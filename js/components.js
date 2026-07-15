/* ============================================================
 * BDDPA UIComponents — Premium Medical Association Design
 *
 * IMPORTANT: This module is a pure presentation layer.
 * app.js drives all fetch calls, routing, auth, and state.
 * Every function here is called by app.js — do not rename.
 * ============================================================ */

const _icon = (name, cls = 'w-4 h-4') =>
  `<i data-lucide="${name}" class="${cls}"></i>`;

// Escape user-controlled strings when injecting into innerHTML.
const _esc = (v) => (v == null ? '' : String(v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;'));

const _fmtDateBn = (d) => {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return new Date(d).toDateString(); }
};

const _initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map(s => s[0] || '').join('').toUpperCase() || 'BD';

const UIComponents = {

  /* ================= PRIMITIVES ================= */
  Button: (text, type = 'primary', onClickAttr = '') => {
    const cls = ({ primary: 'btn-primary', secondary: 'btn-secondary', outline: 'btn-outline', ghost: 'btn-ghost' })[type] || 'btn-primary';
    return `<button ${onClickAttr} class="${cls}">${text}</button>`;
  },

  Loading: () => `
    <div class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="relative w-14 h-14">
        <div class="absolute inset-0 rounded-full border-2 border-ink-100"></div>
        <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-500 animate-spin"></div>
        <div class="absolute inset-2 rounded-full bg-gradient-medical grid place-items-center text-white">
          ${_icon('stethoscope', 'w-4 h-4')}
        </div>
      </div>
      <p class="text-xs font-semibold text-ink-500 tracking-wide">লোড হচ্ছে…</p>
    </div>`,

  ToastNotification: (message, type = 'success') => {
    const iconMap = { success: 'check-circle-2', error: 'alert-octagon', warning: 'alert-triangle' };
    return `<div class="toast toast-${type}">
      ${_icon(iconMap[type] || iconMap.success, 'w-4 h-4')}
      <span>${_esc(message)}</span>
    </div>`;
  },

  SkeletonCard: () => `
    <div class="card p-6 space-y-4">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl shimmer"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 w-1/2 rounded shimmer"></div>
          <div class="h-2.5 w-1/3 rounded shimmer"></div>
        </div>
      </div>
      <div class="h-2.5 rounded shimmer"></div>
      <div class="h-2.5 w-2/3 rounded shimmer"></div>
    </div>`,

  EmptyState: (message = 'কোনো তথ্য খুঁজে পাওয়া যায়নি।', icon = 'inbox') => `
    <div class="flex flex-col items-center justify-center py-20 gap-4 text-center max-w-sm mx-auto">
      <div class="w-16 h-16 rounded-2xl bg-ink-50 grid place-items-center text-ink-400">
        ${_icon(icon, 'w-7 h-7')}
      </div>
      <p class="text-sm font-semibold text-ink-500">${_esc(message)}</p>
    </div>`,

  ErrorPage404: () => `
    <section class="min-h-[70vh] grid place-items-center px-4">
      <div class="max-w-md text-center space-y-6">
        <div class="mx-auto w-20 h-20 rounded-2xl bg-gradient-medical grid place-items-center text-white shadow-elevated">
          ${_icon('search-x', 'w-9 h-9')}
        </div>
        <div>
          <div class="font-latin text-[80px] leading-none font-extrabold bg-clip-text text-transparent bg-gradient-medical">404</div>
          <h2 class="mt-3 text-2xl font-bold text-navy-900">পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h2>
          <p class="mt-2 text-sm text-ink-500">আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি সরানো বা মুছে ফেলা হয়েছে।</p>
        </div>
        <div class="flex items-center justify-center gap-3">
          <a href="#/" class="btn-primary">${_icon('home', 'w-4 h-4')}<span>হোমে ফিরে যান</span></a>
          <a href="#/members" class="btn-outline">${_icon('users', 'w-4 h-4')}<span>সদস্য তালিকা</span></a>
        </div>
      </div>
    </section>`,

  Modal: (id, title, content) => `
    <div id="${id}" class="fixed inset-0 z-[80] hidden items-center justify-center p-4 bg-navy-900/50 backdrop-blur-sm">
      <div class="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-elevated border border-white/60 animate-scale-in">
        <div class="p-5 border-b border-ink-100 flex items-center justify-between bg-ink-50/40">
          <h3 class="font-bold text-navy-900">${_esc(title)}</h3>
          <button onclick="document.getElementById('${id}').classList.add('hidden'); document.getElementById('${id}').classList.remove('flex')" class="w-9 h-9 grid place-items-center rounded-lg hover:bg-ink-100 text-ink-500">${_icon('x')}</button>
        </div>
        <div class="p-6 space-y-4">${content}</div>
      </div>
    </div>`,

  /* ================= HERO ================= */
  HomeHero: () => `
    <section class="relative hero-bg">
      <div class="hero-blob bg-teal-500/60" style="top:-4rem; left:-4rem;"></div>
      <div class="hero-blob bg-emerald-500/40" style="bottom:-6rem; right:-4rem;"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div class="grid lg:grid-cols-12 gap-10 items-center">
          <div class="lg:col-span-7 space-y-7 animate-fade-in-up">
            <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur text-[11px] font-semibold text-teal-100 tracking-wide">
              ${_icon('shield-check', 'w-3.5 h-3.5')}
              <span>Bhola District · Official Verified Directory</span>
            </span>
            <h1 class="text-[34px] sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
              ভোলা জেলার <br class="hidden sm:block"/>
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-teal-100 to-emerald-200">অনুমোদিত ডেন্টাল</span>
              <br class="hidden sm:block"/> চিকিৎসকদের অফিসিয়াল প্ল্যাটফর্ম
            </h1>
            <p class="text-base sm:text-lg text-ink-200/90 max-w-2xl leading-relaxed">
              রেজিস্টার্ড সদস্য, প্রকাশিত নোটিশ ও ইভেন্টসহ ভোলা জেলার সকল ভেরিফাইড দন্ত চিকিৎসকদের একটি নিরাপদ, স্বচ্ছ ও পেশাদার ডিজিটাল রেজিস্ট্রি।
            </p>
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <a href="#/members" class="btn-primary btn-lg" style="background:linear-gradient(135deg,#0891b2,#10b981);">${_icon('users', 'w-4 h-4')}<span>সদস্য তালিকা দেখুন</span></a>
              <a href="#/verification" class="btn-lg inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur transition">
                ${_icon('badge-check', 'w-4 h-4')}<span>সদস্য যাচাই করুন</span>
              </a>
            </div>
            <dl class="grid grid-cols-3 gap-4 sm:gap-6 pt-8 max-w-xl">
              <div><dt class="text-[11px] uppercase tracking-widest text-teal-300 font-latin font-semibold">Members</dt><dd class="mt-1 text-2xl sm:text-3xl font-bold text-white" data-hero-count="members">—</dd></div>
              <div><dt class="text-[11px] uppercase tracking-widest text-teal-300 font-latin font-semibold">Notices</dt><dd class="mt-1 text-2xl sm:text-3xl font-bold text-white" data-hero-count="notices">—</dd></div>
              <div><dt class="text-[11px] uppercase tracking-widest text-teal-300 font-latin font-semibold">Events</dt><dd class="mt-1 text-2xl sm:text-3xl font-bold text-white" data-hero-count="events">—</dd></div>
            </dl>
          </div>

          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md">
              <div class="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-teal-400/30 to-emerald-400/20 blur-2xl"></div>
              <div class="relative rounded-[2rem] bg-white/10 border border-white/20 backdrop-blur-xl p-6 shadow-elevated">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-11 h-11 rounded-xl bg-white/15 grid place-items-center text-teal-200">${_icon('id-card', 'w-5 h-5')}</div>
                  <div>
                    <div class="text-xs text-teal-200 tracking-widest font-latin font-semibold uppercase">Digital Membership Card</div>
                    <div class="text-white font-bold">BDPA-0001</div>
                  </div>
                  <span class="ml-auto verified-badge">${_icon('check', 'w-3 h-3')}<span>Verified</span></span>
                </div>
                <div class="grid grid-cols-3 gap-4">
                  <div class="col-span-1">
                    <div class="aspect-square rounded-2xl bg-gradient-to-br from-white/20 to-white/5 grid place-items-center text-teal-200">${_icon('user', 'w-8 h-8')}</div>
                  </div>
                  <div class="col-span-2 space-y-2">
                    <div class="h-2.5 w-3/4 rounded bg-white/25"></div>
                    <div class="h-2 w-2/3 rounded bg-white/15"></div>
                    <div class="h-2 w-1/2 rounded bg-white/15"></div>
                    <div class="pt-3 flex items-center gap-2 text-[11px] text-teal-100"><span class="chip chip-teal">BDS</span><span class="chip">Bhola Sadar</span></div>
                  </div>
                </div>
                <div class="mt-5 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-teal-100 font-latin">
                  <span>Issued · 2026</span>
                  <span class="inline-flex items-center gap-1">${_icon('lock', 'w-3 h-3')}<span>Cryptographically Signed</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
    </section>`,

  /* ================= ABOUT ================= */
  AboutOrganization: () => `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
      <div class="grid lg:grid-cols-12 gap-12 items-start">
        <div class="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
          <span class="eyebrow">About the Association</span>
          <h2 class="h-section text-3xl sm:text-4xl">সংগঠনের মূল ভিত্তি, ভিশন ও মিশন</h2>
          <p class="text-ink-500 leading-relaxed">
            ভোলা জেলা ডেন্টাল প্র্যাকটিশনার অ্যাসোসিয়েশন — জেলার সাধারণ নাগরিকদের জন্য আধুনিক, নিরাপদ ও নৈতিক দন্ত চিকিৎসা নিশ্চিত করা এবং পেশাদার চিকিৎসকদের একটি অভিন্ন প্ল্যাটফর্মে সংযুক্ত করাই আমাদের অঙ্গীকার।
          </p>
          <div class="flex items-center gap-3 pt-2">
            <a href="#/executive" class="btn-primary">${_icon('award', 'w-4 h-4')}<span>কার্যনির্বাহী কমিটি</span></a>
            <a href="#/members" class="btn-outline">${_icon('users', 'w-4 h-4')}<span>সদস্য তালিকা</span></a>
          </div>
        </div>
        <div class="lg:col-span-7 grid sm:grid-cols-2 gap-5">
          ${[
            ['target',   'আমাদের মিশন',   'ভোলার সাধারণ মানুষের কাছে আধুনিক ও নিরাপদ দন্ত চিকিৎসা পৌঁছে দেওয়া এবং প্রতিটি চিকিৎসকের পেশাদার মান বজায় রাখা।'],
            ['eye',      'আমাদের ভিশন',   'ভোলার প্রতিটি দন্ত চিকিৎসকের মান উন্নয়ন এবং জেলার জনগণের জন্য একটি স্বচ্ছ, ভেরিফাইড রেজিস্ট্রি প্রতিষ্ঠা।'],
            ['heart-handshake', 'পেশাগত অঙ্গীকার', 'নৈতিকতা, স্বচ্ছতা ও রোগীর অধিকারকে সর্বোচ্চ অগ্রাধিকার দিয়ে সেবা প্রদান।'],
            ['graduation-cap',  'ধারাবাহিক শিক্ষা', 'সেমিনার, ওয়ার্কশপ ও ট্রেনিং-এর মাধ্যমে সদস্যদের ধারাবাহিক পেশাগত উন্নয়ন।']
          ].map(([ic, t, d]) => `
            <div class="card p-6">
              <div class="w-11 h-11 rounded-xl bg-teal-50 grid place-items-center text-teal-600 mb-4">${_icon(ic, 'w-5 h-5')}</div>
              <h3 class="font-bold text-navy-900 mb-1.5">${t}</h3>
              <p class="text-sm text-ink-500 leading-relaxed">${d}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>`,

  /* ================= STATS ================= */
  StatsCounterPanel: (data = {}) => {
    const items = [
      ['users',      'রেজিস্টার্ড সদস্য',  data.totalMembers  ?? 0],
      ['megaphone',  'প্রকাশিত নোটিশ',   data.totalNotices  ?? 0],
      ['calendar',   'আয়োজিত ইভেন্টস',   data.totalEvents   ?? 0],
      ['newspaper',  'সংবাদ ও আপডেট',    data.totalNews     ?? 0]
    ];
    return `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
      <div class="card p-4 sm:p-6 lg:p-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          ${items.map(([ic, label, v]) => `
            <div class="flex items-center gap-4 p-3 sm:p-4 rounded-2xl hover:bg-ink-50/60 transition">
              <div class="w-12 h-12 rounded-xl bg-gradient-medical grid place-items-center text-white shadow-card shrink-0">${_icon(ic, 'w-5 h-5')}</div>
              <div class="min-w-0">
                <div class="text-2xl sm:text-3xl font-bold text-navy-900 font-latin">${Number(v).toLocaleString('bn-BD')}</div>
                <div class="text-xs text-ink-500 font-semibold truncate">${label}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  },

  /* ================= HOMEPAGE COMPOSITION HELPERS ================= */
  LeadershipStrip: (data = {}) => `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-14">
        <span class="eyebrow">Leadership</span>
        <h2 class="h-section text-3xl sm:text-4xl">সম্মানিত নেতৃত্ব</h2>
        <p class="text-sm text-ink-500">সংগঠনের নেতৃস্থানীয় দুইজন কর্মকর্তার বার্তা।</p>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        ${[
          ['সভাপতির বার্তা', data.presidentName || 'সভাপতি', data.presidentPost || 'সভাপতি, বিডিডিপিএ ভোলা', data.presidentMsg || 'ভোলার জনগণের দন্ত চিকিৎসা সেবা নিশ্চিত করতে আমাদের সংগঠন প্রতিশ্রুতিবদ্ধ।'],
          ['সাধারণ সম্পাদকের বার্তা', 'সাধারণ সম্পাদক', 'সাধারণ সম্পাদক, বিডিডিপিএ ভোলা', 'পেশাদার মান, স্বচ্ছতা ও ধারাবাহিক প্রশিক্ষণের মাধ্যমে ভোলা জেলার প্রতিটি দন্ত চিকিৎসকের অগ্রযাত্রা নিশ্চিত করাই আমাদের অগ্রাধিকার।']
        ].map(([title, name, post, msg]) => `
          <article class="card p-7 sm:p-9 relative overflow-hidden">
            <div class="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-teal-50 opacity-60"></div>
            <div class="relative flex items-center gap-4 mb-5">
              <div class="w-16 h-16 rounded-2xl bg-gradient-medical grid place-items-center text-white text-lg font-bold">${_initials(name)}</div>
              <div>
                <span class="chip chip-teal">${_esc(title)}</span>
                <h3 class="mt-1.5 font-bold text-navy-900">${_esc(name)}</h3>
                <p class="text-xs text-ink-500">${_esc(post)}</p>
              </div>
            </div>
            <p class="relative text-sm text-ink-700 leading-relaxed">
              <span class="text-4xl text-teal-500/40 leading-none font-serif absolute -left-1 -top-3">“</span>
              ${_esc(msg)}
            </p>
          </article>`).join('')}
      </div>
    </section>`,

  HomeCTA: () => `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="relative overflow-hidden rounded-[2rem] bg-gradient-medical p-8 sm:p-12 lg:p-16 text-white shadow-elevated">
        <div class="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div class="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl"></div>
        <div class="relative grid lg:grid-cols-3 gap-8 items-center">
          <div class="lg:col-span-2 space-y-4">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold tracking-widest uppercase font-latin">${_icon('shield-check', 'w-3.5 h-3.5')}Trust the Directory</span>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">ভোলা জেলার যেকোনো দন্ত চিকিৎসকের রেজিস্ট্রেশন যাচাই করুন এক ক্লিকেই</h2>
            <p class="text-white/80 max-w-2xl">মেম্বারশিপ আইডি অথবা মোবাইল নম্বর দিয়ে সরাসরি অফিসিয়াল রেকর্ড থেকে সদস্যের সত্যতা নিশ্চিত করুন।</p>
          </div>
          <div class="flex lg:justify-end">
            <a href="#/verification" class="btn-lg inline-flex items-center gap-2 rounded-2xl px-6 py-4 bg-white text-navy-900 font-bold shadow-card hover:shadow-elevated transition">
              ${_icon('badge-check', 'w-5 h-5')}<span>এখনই যাচাই করুন</span>
            </a>
          </div>
        </div>
      </div>
    </section>`,

  /* ================= MEMBER CARD ================= */
  MemberCard: (m = {}) => `
    <article class="card overflow-hidden group">
      <div class="relative h-24 bg-gradient-medical">
        <div class="absolute inset-0 bg-grid-pattern opacity-30" style="background-size:24px 24px"></div>
        ${m.roleType === 'Executive Committee' ? `<span class="absolute top-3 right-3 chip chip-gold">${_icon('star','w-3 h-3')}Executive</span>` : ''}
      </div>
      <div class="px-6 pb-6 -mt-10">
        <div class="w-20 h-20 rounded-2xl bg-white p-1 shadow-card ring-1 ring-ink-100">
          ${m.profilePhoto
            ? `<img class="w-full h-full object-cover rounded-xl" src="${_esc(m.profilePhoto)}" alt="${_esc(m.nameEn || '')}" loading="lazy"/>`
            : `<div class="w-full h-full rounded-xl bg-gradient-medical grid place-items-center text-white font-bold text-lg">${_initials(m.nameEn || m.nameBn)}</div>`}
        </div>
        <div class="mt-4 space-y-1.5">
          <h3 class="font-bold text-navy-900 text-lg leading-tight group-hover:text-teal-700 transition">${_esc(m.nameBn || m.nameEn)}</h3>
          <p class="text-xs text-ink-500 font-latin">${_esc(m.nameEn || '')}</p>
          <div class="flex flex-wrap items-center gap-1.5 pt-1.5">
            ${m.memberId ? `<span class="chip chip-teal font-latin">${_esc(m.memberId)}</span>` : ''}
            ${m.qualification ? `<span class="chip">${_esc(m.qualification)}</span>` : ''}
            ${m.status === 'Active' ? `<span class="chip chip-emerald">${_icon('check','w-3 h-3')}Active</span>` : ''}
          </div>
        </div>
        <dl class="mt-5 pt-5 border-t border-ink-100 space-y-2 text-xs">
          <div class="flex items-center gap-2 text-ink-500"><span class="text-teal-600">${_icon('briefcase','w-3.5 h-3.5')}</span><span class="truncate">${_esc(m.chamberName || 'চেম্বার তথ্য শীঘ্রই')}</span></div>
          <div class="flex items-center gap-2 text-ink-500"><span class="text-teal-600">${_icon('map-pin','w-3.5 h-3.5')}</span><span class="truncate">${_esc(m.upazila || m.district || 'Bhola')}</span></div>
        </dl>
        <a href="#/members/${_esc(m.slug || '')}" class="mt-5 btn-outline w-full justify-center">
          ${_icon('user-round','w-4 h-4')}<span>প্রোফাইল দেখুন</span>${_icon('arrow-right','w-4 h-4')}
        </a>
      </div>
    </article>`,

  /* ================= DIRECTORY VIEW ================= */
  DirectoryListView: () => `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <span class="eyebrow">Verified Directory</span>
        <h1 class="h-section text-3xl sm:text-4xl lg:text-5xl">সদস্য তালিকা</h1>
        <p class="text-sm sm:text-base text-ink-500">নাম, মোবাইল বা মেম্বার আইডি দিয়ে অফিসিয়াল রেকর্ড থেকে যেকোনো সদস্য অনুসন্ধান করুন।</p>
      </div>

      ${UIComponents.Search()}

      <div id="directory-render-grid" class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${Array.from({ length: 6 }).map(() => UIComponents.SkeletonCard()).join('')}
      </div>
    </section>`,

  Search: () => `
    <form onsubmit="event.preventDefault(); window.appMembers.executeDirectorySearch();"
          class="card p-4 sm:p-5 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center">
      <div class="field">
        <span class="field-icon">${_icon('search', 'w-4 h-4')}</span>
        <input id="dir-search-input" type="text" class="input with-icon"
               placeholder="সদস্যের নাম, মোবাইল অথবা মেম্বার আইডি লিখুন…"
               aria-label="সদস্য অনুসন্ধান">
      </div>
      <button type="submit" class="btn-primary btn-lg">${_icon('search','w-4 h-4')}<span>অনুসন্ধান</span></button>
    </form>`,

  /* ================= PUBLIC MEMBER PROFILE ================= */
  PublicProfileView: (m = {}) => `
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <a href="#/members" class="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-navy-900 mb-6">
        ${_icon('arrow-left','w-3.5 h-3.5')}<span>সদস্য তালিকায় ফিরে যান</span>
      </a>

      <div class="grid lg:grid-cols-12 gap-6">
        <!-- Identity card -->
        <div class="lg:col-span-4">
          <div class="card overflow-hidden">
            <div class="h-24 bg-gradient-medical relative">
              <div class="absolute inset-0 bg-grid-pattern opacity-30" style="background-size:24px 24px"></div>
            </div>
            <div class="px-6 pb-6 -mt-14">
              <div class="w-28 h-28 rounded-3xl bg-white p-1.5 shadow-elevated ring-1 ring-ink-100 mx-auto">
                ${m.profilePhoto
                  ? `<img class="w-full h-full object-cover rounded-2xl" src="${_esc(m.profilePhoto)}" alt="${_esc(m.nameEn)}"/>`
                  : `<div class="w-full h-full rounded-2xl bg-gradient-medical grid place-items-center text-white font-bold text-2xl">${_initials(m.nameEn || m.nameBn)}</div>`}
              </div>
              <div class="text-center mt-5 space-y-1.5">
                <h1 class="text-xl font-bold text-navy-900">${_esc(m.nameBn || m.nameEn)}</h1>
                <p class="text-xs text-ink-500 font-latin">${_esc(m.nameEn || '')}</p>
                <div class="flex items-center justify-center gap-2 pt-2">
                  ${m.memberId ? `<span class="chip chip-teal font-latin">${_esc(m.memberId)}</span>` : ''}
                  ${m.status === 'Active' ? `<span class="verified-badge">${_icon('badge-check','w-3.5 h-3.5')}<span>Verified</span></span>` : ''}
                </div>
              </div>

              ${m.qrCode ? `
                <div class="mt-6 p-4 rounded-2xl bg-ink-50 border border-ink-100 text-center">
                  <img src="${_esc(m.qrCode)}" alt="QR" class="mx-auto w-32 h-32 rounded-xl bg-white p-2"/>
                  <p class="mt-3 text-[11px] text-ink-500 font-latin tracking-widest">SCAN TO VERIFY</p>
                </div>` : ''}

              <div class="mt-6 grid grid-cols-2 gap-2">
                <button onclick="window.print()" class="btn-outline text-xs">${_icon('printer','w-3.5 h-3.5')}Print</button>
                <button onclick="navigator.share ? navigator.share({title:document.title, url:location.href}) : navigator.clipboard.writeText(location.href).then(() => window.showToast('লিংক কপি হয়েছে'))" class="btn-outline text-xs">${_icon('share-2','w-3.5 h-3.5')}Share</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="lg:col-span-8 space-y-6">
          <div class="card p-7 sm:p-8">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <span class="eyebrow">Professional Profile</span>
                <h2 class="h-section text-xl mt-2">পেশাগত তথ্য</h2>
              </div>
              ${m.roleType === 'Executive Committee' ? `<span class="chip chip-gold">${_icon('star','w-3 h-3')}${_esc(m.executivePost || 'Executive')}</span>` : ''}
            </div>
            <dl class="grid sm:grid-cols-2 gap-5">
              ${[
                ['graduation-cap', 'ডিগ্রি',       m.qualification],
                ['building-2',     'ইনস্টিটিউট',    m.institution],
                ['badge',          'BMDC Reg',      m.bmdcReg],
                ['history',        'অভিজ্ঞতা',     (m.experience ?? 0) + ' বছর'],
                ['briefcase',      'চেম্বার',      m.chamberName],
                ['map-pin',        'ঠিকানা',       m.chamberAddress || m.address],
              ].filter(([,,v]) => v).map(([ic,l,v]) => `
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 rounded-lg bg-teal-50 grid place-items-center text-teal-600 shrink-0">${_icon(ic, 'w-4 h-4')}</div>
                  <div class="min-w-0">
                    <dt class="text-[11px] font-semibold uppercase tracking-widest text-ink-400 font-latin">${l}</dt>
                    <dd class="mt-0.5 text-sm font-semibold text-navy-900 break-words">${_esc(v)}</dd>
                  </div>
                </div>`).join('')}
            </dl>
          </div>

          <div class="card p-7 sm:p-8">
            <span class="eyebrow">Contact</span>
            <h2 class="h-section text-xl mt-2 mb-6">যোগাযোগ</h2>
            <dl class="grid sm:grid-cols-2 gap-5">
              ${[
                ['phone', 'মোবাইল', m.phone],
                ['phone-call', 'বিকল্প', m.alternatePhone],
                ['mail',  'ইমেইল', m.email],
                ['globe', 'ওয়েবসাইট', m.website]
              ].filter(([,,v]) => v).map(([ic,l,v]) => `
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 rounded-lg bg-ink-50 grid place-items-center text-navy-900 shrink-0">${_icon(ic, 'w-4 h-4')}</div>
                  <div class="min-w-0">
                    <dt class="text-[11px] font-semibold uppercase tracking-widest text-ink-400 font-latin">${l}</dt>
                    <dd class="mt-0.5 text-sm font-semibold text-navy-900 truncate font-latin" dir="ltr">${_esc(v)}</dd>
                  </div>
                </div>`).join('')}
            </dl>
          </div>

          ${m.biography ? `
            <div class="card p-7 sm:p-8">
              <span class="eyebrow">Biography</span>
              <h2 class="h-section text-xl mt-2 mb-4">সংক্ষিপ্ত পরিচিতি</h2>
              <div class="prose-bn">${_esc(m.biography).split('\n').map(p => `<p>${p}</p>`).join('')}</div>
            </div>` : ''}
        </div>
      </div>
    </section>`,

  /* ================= VERIFICATION PORTAL ================= */
  VerificationPortalView: () => `
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <span class="eyebrow">Official Verification</span>
        <h1 class="h-section text-3xl sm:text-4xl">সদস্য যাচাইকরণ পোর্টাল</h1>
        <p class="text-sm sm:text-base text-ink-500">মেম্বারশিপ আইডি অথবা মোবাইল নম্বর দিয়ে সরাসরি অফিসিয়াল রেকর্ড থেকে সদস্যের সত্যতা নিশ্চিত করুন।</p>
      </div>
      <div class="card p-6 sm:p-10">
        <form onsubmit="event.preventDefault(); window.appVerify.check();" class="grid sm:grid-cols-[1fr_auto] gap-3">
          <div class="field">
            <span class="field-icon">${_icon('badge-check','w-4 h-4')}</span>
            <input id="verify-input" class="input with-icon" placeholder="মেম্বারশিপ আইডি বা মোবাইল নম্বর" aria-label="যাচাই ইনপুট">
          </div>
          <button class="btn-primary btn-lg" type="submit">${_icon('search','w-4 h-4')}<span>যাচাই করুন</span></button>
        </form>
        <div id="verify-result" class="mt-8"></div>
      </div>
    </section>`,

  VerificationResult: (res, verified = true) => {
    if (!verified) return `
      <div class="p-6 rounded-2xl bg-red-50 border border-red-100 text-red-800 flex items-start gap-3">
        ${_icon('alert-octagon','w-5 h-5 mt-0.5 shrink-0')}
        <div><h4 class="font-bold">রেকর্ড পাওয়া যায়নি</h4><p class="text-sm mt-1">প্রদত্ত তথ্যের সাথে অ্যাসোসিয়েশনের রেকর্ডে কোনো সদস্য মেলেনি।</p></div>
      </div>`;
    const m = res.data || {};
    return `
      <div class="p-6 sm:p-8 rounded-2xl bg-emerald-50/60 border border-emerald-100">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-2xl bg-white p-1 shadow-card ring-1 ring-emerald-200 shrink-0">
            ${m.profilePhoto
              ? `<img src="${_esc(m.profilePhoto)}" class="w-full h-full object-cover rounded-xl"/>`
              : `<div class="w-full h-full rounded-xl bg-gradient-medical grid place-items-center text-white font-bold">${_initials(m.nameEn || m.nameBn)}</div>`}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h4 class="font-bold text-navy-900 text-lg">${_esc(m.nameBn || m.nameEn)}</h4>
              <span class="verified-badge">${_icon('check','w-3 h-3')}<span>Verified</span></span>
            </div>
            <p class="text-sm text-ink-500 font-latin mt-0.5">${_esc(m.nameEn || '')} · ${_esc(m.memberId || '')}</p>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span class="chip chip-teal">${_esc(m.qualification || '')}</span>
              <span class="chip">${_esc(m.status || '')}</span>
              <span class="chip">Joined · ${_fmtDateBn(m.joiningDate)}</span>
            </div>
          </div>
        </div>
      </div>`;
  },

  /* ================= LOGIN ================= */
  LoginForm: () => `
    <section class="min-h-[80vh] grid place-items-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="mx-auto w-14 h-14 rounded-2xl bg-gradient-medical grid place-items-center text-white shadow-elevated">${_icon('lock','w-6 h-6')}</div>
          <h1 class="mt-5 h-section text-2xl">অ্যাডমিন লগইন পোর্টাল</h1>
          <p class="mt-1.5 text-sm text-ink-500">অনুমোদিত অ্যাডমিন সদস্যদের জন্য সংরক্ষিত।</p>
        </div>
        <form id="admin-local-login" class="card p-7 sm:p-8 space-y-5">
          <div>
            <label class="label" for="login-email">ইমেইল এড্রেস</label>
            <div class="field">
              <span class="field-icon">${_icon('mail','w-4 h-4')}</span>
              <input id="login-email" type="email" required autocomplete="email" class="input with-icon" placeholder="admin@bddpa-bhola.org">
            </div>
          </div>
          <div>
            <label class="label" for="login-password">পাসওয়ার্ড</label>
            <div class="field">
              <span class="field-icon">${_icon('key-round','w-4 h-4')}</span>
              <input id="login-password" type="password" required autocomplete="current-password" class="input with-icon" placeholder="••••••••">
            </div>
          </div>
          <button type="submit" class="btn-primary btn-lg w-full">${_icon('log-in','w-4 h-4')}<span>লগইন করুন</span></button>
          <p class="text-[11px] text-ink-400 text-center">সিস্টেমটি JWT ও bcrypt দ্বারা সুরক্ষিত। সমস্ত কার্যক্রম লগ করা হয়।</p>
        </form>
      </div>
    </section>`,

  /* ================= ADMIN DASHBOARD SHELL ================= */
  AdminDashboardShell: (active = 'home', content = '') => {
    const nav = [
      ['home',       'home',     'ওভারভিউ'],
      ['users',      'members',  'সদস্য'],
      ['megaphone',  'notices',  'নোটিশ'],
      ['newspaper',  'news',     'সংবাদ'],
      ['calendar',   'events',   'ইভেন্টস'],
      ['image',      'gallery',  'গ্যালারি'],
      ['mail',       'messages', 'বার্তা'],
      ['settings-2', 'settings', 'সেটিংস']
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
              <button class="btn-primary">${_icon('plus','w-4 h-4')}<span>নতুন এন্ট্রি</span></button>
            </div>
          </header>
          ${content}
        </section>
      </div>
    </div>`;
  },

  AdminOverview: (a = {}) => {
    const kpis = [
      ['users',     'মোট সদস্য',   a.members?.total || 0,   'from-teal-500 to-emerald-500'],
      ['user-check','অ্যাক্টিভ',   a.members?.active || 0,  'from-emerald-500 to-emerald-700'],
      ['award',     'কমিটি',       a.members?.executive||0, 'from-navy-800 to-navy-950'],
      ['megaphone', 'নোটিশ',       a.notices || 0,          'from-teal-500 to-navy-800']
    ];
    return `
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        ${kpis.map(([ic, l, v, g]) => `
          <div class="card p-5">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br ${g} grid place-items-center text-white mb-4">${_icon(ic,'w-5 h-5')}</div>
            <div class="text-2xl sm:text-3xl font-bold text-navy-900 font-latin">${Number(v).toLocaleString('bn-BD')}</div>
            <div class="text-xs text-ink-500 font-semibold">${l}</div>
          </div>`).join('')}
      </div>
      <div class="grid lg:grid-cols-3 gap-6 mt-6">
        <div class="card p-6 lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <div><span class="eyebrow">Analytics</span><h3 class="h-section text-lg mt-1.5">সদস্য বৃদ্ধি</h3></div>
            <span class="chip chip-emerald">${_icon('trending-up','w-3 h-3')}Live</span>
          </div>
          <div class="h-56 rounded-2xl bg-gradient-to-br from-ink-50 to-white border border-ink-100 grid place-items-center text-ink-400 text-sm">
            <div class="text-center space-y-2"><div class="mx-auto w-10 h-10 rounded-lg bg-white shadow-soft grid place-items-center text-teal-600">${_icon('bar-chart-3','w-5 h-5')}</div><p>রিয়েল-টাইম চার্ট শীঘ্রই</p></div>
          </div>
        </div>
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <div><span class="eyebrow">Quick Actions</span><h3 class="h-section text-lg mt-1.5">দ্রুত কাজ</h3></div>
          </div>
          <div class="space-y-2.5">
            ${[
              ['user-plus', 'নতুন সদস্য যোগ করুন'],
              ['megaphone', 'নোটিশ প্রকাশ করুন'],
              ['calendar-plus', 'ইভেন্ট তৈরি করুন'],
              ['mail-plus', 'ব্রডকাস্ট ইমেইল'],
            ].map(([ic, t]) => `
              <button class="w-full text-left drawer-link">${_icon(ic,'w-4 h-4 text-teal-600')}<span>${t}</span>${_icon('chevron-right','w-4 h-4 ml-auto text-ink-300')}</button>
            `).join('')}
          </div>
        </div>
      </div>`;
  },

  /* ================= SYSTEM HEALTH (kept from original API) ================= */
  SystemHealthMonitor: () => `
    <div class="card p-6 sm:p-8 space-y-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">${_icon('activity','w-5 h-5')}</div>
        <div>
          <span class="eyebrow">Diagnostics</span>
          <h4 class="h-section text-base mt-1">সিস্টেম ও সার্ভার স্ট্যাটাস</h4>
        </div>
      </div>
      <div class="grid sm:grid-cols-3 gap-4 text-sm">
        <div class="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
          <div class="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-widest font-latin">${_icon('database','w-3.5 h-3.5')}MongoDB Atlas</div>
          <p class="mt-1.5 font-semibold text-emerald-900">Connected</p>
        </div>
        <div class="p-4 rounded-2xl bg-teal-50/50 border border-teal-100">
          <div class="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-widest font-latin">${_icon('zap','w-3.5 h-3.5')}Latency</div>
          <p class="mt-1.5 font-semibold text-teal-900 font-latin">44 ms</p>
        </div>
        <div class="p-4 rounded-2xl bg-navy-50 border border-navy-100">
          <div class="flex items-center gap-2 text-navy-700 text-xs font-bold uppercase tracking-widest font-latin">${_icon('cloud','w-3.5 h-3.5')}Cloudinary</div>
          <p class="mt-1.5 font-semibold text-navy-900">Active</p>
        </div>
      </div>
    </div>`,

  MaintenancePage: () => `
    <section class="min-h-[70vh] grid place-items-center px-4">
      <div class="max-w-md text-center space-y-4">
        <div class="mx-auto w-16 h-16 rounded-2xl bg-gradient-medical grid place-items-center text-white shadow-elevated">${_icon('wrench','w-7 h-7')}</div>
        <h2 class="h-section text-2xl">সাময়িক রক্ষণাবেক্ষণ চলছে</h2>
        <p class="text-sm text-ink-500">আমরা কিছু আপডেট সম্পন্ন করছি। কিছুক্ষণ পরে আবার চেষ্টা করুন।</p>
      </div>
    </section>`
};

window.UIComponents = UIComponents;
