/*
 * BDDPA Public Client Router & App State
 * Vanilla JS SPA using hash-based routing.
 */

window.appState = {
  token: localStorage.getItem('accessToken') || null,
  user: JSON.parse(localStorage.getItem('currentUser') || 'null')
};

window.API_BASE = (function () {
  const meta = document.querySelector('meta[name="api-base"]');
  if (meta && meta.getAttribute('content')) return meta.getAttribute('content');
  return '/api/v1';
})();

const authHeaders = (isMultipart = false) => {
  const h = {};
  if (!isMultipart) {
    h['Content-Type'] = 'application/json';
  }
  if (window.appState.token) {
    h['Authorization'] = `Bearer ${window.appState.token}`;
  }
  return h;
};

window.showToast = (message, type = 'success') => {
  const el = document.createElement('div');
  el.innerHTML = UIComponents.ToastNotification(message, type);
  const node = el.firstElementChild;
  document.body.appendChild(node);
  if (window.lucide) window.lucide.createIcons({ attrs: { class: 'w-4 h-4' } });
  setTimeout(() => node.remove(), 3500);
};

/* ================= AUTOMATED NOTIFICATION SERVICE ================= */
const NotificationService = {
  sendSMS: async (phone, name, memberId) => {
    try {
      const message = `অভিনন্দন ডাঃ ${name}, BDDPA-তে আপনার সদস্যপদ সফলভাবে নিবন্ধিত হয়েছে। আপনার মেম্বার আইডি: ${memberId}। মেয়াদ ২ বছর।`;
      const smsGatewayUrl = `https://api.greenweb.com.bd/api.php?json&token=YOUR_GREENWEB_TOKEN&to=${phone}&message=${encodeURIComponent(message)}`;
      await fetch(smsGatewayUrl, { mode: 'no-cors' });
      console.log('Automated registration SMS sent successfully to:', phone);
    } catch (err) {
      console.error('Failed to trigger SMS notification:', err);
    }
  },

  sendEmail: async (email, name, memberId) => {
    try {
      console.log('Automated registration Email triggered for:', email);
    } catch (err) {
      console.error('Email trigger failed:', err);
    }
  }
};

/* ================= SEO ================= */
const seoEngine = {
  setMeta: (title, description, canonicalPath, schemaObj = null) => {
    document.title = title;
    const ensureMeta = (attr, val, key = 'name') => {
      let el = document.querySelector(`meta[${key}="${attr}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(key, attr); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    ensureMeta('description', description);
    ensureMeta('og:title', title, 'property');
    ensureMeta('og:description', description, 'property');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', canonicalPath || window.location.href);

    const oldScript = document.getElementById('seo-ld-json');
    if (oldScript) oldScript.remove();
    if (schemaObj) {
      const script = document.createElement('script');
      script.id = 'seo-ld-json';
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    }
  }
};

/* ================= ROUTES ================= */
const routerConfig = {
  '/': {
    title: 'হোম | BDDPA ভোলা',
    description: 'ভোলা জেলা ডেন্টাল প্র্যাকটিশনার অ্যাসোসিয়েশনের অফিসিয়াল হোমপেজ।',
    render: () => {
      setTimeout(() => {
        window.appPublic.initHomeSections();
        window.appPublic.loadDynamicMembershipCard();
      }, 30);
      return `
        ${UIComponents.HomeHero()}
        <div id="home-stats-section"></div>
        <div id="home-welcome-section"></div>
        <div id="home-notice-section"></div>
        <div id="home-leadership-section"></div>
        <div id="home-cta-section">${UIComponents.HomeCTA()}</div>
        <div id="home-membership-card-section" class="py-16 bg-ink-50"></div>
      `;
    }
  },

  '/register': {
    title: 'অনলাইন রেজিস্ট্রেশন | BDDPA ভোলা',
    description: 'ভোলা জেলা ডেন্টাল প্র্যাকটিশনার অ্যাসোসিয়েশনের সদস্যপদের জন্য আবেদন ফরম।',
    render: () => UIComponents.PublicRegistrationForm()
  },

  '/about': {
    title: 'আমাদের সম্পর্কে | BDDPA',
    description: 'সংগঠনের ভিশন, মিশন ও পেশাগত অঙ্গীকার।',
    render: () => {
      const schema = { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About BDDPA', description: 'Vision, and mission of BDDPA Bhola.' };
      setTimeout(() => seoEngine.setMeta('আমাদের সম্পর্কে | BDDPA', 'About the Association', '#/about', schema), 30);
      return UIComponents.AboutOrganization() + UIComponents.HomeCTA();
    }
  },

  '/members': {
    title: 'সদস্য তালিকা | BDDPA',
    description: 'ভোলা জেলার অনুমোদিত ডেন্টাল প্র্যাকটিশনারদের ভেরিফাইড ডিরেক্টরি।',
    render: () => {
      setTimeout(() => window.appMembers.executeDirectorySearch(), 30);
      return UIComponents.DirectoryListView();
    }
  },

  '/executive': {
    title: 'কার্যনির্বাহী কমিটি | BDDPA',
    description: 'সংগঠনের সম্মানিত কার্যনির্বাহী কমিটির সদস্যবৃন্দ।',
    render: () => {
      fetch(`${window.API_BASE}/members?roleType=Executive+Committee&sort=executive`)
        .then(res => res.json())
        .then(res => {
          const area = document.getElementById('executive-grid-view');
          if (!area) return;
          if (res.success && res.data.length) {
            area.innerHTML = res.data.map(m => UIComponents.MemberCard(m)).join('');
          } else {
            area.innerHTML = UIComponents.EmptyState('কমিটির কোনো সদস্য পাওয়া যায়নি।', 'users');
          }
          refreshLucide();
        })
        .catch(() => {
          const area = document.getElementById('executive-grid-view');
          if (area) area.innerHTML = UIComponents.EmptyState('সার্ভার সংযোগ ব্যর্থ হয়েছে।', 'wifi-off');
          refreshLucide();
        });
      return `
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span class="eyebrow">Executive Committee</span>
            <h1 class="h-section text-3xl sm:text-4xl lg:text-5xl">কার্যনির্বাহী কমিটি</h1>
            <p class="text-sm sm:text-base text-ink-500">সংগঠনের নেতৃত্বে থাকা সম্মানিত সদস্যবৃন্দ।</p>
          </div>
          <div id="executive-grid-view" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            ${Array.from({ length: 4 }).map(() => UIComponents.SkeletonCard()).join('')}
          </div>
        </section>`;
    }
  },

  '/events': {
    title: 'ইভেন্টস | BDDPA',
    description: 'সংগঠনের আপকামিং সেমিনার, ওয়ার্কশপ ও অনুষ্ঠানসমূহ।',
    render: () => {
      fetch(`${window.API_BASE}/cms/events`)
        .then(res => res.json())
        .then(res => {
          const area = document.getElementById('events-list-view');
          if (!area) return;
          if (!res.success) return;
          if (res.data.length === 0) {
            area.innerHTML = UIComponents.EmptyState('আপকামিং কোনো ইভেন্ট পাওয়া যায়নি।', 'calendar-x');
            refreshLucide();
            return;
          }
          area.innerHTML = res.data.map(e => {
            const remains = new Date(e.eventDate) - new Date();
            const days = Math.ceil(remains / 86400000);
            const dateStr = new Date(e.eventDate).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
            const _escLocal = s => (s == null ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'));
            return `
              <article class="timeline-item pb-10">
                <div class="card p-6 sm:p-7">
                  <div class="flex flex-wrap items-center gap-2 mb-3">
                    <span class="chip chip-teal"><i data-lucide="calendar" class="w-3 h-3"></i>${dateStr}</span>
                    ${days > 0
                      ? `<span class="chip chip-emerald"><i data-lucide="timer" class="w-3 h-3"></i>${days} দিন বাকি</span>`
                      : `<span class="chip"><i data-lucide="check" class="w-3 h-3"></i>সম্পন্ন</span>`}
                    ${e.startTime ? `<span class="chip"><i data-lucide="clock" class="w-3 h-3"></i>${_escLocal(e.startTime)}${e.endTime ? ' – ' + _escLocal(e.endTime) : ''}</span>` : ''}
                  </div>
                  <h3 class="text-xl font-bold text-navy-900">${_escLocal(e.title)}</h3>
                  <p class="mt-2 text-sm text-ink-500 leading-relaxed">${_escLocal(e.description)}</p>
                  <div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-500">
                    <span class="inline-flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-teal-600"></i>${_escLocal(e.location)}</span>
                    ${e.mapLink ? `<a href="${_escLocal(e.mapLink)}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-teal-600 font-semibold hover:underline"><i data-lucide="external-link" class="w-3.5 h-3.5"></i>ম্যাপে দেখুন</a>` : ''}
                  </div>
                  ${e.registrationLink ? `
                    <div class="mt-5">
                      <a href="${_escLocal(e.registrationLink)}" target="_blank" rel="noopener" class="btn-primary">
                        <i data-lucide="ticket" class="w-4 h-4"></i><span>রেজিস্ট্রেশন</span>
                      </a>
                    </div>` : ''}
                </div>
              </article>`;
          }).join('');
          refreshLucide();
        })
        .catch(() => {
          const area = document.getElementById('events-list-view');
          if (area) area.innerHTML = UIComponents.EmptyState('সার্ভার সংযোগ ব্যর্থ হয়েছে।', 'wifi-off');
          refreshLucide();
        });
      return `
        <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span class="eyebrow">Upcoming Events</span>
            <h1 class="h-section text-3xl sm:text-4xl">আপকামিং ইভেন্টস</h1>
            <p class="text-sm text-ink-500">সেমিনার, ওয়ার্কশপ ও পেশাগত অনুষ্ঠান।</p>
          </div>
          <div id="events-list-view">${UIComponents.Loading()}</div>
        </section>`;
    }
  },

  '/notice': {
    title: 'নোটিশ বোর্ড | BDDPA',
    description: 'অ্যাসোসিয়েশনের প্রকাশিত সকল অফিসিয়াল নোটিশ।',
    render: () => {
      fetch(`${window.API_BASE}/notices`)
        .then(res => res.json())
        .then(res => {
          const area = document.getElementById('notice-list-view');
          if (!area) return;
          if (res.success && res.data.length) {
            const _escLocal = s => (s == null ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'));
            const catChip = c => ({ Urgent: 'chip-red', Meeting: 'chip-teal', Seminar: 'chip-gold' })[c] || 'chip';
            area.innerHTML = res.data.map(n => `
              <article class="timeline-item pb-10">
                <div class="card p-6 sm:p-7">
                  <div class="flex flex-wrap items-center gap-2 mb-3">
                    <span class="chip ${catChip(n.category)}"><i data-lucide="tag" class="w-3 h-3"></i>${_escLocal(n.category)}</span>
                    <span class="text-[11px] text-ink-400 font-latin">${new Date(n.createdAt).toLocaleDateString('bn-BD', { year:'numeric', month:'short', day:'numeric' })}</span>
                  </div>
                  <h3 class="text-lg sm:text-xl font-bold text-navy-900">${_escLocal(n.title)}</h3>
                  <p class="mt-2 text-sm text-ink-500 leading-relaxed">${_escLocal(n.content)}</p>
                  ${n.pdfUrl ? `<a href="${_escLocal(n.pdfUrl)}" target="_blank" rel="noopener" class="btn-outline mt-4 text-xs"><i data-lucide="image" class="w-3.5 h-3.5"></i>ছবি দেখুন</a>` : ''}
                </div>
              </article>`).join('');
          } else {
            area.innerHTML = UIComponents.EmptyState('এই মুহূর্তে কোনো নোটিশ প্রকাশিত হয়নি।', 'megaphone');
          }
          refreshLucide();
        })
        .catch(() => {
          const area = document.getElementById('notice-list-view');
          if (area) area.innerHTML = UIComponents.EmptyState('সার্ভার সংযোগ ব্যর্থ হয়েছে।', 'wifi-off');
          refreshLucide();
        });
      return `
        <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span class="eyebrow">Official Notices</span>
            <h1 class="h-section text-3xl sm:text-4xl">নোটিশ বোর্ড</h1>
            <p class="text-sm text-ink-500">অ্যাসোসিয়েশন থেকে প্রকাশিত সকল অফিসিয়াল ঘোষণা ও বিজ্ঞপ্তি।</p>
          </div>
          <div id="notice-list-view">${UIComponents.Loading()}</div>
        </section>`;
    }
  },

  '/members/:slug': {
    title: 'সদস্য প্রোফাইল | BDDPA',
    description: 'BDDPA সদস্যের অফিসিয়াল প্রোফাইল।',
    render: (params) => {
      fetch(`${window.API_BASE}/members/profile/${encodeURIComponent(params.slug)}`)
        .then(res => res.json())
        .then(res => {
          const el = document.getElementById('member-profile-viewport');
          if (!el) return;
          if (res.success) {
            el.innerHTML = UIComponents.PublicProfileView(res.data);
            seoEngine.setMeta(
              `${res.data.nameBn || res.data.nameEn} | BDDPA`,
              `BDDPA সদস্য প্রোফাইল · ${res.data.memberId || ''}`,
              `#/members/${res.data.slug}`,
              { '@context': 'https://schema.org', '@type': 'Person', name: res.data.nameEn, alternateName: res.data.nameBn, identifier: res.data.memberId, jobTitle: res.data.qualification }
            );
          } else {
            el.innerHTML = UIComponents.ErrorPage404();
          }
          refreshLucide();
        })
        .catch(() => {
          const el = document.getElementById('member-profile-viewport');
          if (el) el.innerHTML = UIComponents.EmptyState('সার্ভার সংযোগ ব্যর্থ হয়েছে।', 'wifi-off');
          refreshLucide();
        });
      return `<div id="member-profile-viewport">${UIComponents.Loading()}</div>`;
    }
  },

  '/verification': {
    title: 'ভেরিফিকেশন পোর্টাল | BDDPA',
    description: 'মেম্বারশিপ আইডি বা মোবাইল দিয়ে সদস্যের সত্যতা যাচাই করুন।',
    render: () => UIComponents.VerificationPortalView()
  },

  '/admin/login': {
    title: 'অ্যাডমিন লগইন | BDDPA',
    description: 'অ্যাসোসিয়েশনের অনুমোদিত অ্যাডমিন সদস্যদের জন্য।',
    render: () => UIComponents.LoginForm()
  },

  '/admin/dashboard': {
    title: 'ড্যাশবোর্ড | BDDPA',
    description: 'অ্যাডমিন ড্যাশবোর্ড।',
    render: () => {
      if (!window.appState.token) { window.location.hash = '#/admin/login'; return ''; }
      
      const hash = window.location.hash || '';
      const params = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
      const tab = params.get('tab') || 'home';

      setTimeout(() => {
        if (tab === 'home') {
          window.appAdmin.loadOverview();
        } else if (tab === 'members') {
          window.appAdmin.loadMemberList();
        } else if (tab === 'requests') {
          window.appAdmin.loadRequestList();
        } else if (tab === 'notices') {
          window.appAdmin.loadNoticeList();
        } else if (tab === 'events') {
          window.appAdmin.loadEventList();
        } else if (tab === 'leadership') {
          window.appAdmin.loadLeadershipForm();
        } else {
          const target = document.getElementById('dashboard-content-area');
          if (target) target.innerHTML = UIComponents.EmptyState(`দুঃখিত, '${tab}' ট্যাবটির কনটেন্ট বা ড্যাশবোর্ড তালিকা নির্মাণাধীন রয়েছে।`, 'wrench');
          refreshLucide();
        }
      }, 30);

      return UIComponents.AdminDashboardShell(tab, `<div id="dashboard-content-area">${UIComponents.Loading()}</div>`);
    }
  }
};

/* ================= AUTH ================= */
window.appAuth = {
  login: async (email, password) => {
    try {
      const res = await fetch(`${window.API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('accessToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        window.appState.token = data.token;
        window.appState.user = data.user;
        window.showToast('সফলভাবে লগইন হয়েছে।', 'success');
        window.location.hash = '#/admin/dashboard';
      } else {
        window.showToast(data.message || 'লগইন ব্যর্থ হয়েছে।', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      window.showToast('সার্ভারে সংযোগ করা যায়নি।', 'error');
    }
  },
  logout: async () => {
    try { await fetch(`${window.API_BASE}/auth/logout`, { method: 'POST', headers: authHeaders() }); } catch (_) {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    window.appState.token = null;
    window.appState.user = null;
    window.showToast('লগআউট হয়েছেন।', 'success');
    window.location.hash = '#/admin/login';
  }
};

/* ================= MEMBERS DIRECTORY ================= */
window.appMembers = {
  executeDirectorySearch: () => {
    const s = document.getElementById('dir-search-input')?.value || '';
    const grid = document.getElementById('directory-render-grid');
    if (grid) grid.innerHTML = Array.from({ length: 6 }).map(() => UIComponents.SkeletonCard()).join('');
    fetch(`${window.API_BASE}/members?search=${encodeURIComponent(s)}`)
      .then(res => res.json())
      .then(res => {
        if (!grid) return;
        if (res.success && res.data.length) {
          grid.innerHTML = res.data.map(m => UIComponents.MemberCard(m)).join('');
        } else {
          grid.innerHTML = `<div class="sm:col-span-2 lg:col-span-3">${UIComponents.EmptyState('কোনো সদস্য পাওয়া যায়নি।', 'user-search')}</div>`;
        }
        refreshLucide();
      })
      .catch(() => {
        if (grid) grid.innerHTML = `<div class="sm:col-span-2 lg:col-span-3">${UIComponents.EmptyState('সার্ভার সংযোগ ব্যর্থ হয়েছে।', 'wifi-off')}</div>`;
        refreshLucide();
      });
  }
};

/* ================= VERIFICATION ================= */
window.appVerify = {
  check: () => {
    const q = document.getElementById('verify-input')?.value?.trim();
    const out = document.getElementById('verify-result');
    if (!q) { out.innerHTML = UIComponents.EmptyState('অনুগ্রহ করে মেম্বারশিপ আইডি বা মোবাইল লিখুন।', 'search'); refreshLucide(); return; }
    out.innerHTML = UIComponents.Loading();
    fetch(`${window.API_BASE}/members/verify?query=${encodeURIComponent(q)}`)
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        out.innerHTML = ok && data.verified
          ? UIComponents.VerificationResult(data, true)
          : UIComponents.VerificationResult(null, false);
        refreshLucide();
      })
      .catch(() => { out.innerHTML = UIComponents.EmptyState('সার্ভার সংযোগ ব্যর্থ হয়েছে।', 'wifi-off'); refreshLucide(); });
  }
};

/* ================= PUBLIC HOMEPAGE ================= */
window.appPublic = {
  initHomeSections: () => {
    const welcome = document.getElementById('home-welcome-section');
    if (welcome) welcome.innerHTML = UIComponents.AboutOrganization();

    const noticeMount = document.getElementById('home-notice-section');
    if (noticeMount) noticeMount.innerHTML = `
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-end justify-between gap-4 mb-8">
          <div><span class="eyebrow">Latest Notices</span><h2 class="h-section text-2xl sm:text-3xl mt-1.5">সাম্প্রতিক নোটিশ</h2></div>
          <a href="#/notice" class="btn-outline text-xs"><i data-lucide="arrow-right" class="w-4 h-4"></i>সবগুলো দেখুন</a>
        </div>
        <div id="home-notice-list" class="grid md:grid-cols-2 gap-5">
          ${Array.from({ length: 2 }).map(() => UIComponents.SkeletonCard()).join('')}
        </div>
      </section>`;

    fetch(`${window.API_BASE}/notices`)
      .then(r => r.json())
      .then(res => {
        const box = document.getElementById('home-notice-list');
        if (!box) return;
        if (res.success && res.data.length) {
          const _escLocal = s => (s == null ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'));
          box.innerHTML = res.data.slice(0, 4).map(n => `
            <article class="card p-6">
              <div class="flex items-center gap-2 mb-3">
                <span class="chip chip-teal"><i data-lucide="tag" class="w-3 h-3"></i>${_escLocal(n.category)}</span>
                <span class="text-[11px] text-ink-400 font-latin">${new Date(n.createdAt).toLocaleDateString('bn-BD',{year:'numeric',month:'short',day:'numeric'})}</span>
              </div>
              <h3 class="font-bold text-navy-900 text-base">${_escLocal(n.title)}</h3>
              <p class="text-sm text-ink-500 mt-2 line-clamp-3">${_escLocal(n.content)}</p>
            </article>`).join('');
        } else {
          box.innerHTML = UIComponents.EmptyState('এখনো কোনো নোটিশ প্রকাশিত হয়নি।', 'megaphone');
        }
        refreshLucide();
      })
      .catch(() => {});

    fetch(`${window.API_BASE}/cms/home`)
      .then(r => r.json())
      .then(res => {
        const el = document.getElementById('home-leadership-section');
        if (el && res.success) el.innerHTML = UIComponents.LeadershipStrip(res.data);
        refreshLucide();
      })
      .catch(() => {});

    fetch(`${window.API_BASE}/stats`)
      .then(res => res.json())
      .then(res => {
        if (!res.success) return;
        const el = document.getElementById('home-stats-section');
        if (el) el.innerHTML = UIComponents.StatsCounterPanel({
          totalMembers: res.data.members,
          totalNotices: res.data.notices,
          totalEvents:  res.data.events,
          totalNews:    res.data.news
        });
        const map = { members: res.data.members, notices: res.data.notices, events: res.data.events };
        document.querySelectorAll('[data-hero-count]').forEach(n => {
          const k = n.getAttribute('data-hero-count');
          if (map[k] != null) n.textContent = Number(map[k]).toLocaleString('bn-BD');
        });
        refreshLucide();
      })
      .catch(() => {});
  },

  loadDynamicMembershipCard: () => {
    const cardSection = document.getElementById('home-membership-card-section');
    if (!cardSection) return;
    
    fetch(`${window.API_BASE}/members?limit=1&sort=-createdAt`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          cardSection.innerHTML = UIComponents.DynamicMembershipCardSection(res.data[0]);
        } else {
          cardSection.innerHTML = UIComponents.DynamicMembershipCardSection(null);
        }
        refreshLucide();
      })
      .catch(() => {
        cardSection.innerHTML = UIComponents.DynamicMembershipCardSection(null);
        refreshLucide();
      });
  }
};

/* ================= ADMIN ================= */
window.appAdmin = {
  loadOverview: () => {
    fetch(`${window.API_BASE}/admin/analytics`, { headers: authHeaders() })
      .then(r => r.json())
      .then(res => {
        const target = document.getElementById('dashboard-content-area');
        if (!target) return;
        if (res.success) {
          target.innerHTML = UIComponents.AdminOverview(res.data) + `<div class="mt-6">${UIComponents.SystemHealthMonitor()}</div>`;
        } else {
          target.innerHTML = UIComponents.EmptyState('অ্যানালিটিক্স লোড করা যায়নি।', 'alert-triangle');
        }
        refreshLucide();
      })
      .catch(() => {
        const target = document.getElementById('dashboard-content-area');
        if (target) target.innerHTML = UIComponents.EmptyState('সার্ভার সংযোগ ব্যর্থ হয়েছে।', 'wifi-off');
        refreshLucide();
      });
  },

  loadMemberList: () => {
    const target = document.getElementById('dashboard-content-area');
    if (!target) return;
    target.innerHTML = UIComponents.Loading();
    fetch(`${window.API_BASE}/members`, { headers: authHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          target.innerHTML = UIComponents.AdminMemberList(res.data);
        } else {
          target.innerHTML = UIComponents.EmptyState('সদস্য তালিকা লোড করা যায়নি।');
        }
        refreshLucide();
      })
      .catch(() => { target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি'); refreshLucide(); });
  },

  loadRequestList: () => {
    const target = document.getElementById('dashboard-content-area');
    if (!target) return;
    target.innerHTML = UIComponents.Loading();
    fetch(`${window.API_BASE}/members?status=Pending`, { headers: authHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          target.innerHTML = UIComponents.AdminRequestList(res.data);
        } else {
          target.innerHTML = UIComponents.EmptyState('আবেদন তালিকা লোড করা যায়নি।');
        }
        refreshLucide();
      })
      .catch((err) => {
        console.error(err);
        target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি');
        refreshLucide();
      });
  },

  loadRequestPreview: async (slug) => {
    const target = document.getElementById('dashboard-content-area');
    if (!target) return;
    target.innerHTML = UIComponents.Loading();
    try {
      const res = await fetch(`${window.API_BASE}/members/profile/${slug}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        target.innerHTML = UIComponents.AdminRequestPreview(data.data);
      } else {
        target.innerHTML = UIComponents.EmptyState('আবেদনকারীর তথ্য লোড করা যায়নি।');
      }
      refreshLucide();
    } catch (err) {
      console.error(err);
      target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি');
      refreshLucide();
    }
  },

  approveRequest: async (id) => {
    if (!confirm('আপনি কি এই আবেদনটি অনুমোদন (Approve) করতে চান? অনুমোদন করলে এই চিকিৎসক ভেরিফাইড সদস্য হিসেবে তালিকাভুক্ত হবেন।')) return;
    try {
      const res = await fetch(`${window.API_BASE}/members/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status: 'Active', joiningDate: new Date().toISOString() })
      });
      const data = await res.json();
      if (data.success) {
        window.showToast('আবেদনটি সফলভাবে অনুমোদন করা হয়েছে।', 'success');
        window.appAdmin.loadRequestList();
      } else {
        window.showToast(data.message || 'অনুমোদন ব্যর্থ হয়েছে।', 'error');
      }
    } catch (err) {
      console.error(err);
      window.showToast('সার্ভার সংযোগ সমস্যা।', 'error');
    }
  },

  rejectRequest: async (id) => {
    if (!confirm('আপনি কি এই আবেদনটি বাতিল ও মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`${window.API_BASE}/members/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        window.showToast('আবেদনটি বাতিল ও মুছে ফেলা হয়েছে।', 'success');
        window.appAdmin.loadRequestList();
      } else {
        window.showToast(data.message || 'বাতিল করা যায়নি।', 'error');
      }
    } catch (err) {
      console.error(err);
      window.showToast('সার্ভার সংযোগ সমস্যা।', 'error');
    }
  },

  loadMemberPreview: async (slug) => {
    const target = document.getElementById('dashboard-content-area');
    if (!target) return;
    target.innerHTML = UIComponents.Loading();
    try {
      const res = await fetch(`${window.API_BASE}/members/profile/${slug}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        target.innerHTML = UIComponents.AdminMemberPreview(data.data);
      } else {
        target.innerHTML = UIComponents.EmptyState('সদস্য তথ্য লোড করা যায়নি।');
      }
      refreshLucide();
    } catch (err) {
      console.error(err);
      target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি');
      refreshLucide();
    }
  },

  loadNoticeList: () => {
    const target = document.getElementById('dashboard-content-area');
    if (!target) return;
    target.innerHTML = UIComponents.Loading();
    fetch(`${window.API_BASE}/notices`, { headers: authHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          target.innerHTML = UIComponents.AdminNoticeList(res.data);
        } else {
          target.innerHTML = UIComponents.EmptyState('নোটিশ তালিকা লোড করা যায়নি।');
        }
        refreshLucide();
      })
      .catch(() => { target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি'); refreshLucide(); });
  },

  loadEventList: () => {
    const target = document.getElementById('dashboard-content-area');
    if (!target) return;
    target.innerHTML = UIComponents.Loading();
    fetch(`${window.API_BASE}/cms/events`, { headers: authHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          target.innerHTML = UIComponents.AdminEventList(res.data);
        } else {
          target.innerHTML = UIComponents.EmptyState('ইভেন্ট তালিকা লোড করা যায়নি।');
        }
        refreshLucide();
      })
      .catch(() => { target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি'); refreshLucide(); });
  },

  loadLeadershipForm: () => {
    const target = document.getElementById('dashboard-content-area');
    if (!target) return;
    target.innerHTML = UIComponents.Loading();
    fetch(`${window.API_BASE}/cms/home`, { headers: authHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          target.innerHTML = UIComponents.AdminLeadershipForm(res.data || {});
        } else {
          target.innerHTML = UIComponents.EmptyState('সম্মানিত নেতৃত্বের তথ্য লোড করা যায়নি।');
        }
        refreshLucide();
      })
      .catch(() => { target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি'); refreshLucide(); });
  },

  loadAddMemberForm: () => {
    const target = document.getElementById('dashboard-content-area');
    if (target) {
      target.innerHTML = UIComponents.AdminMemberForm();
      refreshLucide();
    }
  },

  loadEditMemberForm: async (slug) => {
    const target = document.getElementById('dashboard-content-area');
    if (!target) return;
    target.innerHTML = UIComponents.Loading();
    try {
      const res = await fetch(`${window.API_BASE}/members/profile/${slug}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        target.innerHTML = UIComponents.AdminMemberForm(data.data);
      } else {
        target.innerHTML = UIComponents.EmptyState('সদস্য তথ্য লোড করা যায়নি।');
      }
      refreshLucide();
    } catch (err) {
      target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি');
      refreshLucide();
    }
  },

  loadAddNoticeForm: () => {
    const target = document.getElementById('dashboard-content-area');
    if (target) {
      target.innerHTML = UIComponents.AdminNoticeForm();
      refreshLucide();
    }
  },

  loadEditNoticeForm: async (id) => {
    const target = document.getElementById('dashboard-content-area');
    if (!target) return;
    target.innerHTML = UIComponents.Loading();
    try {
      let res = await fetch(`${window.API_BASE}/notices/${id}`, { headers: authHeaders() });
      let data = await res.json();

      if (!data.success || res.status === 404) {
        res = await fetch(`${window.API_BASE}/cms/notices/${id}`, { headers: authHeaders() });
        data = await res.json();
      }

      if (data.success) {
        target.innerHTML = UIComponents.AdminNoticeForm(data.data);
      } else {
        target.innerHTML = UIComponents.EmptyState(data.message || 'নোটিশ তথ্য লোড করা যায়নি।');
      }
      refreshLucide();
    } catch (err) {
      console.error(err);
      target.innerHTML = UIComponents.EmptyState('সার্ভার সংযোগ ত্রুটি বা অবৈধ রাউট।');
      refreshLucide();
    }
  },

  loadAddEventForm: () => {
    const target = document.getElementById('dashboard-content-area');
    if (target) {
      target.innerHTML = UIComponents.AdminEventForm();
      refreshLucide();
    }
  },

  loadEditEventForm: async (id) => {
    const target = document.getElementById('dashboard-content-area');
    if (!target) return;
    target.innerHTML = UIComponents.Loading();
    try {
      const res = await fetch(`${window.API_BASE}/cms/events/${id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        target.innerHTML = UIComponents.AdminEventForm(data.data);
      } else {
        target.innerHTML = UIComponents.EmptyState('ইভেন্ট তথ্য লোড করা যায়নি।');
      }
      refreshLucide();
    } catch (err) {
      target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি');
      refreshLucide();
    }
  },

  renewMember: async (id) => {
    if (!confirm('আপনি কি এই সদস্যের মেম্বারশিপ মেয়াদ আরও ২ বছর নবায়ন (Renew) করতে চান?')) return;
    try {
      const newJoiningDate = new Date().toISOString();
      const res = await fetch(`${window.API_BASE}/members/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ joiningDate: newJoiningDate, status: 'Active' })
      });
      const data = await res.json();
      if (data.success) {
        window.showToast('মেম্বারশিপ মেয়াদ সফলভাবে ২ বছর বৃদ্ধি করা হয়েছে।', 'success');
        window.appAdmin.loadMemberList();
      } else {
        window.showToast(data.message || 'নবায়ন ব্যর্থ হয়েছে।', 'error');
      }
    } catch (err) {
      window.showToast('সার্ভার সংযোগ ব্যর্থ হয়েছে।', 'error');
    }
  },

  deleteMember: async (id) => {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই সদস্যের অ্যাকাউন্ট ডিলেট করতে চান?')) return;
    try {
      const res = await fetch(`${window.API_BASE}/members/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        window.showToast('সদস্য সফলভাবে ডিলিট করা হয়েছে।', 'success');
        window.appAdmin.loadMemberList();
      } else {
        window.showToast(data.message || 'ডিলিট করা যায়নি।', 'error');
      }
    } catch (err) {
      window.showToast('সার্ভার সংযোগ ত্রুটি।', 'error');
    }
  },

  deleteNotice: async (id) => {
    if (!confirm('আপনি কি এই নোটিশটি মুছে ফেলতে চান?')) return;
    try {
      let res = await fetch(`${window.API_BASE}/notices/${id}`, { method: 'DELETE', headers: authHeaders() });
      let data = await res.json();
      
      if (!data.success || res.status === 404) {
        res = await fetch(`${window.API_BASE}/cms/notices/${id}`, { method: 'DELETE', headers: authHeaders() });
        data = await res.json();
      }

      if (data.success) {
        window.showToast('নোটিশ সফলভাবে ডিলিট করা হয়েছে।', 'success');
        window.appAdmin.loadNoticeList();
      } else {
        window.showToast(data.message || 'ডিলিট করা যায়নি।', 'error');
      }
    } catch (err) {
      console.error(err);
      window.showToast('সার্ভার ত্রুটি বা সংযোগ সমস্যা।', 'error');
    }
  },

  deleteEvent: async (id) => {
    if (!confirm('আপনি কি এই ইভেন্টটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`${window.API_BASE}/cms/events/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        window.showToast('ইভেন্ট ডিলিট করা হয়েছে।', 'success');
        window.appAdmin.loadEventList();
      } else {
        window.showToast('ডিলিট করা যায়নি।', 'error');
      }
    } catch (_) { window.showToast('সার্ভার ত্রুটি'); }
  }
};

/* ================= ROUTER ================= */
class PublicClientRouter {
  constructor(routes, outletId) {
    this.routes = routes;
    this.outlet = document.getElementById(outletId);
    window.addEventListener('hashchange', () => this.handleRouting());
    window.addEventListener('load', () => this.handleRouting());
  }

  handleRouting() {
    if (!this.outlet) return;
    const hash = window.location.hash || '#/';
    const routePath = hash.replace(/^#/, '').split('?')[0];

    let matchedRoute = this.routes[routePath];
    let routeParams = {};

    if (!matchedRoute) {
      for (const routeKey of Object.keys(this.routes)) {
        if (!routeKey.includes('/:')) continue;
        const pathSegments = routeKey.split('/');
        const hashSegments = routePath.split('/');
        if (pathSegments.length !== hashSegments.length) continue;
        let isMatch = true;
        const params = {};
        for (let i = 0; i < pathSegments.length; i++) {
          if (pathSegments[i].startsWith(':')) params[pathSegments[i].slice(1)] = decodeURIComponent(hashSegments[i]);
          else if (pathSegments[i] !== hashSegments[i]) { isMatch = false; break; }
        }
        if (isMatch) { matchedRoute = this.routes[routeKey]; routeParams = params; break; }
      }
    }

    if (matchedRoute) {
      this.outlet.innerHTML = UIComponents.Loading();
      refreshLucide();
      setTimeout(() => {
        this.outlet.innerHTML = matchedRoute.render(routeParams);
        seoEngine.setMeta(matchedRoute.title, matchedRoute.description || 'BDDPA Portal', hash);
        highlightActiveNav(routePath);
        refreshLucide();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 80);
    } else {
      this.outlet.innerHTML = UIComponents.ErrorPage404();
      refreshLucide();
    }
  }
}

/* ================= HELPERS ================= */
function refreshLucide() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function highlightActiveNav(path) {
  document.querySelectorAll('[data-nav], [data-drawer-link]').forEach(a => {
    const target = (a.getAttribute('href') || '').replace(/^#/, '');
    a.classList.toggle('is-active', target === path || (target === '/' && path === '/'));
  });
}

/* ================= MOBILE DRAWER + STICKY HEADER ================= */
function initChrome() {
  const drawer = document.getElementById('mobile-drawer');
  const btn = document.getElementById('mobile-menu-btn');
  const open = () => { drawer.classList.remove('hidden'); document.body.style.overflow = 'hidden'; };
  const close = () => { drawer.classList.add('hidden'); document.body.style.overflow = ''; };
  btn?.addEventListener('click', open);
  drawer?.querySelectorAll('[data-drawer-close]').forEach(el => el.addEventListener('click', close));
  drawer?.querySelectorAll('[data-drawer-link]').forEach(el => el.addEventListener('click', close));

  const header = document.getElementById('site-header');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function patchNavbar() {
  const nav = document.querySelector('nav.hidden.lg\\:flex');
  if (nav && !nav.querySelector('a[href="#/register"]')) {
    const regLink = document.createElement('a');
    regLink.href = '#/register';
    regLink.setAttribute('data-nav', '');
    regLink.className = 'px-3.5 py-2 rounded-lg hover:text-navy-900 hover:bg-ink-50 transition';
    regLink.textContent = 'রেজিস্ট্রেশন';
    nav.appendChild(regLink);
  }

  const drawerNav = document.querySelector('#mobile-drawer nav');
  if (drawerNav && !drawerNav.querySelector('a[href="#/register"]')) {
    const regLink = document.createElement('a');
    regLink.href = '#/register';
    regLink.setAttribute('data-drawer-link', '');
    regLink.className = 'drawer-link';
    regLink.innerHTML = `<i data-lucide="user-plus" class="w-4 h-4"></i>রেজিস্ট্রেশন`;
    drawerNav.appendChild(regLink);
  }
}

document.addEventListener('click', (e) => {
  const backBtn = e.target.closest('button[onclick*="dashboard?tab="]');
  if (backBtn) {
    const onclickStr = backBtn.getAttribute('onclick') || '';
    const match = onclickStr.match(/tab=([^'"]+)/);
    if (match && match[1]) {
      e.preventDefault();
      e.stopPropagation();
      const tab = match[1];
      if (tab === 'members') window.appAdmin.loadMemberList();
      else if (tab === 'requests') window.appAdmin.loadRequestList();
      else if (tab === 'notices') window.appAdmin.loadNoticeList();
      else if (tab === 'events') window.appAdmin.loadEventList();
      else if (tab === 'leadership') window.appAdmin.loadLeadershipForm();
      else window.appAdmin.loadOverview();
    }
  }
});

document.addEventListener('submit', async (e) => {
  if (!e.target) return;

  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      if (!file || !(file instanceof File) || file.size === 0) {
        resolve("");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve("");
    });
  };

  // 1. Admin Login
  if (e.target.id === 'admin-local-login') {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    window.appAuth.login(email, password);
  }

  // 2. Add/Edit Member Form
  if (e.target.id === 'add-member-form') {
    e.preventDefault();
    const form = e.target;
    const memberId = form.dataset.id;
    
    const profilePhotoFile = form.querySelector('input[name="profilePhoto"]')?.files[0];
    const degreePhotoFile = form.querySelector('input[name="degreePhoto"]')?.files[0];
    const nidPhotoFile = form.querySelector('input[name="nidPhoto"]')?.files[0];

    const profilePhotoBase64 = await fileToBase64(profilePhotoFile);
    const degreePhotoBase64 = await fileToBase64(degreePhotoFile);
    const nidPhotoBase64 = await fileToBase64(nidPhotoFile);

    const formFields = new FormData(form);
    const data = Object.fromEntries(formFields.entries());

    data.nameBn = data.nameBn || "";
    data.nameEn = data.nameEn || "";
    data.phone = data.phone || "";
    data.qualification = data.qualification || "";
    data.bmdcReg = data.bmdcReg || "";
    data.institution = data.institution || "";
    data.experience = data.experience ? Number(data.experience) : 0;
    data.nidNumber = data.nidNumber || "";
    data.bloodGroup = data.bloodGroup || "";
    data.email = data.email || "";
    data.chamberName = data.chamberName || "";
    data.chamberAddress = data.chamberAddress || "";
    data.address = data.chamberAddress || "";
    data.personalAddress = data.personalAddress || "";
    data.upazila = data.upazila || "Bhola Sadar";
    data.biography = data.biography || "";
    data.roleType = data.roleType || "General Member";
    data.executivePost = data.executivePost || "";

    if (profilePhotoBase64) {
      data.profilePhoto = profilePhotoBase64;
    } else {
      if (memberId) delete data.profilePhoto;
      else data.profilePhoto = "";
    }

    if (degreePhotoBase64) {
      data.degreePhoto = degreePhotoBase64;
    } else {
      if (memberId) delete data.degreePhoto;
      else data.degreePhoto = "";
    }

    if (nidPhotoBase64) {
      data.nidPhoto = nidPhotoBase64;
    } else {
      if (memberId) delete data.nidPhoto;
      else data.nidPhoto = "";
    }

    const url = memberId ? `${window.API_BASE}/members/${memberId}` : `${window.API_BASE}/members`;
    const method = memberId ? 'PUT' : 'POST';

    if (!memberId) {
      const today = new Date().toISOString();
      data.joiningDate = today;
      data.status = 'Active';
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: authHeaders(false),
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      
      if (resData.success) {
        window.showToast(memberId ? 'সদস্য তথ্য সফলভাবে আপডেট হয়েছে।' : 'সদস্য সফলভাবে নিবন্ধিত হয়েছে।', 'success');
        
        if (!memberId && resData.data && resData.data.phone) {
          NotificationService.sendSMS(resData.data.phone, resData.data.nameBn || resData.data.nameEn, resData.data.memberId);
          NotificationService.sendEmail(resData.data.email, resData.data.nameBn || resData.data.nameEn, resData.data.memberId);
        }
        
        window.location.hash = '#/admin/dashboard?tab=members';
      } else {
        window.showToast(resData.message || 'অপারেশন ব্যর্থ হয়েছে।', 'error');
      }
    } catch (err) {
      console.error(err);
      window.showToast('সার্ভারে সংযোগ স্থাপন করা যায়নি।', 'error');
    }
  }

  // 3. Add/Edit Notice Form
  if (e.target.id === 'add-notice-form') {
    e.preventDefault();
    const form = e.target;
    const noticeId = form.dataset.id;

    const pdfUrlFile = form.querySelector('input[name="pdfUrl"]')?.files[0];
    const pdfUrlBase64 = await fileToBase64(pdfUrlFile);

    const formFields = new FormData(form);
    const data = Object.fromEntries(formFields.entries());

    data.title = data.title || "";
    data.category = data.category || "General";
    data.content = data.content || "";

    if (pdfUrlBase64) {
      data.pdfUrl = pdfUrlBase64;
    } else {
      if (noticeId) delete data.pdfUrl;
      else data.pdfUrl = "";
    }

    try {
      let url = noticeId ? `${window.API_BASE}/notices/${noticeId}` : `${window.API_BASE}/notices`;
      let method = noticeId ? 'PUT' : 'POST';

      let res = await fetch(url, {
        method: method,
        headers: authHeaders(false),
        body: JSON.stringify(data)
      });
      let resData = await res.json();

      if (!resData.success || res.status === 404) {
        url = noticeId ? `${window.API_BASE}/cms/notices/${noticeId}` : `${window.API_BASE}/cms/notices`;
        res = await fetch(url, {
          method: method,
          headers: authHeaders(false),
          body: JSON.stringify(data)
        });
        resData = await res.json();
      }

      if (resData.success) {
        window.showToast(noticeId ? 'নোটিশ সফলভাবে আপডেট হয়েছে।' : 'নোটিশ সফলভাবে প্রকাশিত হয়েছে।', 'success');
        window.location.hash = '#/admin/dashboard?tab=notices';
      } else {
        window.showToast(resData.message || 'নোটিশ সংরক্ষণ করা যায়নি।', 'error');
      }
    } catch (err) {
      console.error(err);
      window.showToast('সার্ভারে সংযোগ স্থাপন করা যায়নি।', 'error');
    }
  }

  // 4. Add/Edit Event Form
  if (e.target.id === 'add-event-form') {
    e.preventDefault();
    const form = e.target;
    const eventId = form.dataset.id;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const url = eventId ? `${window.API_BASE}/cms/events/${eventId}` : `${window.API_BASE}/cms/events`;
      const method = eventId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: authHeaders(),
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) {
        window.showToast(eventId ? 'ইভেন্ট সফলভাবে আপডেট হয়েছে।' : 'ইভেন্ট সফলভাবে তৈরি হয়েছে।', 'success');
        window.location.hash = '#/admin/dashboard?tab=events';
      } else {
        window.showToast('ইভেন্ট তৈরি ব্যর্থ হয়েছে।', 'error');
      }
    } catch (_) { window.showToast('সার্ভার ত্রুটি'); }
  }

  // 5. Leadership Form
  if (e.target.id === 'edit-leadership-form') {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`${window.API_BASE}/cms/home`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) {
        window.showToast('নেতৃত্বের বার্তা সফলভাবে আপডেট হয়েছে।', 'success');
        window.location.hash = '#/admin/dashboard?tab=home';
      } else {
        window.showToast('আপডেট ব্যর্থ হয়েছে।', 'error');
      }
    } catch (_) { window.showToast('সার্ভার ত্রুটি'); }
  }

  // 6. Public Registration Form
  if (e.target.id === 'public-register-form') {
    e.preventDefault();
    const form = e.target;
    
    const profilePhotoFile = form.querySelector('input[name="profilePhoto"]')?.files[0];
    const degreePhotoFile = form.querySelector('input[name="degreePhoto"]')?.files[0];
    const nidPhotoFile = form.querySelector('input[name="nidPhoto"]')?.files[0];

    if (!profilePhotoFile || profilePhotoFile.size === 0) {
      window.showToast('দয়া করে আপনার ছবি সিলেক্ট করুন।', 'error');
      return;
    }
    if (!degreePhotoFile || degreePhotoFile.size === 0) {
      window.showToast('দয়া করে ডিগ্রি সার্টিফিকেট ছবি সিলেক্ট করুন।', 'error');
      return;
    }
    if (!nidPhotoFile || nidPhotoFile.size === 0) {
      window.showToast('দয়া করে এনআইডি (NID) কার্ডের ছবি সিলেক্ট করুন।', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>প্রসেস হচ্ছে...</span>`;

    const profilePhotoBase64 = await fileToBase64(profilePhotoFile);
    const degreePhotoBase64 = await fileToBase64(degreePhotoFile);
    const nidPhotoBase64 = await fileToBase64(nidPhotoFile);

    const formFields = new FormData(form);
    const data = Object.fromEntries(formFields.entries());

    data.nameBn = data.nameBn || "";
    data.nameEn = data.nameEn || "";
    data.phone = data.phone || "";
    data.qualification = data.qualification || "";
    data.bmdcReg = data.bmdcReg || "";
    data.institution = data.institution || "";
    data.experience = data.experience ? Number(data.experience) : 0;
    data.nidNumber = data.nidNumber || "";
    data.bloodGroup = data.bloodGroup || "";
    data.email = data.email || "";
    data.chamberName = data.chamberName || "";
    data.chamberAddress = data.chamberAddress || "";
    data.address = data.chamberAddress || ""; 
    data.personalAddress = data.personalAddress || "";
    data.upazila = data.upazila || "Bhola Sadar";
    data.biography = data.biography || "";
    data.roleType = "General Member"; 
    data.executivePost = "";
    
    data.status = 'Pending';
    data.joiningDate = new Date().toISOString();

    data.profilePhoto = profilePhotoBase64;
    data.degreePhoto = degreePhotoBase64;
    data.nidPhoto = nidPhotoBase64;

    try {
      const res = await fetch(`${window.API_BASE}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      
      if (resData.success) {
        window.showToast('আপনার রেজিস্ট্রেশন আবেদন সফলভাবে জমা হয়েছে। অ্যাডমিন পর্যালোচনার পর এটি সক্রিয় করা হবে।', 'success');
        window.location.hash = '#/';
      } else {
        window.showToast(resData.message || 'আবেদন জমা দেওয়া যায়নি।', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    } catch (err) {
      console.error(err);
      window.showToast('সার্ভারে সংযোগ স্থাপন করা যায়নি।', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initChrome();
  patchNavbar();
  refreshLucide();
  new PublicClientRouter(routerConfig, 'main-app-viewport');
});
