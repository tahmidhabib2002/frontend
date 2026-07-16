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
  // এসএমএস পাঠানোর গেটওয়ে হ্যান্ডলার
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

/* ================= DYNAMIC UI COMPONENTS OVERRIDES ================= */
if (window.UIComponents) {
  // ১. ড্যাশবোর্ড শেলে নতুন "সদস্য আবেদন" ট্যাব যুক্ত করা
  UIComponents.AdminDashboardShell = (active = 'home', content = '') => {
    const nav = [
      ['home',       'home',       'ওভারভিউ'],
      ['users',      'members',    'সদস্য তালিকা'],
      ['user-plus',  'requests',   'সদস্য আবেদন'], // নতুন ট্যাব
      ['megaphone',  'notices',    'নোটিশ বোর্ড'],
      ['calendar',   'events',     'ইভেন্টস'],
      ['sliders',    'leadership', 'সম্মানিত নেতৃত্ব'],
    ];
    const user = window.appState?.user || {};
    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside class="card p-4 h-max lg:sticky lg:top-28">
          <div class="flex items-center gap-3 p-3 rounded-xl bg-gradient-medical text-white mb-4">
            <div class="w-10 h-10 rounded-lg bg-white/15 grid place-items-center font-bold">${_initials(user.name || 'AD')}</div>
            <div class="min-w-0">
              <div class="text-sm font-bold truncate">${_esc(user.name || 'Admin')}</div>
              <div class="text-[11px] text-teal-100 truncate font-latin">${_esc(user.role || 'Editor')}</div>
            </div>
          </div>
          <nav class="space-y-1 text-sm font-medium">
            ${nav.map(([ic, key, label]) => `
              <a href="#/admin/dashboard?tab=${key}" data-admin-tab="${key}" class="drawer-link ${active === key ? 'is-active' : ''}">
                ${_icon(ic, 'w-4 h-4')}<span>${label}</span>
              </a>`).join('')}
          </nav>
          <div class="mt-4 pt-4 border-t border-ink-100">
            <button onclick="window.appAuth.logout()" class="drawer-link w-full text-red-600 hover:bg-red-50">${_icon('log-out','w-4 h-4')}<span>লগআউট</span></button>
          </div>
        </aside>

        <section class="min-w-0 space-y-6">
          <header class="card p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p class="text-[11px] uppercase tracking-widest text-teal-600 font-latin font-bold">Dashboard</p>
              <h1 class="h-section text-xl mt-1">স্বাগতম, ${_esc((user.name || 'Admin').split(' ')[0])}</h1>
            </div>
            <div class="flex items-center gap-2">
              <a href="#/" class="btn-outline">${_icon('external-link','w-4 h-4')}<span class="hidden sm:inline">সাইট দেখুন</span></a>
              <button onclick="window.appAdmin.loadAddMemberForm()" class="btn-primary">${_icon('plus','w-4 h-4')}<span>নতুন সদস্য</span></button>
            </div>
          </header>
          <div id="dashboard-content-area">${content}</div>
        </section>
      </div>
    </div>`;
  };

  // ২. হোমপেজ হিরো সেকশনে ডাইরেক্ট আবেদন বাটন সেট করা
  UIComponents.HomeHero = () => `
    <section class="relative hero-bg">
      <div class="hero-blob bg-teal-500/60" style="top:-4rem; left:-4rem;"></div>
      <div class="hero-blob bg-emerald-500/40" style="bottom:-6rem; right:-4rem;"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32 text-center lg:text-left">
        <div class="max-w-4xl mx-auto space-y-7 animate-fade-in-up flex flex-col items-center">
          <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur text-[11px] font-semibold text-teal-100 tracking-wide">
            ${_icon('shield-check', 'w-3.5 h-3.5')}
            <span>Bhola District · Official Verified Directory</span>
          </span>
          <h1 class="text-[34px] sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight text-center">
            ভোলা জেলার <br class="hidden sm:block"/>
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-teal-100 to-emerald-200">অনুমোদিত ডেন্টাল</span>
            <br class="hidden sm:block"/> চিকিৎসকদের অফিসিয়াল প্ল্যাটফর্ম
          </h1>
          <p class="text-base sm:text-lg text-ink-200/90 max-w-2xl leading-relaxed text-center">
            রেজিস্টার্ড সদস্য, প্রকাশিত নোটিশ ও ইভেন্টসহ ভোলা জেলার সকল ভেরিফাইড দন্ত চিকিৎসকদের একটি নিরাপদ, স্বচ্ছ ও পেশাদার ডিজিটাল রেজিস্ট্রি।
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="#/register" class="btn-primary btn-lg" style="background:linear-gradient(135deg,#0891b2,#10b981);">${_icon('user-plus', 'w-4 h-4')}<span>আবেদন করুন (অনলাইন রেজিস্ট্রেশন)</span></a>
            <a href="#/members" class="btn-lg inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur transition">
              ${_icon('users', 'w-4 h-4')}<span>সদস্য তালিকা দেখুন</span>
            </a>
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
    </section>
  `;

  // ৩. হোমপেজ CTA সেকশনকে অনলাইন রেজিস্ট্রেশনের সাথে ম্যাপ করা
  UIComponents.HomeCTA = () => `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="relative overflow-hidden rounded-[2rem] bg-gradient-medical p-8 sm:p-12 lg:p-16 text-white shadow-elevated">
        <div class="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div class="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl"></div>
        <div class="relative grid lg:grid-cols-3 gap-8 items-center">
          <div class="lg:col-span-2 space-y-4">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold tracking-widest uppercase font-latin">${_icon('shield-check', 'w-3.5 h-3.5')}Apply for Membership</span>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">ভোলা জেলার ডেন্টাল প্র্যাকটিশনার অ্যাসোসিয়েশনে যোগ দিন</h2>
            <p class="text-white/80 max-w-2xl">ভোলা জেলার ডেন্টাল চিকিৎসকদের পেশাদার অ্যাসোসিয়েশনে মেম্বারশিপের জন্য এখনই অনলাইনে আবেদন ফরম পূরণ করুন।</p>
          </div>
          <div class="flex lg:justify-end">
            <a href="#/register" class="btn-lg inline-flex items-center gap-2 rounded-2xl px-6 py-4 bg-white text-navy-900 font-bold shadow-card hover:shadow-elevated transition">
              ${_icon('user-plus', 'w-5 h-5')}<span>অনলাইন রেজিস্ট্রেশন ফরম</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

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
    render: () => {
      return renderPublicRegistrationFormInline();
    }
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
            const _esc = s => (s == null ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'));
            return `
              <article class="timeline-item pb-10">
                <div class="card p-6 sm:p-7">
                  <div class="flex flex-wrap items-center gap-2 mb-3">
                    <span class="chip chip-teal"><i data-lucide="calendar" class="w-3 h-3"></i>${dateStr}</span>
                    ${days > 0
                      ? `<span class="chip chip-emerald"><i data-lucide="timer" class="w-3 h-3"></i>${days} দিন বাকি</span>`
                      : `<span class="chip"><i data-lucide="check" class="w-3 h-3"></i>সম্পন্ন</span>`}
                    ${e.startTime ? `<span class="chip"><i data-lucide="clock" class="w-3 h-3"></i>${_esc(e.startTime)}${e.endTime ? ' – ' + _esc(e.endTime) : ''}</span>` : ''}
                  </div>
                  <h3 class="text-xl font-bold text-navy-900">${_esc(e.title)}</h3>
                  <p class="mt-2 text-sm text-ink-500 leading-relaxed">${_esc(e.description)}</p>
                  <div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-500">
                    <span class="inline-flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-teal-600"></i>${_esc(e.location)}</span>
                    ${e.mapLink ? `<a href="${_esc(e.mapLink)}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-teal-600 font-semibold hover:underline"><i data-lucide="external-link" class="w-3.5 h-3.5"></i>ম্যাপে দেখুন</a>` : ''}
                  </div>
                  ${e.registrationLink ? `
                    <div class="mt-5">
                      <a href="${_esc(e.registrationLink)}" target="_blank" rel="noopener" class="btn-primary">
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
            const _esc = s => (s == null ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'));
            const catChip = c => ({ Urgent: 'chip-red', Meeting: 'chip-teal', Seminar: 'chip-gold' })[c] || 'chip';
            area.innerHTML = res.data.map(n => `
              <article class="timeline-item pb-10">
                <div class="card p-6 sm:p-7">
                  <div class="flex flex-wrap items-center gap-2 mb-3">
                    <span class="chip ${catChip(n.category)}"><i data-lucide="tag" class="w-3 h-3"></i>${_esc(n.category)}</span>
                    <span class="text-[11px] text-ink-400 font-latin">${new Date(n.createdAt).toLocaleDateString('bn-BD', { year:'numeric', month:'short', day:'numeric' })}</span>
                  </div>
                  <h3 class="text-lg sm:text-xl font-bold text-navy-900">${_esc(n.title)}</h3>
                  <p class="mt-2 text-sm text-ink-500 leading-relaxed">${_esc(n.content)}</p>
                  ${n.pdfUrl ? `<a href="${_esc(n.pdfUrl)}" target="_blank" rel="noopener" class="btn-outline mt-4 text-xs"><i data-lucide="image" class="w-3.5 h-3.5"></i>ছবি দেখুন</a>` : ''}
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
        } else if (tab === 'requests') { // সদস্য আবেদন রাউট হ্যান্ডলিং
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
          const _esc = s => (s == null ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'));
          box.innerHTML = res.data.slice(0, 4).map(n => `
            <article class="card p-6">
              <div class="flex items-center gap-2 mb-3">
                <span class="chip chip-teal"><i data-lucide="tag" class="w-3 h-3"></i>${_esc(n.category)}</span>
                <span class="text-[11px] text-ink-400 font-latin">${new Date(n.createdAt).toLocaleDateString('bn-BD',{year:'numeric',month:'short',day:'numeric'})}</span>
              </div>
              <h3 class="font-bold text-navy-900 text-base">${_esc(n.title)}</h3>
              <p class="text-sm text-ink-500 mt-2 line-clamp-3">${_esc(n.content)}</p>
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
          target.innerHTML = renderAdminRequestListInline(res.data);
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
        target.innerHTML = renderAdminRequestPreviewInline(data.data);
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
      // রাউট কনফিগারেশনের ভিত্তিতে standard বা cms রাউটের জন্য ট্রাই করা হবে
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
      // standard রাউটে রিকোয়েস্ট পাঠানো হবে
      let res = await fetch(`${window.API_BASE}/notices/${id}`, { method: 'DELETE', headers: authHeaders() });
      let data = await res.json();
      
      // standard রাউটে রিকোয়েস্ট ফেইল করলে cms রাউটে ট্রাই করা হবে
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

function _fmtDateBn(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return new Date(d).toDateString(); }
}

function _checkExpiry(joiningDate) {
  if (!joiningDate) return { expired: false, diffText: '' };
  const jDate = new Date(joiningDate);
  const expDate = new Date(jDate.setFullYear(jDate.getFullYear() + 2));
  const today = new Date();
  
  if (today > expDate) {
    return { expired: true, diffText: 'মেয়ادোত্তীর্ণ (Expired)' };
  }
  
  const diffTime = Math.abs(expDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return { expired: false, diffText: `${diffDays} দিন বাকি` };
}

function _initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(s => s[0] || '').join('').toUpperCase() || 'BD';
}

const _icon = (name, cls = 'w-4 h-4') =>
  `<i data-lucide="${name}" class="${cls}"></i>`;

/* ================= INLINE VIEWS FOR PUBLIC REGISTER & ADMIN PENDING REQUESTS ================= */
function renderPublicRegistrationFormInline() {
  return `
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <div class="mx-auto w-14 h-14 rounded-2xl bg-gradient-medical grid place-items-center text-white shadow-elevated">
          ${_icon('user-plus', 'w-6 h-6')}
        </div>
        <h1 class="h-section text-3xl">অনলাইন সদস্যপদ আবেদন ফরম</h1>
        <p class="text-sm sm:text-base text-ink-500">BDDPA ভোলা জেলার সদস্যপদ নিবন্ধনের জন্য নিচের ফরমটি সঠিক তথ্য দিয়ে পূরণ করুন। আপনার আবেদনটি অ্যাডমিন কর্তৃক ভেরিফিকেশন ও অনুমোদনের পর সক্রিয় করা হবে।</p>
      </div>

      <div class="card p-6 sm:p-8 space-y-6 animate-fade-in-up">
        <form id="public-register-form" class="space-y-6" enctype="multipart/form-data">
          
          <div class="border-b pb-2">
            <h3 class="font-bold text-navy-900 text-base">১. ব্যক্তিগত তথ্য (Personal Info)</h3>
          </div>

          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="label" for="reg-nameBn">নাম (বাংলায়) <span class="text-red-500">*</span></label>
              <input id="reg-nameBn" name="nameBn" required class="input" placeholder="ডাঃ মোঃ আবদুর রহমান">
            </div>
            <div>
              <label class="label" for="reg-nameEn">Name (English) <span class="text-red-500">*</span></label>
              <input id="reg-nameEn" name="nameEn" required class="input" placeholder="Dr. Md. Abdur Rahman">
            </div>
            <div>
              <label class="label" for="reg-phone">মোবাইল নম্বর <span class="text-red-500">*</span></label>
              <input id="reg-phone" name="phone" required class="input" placeholder="017XXXXXXXX">
            </div>
            <div>
              <label class="label" for="reg-email">ইমেইল এড্রেস <span class="text-ink-400 font-normal text-xs">(ঐচ্ছিক)</span></label>
              <input id="reg-email" name="email" type="email" class="input" placeholder="member@email.com">
            </div>
            <div>
              <label class="label" for="reg-bloodGroup">ব্লাড গ্রুপ <span class="text-red-500">*</span></label>
              <select id="reg-bloodGroup" name="bloodGroup" required class="select">
                <option value="">সিলেক্ট করুন</option>
                ${['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => `
                  <option value="${bg}">${bg}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="label" for="reg-nidNumber">ন্যাশনাল আইডি (NID) নম্বর <span class="text-red-500">*</span></label>
              <input id="reg-nidNumber" name="nidNumber" required class="input" placeholder="199XXXXXXXXXXXX">
            </div>
          </div>

          <div class="border-b pb-2 pt-4">
            <h3 class="font-bold text-navy-900 text-base">২. শিক্ষাগত ও পেশাগত তথ্য (Professional Info)</h3>
          </div>

          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="label" for="reg-qualification">যোগ্যতা/ডিগ্রি <span class="text-red-500">*</span></label>
              <input id="reg-qualification" name="qualification" required class="input" placeholder="BDS, PGT (Dental)">
            </div>
            <div>
              <label class="label" for="reg-bmdcReg">BMDC রেজিস্ট্রেশন নম্বর <span class="text-ink-400 font-normal text-xs">(ঐচ্ছিক)</span></label>
              <input id="reg-bmdcReg" name="bmdcReg" class="input" placeholder="D-1234">
            </div>
            <div>
              <label class="label" for="reg-institution">শিক্ষা প্রতিষ্ঠান (ইনституটিউট) <span class="text-red-500">*</span></label>
              <input id="reg-institution" name="institution" required class="input" placeholder="উদাঃ ঢাকা ডেন্টাল কলেজ">
            </div>
            <div>
              <label class="label" for="reg-experience">পেশাগত অভিজ্ঞতা (বছর) <span class="text-red-500">*</span></label>
              <input id="reg-experience" name="experience" type="number" required class="input" placeholder="উদাঃ ৫">
            </div>
            <div>
              <label class="label" for="reg-chamberName">চেম্বারের নাম <span class="text-red-500">*</span></label>
              <input id="reg-chamberName" name="chamberName" required class="input" placeholder="রহমান ডেন্টাল কেয়ার">
            </div>
            <div>
              <label class="label" for="reg-chamberAddress">চেম্বারের ঠিকানা <span class="text-red-500">*</span></label>
              <input id="reg-chamberAddress" name="chamberAddress" required class="input" placeholder="সদর রোড, ভোলা সদর">
            </div>
            <div>
              <label class="label" for="reg-personalAddress">স্থায়ী ঠিকানা <span class="text-red-500">*</span></label>
              <input id="reg-personalAddress" name="personalAddress" required class="input" placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা">
            </div>
            <div>
              <label class="label" for="reg-upazila">উপজেলা (ভোলা জেলা) <span class="text-red-500">*</span></label>
              <select id="reg-upazila" name="upazila" required class="select">
                <option value="">সিলেক্ট করুন</option>
                ${['Bhola Sadar', 'Borhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin'].map(up => `
                  <option value="${up}">${up}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="border-b pb-2 pt-4">
            <h3 class="font-bold text-navy-900 text-base">৩. প্রয়োজনীয় নথি আপলোড (File Uploads)</h3>
            <p class="text-[11px] text-ink-500 mt-1">দয়া করে স্পষ্ট এবং পড়ার উপযোগী ছবি আপলোড করুন।</p>
          </div>

          <div class="grid sm:grid-cols-3 gap-5">
            <div>
              <label class="label">আপনার ছবি (Profile Photo) <span class="text-red-500">*</span></label>
              <input type="file" name="profilePhoto" accept="image/*" required class="input py-2">
            </div>
            <div>
              <label class="label">ডিগ্রি সার্টিফিকেট ছবি <span class="text-red-500">*</span></label>
              <input type="file" name="degreePhoto" accept="image/*" required class="input py-2">
            </div>
            <div>
              <label class="label">এনআইডি (NID) কার্ডের ছবি <span class="text-red-500">*</span></label>
              <input type="file" name="nidPhoto" accept="image/*" required class="input py-2">
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-6 border-t border-ink-100">
            <button type="button" onclick="window.location.hash = '#/'" class="btn-outline">বাতিল</button>
            <button type="submit" class="btn-primary w-full sm:w-auto">${_icon('save', 'w-4 h-4')}<span>আবেদন জমা দিন (Submit Application)</span></button>
          </div>
        </form>
      </div>
    </section>
  `;
}

function renderAdminRequestListInline(list = []) {
  if (list.length === 0) {
    return UIComponents.EmptyState('বর্তমানে কোনো নতুন সদস্য আবেদন জমা নেই।', 'user-plus');
  }
  return `
    <div class="card p-6 space-y-6 animate-fade-in">
      <div class="border-b border-ink-100 pb-4">
        <h2 class="h-section text-xl">সদস্য আবেদন তালিকা (Pending Requests)</h2>
        <p class="text-xs text-ink-500 mt-1">নতুন চিকিৎসকদের রেজিস্ট্রেশন আবেদনগুলো পর্যালোচনা করে অনুমোদন অথবা বাতিল করুন।</p>
      </div>
      <div class="overflow-x-auto rounded-xl border border-ink-100">
        <table>
          <thead>
            <tr>
              <th>নাম (বাংলা)</th>
              <th>মোবাইল নম্বর</th>
              <th>উপজেলা</th>
              <th>তারিখ</th>
              <th class="text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(m => {
              const memberIdVal = m._id || m.id || '';
              return `
              <tr>
                <td class="font-bold text-navy-900">${_esc(m.nameBn || m.nameEn)}</td>
                <td class="font-latin">${_esc(m.phone || '—')}</td>
                <td><span class="chip">${_esc(m.upazila || '—')}</span></td>
                <td class="text-xs text-ink-400 font-latin">${_fmtDateBn(m.createdAt || m.joiningDate)}</td>
                <td class="text-right space-x-1">
                  <button onclick="window.appAdmin.loadRequestPreview('${m.slug}')" class="btn-outline px-2 py-1 text-xs text-navy-600 border-navy-300">${_icon('eye','w-3 h-3')} রিভিউ</button>
                  <button onclick="window.appAdmin.approveRequest('${memberIdVal}')" class="btn-outline px-2 py-1 text-xs text-emerald-600 border-emerald-300 bg-emerald-50 hover:bg-emerald-100">${_icon('check','w-3 h-3')} অনুমোদন</button>
                  <button onclick="window.appAdmin.rejectRequest('${memberIdVal}')" class="btn-outline px-2 py-1 text-xs text-red-600 border-red-300 bg-red-50 hover:bg-red-100">${_icon('x','w-3 h-3')} বাতিল</button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function renderAdminRequestPreviewInline(m = {}) {
  const _esc = (v) => (v == null ? '' : String(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;'));

  const profileImg = m.profilePhoto ? `<img src="${_esc(m.profilePhoto)}" class="w-full h-full object-cover rounded-xl"/>` : `<div class="w-full h-full rounded-xl bg-gradient-medical grid place-items-center text-white font-bold text-xl">${_initials(m.nameEn || m.nameBn)}</div>`;
  const degreeImg = m.degreePhoto ? `<img src="${_esc(m.degreePhoto)}" class="w-full h-auto max-h-[300px] object-contain rounded-xl border border-ink-200 shadow-soft"/>` : `<div class="p-8 text-center text-ink-400 bg-ink-50 rounded-xl border border-dashed border-ink-200 w-full">সার্টিফিকেটের ছবি আপলোড করা হয়নি</div>`;
  const nidImg = m.nidPhoto ? `<img src="${_esc(m.nidPhoto)}" class="w-full h-auto max-h-[300px] object-contain rounded-xl border border-ink-200 shadow-soft"/>` : `<div class="p-8 text-center text-ink-400 bg-ink-50 rounded-xl border border-dashed border-ink-200 w-full">এনআইডি কার্ডের ছবি আপলোড করা হয়নি</div>`;
  const memberIdVal = m._id || m.id || '';

  return `
    <div class="card p-6 sm:p-8 space-y-8 animate-fade-in-up">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-ink-100 pb-4">
        <div>
          <span class="eyebrow">Application Review</span>
          <h2 class="h-section text-xl mt-1">সদস্য পদের আবেদন পর্যালোচনা</h2>
        </div>
        <button onclick="window.appAdmin.loadRequestList()" class="btn-outline text-xs inline-flex items-center gap-1">
          ${_icon('arrow-left', 'w-3.5 h-3.5')}<span>আবেদন তালিকায় ফিরে যান</span>
        </button>
      </div>

      <!-- Main Layout -->
      <div class="grid lg:grid-cols-12 gap-8">
        <!-- Profile Column -->
        <div class="lg:col-span-4 space-y-6">
          <div class="card p-5 text-center bg-ink-50/50">
            <div class="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-elevated ring-1 ring-ink-100 mx-auto overflow-hidden">
              ${profileImg}
            </div>
            <h3 class="text-lg font-bold text-navy-900 mt-4">${_esc(m.nameBn || m.nameEn)}</h3>
            <p class="text-xs text-ink-500 font-latin mt-1">${_esc(m.nameEn || '')}</p>
            <div class="pt-3">
              <span class="chip chip-teal">Pending Approval</span>
            </div>
          </div>
        </div>

        <!-- Info Fields Column -->
        <div class="lg:col-span-8 space-y-6">
          <div class="card p-6 space-y-5">
            <h3 class="font-bold text-navy-900 border-b pb-2 text-base">আবেদনকারীর বিবরণ</h3>
            <dl class="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              ${[
                ['graduation-cap', 'যোগ্যতা/ডিগ্রি', m.qualification],
                ['building-2',     'শিক্ষা প্রতিষ্ঠান', m.institution],
                ['badge',          'BMDC Reg No',     m.bmdcReg],
                ['history',        'অভিজ্ঞতা',         m.experience ? `${m.experience} বছর` : '০ বছর'],
                ['briefcase',      'চেম্বারের নাম',    m.chamberName],
                ['map-pin',        'চেম্বারের ঠিকানা',  m.chamberAddress || m.address],
                ['phone',          'মোবাইল নম্বর',    m.phone],
                ['mail',           'ইমেল এড্রেস',     m.email],
                ['heart',          'ব্লাড গ্রুপ',      m.bloodGroup],
                ['credit-card',    'এনআইডি নম্বর',     m.nidNumber],
                ['home',           'স্থায়ী ঠিকানা',    m.personalAddress],
                ['map',            'উপজেলা',          m.upazila],
              ].map(([ic, label, val]) => `
                <div class="flex items-start gap-2.5">
                  <span class="text-teal-600 mt-0.5">${_icon(ic, 'w-4 h-4')}</span>
                  <div>
                    <dt class="text-[11px] font-semibold text-ink-400 uppercase tracking-widest">${label}</dt>
                    <dd class="font-semibold text-navy-900 mt-0.5">${_esc(val || '—')}</dd>
                  </div>
                </div>
              `).join('')}
            </dl>
          </div>
        </div>
      </div>

      <!-- Image Previews Section -->
      <div class="border-t border-ink-100 pt-6 space-y-6">
        <h3 class="font-bold text-navy-900 text-base flex items-center gap-2">
          ${_icon('image', 'w-5 h-5 text-teal-600')}
          <span>আপলোডকৃত নথি ও সার্টিফিকেট প্রিভিউ</span>
        </h3>
        
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Degree Card -->
          <div class="card p-5 space-y-4 bg-ink-50/30">
            <h4 class="font-bold text-sm text-navy-900 flex items-center gap-1.5">
              ${_icon('graduation-cap', 'w-4 h-4 text-teal-600')}
              <span>ডিগ্রি সার্টিফিকেট ছবি</span>
            </h4>
            <div class="flex items-center justify-center min-h-[200px] bg-white rounded-xl p-2 border">
              ${degreeImg}
            </div>
          </div>

          <!-- NID Card -->
          <div class="card p-5 space-y-4 bg-ink-50/30">
            <h4 class="font-bold text-sm text-navy-900 flex items-center gap-1.5">
              ${_icon('credit-card', 'w-4 h-4 text-teal-600')}
              <span>ন্যাশনাল আইডি (NID) কার্ডের ছবি</span>
            </h4>
            <div class="flex items-center justify-center min-h-[200px] bg-white rounded-xl p-2 border">
              ${nidImg}
            </div>
          </div>
        </div>
      </div>

      <!-- Approval & Rejection Actions -->
      <div class="flex items-center justify-end gap-3 pt-6 border-t border-ink-100">
        <button onclick="window.appAdmin.rejectRequest('${memberIdVal}')" class="btn-outline text-red-600 border-red-300 bg-red-50 hover:bg-red-100 py-3 px-6">
          ${_icon('x', 'w-4 h-4 inline mr-1')}<span>আবেদন বাতিল (Delete)</span>
        </button>
        <button onclick="window.appAdmin.approveRequest('${memberIdVal}')" class="btn-primary bg-emerald-600 hover:bg-emerald-700 py-3 px-6">
          ${_icon('check', 'w-4 h-4 inline mr-1')}<span>আবেদন অনুমোদন (Approve)</span>
        </button>
      </div>
    </div>
  `;
}

function _esc(v) {
  return v == null ? '' : String(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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

// ন্যাভবারে রেজিস্ট্রেশন অপশন ইনজেক্ট করার হেল্পার
function patchNavbar() {
  // ডেস্কটপ ন্যাভবার
  const nav = document.querySelector('nav.hidden.lg\\:flex');
  if (nav && !nav.querySelector('a[href="#/register"]')) {
    const regLink = document.createElement('a');
    regLink.href = '#/register';
    regLink.setAttribute('data-nav', '');
    regLink.className = 'px-3.5 py-2 rounded-lg hover:text-navy-900 hover:bg-ink-50 transition';
    regLink.textContent = 'রেজিস্ট্রেশন';
    nav.appendChild(regLink);
  }

  // মোবাইল ড্রয়ার ন্যাভবার
  const drawerNav = document.querySelector('#mobile-drawer nav');
  if (drawerNav && !drawerNav.querySelector('a[href="#/register"]')) {
    const regLink = document.createElement('a');
    regLink.href = '#/register';
    regLink.setAttribute('data-drawer-link', '');
    regLink.className = 'drawer-link';
    regLink.innerHTML = `${_icon('user-plus', 'w-4 h-4')}রেজিস্ট্রেশন`;
    drawerNav.appendChild(regLink);
  }
}

// গ্লোবাল ক্লিক ডেলিগেশন হ্যান্ডলার (ফিরে যান/বাতিল বাটন বাগের সমাধান)
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
      else if (tab === 'requests') window.appAdmin.loadRequestList(); // নতুন আবেদনের ব্যাক বাটন
      else if (tab === 'notices') window.appAdmin.loadNoticeList();
      else if (tab === 'events') window.appAdmin.loadEventList();
      else if (tab === 'leadership') window.appAdmin.loadLeadershipForm();
      else window.appAdmin.loadOverview();
    }
  }
});

document.addEventListener('submit', async (e) => {
  if (!e.target) return;

  // ফাইলকে Base64-এ রূপান্তর করার গ্লোবাল হেল্পার ফাংশন
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

  // ১. অ্যাডমিন লগইন
  if (e.target.id === 'admin-local-login') {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    window.appAuth.login(email, password);
  }

  // ২. নতুন সদস্য এড বা এডিট ফর্ম সাবমিট
  if (e.target.id === 'add-member-form') {
    e.preventDefault();
    const form = e.target;
    const memberId = form.dataset.id; // এডিট মোড হলে থাকবে
    
    // ফর্ম ইনপুট থেকে ফাইল অবজেক্টগুলো নেওয়া
    const profilePhotoFile = form.querySelector('input[name="profilePhoto"]')?.files[0];
    const degreePhotoFile = form.querySelector('input[name="degreePhoto"]')?.files[0];
    const nidPhotoFile = form.querySelector('input[name="nidPhoto"]')?.files[0];

    // ফাইলগুলোকে Base64-এ রূপান্তর করা
    const profilePhotoBase64 = await fileToBase64(profilePhotoFile);
    const degreePhotoBase64 = await fileToBase64(degreePhotoFile);
    const nidPhotoBase64 = await fileToBase64(nidPhotoFile);

    // ফর্ম ডেটা অবজেক্ট তৈরি
    const formFields = new FormData(form);
    const data = Object.fromEntries(formFields.entries());

    // ব্যাকএন্ড স্কিমার রিকোয়ার্ড ফিল্ড এরর এড়াতে ডিফেন্সিভ ডেটা ম্যাপিং (ডিফল্ট ভ্যালু প্রদান)
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
    data.address = data.chamberAddress || ""; // chamberAddress কে address-এ ম্যাপ করা
    data.personalAddress = data.personalAddress || "";
    data.upazila = data.upazila || "Bhola Sadar";
    data.biography = data.biography || "";
    data.roleType = data.roleType || "General Member";
    data.executivePost = data.executivePost || "";

    // কনভার্ট করা Base64 ডাটা অ্যাসাইন করা
    // এডিট মুডে যদি ব্যবহারকারী নতুন ছবি আপলোড না করে থাকেন, তবে বডি থেকে সংশ্লিষ্ট প্রোপার্টিগুলো মুছে ফেলা হবে
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

    // এডিট নাকি ক্রিয়েট—অনুরূপ ইউআরএল ও মেথড নির্ধারণ
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
        headers: authHeaders(false), // JSON ট্রান্সমিশনের জন্য application/json ব্যবহার করা হবে
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      
      if (resData.success) {
        window.showToast(memberId ? 'সদস্য তথ্য সফলভাবে আপডেট হয়েছে।' : 'সদস্য সফলভাবে নিবন্ধিত হয়েছে।', 'success');
        
        // অটোমেটেড মোবাইল এসএমএস ও ইমেইল নোটিফিকেশন (শুধুমাত্র নতুন এন্ট্রির ক্ষেত্রে)
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

  // ৩. নতুন নোটিশ প্রকাশ বা এডিট ফর্ম সাবমিট
  if (e.target.id === 'add-notice-form') {
    e.preventDefault();
    const form = e.target;
    const noticeId = form.dataset.id;

    // নোটিশের ছবি ইনপুট নেওয়া ও রূপান্তর করা
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

  // ৪. ইভেন্ট এড বা এডিট ফর্ম সাবমিট
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

  // ৫. হোমপেজ সম্মানিত নেতৃত্ব মডিউল আপডেট
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

  // ৬. পাবলিক রেজিস্ট্রেশন ফর্ম সাবমিট (নতুন ফিচার)
  if (e.target.id === 'public-register-form') {
    e.preventDefault();
    const form = e.target;
    
    // ফাইল ইনপুটগুলো রিসিভ করা
    const profilePhotoFile = form.querySelector('input[name="profilePhoto"]')?.files[0];
    const degreePhotoFile = form.querySelector('input[name="degreePhoto"]')?.files[0];
    const nidPhotoFile = form.querySelector('input[name="nidPhoto"]')?.files[0];

    // বাধ্যতামূলক ফাইল চেকিং ভ্যালিডেশন
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

    // বাটন লোডিং স্টেট পরিবর্তন
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>প্রসেস হচ্ছে...</span>`;

    // ফাইলগুলোকে Base64-এ রূপান্তর করা
    const profilePhotoBase64 = await fileToBase64(profilePhotoFile);
    const degreePhotoBase64 = await fileToBase64(degreePhotoFile);
    const nidPhotoBase64 = await fileToBase64(nidPhotoFile);

    // ফর্ম ডাটা তৈরি
    const formFields = new FormData(form);
    const data = Object.fromEntries(formFields.entries());

    // মেন্ডেটরি ও ডিফেন্সিভ অবজেক্ট ম্যাপিং
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
    
    // আবেদন অবশ্যই 'Pending' স্ট্যাটাসে ডাটাবেজে যাবে এবং এপ্রুভালের অপেক্ষায় থাকবে
    data.status = 'Pending';
    data.joiningDate = new Date().toISOString();

    data.profilePhoto = profilePhotoBase64;
    data.degreePhoto = degreePhotoBase64;
    data.nidPhoto = nidPhotoBase64;

    try {
      const res = await fetch(`${window.API_BASE}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // টোকেন ছাড়া পাবলিক এপিআই হিসেবে সাবমিট হবে
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
