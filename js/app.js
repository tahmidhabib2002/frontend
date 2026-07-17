/*
 * BDDPA Public Client Router & App State
 * Vanilla JS SPA using hash-based routing.
 */

// ==================== GLOBALS ====================
window.appState = {
  token: localStorage.getItem('accessToken') || null,
  user: JSON.parse(localStorage.getItem('currentUser') || 'null')
};

window.API_BASE = (function () {
  const meta = document.querySelector('meta[name="api-base"]');
  if (meta && meta.getAttribute('content')) return meta.getAttribute('content');
  return '/api/v1';
})();

// ==================== AUTH HEADERS ====================
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

// ==================== TOAST ====================
window.showToast = (message, type = 'success') => {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="toast toast-${type} animate-fade-in-up" style="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;max-width:90%;">
      <i data-lucide="${type === 'success' ? 'check-circle-2' : type === 'error' ? 'alert-octagon' : 'alert-triangle'}" class="w-4 h-4"></i>
      <span>${message}</span>
    </div>
  `;
  const node = el.firstElementChild;
  document.body.appendChild(node);
  if (window.lucide) window.lucide.createIcons({ attrs: { class: 'w-4 h-4' } });
  setTimeout(() => {
    if (node && node.parentNode) node.remove();
  }, 3500);
};

// ==================== SEO ENGINE ====================
const seoEngine = {
  setMeta: (title, description, canonicalPath, schemaObj = null) => {
    document.title = title || 'BDDPA ভোলা';
    const ensureMeta = (attr, val, key = 'name') => {
      let el = document.querySelector(`meta[${key}="${attr}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(key, attr); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    ensureMeta('description', description || 'ভোলা জেলা ডেন্টাল প্র্যাকটিশনার অ্যাসোসিয়েশন');
    ensureMeta('og:title', title || 'BDDPA', 'property');
    ensureMeta('og:description', description || '', 'property');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', canonicalPath || window.location.href);

    const oldScript = document.getElementById('seo-ld-json');
    if (oldScript) oldScript.remove();
    if (schemaObj) {
      const script = document.createElement('script');
      script.id = 'seo-ld-json';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    }
  }
};
window.seoEngine = seoEngine;

// ==================== HELPERS ====================
function refreshLucide() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}
window.refreshLucide = refreshLucide;

function highlightActiveNav(path) {
  document.querySelectorAll('[data-nav], [data-drawer-link]').forEach(a => {
    const target = (a.getAttribute('href') || '').replace(/^#/, '') || '/';
    const current = path || window.location.hash.replace(/^#/, '').split('?')[0] || '/';
    a.classList.toggle('is-active', target === current || (target === '/' && current === '/'));
  });
}
window.highlightActiveNav = highlightActiveNav;

// ==================== LIGHTBOX ====================
window.viewLargeImage = (src) => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[100] bg-navy-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in';
  modal.innerHTML = `
    <div class="absolute top-4 right-4 flex gap-2 z-10">
      <button onclick="window.print()" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer" title="প্রিন্ট করুন">
        <i data-lucide="printer" class="w-5 h-5"></i>
      </button>
      <button id="close-lightbox-btn" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer" title="বন্ধ করুন">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>
    <div class="relative max-w-full max-h-[85vh] overflow-auto flex items-center justify-center rounded-2xl border border-white/10 bg-black/40 shadow-elevated p-2">
      <img src="${src}" class="max-w-full max-h-[80vh] object-contain rounded-xl" alt="Notice Attachment" />
    </div>
  `;
  
  const close = () => { modal.remove(); document.body.style.overflow = ''; };
  modal.querySelector('#close-lightbox-btn').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  refreshLucide();
};

// ==================== ROUTER CLASS ====================
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
          if (pathSegments[i].startsWith(':')) params[pathSegments[i].slice(1)] = decodeURIComponent(hashSegments[i] || '');
          else if (pathSegments[i] !== hashSegments[i]) { isMatch = false; break; }
        }
        if (isMatch) { matchedRoute = this.routes[routeKey]; routeParams = params; break; }
      }
    }

    if (matchedRoute) {
      const loadingHTML = UIComponents ? UIComponents.Loading() : '<div class="flex justify-center py-20"><div class="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div></div>';
      this.outlet.innerHTML = loadingHTML;
      refreshLucide();
      setTimeout(() => {
        try {
          this.outlet.innerHTML = matchedRoute.render(routeParams);
          seoEngine.setMeta(matchedRoute.title, matchedRoute.description || 'BDDPA Portal', hash);
          highlightActiveNav(routePath);
          refreshLucide();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
          console.error('Route render error:', e);
          this.outlet.innerHTML = UIComponents ? UIComponents.ErrorPage404() : '<div class="text-center py-20"><h1 class="text-2xl font-bold">404</h1><p>পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</p></div>';
          refreshLucide();
        }
      }, 80);
    } else {
      this.outlet.innerHTML = UIComponents ? UIComponents.ErrorPage404() : '<div class="text-center py-20"><h1 class="text-2xl font-bold">404</h1><p>পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</p></div>';
      refreshLucide();
    }
  }
}

// ==================== ROUTE CONFIGURATION ====================
function getRouterConfig() {
  return {
    '/': {
      title: 'হোম | BDDPA ভোলা',
      description: 'ভোলা জেলা ডেন্টাল প্র্যাকটিশনার অ্যাসোসিয়েশনের অফিসিয়াল হোমপেজ।',
      render: () => {
        setTimeout(() => {
          if (window.appPublic) {
            window.appPublic.initHomeSections();
            window.appPublic.loadDynamicMembershipCard();
          }
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
        setTimeout(() => {
          if (window.appMembers) window.appMembers.executeDirectorySearch();
        }, 30);
        return UIComponents.DirectoryListView();
      }
    },

    '/executive': {
      title: 'কার্যনির্বাহী কমিটি | BDDPA',
      description: 'সংগঠনের সম্মানিত কার্যনির্বাহী কমিটির সদস্যবৃন্দ।',
      render: () => {
        setTimeout(() => {
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
        }, 30);
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
        setTimeout(() => {
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
        }, 30);
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
        setTimeout(() => {
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
                    <div class="card p-6 sm:p-7 space-y-4">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="chip ${catChip(n.category)}"><i data-lucide="tag" class="w-3 h-3"></i>${_esc(n.category)}</span>
                        <span class="text-[11px] text-ink-400 font-latin">${new Date(n.createdAt).toLocaleDateString('bn-BD', { year:'numeric', month:'short', day:'numeric' })}</span>
                      </div>
                      <h3 class="text-lg sm:text-xl font-bold text-navy-900">${_esc(n.title)}</h3>
                      <p class="text-sm text-ink-500 leading-relaxed">${_esc(n.content)}</p>
                      ${n.pdfUrl ? `
                        <div class="mt-4 max-w-lg rounded-xl overflow-hidden border border-ink-100 bg-ink-50 relative group">
                          <img src="${_esc(n.pdfUrl)}" alt="${_esc(n.title)}" class="w-full h-auto max-h-[400px] object-contain" loading="lazy" />
                          <div class="p-3 bg-white border-t flex justify-end">
                            <button onclick="window.viewLargeImage('${_esc(n.pdfUrl)}')" class="btn-outline text-xs inline-flex items-center gap-1.5 cursor-pointer">
                              <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
                              <span>বড় করে দেখুন</span>
                            </button>
                          </div>
                        </div>` : ''}
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
        }, 30);
        return `
          <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <span class="eyebrow">Official Notices</span>
              <h1 class="h-section text-3xl sm:text-4xl">নোটিশ বোর্ড</h1>
              <p class="text-sm text-ink-500">অ্যাসোসিয়েশন থেকে প্রকাশিত সকল ঘোষণা ও বিজ্ঞপ্তি।</p>
            </div>
            <div id="notice-list-view">${UIComponents.Loading()}</div>
          </section>`;
      }
    },

    '/members/:slug': {
      title: 'সদস্য প্রোফাইল | BDDPA',
      description: 'BDDPA সদস্যের অফিসিয়াল প্রোফাইল।',
      render: (params) => {
        setTimeout(() => {
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
        }, 30);
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
          if (window.appAdmin) {
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
          }
        }, 30);

        return UIComponents.AdminDashboardShell(tab, `<div id="dashboard-content-area">${UIComponents.Loading()}</div>`);
      }
    }
  };
}

// ==================== AUTH MODULE ====================
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

// ==================== MEMBERS MODULE ====================
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

// ==================== VERIFICATION MODULE ====================
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

// ==================== PUBLIC MODULE ====================
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
            <article class="card p-6 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <span class="chip chip-teal"><i data-lucide="tag" class="w-3 h-3"></i>${_esc(n.category)}</span>
                  <span class="text-[11px] text-ink-400 font-latin">${new Date(n.createdAt).toLocaleDateString('bn-BD',{year:'numeric',month:'short',day:'numeric'})}</span>
                </div>
                <h3 class="font-bold text-navy-900 text-base">${_esc(n.title)}</h3>
                <p class="text-sm text-ink-500 mt-2 line-clamp-3">${_esc(n.content)}</p>
              </div>
              ${n.pdfUrl ? `
                <div class="mt-4 rounded-xl overflow-hidden border border-ink-100 aspect-[16/9] bg-ink-50 relative group">
                  <img src="${_esc(n.pdfUrl)}" alt="${_esc(n.title)}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                  <button onclick="window.viewLargeImage('${_esc(n.pdfUrl)}')" class="absolute inset-0 w-full h-full bg-navy-900/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-sm border-none cursor-pointer">
                    <i data-lucide="maximize-2" class="w-4 h-4"></i>
                    <span>বড় করে দেখুন</span>
                  </button>
                </div>` : ''}
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

// ==================== ADMIN MODULE ====================
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
      .catch(() => { target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি'); refreshLucide(); });
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
      target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি');
      refreshLucide();
    }
  },

  approveRequest: async (id) => {
    if (!confirm('আপনি কি এই আবেদনটি অনুমোদন করতে চান?')) return;
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
      window.showToast('সার্ভার সংযোগ সমস্যা।', 'error');
    }
  },

  rejectRequest: async (id) => {
    if (!confirm('আপনি কি এই আবেদনটি বাতিল ও মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`${window.API_BASE}/members/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        window.showToast('আবেদনটি বাতিল ও মুছে ফেলা হয়েছে।', 'success');
        window.appAdmin.loadRequestList();
      } else {
        window.showToast(data.message || 'বাতিল করা যায়নি।', 'error');
      }
    } catch (err) {
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
        if (res.success) target.innerHTML = UIComponents.AdminNoticeList(res.data);
        else target.innerHTML = UIComponents.EmptyState('নোটিশ তালিকা লোড করা যায়নি।');
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
        if (res.success) target.innerHTML = UIComponents.AdminEventList(res.data);
        else target.innerHTML = UIComponents.EmptyState('ইভেন্ট তালিকা লোড করা যায়নি।');
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
        if (res.success) target.innerHTML = UIComponents.AdminLeadershipForm(res.data || {});
        else target.innerHTML = UIComponents.EmptyState('সম্মানিত নেতৃত্বের তথ্য লোড করা যায়নি।');
        refreshLucide();
      })
      .catch(() => { target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি'); refreshLucide(); });
  },

  loadAddMemberForm: () => {
    const target = document.getElementById('dashboard-content-area');
    if (target) { target.innerHTML = UIComponents.AdminMemberForm(); refreshLucide(); }
  },

  loadEditMemberForm: async (slug) => {
    const target = document.getElementById('dashboard-content-area');
    if (!target) return;
    target.innerHTML = UIComponents.Loading();
    try {
      const res = await fetch(`${window.API_BASE}/members/profile/${slug}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) target.innerHTML = UIComponents.AdminMemberForm(data.data);
      else target.innerHTML = UIComponents.EmptyState('সদস্য তথ্য লোড করা যায়নি।');
      refreshLucide();
    } catch (err) { target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি'); refreshLucide(); }
  },

  loadAddNoticeForm: () => {
    const target = document.getElementById('dashboard-content-area');
    if (target) { target.innerHTML = UIComponents.AdminNoticeForm(); refreshLucide(); }
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
      if (data.success) target.innerHTML = UIComponents.AdminNoticeForm(data.data);
      else target.innerHTML = UIComponents.EmptyState(data.message || 'নোটিশ তথ্য লোড করা যায়নি।');
      refreshLucide();
    } catch (err) { target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি'); refreshLucide(); }
  },

  loadAddEventForm: () => {
    const target = document.getElementById('dashboard-content-area');
    if (target) { target.innerHTML = UIComponents.AdminEventForm(); refreshLucide(); }
  },

  loadEditEventForm: async (id) => {
    const target = document.getElementById('dashboard-content-area');
    if (!target) return;
    target.innerHTML = UIComponents.Loading();
    try {
      const res = await fetch(`${window.API_BASE}/cms/events/${id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) target.innerHTML = UIComponents.AdminEventForm(data.data);
      else target.innerHTML = UIComponents.EmptyState('ইভেন্ট তথ্য লোড করা যায়নি।');
      refreshLucide();
    } catch (err) { target.innerHTML = UIComponents.EmptyState('সার্ভার ত্রুটি'); refreshLucide(); }
  },

  renewMember: async (id) => {
    if (!confirm('আপনি কি এই সদস্যের মেম্বারশিপ মেয়াদ আরও ২ বছর নবায়ন করতে চান?')) return;
    try {
      const res = await fetch(`${window.API_BASE}/members/${id}`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ joiningDate: new Date().toISOString(), status: 'Active' })
      });
      const data = await res.json();
      if (data.success) { window.showToast('মেম্বারশিপ মেয়াদ সফলভাবে নবায়ন হয়েছে।', 'success'); window.appAdmin.loadMemberList(); }
      else window.showToast(data.message || 'নবায়ন ব্যর্থ হয়েছে।', 'error');
    } catch (err) { window.showToast('সার্ভার সংযোগ ব্যর্থ হয়েছে।', 'error'); }
  },

  deleteMember: async (id) => {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই সদস্যের অ্যাকাউন্ট ডিলেট করতে চান?')) return;
    try {
      const res = await fetch(`${window.API_BASE}/members/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (data.success) { window.showToast('সদস্য সফলভাবে ডিলিট করা হয়েছে।', 'success'); window.appAdmin.loadMemberList(); }
      else window.showToast(data.message || 'ডিলিট করা যায়নি।', 'error');
    } catch (err) { window.showToast('সার্ভার সংযোগ ত্রুটি।', 'error'); }
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
      if (data.success) { window.showToast('নোটিশ ডিলিট করা হয়েছে।', 'success'); window.appAdmin.loadNoticeList(); }
      else window.showToast(data.message || 'ডিলিট করা যায়নি।', 'error');
    } catch (err) { window.showToast('সার্ভার ত্রুটি।', 'error'); }
  },

  deleteEvent: async (id) => {
    if (!confirm('আপনি কি এই ইভেন্টটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`${window.API_BASE}/cms/events/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (data.success) { window.showToast('ইভেন্ট ডিলিট করা হয়েছে।', 'success'); window.appAdmin.loadEventList(); }
      else window.showToast('ডিলিট করা যায়নি।', 'error');
    } catch (_) { window.showToast('সার্ভার ত্রুটি'); }
  }
};

// ==================== EVENT LISTENERS ====================
document.addEventListener('click', (e) => {
  const backBtn = e.target.closest('button[onclick*="dashboard?tab="]');
  if (backBtn) {
    const onclickStr = backBtn.getAttribute('onclick') || '';
    const match = onclickStr.match(/tab=([^'"]+)/);
    if (match && match[1]) {
      e.preventDefault();
      e.stopPropagation();
      const tab = match[1];
      if (window.appAdmin) {
        if (tab === 'members') window.appAdmin.loadMemberList();
        else if (tab === 'requests') window.appAdmin.loadRequestList();
        else if (tab === 'notices') window.appAdmin.loadNoticeList();
        else if (tab === 'events') window.appAdmin.loadEventList();
        else if (tab === 'leadership') window.appAdmin.loadLeadershipForm();
        else window.appAdmin.loadOverview();
      }
    }
  }
});

document.addEventListener('submit', async (e) => {
  if (!e.target) return;

  const fileToBase64 = (file) => new Promise((resolve) => {
    if (!file || !(file instanceof File) || file.size === 0) { resolve(""); return; }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve("");
  });

  // ============ অ্যাডমিন লগইন ============
  if (e.target.id === 'admin-local-login') {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;
    if (email && password && window.appAuth) {
      window.appAuth.login(email, password);
    }
  }

  // ============ সদস্য তৈরি/আপডেট (অ্যাডমিন) ============
  if (e.target.id === 'add-member-form') {
    e.preventDefault();
    const form = e.target;
    const memberId = form.dataset.id;
    const profilePhotoFile = form.querySelector('input[name="profilePhoto"]')?.files[0];
    const degreePhotoFile = form.querySelector('input[name="degreePhoto"]')?.files[0];
    const nidPhotoFile = form.querySelector('input[name="nidPhoto"]')?.files[0];

    const formFields = new FormData(form);
    const data = Object.fromEntries(formFields.entries());
    data.profilePhoto = await fileToBase64(profilePhotoFile) || data.profilePhoto || "";
    data.degreePhoto = await fileToBase64(degreePhotoFile) || data.degreePhoto || "";
    data.nidPhoto = await fileToBase64(nidPhotoFile) || data.nidPhoto || "";
    
    if (!memberId) { data.joiningDate = new Date().toISOString(); data.status = 'Active'; }

    try {
      const res = await fetch(memberId ? `${window.API_BASE}/members/${memberId}` : `${window.API_BASE}/members`, {
        method: memberId ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) {
        window.showToast(memberId ? 'সদস্য আপডেট হয়েছে।' : 'সদস্য নিবন্ধিত হয়েছে।', 'success');
        window.location.hash = '#/admin/dashboard?tab=members';
      } else window.showToast(resData.message || 'অপারেশন ব্যর্থ হয়েছে।', 'error');
    } catch (err) { window.showToast('সার্ভারে সংযোগ করা যায়নি।', 'error'); }
  }

  // ============ নোটিশ তৈরি/আপডেট ============
  if (e.target.id === 'add-notice-form') {
    e.preventDefault();
    const form = e.target;
    const noticeId = form.dataset.id;
    const pdfUrlFile = form.querySelector('input[name="pdfUrl"]')?.files[0];
    const formFields = new FormData(form);
    const data = Object.fromEntries(formFields.entries());
    data.pdfUrl = await fileToBase64(pdfUrlFile) || data.pdfUrl || "";

    try {
      let res = await fetch(noticeId ? `${window.API_BASE}/notices/${noticeId}` : `${window.API_BASE}/notices`, {
        method: noticeId ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(data)
      });
      let resData = await res.json();
      if (!resData.success || res.status === 404) {
        res = await fetch(noticeId ? `${window.API_BASE}/cms/notices/${noticeId}` : `${window.API_BASE}/cms/notices`, {
          method: noticeId ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(data)
        });
        resData = await res.json();
      }
      if (resData.success) { window.showToast(noticeId ? 'নোটিশ আপডেট হয়েছে।' : 'নোটিশ প্রকাশিত হয়েছে।', 'success'); window.location.hash = '#/admin/dashboard?tab=notices'; }
      else window.showToast(resData.message || 'সংরক্ষণ ব্যর্থ।', 'error');
    } catch (err) { window.showToast('সার্ভারে সংযোগ করা যায়নি।', 'error'); }
  }

  // ============ ইভেন্ট তৈরি/আপডেট ============
  if (e.target.id === 'add-event-form') {
    e.preventDefault();
    const form = e.target;
    const eventId = form.dataset.id;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch(eventId ? `${window.API_BASE}/cms/events/${eventId}` : `${window.API_BASE}/cms/events`, {
        method: eventId ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) { window.showToast(eventId ? 'ইভেন্ট আপডেট হয়েছে।' : 'ইভেন্ট তৈরি হয়েছে।', 'success'); window.location.hash = '#/admin/dashboard?tab=events'; }
      else window.showToast('ইভেন্ট সংরক্ষণ ব্যর্থ।', 'error');
    } catch (_) { window.showToast('সার্ভার ত্রুটি'); }
  }

  // ============ লিডারশিপ ফর্ম ============
  if (e.target.id === 'edit-leadership-form') {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await fetch(`${window.API_BASE}/cms/home`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) });
      const resData = await res.json();
      if (resData.success) { window.showToast('নেতৃত্ব আপডেট হয়েছে।', 'success'); window.location.hash = '#/admin/dashboard?tab=home'; }
      else window.showToast('আপডেট ব্যর্থ।', 'error');
    } catch (_) { window.showToast('সার্ভার ত্রুটি'); }
  }

  // ============ পাবলিক রেজিস্ট্রেশন ফর্ম ============
  if (e.target.id === 'public-register-form') {
    e.preventDefault();
    const form = e.target;

    // ফাইল চেক
    const profilePhotoFile = form.querySelector('input[name="profilePhoto"]')?.files[0];
    const degreePhotoFile = form.querySelector('input[name="degreePhoto"]')?.files[0];
    const nidPhotoFile = form.querySelector('input[name="nidPhoto"]')?.files[0];

    if (!profilePhotoFile || !degreePhotoFile || !nidPhotoFile) {
      window.showToast('সবগুলো ছবি সিলেক্ট করুন।', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const orig = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>প্রসেস হচ্ছে...</span>';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      data.profilePhoto = await fileToBase64(profilePhotoFile);
      data.degreePhoto = await fileToBase64(degreePhotoFile);
      data.nidPhoto = await fileToBase64(nidPhotoFile);

      // 👇 পাবলিক এন্ডপয়েন্ট সংশোধিত: /members/apply ব্যবহার করা হলো
      const res = await fetch(`${window.API_BASE}/members/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const resData = await res.json();
      if (resData.success) {
        window.showToast('আবেদন জমা হয়েছে।', 'success');
        window.location.hash = '#/';
      } else {
        window.showToast(resData.message || 'আবেদন জমা দেওয়া যায়নি।', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = orig;
      }
    } catch (err) {
      console.error('Registration error:', err);
      window.showToast('সার্ভার সংযোগ করা যায়নি।', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = orig;
    }
  }
});

// ==================== INIT ====================
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

// ============ DOM রেডি ============
document.addEventListener('DOMContentLoaded', () => {
  if (typeof UIComponents === 'undefined') {
    console.error('UIComponents not loaded! Check components.js');
    document.getElementById('main-app-viewport').innerHTML = `
      <div class="text-center py-20 px-4">
        <div class="text-4xl mb-4">⚠️</div>
        <h1 class="text-2xl font-bold text-navy-900">কম্পোনেন্ট লোড হয়নি</h1>
        <p class="text-sm text-ink-500 mt-2">দয়া করে পৃষ্ঠাটি রিফ্রেশ করুন।</p>
        <button onclick="location.reload()" class="btn-primary mt-4">রিফ্রেশ করুন</button>
      </div>
    `;
    return;
  }

  initChrome();
  patchNavbar();
  refreshLucide();
  
  const router = new PublicClientRouter(getRouterConfig(), 'main-app-viewport');
  window.__router = router;
});
