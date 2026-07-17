/* ============================================================
 * BDDPA UIComponents — Premium Medical Association Design
 * ============================================================ */

const _icon = (name, cls = 'w-4 h-4') =>
  `<i data-lucide="${name}" class="${cls}"></i>`;

const _esc = (v) => (v == null ? '' : String(v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;'));

const _fmtDateBn = (d) => {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return new Date(d).toDateString(); }
};

const _initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map(s => s[0] || '').join('').toUpperCase() || 'BD';

const _checkExpiry = (joiningDate) => {
  if (!joiningDate) return { expired: false, diffText: '' };
  const jDate = new Date(joiningDate);
  const expDate = new Date(jDate.setFullYear(jDate.getFullYear() + 2));
  const today = new Date();
  
  if (today > expDate) {
    return { expired: true, diffText: 'মেয়াদোত্তীর্ণ (Expired)' };
  }
  
  const diffTime = Math.abs(expDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return { expired: false, diffText: `${diffDays} দিন বাকি` };
};

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

  /* ================= HERO ================= */
  HomeHero: () => `
    <section class="relative hero-bg">
      <div class="hero-blob bg-teal-500/60" style="top:-4rem; left:-4rem;"></div>
      <div class="hero-blob bg-emerald-500/40" style="bottom:-6rem; right:-4rem;"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32 text-center lg:text-left">
        <div class="max-w-4xl mx-auto space-y-7 animate-fade-in-up flex flex-col items-center">
          <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur text-[11px] font-semibold text-teal-100 tracking-wide">
            ${_icon('shield-check', 'w-3.5 h-3.5')}
            <span>Bhola District · Official Verified Directory</span>
          </span>
          <h1 class="text-[34px] sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
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
      ['calendar',   'আরোহী ইভেন্টস',   data.totalEvents   ?? 0],
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

  /* ================= HOMEPAGE LEADERSHIP ================= */
  LeadershipStrip: (data = {}) => `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-14">
        <span class="eyebrow">Leadership</span>
        <h2 class="h-section text-3xl sm:text-4xl">সম্মানিত নেতৃত্ব</h2>
        <p class="text-sm text-ink-500">সংগঠনের সম্মানিত সভাপতি ও সাধারণ সম্পাদকের সর্বশেষ আপডেট বার্তা।</p>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        ${[
          ['সভাপতির বার্তা', data.presidentName || 'সভাপতি', data.presidentPost || 'সভাপতি, বিডিডিপিএ ভোলা', data.presidentMsg || 'ভোলার জনগণের দন্ত চিকিৎসা সেবা নিশ্চিত করতে আমাদের সংগঠন প্রতিশ্রুতিবদ্ধ।'],
          ['সাধারণ সম্পাদকের বার্তা', data.secretaryName || 'সাধারণ সম্পাদক', data.secretaryPost || 'সাধারণ সম্পাদক, বিডিডিপিএ ভোলা', data.secretaryMsg || 'পেশাদার মান, স্বচ্ছতা ও ধারাবাহিক প্রশিক্ষণের মাধ্যমে ভোলা জেলার প্রতিটি দন্ত চিকিৎসকের অগ্রযাত্রা নিশ্চিত করাই আমাদের অগ্রাধিকার।']
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

  /* ================= HOME DYNAMIC MEMBERSHIP CARD ================= */
  DynamicMembershipCardSection: (m) => {
    if (!m) {
      return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span class="eyebrow">Digital Membership ID Card</span>
        <h2 class="h-section text-2xl sm:text-3xl mt-2 mb-8">ডিজিটাল সদস্য পরিচিতি কার্ড</h2>
        <div class="card p-8 text-center text-ink-500">
          <p>বর্তমানে কোন সক্রিয় সদস্য পাওয়া যায়নি।</p>
        </div>
      </div>`;
    }
    const expiry = _checkExpiry(m.joiningDate);
    return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span class="eyebrow">Digital Membership ID Card</span>
      <h2 class="h-section text-2xl sm:text-3xl mt-2 mb-8">ডিজিটাল সদস্য পরিচিতি কার্ড</h2>
      
      <div class="relative mx-auto max-w-md rounded-[2rem] bg-navy-900 border border-white/10 p-6 sm:p-8 shadow-elevated text-left">
        <div class="absolute inset-0 bg-grid-pattern opacity-10" style="background-size:24px 24px"></div>
        <div class="flex items-center gap-3 mb-6 relative z-10">
          <div class="w-11 h-11 rounded-xl bg-white/15 grid place-items-center text-teal-200">${_icon('id-card', 'w-5 h-5')}</div>
          <div>
            <div class="text-xs text-teal-200 tracking-widest font-latin font-semibold uppercase">Digital ID card</div>
            <div class="text-white font-bold font-latin">${_esc(m.memberId || 'BDPA-XXXX')}</div>
          </div>
          <span class="ml-auto verified-badge ${expiry.expired ? 'bg-red-600' : 'bg-emerald-600'}">
            ${_icon('check', 'w-3 h-3')}<span>${expiry.expired ? 'Expired' : 'Verified'}</span>
          </span>
        </div>
        <div class="grid grid-cols-3 gap-5 relative z-10">
          <div class="col-span-1">
            <div class="aspect-square rounded-2xl bg-white/10 overflow-hidden">
              ${m.profilePhoto 
                ? `<img src="${_esc(m.profilePhoto)}" class="w-full h-full object-cover"/>`
                : `<div class="w-full h-full grid place-items-center text-white font-bold">${_initials(m.nameEn)}</div>`}
            </div>
          </div>
          <div class="col-span-2 space-y-1.5 text-white">
            <h4 class="font-bold text-base leading-tight">${_esc(m.nameBn || m.nameEn)}</h4>
            <p class="text-xs text-teal-200 font-latin">${_esc(m.nameEn)}</p>
            <p class="text-xs text-ink-300 font-latin">${_esc(m.qualification || 'BDS')}</p>
            <div class="pt-2 flex items-center gap-1.5 text-[10px]">
              <span class="chip bg-white/10 text-white border-none font-latin">${_esc(m.bloodGroup || 'O+')}</span>
              <span class="chip bg-white/10 text-white border-none">${_esc(m.upazila || 'Bhola Sadar')}</span>
            </div>
          </div>
        </div>
        <div class="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-teal-100 font-latin relative z-10">
          <span>Joined · ${_fmtDateBn(m.joiningDate)}</span>
          <span class="inline-flex items-center gap-1 ${expiry.expired ? 'text-red-400' : 'text-emerald-400'}">
            ${_icon(expiry.expired ? 'alert-triangle' : 'shield-check', 'w-3.5 h-3.5')}
            <span>${expiry.diffText}</span>
          </span>
        </div>
      </div>
    </div>`;
  },

  HomeCTA: () => `
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
    </section>`,

  /* ================= MEMBER CARD ================= */
  MemberCard: (m = {}) => `
    <article class="card overflow-hidden group">
      <div class="relative h-24 bg-gradient-medical">
        <div class="absolute inset-0 bg-grid-pattern opacity-30" style="background-size:24px 24px"></div>
        ${m.roleType === 'Executive Committee' ? `<span class="absolute top-3 right-3 chip chip-gold">${_icon('star','w-3 h-3')}Executive</span>` : ''}
      </div>
      <div class="px-6 pb-6 -mt-10">
        <div class="w-20 h-20 rounded-2xl bg-white p-1 shadow-card ring-1 ring-ink-100 mx-auto sm:mx-0">
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
        <p class="text-sm sm:text-base text-ink-500">নাম, মোবাইল বা মেম্বার আইডি দিয়ে রেকর্ড থেকে সদস্যপদ যাচাই করুন।</p>
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
                ['building-2',     'ইনституটিউট',    m.institution],
                ['badge',          'BMDC Reg',      m.bmdcReg],
                ['history',        'অভিজ্ঞতা',     (m.experience ?? 0) + ' বছর'],
                ['briefcase',      'চেম্বারের নাম',    m.chamberName],
                ['map-pin',        'ঠিকানা',       m.chamberAddress || m.address],
                ['heart',          'ব্লাড গ্রুপ',    m.bloodGroup],
                ['credit-card',    'এনআইডি নম্বর',  m.nidNumber],
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
                ['home',  'ব্যক্তিগত ঠিকানা', m.personalAddress]
              ].filter(([,,v]) => v).map(([ic,l,v]) => `
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 rounded-lg bg-ink-50 grid place-items-center text-navy-900 shrink-0">${_icon(ic, 'w-4 h-4')}</div>
                  <div class="min-w-0">
                    <dt class="text-[11px] font-semibold uppercase tracking-widest text-ink-400 font-latin">${l}</dt>
                    <dd class="mt-0.5 text-sm font-semibold text-navy-900 break-words font-latin">${_esc(v)}</dd>
                  </div>
                </div>`).join('')}
            </dl>
          </div>
        </div>
      </div>
    </section>`,

  /* ================= VERIFICATION PORTAL ================= */
  VerificationPortalView: () => `
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <span class="eyebrow">Official Verification</span>
        <h1 class="h-section text-3xl sm:text-4xl">সদস্য যাচাইকরণ পোর্টাল</h1>
        <p class="text-sm sm:text-base text-ink-500">মেম্বারশিপ আইডি বা মোবাইল নম্বর দিয়ে সরাসরি রেকর্ড থেকে সদস্যপদ যাচাই করুন।</p>
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
        <div><h4 class="font-bold">রেকর্ড পাওয়া যায়নি</h4><p class="text-sm mt-1">প্রদত্ত তথ্যের সাথে মিল পাওয়া যায়নি।</p></div>
      </div>`;
    const m = res.data || {};
    const expiry = _checkExpiry(m.joiningDate);
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
              <span class="verified-badge bg-emerald-600">${_icon('check','w-3 h-3')}<span>${expiry.expired ? 'Expired' : 'Verified'}</span></span>
            </div>
            <p class="text-sm text-ink-500 font-latin mt-0.5">${_esc(m.nameEn || '')} · ${_esc(m.memberId || '')}</p>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span class="chip chip-teal">${_esc(m.qualification || '')}</span>
              <span class="chip">${expiry.diffText}</span>
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
        </form>
      </div>
    </section>`,

  /* ================= ADMIN DASHBOARD SHELL ================= */
  AdminDashboardShell: (active = 'home', content = '') => {
    const nav = [
      ['home',       'home',       'ওভারভিউ'],
      ['users',      'members',    'সদস্য তালিকা'],
      ['user-plus',  'requests',   'সদস্য আবেদন'], // নতুন আবেদন ট্যাব
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
  },

  AdminOverview: (a = {}) => {
    const kpis = [
      ['users',     'মোট সদস্য',   a.members?.total || 0,   'from-teal-500 to-emerald-500'],
      ['user-check','অ্যাক্টিভ',   a.members?.active || 0,  'from-emerald-500 to-emerald-700'],
      ['award',     'কমিটি',       a.members?.executive||0, 'from-navy-800 to-navy-950'],
      ['megaphone', 'নোটিশ',       a.notices || 0,          'from-teal-500 to-navy-800']
    ];
    return `
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
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
              ['user-plus', 'নতুন সদস্য যোগ করুন', 'window.appAdmin.loadAddMemberForm()'],
              ['megaphone', 'নোটিশ প্রকাশ করুন', 'window.appAdmin.loadAddNoticeForm()'],
              ['calendar-plus', 'ইভেন্ট তৈরি করুন', 'window.appAdmin.loadAddEventForm()'],
              ['sliders', 'নেতৃত্বের বার্তা পরিবর্তন', "window.location.hash = '#/admin/dashboard?tab=leadership'"],
            ].map(([ic, t, clickAction]) => `
              <button onclick="${_esc(clickAction)}" class="w-full text-left drawer-link">
                ${_icon(ic,'w-4 h-4 text-teal-600')}<span>${t}</span>
                ${_icon('chevron-right','w-4 h-4 ml-auto text-ink-300')}
              </button>
            `).join('')}
          </div>
        </div>
      </div>`;
  },

  /* ================= LIST PAGES ================= */
  AdminMemberList: (list = []) => `
    <div class="card p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between border-b border-ink-100 pb-4">
        <h2 class="h-section text-xl">সদস্য তালিকা ব্যবস্থাপনা</h2>
        <button onclick="window.appAdmin.loadAddMemberForm()" class="btn-primary text-xs">${_icon('plus','w-3.5 h-3.5')}নতুন সদস্য এড করুন</button>
      </div>
      <div class="overflow-x-auto rounded-xl border border-ink-100">
        <table>
          <thead>
            <tr>
              <th>নাম (বাংলা)</th>
              <th>মেম্বার আইডি</th>
              <th>মোবাইল নম্বর</th>
              <th>অবস্থা/স্ট্যাটাস</th>
              <th class="text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(m => {
              const expiry = _checkExpiry(m.joiningDate);
              const memberIdVal = m._id || m.id || '';
              return `
              <tr>
                <td class="font-bold text-navy-900">${_esc(m.nameBn || m.nameEn)}</td>
                <td class="font-latin font-bold text-teal-600">${_esc(m.memberId || '—')}</td>
                <td class="font-latin">${_esc(m.phone || '—')}</td>
                <td>
                  <span class="chip ${expiry.expired ? 'chip-red' : 'chip-emerald'}">
                    ${_esc(expiry.diffText)}
                  </span>
                </td>
                <td class="text-right space-x-1">
                  <button onclick="window.appAdmin.loadMemberPreview('${m.slug}')" class="btn-outline px-2 py-1 text-xs text-navy-600 border-navy-300">${_icon('eye','w-3 h-3')} প্রিভিউ</button>
                  ${expiry.expired ? `<button onclick="window.appAdmin.renewMember('${memberIdVal}')" class="btn-outline px-2 py-1 text-xs text-emerald-600 border-emerald-300">${_icon('refresh-cw','w-3 h-3')} নবায়ন</button>` : ''}
                  <button onclick="window.appAdmin.loadEditMemberForm('${m.slug}')" class="btn-outline px-2 py-1 text-xs text-teal-600 border-teal-300">${_icon('edit','w-3 h-3')} এডিট</button>
                  <button onclick="window.appAdmin.deleteMember('${memberIdVal}')" class="btn-outline px-2 py-1 text-xs text-red-600 border-red-300">${_icon('trash','w-3 h-3')} ডিলিট</button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`,

  AdminRequestList: (list = []) => {
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
  },

  AdminRequestPreview: (m = {}) => {
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
              <div class="flex items-center justify-center min-h-[200px] bg-white rounded-xl p-2 border animate-fade-in">
                ${degreeImg}
              </div>
            </div>

            <!-- NID Card -->
            <div class="card p-5 space-y-4 bg-ink-50/30">
              <h4 class="font-bold text-sm text-navy-900 flex items-center gap-1.5">
                ${_icon('credit-card', 'w-4 h-4 text-teal-600')}
                <span>ন্যাশনাল আইডি (NID) কার্ডের ছবি</span>
              </h4>
              <div class="flex items-center justify-center min-h-[200px] bg-white rounded-xl p-2 border animate-fade-in">
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
--- START OF FILE index.html ---

<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#000000">

  <title>ভোলা জেলা ডেন্টাল প্র্যাকটিশনার অ্যাসোসিয়েশন | BDDPA</title>
  <meta name="description" content="ভোলা জেলার রেজিস্টার্ড ডেন্টাল চিকিৎসকদের অফিশিয়াল ডিজিটাল ডাটাবেজ ও প্রফেশনাল অ্যাসোসিয়েশন পোর্টাল।">
  <meta name="api-base" content="https://backend-fow0.onrender.com/api/v1">
  <meta name="author" content="BDDPA">
  <meta property="og:type" content="website">
  <meta property="og:title" content="BDDPA — Bhola District Dental Practitioners Association">
  <meta property="og:description" content="ভোলা জেলার অনুমোদিত ডেন্টাল প্র্যাকটিশনারদের পেশাদার প্ল্যাটফর্ম।">
  <meta name="twitter:card" content="summary_large_image">

  <!-- Preconnect for premium Bengali typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">

  <link rel="icon" type="image/png" href="assets/placeholder-avatar.png">

  <!-- Tailwind (CDN, per project stack) -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    // Vercel-monochrome remap
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            bn: ['"Hind Siliguri"', '"Noto Sans Bengali"', 'system-ui', 'sans-serif'],
            display: ['"Noto Sans Bengali"', '"Hind Siliguri"', 'Inter', 'sans-serif'],
            latin: ['Inter', 'system-ui', 'sans-serif'],
            serif: ['"Instrument Serif"', '"Playfair Display"', 'Georgia', 'serif']
          },
          colors: {
            navy: {
              50:  '#fafafa',
              100: '#f4f4f5',
              200: '#e4e4e7',
              300: '#a1a1aa',
              400: '#71717a',
              500: '#52525b',
              600: '#3f3f46',
              700: '#27272a',
              800: '#18181b',
              900: '#0a0a0a',
              950: '#000000'
            },
            teal: {
              50:  '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#0070f3',
              600: '#0061d5',
              700: '#0052b3',
              800: '#003d85',
              900: '#00285c'
            },
            emerald: {
              50:  '#eff6ff',
              400: '#60a5fa',
              500: '#0070f3',
              600: '#0061d5',
              700: '#0052b3'
            },
            gold: {
              400: '#d4d4d8',
              500: '#a1a1aa',
              600: '#71717a'
            },
            ink: {
              900: '#0a0a0a',
              800: '#171717',
              700: '#262626',
              600: '#404040',
              500: '#525252',
              400: '#737373',
              300: '#a3a3a3',
              200: '#e5e5e5',
              100: '#ededed',
              50:  '#fafafa'
            }
          },
          boxShadow: {
            'soft':      '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
            'card':      '0 1px 2px rgba(0,0,0,0.05), 0 8px 24px -12px rgba(0,0,0,0.14)',
            'elevated':  '0 2px 4px rgba(0,0,0,0.05), 0 24px 48px -20px rgba(0,0,0,0.20)',
            'ring-navy': '0 0 0 4px rgba(0,0,0,0.06)'
          },
          backgroundImage: {
            'gradient-navy':     'linear-gradient(135deg, #000000 0%, #0a0a0a 60%, #171717 100%)',
            'gradient-medical':  'linear-gradient(135deg, #000000 0%, #0a0a0a 60%, #171717 100%)',
            'gradient-hero':     'radial-gradient(ellipse 55% 45% at 15% 8%, rgba(0,112,243,0.22), transparent 60%), radial-gradient(ellipse 50% 40% at 88% 92%, rgba(0,112,243,0.10), transparent 65%), linear-gradient(180deg, #000000 0%, #0a0a0a 55%, #171717 100%)',
            'gradient-card':     'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
            'grid-pattern':      'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)'
          },
          keyframes: {
            'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
            'fade-in':    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
            'scale-in':   { '0%': { opacity: '0', transform: 'scale(.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
            'slide-in-right': { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
            'shimmer':    { '0%': { backgroundPosition: '-800px 0' }, '100%': { backgroundPosition: '800px 0' } },
            'blob':       { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(20px,-30px) scale(1.05)' } }
          },
          animation: {
            'fade-in-up':     'fade-in-up .6s cubic-bezier(.2,.7,.2,1) both',
            'fade-in':        'fade-in .4s ease-out both',
            'scale-in':       'scale-in .3s cubic-bezier(.2,.7,.2,1) both',
            'slide-in-right': 'slide-in-right .3s ease-out',
            'shimmer':        'shimmer 1.6s linear infinite',
            'blob':           'blob 12s ease-in-out infinite'
          }
        }
      }
    }
  </script>

  <!-- Lucide icons for consistent iconography -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="font-bn bg-white text-ink-900 antialiased selection:bg-teal-500/20 selection:text-navy-900 flex flex-col min-h-dvh">

  <a href="#main-app-viewport" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-navy-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">मूल কনটেন্টে যান</a>

  <header id="site-header" class="fixed top-0 inset-x-0 z-50 no-print transition-all duration-300">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mt-3 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-soft">
        <div class="flex items-center justify-between h-16 sm:h-[72px] px-4 sm:px-5">

          <a href="#/" class="flex items-center gap-3 min-w-0 group">
            <div class="relative shrink-0">
              <div class="absolute inset-0 rounded-xl bg-gradient-medical blur-md opacity-30 group-hover:opacity-50 transition"></div>
              <div class="relative w-11 h-11 rounded-xl bg-gradient-medical grid place-items-center text-white shadow-card">
                <i data-lucide="stethoscope" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="min-w-0 leading-tight">
              <div class="text-[13px] sm:text-[15px] font-bold text-navy-900 truncate">
                ভোলা জেলা ডেন্টাল প্র্যাকটিশনার অ্যাসোসিয়েশন
              </div>
              <div class="text-[10px] sm:text-[11px] font-latin tracking-[0.18em] text-teal-600 font-semibold uppercase">
                BDDPA · Estd 2026
              </div>
            </div>
          </a>

          <nav class="hidden lg:flex items-center gap-1 text-sm font-medium text-ink-700">
            <a href="#/"            data-nav class="px-3.5 py-2 rounded-lg hover:text-navy-900 hover:bg-ink-50 transition">হোম</a>
            <a href="#/about"       data-nav class="px-3.5 py-2 rounded-lg hover:text-navy-900 hover:bg-ink-50 transition">আমাদের সম্পর্কে</a>
            <a href="#/members"     data-nav class="px-3.5 py-2 rounded-lg hover:text-navy-900 hover:bg-ink-50 transition">সদস্য তালিকা</a>
            <a href="#/executive"   data-nav class="px-3.5 py-2 rounded-lg hover:text-navy-900 hover:bg-ink-50 transition">কার্যনির্বাহী</a>
            <a href="#/events"      data-nav class="px-3.5 py-2 rounded-lg hover:text-navy-900 hover:bg-ink-50 transition">ইভেন্টস</a>
            <a href="#/notice"      data-nav class="px-3.5 py-2 rounded-lg hover:text-navy-900 hover:bg-ink-50 transition">নোটিশ</a>
            <a href="#/verification" data-nav class="px-3.5 py-2 rounded-lg hover:text-navy-900 hover:bg-ink-50 transition">ভেরিফিকেশন</a>
          </nav>

          <div class="flex items-center gap-2">
            <a href="#/verification" class="hidden md:inline-flex items-center gap-2 text-xs font-semibold text-ink-700 hover:text-navy-900 px-3 py-2 rounded-lg hover:bg-ink-50">
              <i data-lucide="search" class="w-4 h-4"></i>
              <span class="hidden lg:inline">যাচাই করুন</span>
            </a>
            <a href="#/admin/login" class="hidden sm:inline-flex btn-primary text-xs">
              <i data-lucide="lock" class="w-4 h-4"></i>
              <span>অ্যাডমিন</span>
            </a>
            <button id="mobile-menu-btn" aria-label="মেনু খুলুন" class="lg:hidden inline-flex w-10 h-10 items-center justify-center rounded-lg hover:bg-ink-50 text-navy-900">
              <i data-lucide="menu" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div id="mobile-drawer" class="fixed inset-0 z-[60] hidden">
    <div class="absolute inset-0 bg-navy-900/50 backdrop-blur-sm" data-drawer-close></div>
    <aside class="absolute top-0 right-0 h-full w-[86%] max-w-sm bg-white shadow-elevated animate-slide-in-right flex flex-col">
      <div class="flex items-center justify-between px-5 h-16 border-b border-ink-100">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-lg bg-gradient-medical grid place-items-center text-white">
            <i data-lucide="stethoscope" class="w-4 h-4"></i>
          </div>
          <span class="font-bold text-navy-900">BDDPA</span>
        </div>
        <button data-drawer-close aria-label="মেনু বন্ধ করুন" class="w-9 h-9 grid place-items-center rounded-lg hover:bg-ink-50 text-ink-700">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <nav class="flex-1 overflow-y-auto p-4 space-y-1 text-sm font-medium">
        <a href="#/" data-drawer-link class="drawer-link"><i data-lucide="home" class="w-4 h-4"></i>হোম</a>
        <a href="#/about" data-drawer-link class="drawer-link"><i data-lucide="info" class="w-4 h-4"></i>আমাদের সম্পর্কে</a>
        <a href="#/members" data-drawer-link class="drawer-link"><i data-lucide="users" class="w-4 h-4"></i>সদস্য তালিকা</a>
        <a href="#/executive" data-drawer-link class="drawer-link"><i data-lucide="award" class="w-4 h-4"></i>কার্যনির্বাহী কমিটি</a>
        <a href="#/events" data-drawer-link class="drawer-link"><i data-lucide="calendar" class="w-4 h-4"></i>ইভেন্টস</a>
        <a href="#/notice" data-drawer-link class="drawer-link"><i data-lucide="megaphone" class="w-4 h-4"></i>নোটিশ বোর্ড</a>
        <a href="#/verification" data-drawer-link class="drawer-link"><i data-lucide="badge-check" class="w-4 h-4"></i>ভেরিফিকেশন</a>
      </nav>
      <div class="p-4 border-t border-ink-100">
        <a href="#/admin/login" data-drawer-link class="btn-primary w-full justify-center">
          <i data-lucide="lock" class="w-4 h-4"></i>অ্যাডমিন লগইন
        </a>
      </div>
    </aside>
  </div>

  <main id="main-app-viewport" class="flex-grow pt-24 sm:pt-28"></main>

  <footer class="bg-navy-950 text-ink-200 mt-24 no-print relative overflow-hidden">
    <div class="absolute inset-0 bg-grid-pattern opacity-40" style="background-size:44px 44px"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-10">
        <div class="col-span-2">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-11 h-11 rounded-xl bg-gradient-medical grid place-items-center text-white shadow-card">
              <i data-lucide="stethoscope" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="font-bold text-white text-sm">BDDPA ভোলা</div>
              <div class="text-[11px] tracking-widest text-teal-400 font-latin uppercase">Estd 2026</div>
            </div>
          </div>
          <p class="text-sm text-ink-300 leading-relaxed max-w-md">
            ভোলা জেলা ডেন্টাল প্র্যাকটিশনার অ্যাসোসিয়েশন — জেলার ডিপ্লোমা দন্ত চিকিৎসকদের একমাত্র অফিসিয়াল পেশাদার প্ল্যাটফর্ম।
          </p>
          <div class="flex gap-2 mt-5">
            <a href="#" aria-label="Facebook" class="social-btn"><i data-lucide="facebook" class="w-4 h-4"></i></a>
            <a href="#" aria-label="Twitter"  class="social-btn"><i data-lucide="twitter"  class="w-4 h-4"></i></a>
            <a href="#" aria-label="Youtube"  class="social-btn"><i data-lucide="youtube"  class="w-4 h-4"></i></a>
            <a href="#" aria-label="Linkedin" class="social-btn"><i data-lucide="linkedin" class="w-4 h-4"></i></a>
          </div>
        </div>

        <div>
          <h4 class="text-white font-semibold text-sm mb-4">দ্রুত লিংক</h4>
          <ul class="space-y-2.5 text-sm">
            <li><a href="#/about" class="footer-link">আমাদের সম্পর্কে</a></li>
            <li><a href="#/members" class="footer-link">সদস্য তালিকা</a></li>
            <li><a href="#/executive" class="footer-link">কার্যনির্বাহী কমিটি</a></li>
            <li><a href="#/events" class="footer-link">ইভেন্টস</a></li>
            <li><a href="#/notice" class="footer-link">নোটিশ বোর্ড</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold text-sm mb-4">যোগাযোগ</h4>
          <ul class="space-y-3 text-sm text-ink-300">
            <li class="flex items-start gap-2.5"><i data-lucide="map-pin" class="w-4 h-4 mt-0.5 text-teal-400 shrink-0"></i><span>সদর রোড, ভোলা সদর, বাংলাদেশ</span></li>
            <li class="flex items-start gap-2.5"><i data-lucide="phone" class="w-4 h-4 mt-0.5 text-teal-400 shrink-0"></i><span dir="ltr">+880 1900 000000</span></li>
            <li class="flex items-start gap-2.5"><i data-lucide="mail" class="w-4 h-4 mt-0.5 text-teal-400 shrink-0"></i><a href="mailto:info@bddpa-bhola.org" class="footer-link">info@bddpa-bhola.org</a></li>
            <li class="flex items-start gap-2.5"><i data-lucide="alert-circle" class="w-4 h-4 mt-0.5 text-emerald-500 shrink-0"></i><span>জরুরি: <span dir="ltr">999</span></span></li>
          </ul>
        </div>
      </div>

      <div class="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-ink-400">© ২০২৬ ভোলা জেলা ডেন্টাল প্র্যাকটিশনার অ্যাসোসিয়েশন। সর্বস্বত্ব সংরক্ষিত।</p>
        <p class="text-xs text-ink-400 flex items-center gap-2">
          <span class="inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Designed & Developed by Tahmid Habib</span>
        </p>
      </div>
    </div>
  </footer>

  <!-- App scripts -->
  <script src="js/components.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
