/* KARVAN i18n and motion enhancement, loaded before the existing router. */
(()=>{'use strict';
const extra=['fa','tr','ar'],all=['de','en',...extra],dict=window.KARVAN_TRANSLATIONS||{};
const names={de:'Deutsch',en:'English',fa:'فارسی',tr:'Türkçe',ar:'العربية'};
const pageTitles={
 fa:{index:'خانه',leistungen:'خدمات',projekte:'پروژه‌ها','ueber-uns':'درباره ما',kontakt:'تماس',anfrage:'درخواست پروژه',impressum:'مشخصات قانونی',datenschutz:'حریم خصوصی'},
 tr:{index:'Ana sayfa',leistungen:'Hizmetler',projekte:'Projeler','ueber-uns':'Hakkımızda',kontakt:'İletişim',anfrage:'Proje talebi',impressum:'Yasal bilgiler',datenschutz:'Gizlilik'},
 ar:{index:'الرئيسية',leistungen:'الخدمات',projekte:'المشاريع','ueber-uns':'من نحن',kontakt:'اتصل بنا',anfrage:'طلب مشروع',impressum:'البيانات القانونية',datenschutz:'الخصوصية'}
};
function localized(s,lang){return dict[s]?.[lang]||s;}
function translateTree(root,lang){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  const raw=node.nodeValue,key=raw.trim();if(!key)continue;
  const translated=localized(key,lang);
  if(translated!==key){
   const before=raw.match(/^\s*/)?.[0]||'',after=raw.match(/\s*$/)?.[0]||'';
   node.nodeValue=before+translated+after;
  }
 }
 for(const el of [root,...root.querySelectorAll('*')]){
  for(const attr of ['title','aria-label','alt','placeholder']){
   const val=el.getAttribute?.(attr);if(val){const t=localized(val.trim(),lang);if(t!==val.trim())el.setAttribute(attr,t);}
  }
 }
}
function cloneLanguage(base,lang){
 const clone=base.cloneNode(true);
 clone.classList.remove('chrome-de');if(clone.classList.contains('site-chrome'))clone.classList.add('chrome-'+lang);
 if(clone.matches('.virtual-page')){
  const route=base.dataset.route;
  clone.dataset.lang=lang;clone.id=lang+'-'+route;
  clone.dataset.pageTitle=pageTitles[lang][route]+' | KARVAN';
 }
 for(const el of clone.querySelectorAll('[id]')){
  if(el.id.startsWith('de-'))el.id=lang+el.id.slice(2);
  else if(el.id.endsWith('-de'))el.id=el.id.slice(0,-2)+lang;
  else el.id=lang+'-'+el.id;
 }
 for(const el of clone.querySelectorAll('[href^="#de-"]')){
  el.setAttribute('href','#'+lang+'-'+el.getAttribute('href').slice(4));
 }
 for(const el of clone.querySelectorAll('input[name="_url"]')){
  el.value='https://karvan-design.de/#'+lang+'-anfrage';
 }
 translateTree(clone,lang);
 return clone;
}
const main=document.querySelector('main'),firstTop=document.querySelector('.site-chrome.chrome-de:not(.bottom-chrome)'),firstBottom=document.querySelector('.site-chrome.chrome-de.bottom-chrome');
const dePages=[...document.querySelectorAll('main .virtual-page[data-lang="de"]')];
if(!main||!firstTop||!firstBottom||dePages.length!==8){console.error('KARVAN: expected 8 German pages and shared chrome');return;}
for(const lang of extra){
 const top=cloneLanguage(firstTop,lang);
 document.querySelector('.site-chrome.chrome-en:not(.bottom-chrome)').insertAdjacentElement('afterend',top);
 for(const page of dePages)main.appendChild(cloneLanguage(page,lang));
 const bottom=cloneLanguage(firstBottom,lang);
 document.querySelector('.site-chrome.chrome-en.bottom-chrome').insertAdjacentElement('afterend',bottom);
}
const languages={de:'Sprache',en:'Language',fa:'زبان',tr:'Dil',ar:'اللغة'};
for(const chrome of document.querySelectorAll('.site-chrome:not(.bottom-chrome)')){
 const current=all.find(lang=>chrome.classList.contains('chrome-'+lang))||'de';
 const actions=chrome.querySelector('.header-actions');
 if(!actions)continue;
 actions.querySelectorAll('.dynamic-langlink').forEach(el=>el.remove());
 const label=document.createElement('label');label.className='karvan-lang-picker';
 label.setAttribute('aria-label',languages[current]);
 const select=document.createElement('select');select.className='karvan-lang-control';select.setAttribute('aria-label',languages[current]);
 for(const lang of all){const option=document.createElement('option');option.value=lang;option.textContent=lang.toUpperCase();option.setAttribute('title',names[lang]);select.append(option);}
 select.value=current;
 select.addEventListener('change',()=>{
  const active=location.hash.slice(1);
  const route=/^(de|en|fa|tr|ar)-/.test(active)?active.slice(3):'index';
  const target=select.value+'-'+route;
  location.hash='#'+target;
 });
 label.append(select);actions.prepend(label);
}
window.KARVAN_UPDATE_LANG=(lang)=>{
 document.querySelectorAll('.karvan-lang-control').forEach(select=>{select.value=lang;select.setAttribute('aria-label',languages[lang]||'Language');});
 document.documentElement.dir=['fa','ar'].includes(lang)?'rtl':'ltr';
 document.body.dataset.activeLang=lang;
};
window.KARVAN_FORM_NOTICES={
 fa:{sending:'درخواست شما در حال ارسال است…',success:'درخواست به سرویس ارسال فرم تحویل شد. برای دریافت ایمیل‌ها، شرکت باید تأیید اولیه FormSubmit را در صندوق ایمیل انجام داده باشد.',error:'ارسال خودکار انجام نشد. لطفاً از طریق ایمیل یا واتساپ با ما تماس بگیرید.'},
 tr:{sending:'Talebiniz gönderiliyor…',success:'Talep form hizmetine iletildi. E-postaların ulaşması için KARVAN ilk FormSubmit aktivasyon e-postasını onaylamış olmalıdır.',error:'Otomatik gönderim başarısız oldu. Lütfen e-posta veya WhatsApp üzerinden iletişime geçin.'},
 ar:{sending:'جارٍ إرسال طلبك…',success:'تم تسليم الطلب إلى خدمة النماذج. لاستلام الرسائل يجب على كارڤان تأكيد رسالة تفعيل FormSubmit الأولى عبر البريد الإلكتروني.',error:'تعذر الإرسال التلقائي. يرجى التواصل معنا عبر البريد الإلكتروني أو واتساب.'}
};
const css=document.createElement('style');
css.textContent=`
/* Five-language routing; override old bilingual visibility rules. */
body.js-router .site-chrome{display:none!important}
body.js-router[data-active-lang="de"] .site-chrome.chrome-de,
body.js-router[data-active-lang="en"] .site-chrome.chrome-en,
body.js-router[data-active-lang="fa"] .site-chrome.chrome-fa,
body.js-router[data-active-lang="tr"] .site-chrome.chrome-tr,
body.js-router[data-active-lang="ar"] .site-chrome.chrome-ar{display:block!important}
.karvan-lang-picker{position:relative;display:inline-flex;align-items:center;flex-shrink:0;border:1px solid #d5e4ec;border-radius:999px;background:#fff;color:#12354a}
.karvan-lang-picker::after{content:"⌄";position:absolute;right:10px;top:50%;transform:translateY(-56%);font-size:16px;pointer-events:none;color:#124565}
.karvan-lang-control{appearance:none;-webkit-appearance:none;border:0;background:transparent;color:inherit;height:43px;min-width:68px;padding:0 22px 0 14px;font-size:12px;font-weight:800;letter-spacing:.05em;cursor:pointer;border-radius:999px}
.karvan-lang-control:focus-visible{outline:3px solid #ff7a19;outline-offset:3px}
[dir="rtl"] .karvan-lang-picker{direction:ltr}
[dir="rtl"] .enquiry-form input[type="email"],[dir="rtl"] .enquiry-form input[type="tel"]{direction:ltr;text-align:left}
[dir="rtl"] .header-actions{direction:ltr}
[dir="rtl"] .hero-panel,[dir="rtl"] .page-hero-inner,[dir="rtl"] .form-heading,[dir="rtl"] .legal-box{text-align:right}
[dir="rtl"] .hero-panel h1{letter-spacing:normal;line-height:1.3}
[dir="rtl"] .nav-items,[dir="rtl"] .mobile-nav-native nav{direction:rtl}
[dir="rtl"] .enquiry-form{text-align:right}
[dir="rtl"] .hero-panel .btn{letter-spacing:normal}

/* Clean hero: the team photo should be visible instead of covered by marketing copy. */
.hero-home .hero-photo-badge,
.hero-home .hero-panel .kicker-white{display:none!important}
@media(max-width:920px){
 .virtual-page .hero-home{
  display:flex!important;flex-direction:column!important;
  min-height:0!important;height:auto!important;overflow:hidden;
  background:#071924!important;
 }
 .virtual-page .hero-home::before,
 .virtual-page .hero-home::after{display:none!important}
 .virtual-page .hero-home .hero-photo{
  display:block!important;position:relative!important;
  inset:auto!important;left:auto!important;right:auto!important;
  top:auto!important;bottom:auto!important;
  width:100%!important;height:clamp(280px,69vw,435px)!important;
  min-height:0!important;opacity:1!important;z-index:0!important;
  overflow:hidden!important;
 }
 .virtual-page .hero-home .hero-photo img{
  display:block;width:100%;height:100%;
  object-fit:cover;object-position:center 31%;filter:saturate(.98) contrast(1.01);
 }
 .virtual-page .hero-home .hero-photo::after{
  background:linear-gradient(0deg,rgba(7,25,36,.46),transparent 24%)!important;
 }
 .virtual-page .hero-home .hero-home-inner{
  display:block!important;position:relative!important;
  width:calc(100% - 42px)!important;max-width:1140px!important;
  min-height:0!important;height:auto!important;
  margin:0 auto!important;padding:0 0 31px!important;
  background:transparent!important;
 }
 .virtual-page .hero-home .hero-panel{
  display:block!important;width:100%!important;max-width:680px!important;
  position:relative!important;z-index:2!important;
  padding:26px 0 14px!important; margin:0!important;
 }
 .virtual-page .hero-home .hero-panel h1{
  font-size:clamp(35px,7.6vw,55px)!important;
  line-height:1.16!important;letter-spacing:-.045em;
  margin:0 0 17px!important;text-wrap:balance;
 }
 .virtual-page .hero-home .hero-panel>p{
  font-size:clamp(14px,2.05vw,16px)!important;line-height:1.77!important;
  margin:0 0 23px!important;max-width:630px!important;color:#dce9ec;
 }
 .virtual-page .hero-home .hero-buttons{gap:12px!important;display:flex;flex-wrap:wrap}
 .virtual-page .hero-home .hero-mini{margin-top:29px!important}
}
@media(max-width:480px){
 .virtual-page .hero-home .hero-photo{height:clamp(260px,79vw,365px)!important}
 .virtual-page .hero-home .hero-home-inner{width:calc(100% - 38px)!important}
 .virtual-page .hero-home .hero-panel h1{font-size:clamp(35px,8.8vw,43px)!important}
 .virtual-page .hero-home .hero-buttons{gap:11px!important}
 .virtual-page .hero-home .hero-buttons .btn{min-height:47px}
}
[dir="rtl"] .virtual-page .hero-home .hero-panel h1{letter-spacing:normal!important}

.hero-home .hero-photo img{animation:karvanHeroSlowZoom 18s ease-in-out infinite alternate;transform-origin:50% 43%;will-change:transform}
@keyframes karvanHeroSlowZoom{0%{transform:scale(1) translate3d(0,0,0)}100%{transform:scale(1.06) translate3d(0,-.6%,0)}}
@media(prefers-reduced-motion:reduce){.hero-home .hero-photo img{animation:none!important;will-change:auto}}
@media(max-width:660px){.karvan-lang-control{min-width:65px;height:43px;padding-left:12px;padding-right:20px;font-size:11px}.karvan-lang-picker::after{right:8px}}
`;
document.head.append(css);
})();