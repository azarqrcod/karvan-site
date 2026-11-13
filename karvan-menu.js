/* KARVAN mobile menu, accessible and localized (DE/EN/FA/TR/AR) */
(()=>{'use strict';
const langs=['de','en','fa','tr','ar'];
const copy={
de:['Menü öffnen','Menü schließen','KARVAN ENTDECKEN','Design, Renovierung und Logistik aus einer Hand.','Navigation','Projekt anfragen','Unverbindlich anfragen','Direktkontakt','Impressum','Datenschutz'],
en:['Open menu','Close menu','DISCOVER KARVAN','Design, renovation and logistics in one place.','Explore','Request a quote','No-obligation enquiry','Contact us','Legal notice','Privacy policy'],
fa:['باز کردن منو','بستن منو','آشنایی با کاروان','طراحی داخلی، بازسازی و لجستیک در یک مجموعه.','دسترسی سریع','ثبت درخواست پروژه','درخواست بدون تعهد','ارتباط مستقیم','مشخصات قانونی','حریم خصوصی'],
tr:['Menüyü aç','Menüyü kapat','KARVAN’I KEŞFEDİN','Tasarım, tadilat ve lojistik tek çatı altında.','Sayfalar','Proje talebi gönder','Bağlayıcı olmayan talep','İletişim','Yasal bilgiler','Gizlilik'],
ar:['افتح القائمة','أغلق القائمة','اكتشف كارڤان','التصميم والتجديد والخدمات اللوجستية في مكان واحد.','صفحات الموقع','أرسل طلب مشروع','طلب بدون التزام','تواصل معنا','البيانات القانونية','الخصوصية']
};
const iconPaths={
home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
services:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
projects:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m3 17 5-5 4 4 3-3 6 5"/><circle cx="8" cy="9" r="1.5"/>',
about:'<circle cx="12" cy="8" r="4"/><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2"/>',
contact:'<path d="M21 11.5c0 4.7-4 8.5-9 8.5a10 10 0 0 1-4.5-1L3 21l1.6-4.2a8 8 0 0 1-1.6-5.3C3 6.8 7 3 12 3s9 3.8 9 8.5Z"/><path d="M8 11.5h8"/>',
quote:'<path d="M12 5v14M5 12h14"/>',
mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
wa:'<path d="M20 11.6a8.1 8.1 0 0 1-11.7 7.2L4 20l1.2-4.2A8.1 8.1 0 1 1 20 11.6Z"/><path d="M8 9.6c.4 2.6 2.6 4.7 5.2 5.2l1.6-1.1 1.4 1.3c-1.8 3.6-8.1-.2-9.2-4.1Z"/>',
arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>'
};
function el(tag,cls,value){const r=document.createElement(tag);if(cls)r.className=cls;if(value!==undefined)r.textContent=value;return r;}
function icon(name){const span=el('span','k-menu-icon');span.setAttribute('aria-hidden','true');span.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+iconPaths[name]+'</svg>';return span;}
const menus=[];
function setup(chrome,lang){
 const details=chrome.querySelector('details.mobile-nav-native');if(!details)return;
 const summary=details.querySelector('summary'),nav=details.querySelector('nav');
 if(!summary||!nav)return;
 const links=[...nav.querySelectorAll('a[href^="#"]')];if(links.length<5)return;
 const t=copy[lang];details.classList.add('k-menu-ready');
 summary.textContent='';summary.setAttribute('aria-label',t[0]);summary.title=t[0];
 const burger=el('span','k-menu-burger');for(let i=0;i<3;i++)burger.append(el('i','k-menu-line'));
 summary.append(burger,el('span','k-menu-sr',t[0]));
 const scrim=el('button','k-menu-scrim');scrim.type='button';scrim.tabIndex=-1;scrim.setAttribute('aria-label',t[1]);details.insertBefore(scrim,nav);
 nav.className='k-menu-drawer';nav.setAttribute('aria-label',t[4]);nav.textContent='';
 const intro=el('div','k-menu-intro'),mark=el('span','k-menu-mark','K');mark.setAttribute('aria-hidden','true');
 const brand=el('div','k-menu-headline');brand.append(el('span','k-menu-overline',t[2]),el('strong','k-menu-brand','KARVAN'));intro.append(mark,brand);
 nav.append(intro,el('p','k-menu-subline',t[3]),el('div','k-menu-section-title',t[4]));
 const list=el('div','k-menu-links');
 links.slice(0,5).forEach((old,i)=>{
  const a=el('a','k-menu-link');a.href=old.getAttribute('href');
  a.append(icon(['home','services','projects','about','contact'][i]),el('span','k-menu-link-text',old.textContent.trim()),el('span','k-menu-arrow','›'));list.append(a);
 });nav.append(list);
 const quote=el('a','k-menu-quote');quote.href='#'+lang+'-anfrage';
 const qt=el('span','k-menu-quote-copy');qt.append(el('strong','',t[5]),el('small','',t[6]));quote.append(icon('quote'),qt,icon('arrow'));nav.append(quote);
 nav.append(el('div','k-menu-section-title k-menu-contact-title',t[7]));
 const direct=el('div','k-menu-direct'),wa=el('a','k-menu-direct-link k-menu-wa'),email=el('a','k-menu-direct-link');
 wa.href='https://api.whatsapp.com/send?phone=4917672161005';wa.target='_blank';wa.rel='noopener noreferrer';
 wa.append(icon('wa'),el('span','',['واتساپ','واتساب'].includes(t[7])?'WhatsApp':'WhatsApp'));
 email.href='mailto:info@karvan-design.de';email.append(icon('mail'),el('span','',({de:'E-Mail',en:'Email',fa:'ایمیل',tr:'E-posta',ar:'البريد الإلكتروني'})[lang]));
 direct.append(wa,email);nav.append(direct);
 const legal=el('div','k-menu-footer');legal.append(el('span','',({de:'Rechtliches',en:'Legal',fa:'حقوقی',tr:'Yasal',ar:'قانوني'})[lang]));
 for(const [route,title] of [['impressum',t[8]],['datenschutz',t[9]]]){const a=el('a','',title);a.href='#'+lang+'-'+route;legal.append(a);}nav.append(legal);
 const close=(focus)=>{details.open=false;if(focus)summary.focus();};
 scrim.addEventListener('click',()=>close(true));
 nav.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>close(false)));
 details.addEventListener('toggle',()=>{
  if(details.open){
   menus.forEach(m=>{if(m!==details)m.open=false;});
   const bottom=chrome.querySelector('.site-header')?.getBoundingClientRect().bottom||80;
   details.style.setProperty('--k-menu-top',Math.max(55,Math.min(bottom,150))+'px');
   summary.setAttribute('aria-label',t[1]);summary.title=t[1];
   document.body.classList.add('k-menu-body-open');
  }else{
   summary.setAttribute('aria-label',t[0]);summary.title=t[0];
   if(!menus.some(m=>m.open))document.body.classList.remove('k-menu-body-open');
  }
 });
 menus.push(details);
}
function sync(){
 const current=location.hash.slice(1)||'de-index';
 for(const menu of menus)for(const a of menu.querySelectorAll('.k-menu-link,.k-menu-quote')){
  const active=a.getAttribute('href')==='#'+current;
  a.classList.toggle('k-menu-current',active);
  if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
 }
}
function init(){
 for(const lang of langs){const chrome=document.querySelector('.site-chrome.chrome-'+lang+':not(.bottom-chrome)');if(chrome)setup(chrome,lang);}
 if(menus.length!==5)console.warn('KARVAN navigation language count:',menus.length);
 window.addEventListener('hashchange',()=>{menus.forEach(m=>m.open=false);document.body.classList.remove('k-menu-body-open');sync();});
 window.addEventListener('resize',()=>{if(window.innerWidth>920){menus.forEach(m=>m.open=false);document.body.classList.remove('k-menu-body-open');}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')for(const m of menus)if(m.open){m.open=false;m.querySelector('summary')?.focus();}});
 sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();