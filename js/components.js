/* ============================================================
 * BDDPA UIComponents — Premium Medical Association Design
 * Complete File - Copy this entire file
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

      <form onsubmit="event.preventDefault(); window.appMembers.executeDirectorySearch();"
            class="card p-4 sm:p-5 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center">
        <div class="field">
          <span class="field-icon">${_icon('search', 'w-4 h-4')}</span>
          <input id="dir-search-input" type="text" class="input with-icon"
                 placeholder="সদস্যের নাম, মোবাইল অথবা মেম্বার আইডি লিখুন…"
                 aria-label="সদস্য অনুসন্ধান">
        </div>
        <button type="submit" class="btn-primary btn-lg">${_icon('search','w-4 h-4')}<span>অনুসন্ধান</span></button>
      </form>

      <div id="directory-render-grid" class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${Array.from({ length: 6 }).map(() => UIComponents.SkeletonCard()).join('')}
      </div>
    </section>`,

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
      ['user-plus',  'requests',   'সদস্য আবেদন'],
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

  /* ================= ADMIN LIST PAGES ================= */
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
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-ink-100 pb-4">
          <div>
            <span class="eyebrow">Application Review</span>
            <h2 class="h-section text-xl mt-1">সদস্য পদের আবেদন পর্যালোচনা</h2>
          </div>
          <button onclick="window.appAdmin.loadRequestList()" class="btn-outline text-xs inline-flex items-center gap-1">
            ${_icon('arrow-left', 'w-3.5 h-3.5')}<span>আবেদন তালিকায় ফিরে যান</span>
          </button>
        </div>

        <div class="grid lg:grid-cols-12 gap-8">
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

        <div class="border-t border-ink-100 pt-6 space-y-6">
          <h3 class="font-bold text-navy-900 text-base flex items-center gap-2">
            ${_icon('image', 'w-5 h-5 text-teal-600')}
            <span>আপলোডকৃত নথি ও সার্টিফিকেট প্রিভিউ</span>
          </h3>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="card p-5 space-y-4 bg-ink-50/30">
              <h4 class="font-bold text-sm text-navy-900 flex items-center gap-1.5">
                ${_icon('graduation-cap', 'w-4 h-4 text-teal-600')}
                <span>ডিগ্রি সার্টিফিকেট ছবি</span>
              </h4>
              <div class="flex items-center justify-center min-h-[200px] bg-white rounded-xl p-2 border animate-fade-in">
                ${degreeImg}
              </div>
            </div>

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

  /* ================= SYSTEM HEALTH ================= */
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

  /* ================= NEW FUNCTIONS (Added for completeness) ================= */
  
  PublicRegistrationForm: function() {
    return `
      <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span class="eyebrow">Online Registration</span>
          <h1 class="h-section text-3xl sm:text-4xl">অনলাইন রেজিস্ট্রেশন ফরম</h1>
          <p class="text-sm text-ink-500">ভোলা জেলা ডেন্টাল প্র্যাকটিশনার অ্যাসোসিয়েশনের সদস্যপদের জন্য আবেদন করুন।</p>
        </div>
        <form id="public-register-form" class="card p-6 sm:p-10 space-y-6" enctype="multipart/form-data">
          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="label" for="reg-nameBn">নাম (বাংলা) *</label>
              <input id="reg-nameBn" name="nameBn" class="input" placeholder="আপনার নাম বাংলায়" required>
            </div>
            <div>
              <label class="label" for="reg-nameEn">নাম (ইংরেজি) *</label>
              <input id="reg-nameEn" name="nameEn" class="input" placeholder="Your name in English" required>
            </div>
            <div>
              <label class="label" for="reg-phone">মোবাইল নম্বর *</label>
              <input id="reg-phone" name="phone" class="input" placeholder="০১৭XXXXXXXX" required type="tel">
            </div>
            <div>
              <label class="label" for="reg-email">ইমেইল</label>
              <input id="reg-email" name="email" class="input" placeholder="your@email.com" type="email">
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="label" for="reg-qualification">যোগ্যতা/ডিগ্রি *</label>
              <input id="reg-qualification" name="qualification" class="input" placeholder="যেমন: BDS, DDS" required>
            </div>
            <div>
              <label class="label" for="reg-institution">শিক্ষা প্রতিষ্ঠান</label>
              <input id="reg-institution" name="institution" class="input" placeholder="আপনার কলেজ/বিশ্ববিদ্যালয়">
            </div>
            <div>
              <label class="label" for="reg-bmdcReg">BMDC Reg No</label>
              <input id="reg-bmdcReg" name="bmdcReg" class="input" placeholder="BMDC রেজিস্ট্রেশন নম্বর">
            </div>
            <div>
              <label class="label" for="reg-experience">অভিজ্ঞতা (বছর)</label>
              <input id="reg-experience" name="experience" class="input" placeholder="যেমন: 5" type="number" min="0">
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="label" for="reg-chamberName">চেম্বারের নাম</label>
              <input id="reg-chamberName" name="chamberName" class="input" placeholder="আপনার চেম্বারের নাম">
            </div>
            <div>
              <label class="label" for="reg-chamberAddress">চেম্বারের ঠিকানা</label>
              <input id="reg-chamberAddress" name="chamberAddress" class="input" placeholder="চেম্বারের সম্পূর্ণ ঠিকানা">
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="label" for="reg-upazila">উপজেলা *</label>
              <input id="reg-upazila" name="upazila" class="input" placeholder="আপনার উপজেলা" required>
            </div>
            <div>
              <label class="label" for="reg-bloodGroup">ব্লাড গ্রুপ</label>
              <input id="reg-bloodGroup" name="bloodGroup" class="input" placeholder="যেমন: A+, O-">
            </div>
            <div>
              <label class="label" for="reg-nidNumber">এনআইডি নম্বর</label>
              <input id="reg-nidNumber" name="nidNumber" class="input" placeholder="জাতীয় পরিচয়পত্র নম্বর">
            </div>
            <div>
              <label class="label" for="reg-personalAddress">ব্যক্তিগত ঠিকানা</label>
              <input id="reg-personalAddress" name="personalAddress" class="input" placeholder="আপনার বাসার ঠিকানা">
            </div>
          </div>

          <div class="grid sm:grid-cols-3 gap-5 pt-4 border-t border-ink-100">
            <div>
              <label class="label" for="reg-profilePhoto">প্রোফাইল ছবি *</label>
              <input id="reg-profilePhoto" name="profilePhoto" class="input" type="file" accept="image/*" required>
              <p class="text-[10px] text-ink-400 mt-1">JPEG, PNG (সর্বোচ্চ 2MB)</p>
            </div>
            <div>
              <label class="label" for="reg-degreePhoto">ডিগ্রি সার্টিফিকেট *</label>
              <input id="reg-degreePhoto" name="degreePhoto" class="input" type="file" accept="image/*" required>
              <p class="text-[10px] text-ink-400 mt-1">JPEG, PNG (সর্বোচ্চ 2MB)</p>
            </div>
            <div>
              <label class="label" for="reg-nidPhoto">এনআইডি কার্ড ছবি *</label>
              <input id="reg-nidPhoto" name="nidPhoto" class="input" type="file" accept="image/*" required>
              <p class="text-[10px] text-ink-400 mt-1">JPEG, PNG (সর্বোচ্চ 2MB)</p>
            </div>
          </div>

          <button type="submit" class="btn-primary btn-lg w-full">
            <i data-lucide="send" class="w-4 h-4"></i>
            <span>আবেদন জমা দিন</span>
          </button>
        </form>
      </section>
    `;
  },

  AdminMemberPreview: function(m) {
    if (!m) return UIComponents.EmptyState('সদস্য তথ্য পাওয়া যায়নি।');
    return `
      <div class="card p-6 sm:p-8 space-y-6">
        <div class="flex items-center justify-between border-b border-ink-100 pb-4">
          <div>
            <span class="eyebrow">Member Preview</span>
            <h2 class="h-section text-xl mt-1">${_esc(m.nameBn || m.nameEn)}</h2>
          </div>
          <button onclick="window.appAdmin.loadMemberList()" class="btn-outline text-xs">${_icon('arrow-left','w-3.5 h-3.5')} ফিরে যান</button>
        </div>
        <div class="grid sm:grid-cols-2 gap-4 text-sm">
          ${[
            ['মেম্বার আইডি', m.memberId],
            ['নাম (বাংলা)', m.nameBn],
            ['নাম (ইংরেজি)', m.nameEn],
            ['যোগ্যতা', m.qualification],
            ['মোবাইল', m.phone],
            ['ইমেইল', m.email],
            ['উপজেলা', m.upazila],
            ['অভিজ্ঞতা', m.experience ? m.experience + ' বছর' : '—'],
            ['ব্লাড গ্রুপ', m.bloodGroup],
            ['এনআইডি', m.nidNumber],
            ['স্ট্যাটাস', `<span class="chip ${m.status === 'Active' ? 'chip-emerald' : 'chip-red'}">${m.status || 'Pending'}</span>`],
            ['মেয়াদ', _checkExpiry(m.joiningDate).diffText]
          ].filter(([_, v]) => v).map(([label, val]) => `
            <div><dt class="text-[11px] font-semibold text-ink-400 uppercase">${label}</dt><dd class="font-medium text-navy-900 mt-0.5">${_esc(val)}</dd></div>
          `).join('')}
        </div>
      </div>
    `;
  },

  AdminNoticeList: function(list) {
    if (!list || list.length === 0) return UIComponents.EmptyState('কোনো নোটিশ পাওয়া যায়নি।', 'megaphone');
    return `
      <div class="card p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-ink-100 pb-4">
          <h2 class="h-section text-xl">নোটিশ ব্যবস্থাপনা</h2>
          <button onclick="window.appAdmin.loadAddNoticeForm()" class="btn-primary text-xs">${_icon('plus','w-3.5 h-3.5')} নতুন নোটিশ</button>
        </div>
        <div class="space-y-3">
          ${list.map(n => `
            <div class="flex items-center justify-between p-4 rounded-xl bg-ink-50/50 border border-ink-100">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="chip ${({ Urgent:'chip-red', Meeting:'chip-teal', Seminar:'chip-gold' })[n.category] || 'chip'} text-[10px]">${_esc(n.category)}</span>
                  <h4 class="font-bold text-navy-900 text-sm truncate">${_esc(n.title)}</h4>
                </div>
                <p class="text-xs text-ink-500 truncate mt-0.5">${_esc(n.content)}</p>
              </div>
              <div class="flex items-center gap-1 ml-4 shrink-0">
                <button onclick="window.appAdmin.loadEditNoticeForm('${n._id || n.id}')" class="btn-outline px-2 py-1 text-xs">${_icon('edit','w-3 h-3')}</button>
                <button onclick="window.appAdmin.deleteNotice('${n._id || n.id}')" class="btn-outline px-2 py-1 text-xs text-red-600 border-red-300">${_icon('trash','w-3 h-3')}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  AdminEventList: function(list) {
    if (!list || list.length === 0) return UIComponents.EmptyState('কোনো ইভেন্ট পাওয়া যায়নি।', 'calendar');
    return `
      <div class="card p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-ink-100 pb-4">
          <h2 class="h-section text-xl">ইভেন্ট ব্যবস্থাপনা</h2>
          <button onclick="window.appAdmin.loadAddEventForm()" class="btn-primary text-xs">${_icon('plus','w-3.5 h-3.5')} নতুন ইভেন্ট</button>
        </div>
        <div class="space-y-3">
          ${list.map(e => `
            <div class="flex items-center justify-between p-4 rounded-xl bg-ink-50/50 border border-ink-100">
              <div class="min-w-0 flex-1">
                <h4 class="font-bold text-navy-900 text-sm">${_esc(e.title)}</h4>
                <div class="flex flex-wrap items-center gap-2 text-xs text-ink-500 mt-1">
                  <span>${new Date(e.eventDate).toLocaleDateString('bn-BD')}</span>
                  <span>•</span>
                  <span>${_esc(e.location)}</span>
                </div>
              </div>
              <div class="flex items-center gap-1 ml-4 shrink-0">
                <button onclick="window.appAdmin.loadEditEventForm('${e._id || e.id}')" class="btn-outline px-2 py-1 text-xs">${_icon('edit','w-3 h-3')}</button>
                <button onclick="window.appAdmin.deleteEvent('${e._id || e.id}')" class="btn-outline px-2 py-1 text-xs text-red-600 border-red-300">${_icon('trash','w-3 h-3')}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  AdminNoticeForm: function(data) {
    const d = data || {};
    return `
      <div class="card p-6 sm:p-8 space-y-6">
        <div class="border-b border-ink-100 pb-4">
          <h2 class="h-section text-xl">${d._id || d.id ? 'নোটিশ সম্পাদনা' : 'নতুন নোটিশ প্রকাশ'}</h2>
        </div>
        <form id="add-notice-form" data-id="${d._id || d.id || ''}" class="space-y-5">
          <div>
            <label class="label" for="notice-title">শিরোনাম *</label>
            <input id="notice-title" name="title" class="input" placeholder="নোটিশের শিরোনাম" value="${_esc(d.title || '')}" required>
          </div>
          <div>
            <label class="label" for="notice-content">বিবরণ *</label>
            <textarea id="notice-content" name="content" class="input" rows="4" placeholder="নোটিশের সম্পূর্ণ বিবরণ" required>${_esc(d.content || '')}</textarea>
          </div>
          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="label" for="notice-category">ক্যাটেগরি</label>
              <select id="notice-category" name="category" class="input">
                ${['General','Urgent','Meeting','Seminar','Workshop'].map(c => `<option value="${c}" ${d.category === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="label" for="notice-pdf">ছবি/পিডিএফ আপলোড</label>
              <input id="notice-pdf" name="pdfUrl" class="input" type="file" accept="image/*">
              ${d.pdfUrl ? `<p class="text-xs text-ink-400 mt-1">বর্তমান: <a href="${_esc(d.pdfUrl)}" target="_blank" class="text-teal-600">দেখুন</a></p>` : ''}
            </div>
          </div>
          <div class="flex items-center gap-3 pt-4 border-t border-ink-100">
            <button type="submit" class="btn-primary">${_icon('save','w-4 h-4')} সংরক্ষণ করুন</button>
            <button type="button" onclick="window.appAdmin.loadNoticeList()" class="btn-outline">বাতিল করুন</button>
          </div>
        </form>
      </div>
    `;
  },

  AdminEventForm: function(data) {
    const d = data || {};
    return `
      <div class="card p-6 sm:p-8 space-y-6">
        <div class="border-b border-ink-100 pb-4">
          <h2 class="h-section text-xl">${d._id || d.id ? 'ইভেন্ট সম্পাদনা' : 'নতুন ইভেন্ট তৈরি'}</h2>
        </div>
        <form id="add-event-form" data-id="${d._id || d.id || ''}" class="space-y-5">
          <div>
            <label class="label" for="event-title">ইভেন্টের নাম *</label>
            <input id="event-title" name="title" class="input" placeholder="ইভেন্টের নাম" value="${_esc(d.title || '')}" required>
          </div>
          <div>
            <label class="label" for="event-description">বিবরণ *</label>
            <textarea id="event-description" name="description" class="input" rows="3" placeholder="ইভেন্টের বিবরণ" required>${_esc(d.description || '')}</textarea>
          </div>
          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="label" for="event-date">তারিখ *</label>
              <input id="event-date" name="eventDate" class="input" type="date" value="${d.eventDate ? new Date(d.eventDate).toISOString().split('T')[0] : ''}" required>
            </div>
            <div>
              <label class="label" for="event-location">স্থান *</label>
              <input id="event-location" name="location" class="input" placeholder="ইভেন্টের স্থান" value="${_esc(d.location || '')}" required>
            </div>
            <div>
              <label class="label" for="event-startTime">শুরুর সময়</label>
              <input id="event-startTime" name="startTime" class="input" type="time" value="${_esc(d.startTime || '')}">
            </div>
            <div>
              <label class="label" for="event-endTime">শেষের সময়</label>
              <input id="event-endTime" name="endTime" class="input" type="time" value="${_esc(d.endTime || '')}">
            </div>
            <div>
              <label class="label" for="event-mapLink">ম্যাপ লিংক</label>
              <input id="event-mapLink" name="mapLink" class="input" placeholder="Google Maps URL" value="${_esc(d.mapLink || '')}">
            </div>
            <div>
              <label class="label" for="event-registrationLink">রেজিস্ট্রেশন লিংক</label>
              <input id="event-registrationLink" name="registrationLink" class="input" placeholder="রেজিস্ট্রেশন ফর্ম URL" value="${_esc(d.registrationLink || '')}">
            </div>
          </div>
          <div class="flex items-center gap-3 pt-4 border-t border-ink-100">
            <button type="submit" class="btn-primary">${_icon('save','w-4 h-4')} সংরক্ষণ করুন</button>
            <button type="button" onclick="window.appAdmin.loadEventList()" class="btn-outline">বাতিল করুন</button>
          </div>
        </form>
      </div>
    `;
  },

  AdminLeadershipForm: function(data) {
    const d = data || {};
    return `
      <div class="card p-6 sm:p-8 space-y-6">
        <div class="border-b border-ink-100 pb-4">
          <h2 class="h-section text-xl">সম্মানিত নেতৃত্বের বার্তা সম্পাদনা</h2>
          <p class="text-xs text-ink-500 mt-1">হোমপেজে প্রদর্শিত সভাপতি ও সাধারণ সম্পাদকের বার্তা আপডেট করুন।</p>
        </div>
        <form id="edit-leadership-form" class="space-y-6">
          <div class="grid sm:grid-cols-2 gap-5">
            <div class="space-y-4 p-4 rounded-xl bg-ink-50/50 border border-ink-100">
              <h3 class="font-bold text-navy-900 text-sm">সভাপতির তথ্য</h3>
              <div>
                <label class="label" for="president-name">নাম</label>
                <input id="president-name" name="presidentName" class="input" placeholder="সভাপতির নাম" value="${_esc(d.presidentName || '')}">
              </div>
              <div>
                <label class="label" for="president-post">পদবী</label>
                <input id="president-post" name="presidentPost" class="input" placeholder="পদবী" value="${_esc(d.presidentPost || '')}">
              </div>
              <div>
                <label class="label" for="president-msg">বার্তা</label>
                <textarea id="president-msg" name="presidentMsg" class="input" rows="3" placeholder="সভাপতির বার্তা">${_esc(d.presidentMsg || '')}</textarea>
              </div>
            </div>
            <div class="space-y-4 p-4 rounded-xl bg-ink-50/50 border border-ink-100">
              <h3 class="font-bold text-navy-900 text-sm">সাধারণ সম্পাদকের তথ্য</h3>
              <div>
                <label class="label" for="secretary-name">নাম</label>
                <input id="secretary-name" name="secretaryName" class="input" placeholder="সাধারণ সম্পাদকের নাম" value="${_esc(d.secretaryName || '')}">
              </div>
              <div>
                <label class="label" for="secretary-post">পদবী</label>
                <input id="secretary-post" name="secretaryPost" class="input" placeholder="পদবী" value="${_esc(d.secretaryPost || '')}">
              </div>
              <div>
                <label class="label" for="secretary-msg">বার্তা</label>
                <textarea id="secretary-msg" name="secretaryMsg" class="input" rows="3" placeholder="সাধারণ সম্পাদকের বার্তা">${_esc(d.secretaryMsg || '')}</textarea>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3 pt-4 border-t border-ink-100">
            <button type="submit" class="btn-primary">${_icon('save','w-4 h-4')} সংরক্ষণ করুন</button>
            <button type="button" onclick="window.appAdmin.loadOverview()" class="btn-outline">বাতিল করুন</button>
          </div>
        </form>
      </div>
    `;
  },

  AdminMemberForm: function(data) {
    const d = data || {};
    const isEdit = !!(d._id || d.id);
    return `
      <div class="card p-6 sm:p-8 space-y-6">
        <div class="border-b border-ink-100 pb-4">
          <h2 class="h-section text-xl">${isEdit ? 'সদস্য সম্পাদনা' : 'নতুন সদস্য যোগ করুন'}</h2>
        </div>
        <form id="add-member-form" data-id="${d._id || d.id || ''}" class="space-y-5">
          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="label" for="member-nameBn">নাম (বাংলা) *</label>
              <input id="member-nameBn" name="nameBn" class="input" placeholder="নাম বাংলায়" value="${_esc(d.nameBn || '')}" required>
            </div>
            <div>
              <label class="label" for="member-nameEn">নাম (ইংরেজি) *</label>
              <input id="member-nameEn" name="nameEn" class="input" placeholder="Name in English" value="${_esc(d.nameEn || '')}" required>
            </div>
            <div>
              <label class="label" for="member-phone">মোবাইল *</label>
              <input id="member-phone" name="phone" class="input" placeholder="০১৭XXXXXXXX" value="${_esc(d.phone || '')}" required>
            </div>
            <div>
              <label class="label" for="member-email">ইমেইল</label>
              <input id="member-email" name="email" class="input" placeholder="email@example.com" value="${_esc(d.email || '')}" type="email">
            </div>
            <div>
              <label class="label" for="member-qualification">যোগ্যতা *</label>
              <input id="member-qualification" name="qualification" class="input" placeholder="BDS, DDS" value="${_esc(d.qualification || '')}" required>
            </div>
            <div>
              <label class="label" for="member-institution">ইনস্টিটিউট</label>
              <input id="member-institution" name="institution" class="input" placeholder="কলেজ/বিশ্ববিদ্যালয়" value="${_esc(d.institution || '')}">
            </div>
            <div>
              <label class="label" for="member-bmdcReg">BMDC Reg No</label>
              <input id="member-bmdcReg" name="bmdcReg" class="input" placeholder="BMDC নম্বর" value="${_esc(d.bmdcReg || '')}">
            </div>
            <div>
              <label class="label" for="member-experience">অভিজ্ঞতা (বছর)</label>
              <input id="member-experience" name="experience" class="input" type="number" min="0" placeholder="৫" value="${_esc(d.experience || '')}">
            </div>
            <div>
              <label class="label" for="member-chamberName">চেম্বারের নাম</label>
              <input id="member-chamberName" name="chamberName" class="input" placeholder="চেম্বারের নাম" value="${_esc(d.chamberName || '')}">
            </div>
            <div>
              <label class="label" for="member-chamberAddress">চেম্বারের ঠিকানা</label>
              <input id="member-chamberAddress" name="chamberAddress" class="input" placeholder="চেম্বারের ঠিকানা" value="${_esc(d.chamberAddress || '')}">
            </div>
            <div>
              <label class="label" for="member-upazila">উপজেলা *</label>
              <input id="member-upazila" name="upazila" class="input" placeholder="উপজেলা" value="${_esc(d.upazila || '')}" required>
            </div>
            <div>
              <label class="label" for="member-bloodGroup">ব্লাড গ্রুপ</label>
              <input id="member-bloodGroup" name="bloodGroup" class="input" placeholder="A+, O-" value="${_esc(d.bloodGroup || '')}">
            </div>
            <div>
              <label class="label" for="member-nidNumber">এনআইডি নম্বর</label>
              <input id="member-nidNumber" name="nidNumber" class="input" placeholder="এনআইডি নম্বর" value="${_esc(d.nidNumber || '')}">
            </div>
            <div>
              <label class="label" for="member-personalAddress">ব্যক্তিগত ঠিকানা</label>
              <input id="member-personalAddress" name="personalAddress" class="input" placeholder="বাসার ঠিকানা" value="${_esc(d.personalAddress || '')}">
            </div>
            <div>
              <label class="label" for="member-slug">Slug (URL)</label>
              <input id="member-slug" name="slug" class="input" placeholder="ইউনিক স্লাগ" value="${_esc(d.slug || '')}">
            </div>
            ${isEdit ? `
              <div>
                <label class="label" for="member-status">স্ট্যাটাস</label>
                <select id="member-status" name="status" class="input">
                  ${['Pending','Active','Inactive'].map(s => `<option value="${s}" ${d.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
              </div>
            ` : ''}
          </div>

          <div class="grid sm:grid-cols-3 gap-5 pt-4 border-t border-ink-100">
            <div>
              <label class="label" for="member-profilePhoto">প্রোফাইল ছবি</label>
              <input id="member-profilePhoto" name="profilePhoto" class="input" type="file" accept="image/*">
              ${d.profilePhoto ? `<p class="text-xs text-ink-400 mt-1">বর্তমান: <a href="${_esc(d.profilePhoto)}" target="_blank" class="text-teal-600">দেখুন</a></p>` : ''}
            </div>
            <div>
              <label class="label" for="member-degreePhoto">ডিগ্রি সার্টিফিকেট</label>
              <input id="member-degreePhoto" name="degreePhoto" class="input" type="file" accept="image/*">
              ${d.degreePhoto ? `<p class="text-xs text-ink-400 mt-1">বর্তমান: <a href="${_esc(d.degreePhoto)}" target="_blank" class="text-teal-600">দেখুন</a></p>` : ''}
            </div>
            <div>
              <label class="label" for="member-nidPhoto">এনআইডি কার্ড</label>
              <input id="member-nidPhoto" name="nidPhoto" class="input" type="file" accept="image/*">
              ${d.nidPhoto ? `<p class="text-xs text-ink-400 mt-1">বর্তমান: <a href="${_esc(d.nidPhoto)}" target="_blank" class="text-teal-600">দেখুন</a></p>` : ''}
            </div>
          </div>

          <div class="flex items-center gap-3 pt-4 border-t border-ink-100">
            <button type="submit" class="btn-primary">${_icon('save','w-4 h-4')} ${isEdit ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}</button>
            <button type="button" onclick="window.appAdmin.loadMemberList()" class="btn-outline">বাতিল করুন</button>
          </div>
        </form>
      </div>
    `;
  },

  MaintenancePage: () => `
    <section class="min-h-[70vh] grid place-items-center px-4">
      <div class="max-w-md text-center space-y-4">
        <div class="mx-auto w-16 h-16 rounded-2xl bg-gradient-medical grid place-items-center text-white shadow-elevated">${_icon('wrench','w-7 h-7')}</div>
        <h2 class="h-section text-2xl">সাময়িক রক্ষণাবেক্ষণ চলছে</h2>
        <p class="text-sm text-ink-500">আমরা কিছু আপডেট সম্পন্ন করছি। কিছুক্ষণ পরে আবার চেষ্টা করুন।</p>
      </div>
    </section>`
};

// Make UIComponents globally available
window.UIComponents = UIComponents;
