(() => {
 const config = window.CONTINENTAL_CONFIG || {};
 const keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
 const initial = new URL(location.href);
 const source = {};
 keys.forEach(key => { const value = initial.searchParams.get(key); if (value) source[key] = value.slice(0,160); });
 const read = (store,key,fallback) => { try { return JSON.parse(store.getItem(key)) || fallback; } catch { return fallback; } };
 const write = (store,key,value) => { try { store.setItem(key,JSON.stringify(value)); } catch {} };
 let storage, session;
 try { storage = window.localStorage; session = window.sessionStorage; } catch {}
 const consentKey='cm-preferences-v2:'+(config.ga4Id||'none')+':'+(config.metaPixelId||'none');
 let preference = read(storage,consentKey,{analytics:false,marketing:false});
 if (preference.analytics) {const combined={...read(session,'cm-campaign-v1',{}),...source};Object.assign(source,combined);}
 let reference = read(session,'cm-contact-reference','');
 if (!/^CM-[A-F0-9]{8}$/.test(reference)) {
  const bytes = new Uint8Array(4); crypto.getRandomValues(bytes);
  reference = 'CM-' + [...bytes].map(n=>n.toString(16).padStart(2,'0')).join('').toUpperCase();
  write(session,'cm-contact-reference',reference);
 }
 const gaId = /^G-[A-Z0-9]+$/.test(config.ga4Id || '') ? config.ga4Id : '';
 const pixelId = /^\d{8,20}$/.test(config.metaPixelId || '') ? config.metaPixelId : '';
 let gaLoaded = false, pixelLoaded = false;
 const script = src => { const el = document.createElement('script'); el.async = true; el.src = src; document.head.append(el); };
 const setProviders = () => {
  if (gaId && preference.analytics && !gaLoaded) {
   window.dataLayer = window.dataLayer || [];
   window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
   window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   window.gtag('consent','update',{analytics_storage:'granted'});
   window.gtag('js',new Date());
   const campaign = {utm_source:'campaign_source',utm_medium:'campaign_medium',utm_campaign:'campaign_name',utm_content:'campaign_content',utm_term:'campaign_term'};
   const params = {page_location:location.origin+location.pathname,send_page_view:true};
   Object.entries(source).forEach(([key,value])=>{ if (campaign[key]) params[campaign[key]]=value; });
   window.gtag('config',gaId,params); gaLoaded=true;
   script('https://www.googletagmanager.com/gtag/js?id='+gaId);
  }
  if (pixelId && preference.marketing && !pixelLoaded) {
   const fb = function(){fb.callMethod ? fb.callMethod.apply(fb,arguments) : fb.queue.push(arguments);};
   fb.queue=[];fb.loaded=true;fb.version='2.0';fb.push=fb;window.fbq=fb;window._fbq=fb;
   fb('consent','grant');fb('init',pixelId);fb('track','PageView');pixelLoaded=true;
   script('https://connect.facebook.net/en_US/fbevents.js');
  }
 };
 const track = (event,params={}) => {
  if (!/^[a-z_]{3,40}$/.test(event)) return;
  const safe = {page_path:location.pathname};
  ['channel','service','placement','panel','format','plan','lcp_ms','cls','load_ms','ttfb_ms'].forEach(key=>{
   if (params[key]!==undefined) safe[key]=typeof params[key]==='number'?params[key]:String(params[key]).slice(0,100);
  });
  // Form values and full contact URLs never enter measurement events.
  if (preference.analytics && gaLoaded) window.gtag('event',event,safe);
  if (preference.marketing && pixelLoaded) window.fbq('trackCustom',event,safe);
 };
 const contactUrl = raw => {
  const url = new URL(raw,location.href);
  if (url.hostname !== 'wa.me') return raw;
  let text = url.searchParams.get('text') || 'Olá, Continental MKT!';
  if (!text.includes('Referência: CM-')) {
   if (source.utm_source) text += '\nOrigem: '+source.utm_source+(source.utm_medium?' / '+source.utm_medium:'');
   if (source.utm_campaign) text += '\nCampanha: '+source.utm_campaign;
   text += '\nReferência: '+reference;
  }
  url.searchParams.set('text',text); return url.href;
 };
 const preserveLink = link => {
  const raw = link.getAttribute('href');
  if (!raw || /^(mailto:|tel:|blob:|data:)/.test(raw)) return;
  const url = new URL(raw,location.href);
  if (url.origin !== location.origin) return;
  if (/\.(webp|png|jpg|svg|csv|pdf)$/.test(url.pathname)) return;
  Object.entries(source).forEach(([key,value])=>{if(!url.searchParams.has(key))url.searchParams.set(key,value);});
  link.href=url.pathname+url.search+url.hash;
 };
 document.querySelectorAll('a[href]').forEach(preserveLink);
 document.addEventListener('click',event=>{
  const link = event.target.closest('a[href]');
  if (!link) return;
  preserveLink(link);
  if (link.href.startsWith('https://wa.me/')) link.href=contactUrl(link.href);
  const channel=link.href.startsWith('https://wa.me/')?'whatsapp':link.href.startsWith('mailto:')?'email':link.href.includes('instagram.com/continentalmkt')?'instagram':null;
  if(channel){const placement=link.closest('.package-selection,.google-package')?'offer':link.closest('header')?'header':link.closest('footer')?'footer':'contact';track('contact_click',{channel,service:link.dataset.service||'general',placement});}
 },true);
 window.Continental = Object.freeze({track,contactUrl,reference});
 const dialog = document.createElement('dialog');dialog.className='privacy-dialog';
 dialog.setAttribute('aria-labelledby','privacy-preferences-title');
 dialog.innerHTML='<h2 id="privacy-preferences-title">Preferências de privacidade</h2><p>Você escolhe quais ferramentas opcionais podem ser carregadas.</p><label><input type="checkbox" name="analytics"> Estatísticas de navegação</label><label><input type="checkbox" name="marketing"> Mensuração de publicidade</label><p class="fine">'+(gaId||pixelId?'A ativação depende da sua escolha.':'Nenhum identificador de Analytics ou Pixel está configurado nesta versão.')+'</p><div class="privacy-actions"><button type="button" data-privacy="reject">Recusar opcionais</button><button type="button" data-privacy="save">Salvar escolhas</button><button type="button" data-privacy="close">Fechar</button></div><a href="/privacidade/">Ler a Política de Privacidade</a>';
 document.body.append(dialog);
 const analyticsBox=dialog.querySelector('[name=analytics]'),marketingBox=dialog.querySelector('[name=marketing]');
 const openPreferences=()=>{analyticsBox.checked=!!preference.analytics;marketingBox.checked=!!preference.marketing;if(!dialog.open)dialog.showModal();};
 document.querySelectorAll('[data-open-preferences]').forEach(button=>button.addEventListener('click',openPreferences));
 const save = value => {
  const previous=preference; preference=value;write(storage,consentKey,preference);
  if(preference.analytics)write(session,'cm-campaign-v1',source);else {try{session.removeItem('cm-campaign-v1');}catch{}}
  if (gaLoaded) window.gtag('consent','update',{analytics_storage:preference.analytics?'granted':'denied'});
  if (pixelLoaded) window.fbq('consent',preference.marketing?'grant':'revoke');
  const revoked=(previous.analytics&&!preference.analytics)||(previous.marketing&&!preference.marketing);
  if(revoked){
   document.cookie.split(';').forEach(cookie=>{const name=cookie.split('=')[0].trim();if(/^(_ga|_gid|_gat|_fbp|_fbc)/.test(name)){
    const hosts=location.hostname.split('.');for(let i=0;i<hosts.length-1;i++){document.cookie=name+'=; Max-Age=0; path=/; domain=.'+hosts.slice(i).join('.');}document.cookie=name+'=; Max-Age=0; path=/;';
   }});
  }
  setProviders();dialog.close();document.getElementById('measurement-banner')?.remove();
  if(revoked)location.reload();
 };
 dialog.querySelector('[data-privacy=reject]').addEventListener('click',()=>save({analytics:false,marketing:false}));
 dialog.querySelector('[data-privacy=save]').addEventListener('click',()=>save({analytics:analyticsBox.checked,marketing:marketingBox.checked}));
 dialog.querySelector('[data-privacy=close]').addEventListener('click',()=>dialog.close());
 if((gaId||pixelId)&&!read(storage,consentKey,null)){
  const banner=document.createElement('aside');banner.id='measurement-banner';banner.className='measurement-banner';banner.setAttribute('aria-label','Escolhas de privacidade');
  banner.innerHTML='<p>Podemos usar ferramentas opcionais para medir visitas e publicidade. Você pode aceitar ou recusar.</p><button type="button" data-choice="settings">Escolher</button><button type="button" data-choice="reject">Recusar</button>';
  document.body.append(banner);banner.querySelector('[data-choice=settings]').addEventListener('click',openPreferences);banner.querySelector('[data-choice=reject]').addEventListener('click',()=>save({analytics:false,marketing:false}));
 }
 setProviders();
 document.addEventListener('click',event=>{
  const tab=event.target.closest('[data-panel]'),service=event.target.closest('[data-service-choice]');
  if(tab)track('process_panel_view',{panel:tab.dataset.panel});
  if(service)track('service_select',{service:service.dataset.serviceChoice});
 });
 // Browser measurements are observations, not a synthetic speed score.
 const vitals={};
 if('PerformanceObserver'in window){
  try{new PerformanceObserver(list=>{const entries=list.getEntries();vitals.lcp_ms=Math.round(entries[entries.length-1].startTime);}).observe({type:'largest-contentful-paint',buffered:true});}catch{}
  let clsSession=0,clsFirst=0,clsLast=0;
  try{new PerformanceObserver(list=>{list.getEntries().forEach(e=>{if(e.hadRecentInput)return;if(clsLast&&e.startTime-clsLast<1000&&e.startTime-clsFirst<5000){clsSession+=e.value;}else{clsSession=e.value;clsFirst=e.startTime;}clsLast=e.startTime;vitals.cls=Math.round(Math.max(vitals.cls||0,clsSession)*10000)/10000;});}).observe({type:'layout-shift',buffered:true});}catch{}
 }
 window.addEventListener('load',()=>{const nav=performance.getEntriesByType('navigation')[0];if(nav){vitals.ttfb_ms=Math.round(nav.responseStart);vitals.load_ms=Math.round(nav.loadEventStart);}});
 window.addEventListener('pagehide',()=>track('site_performance',vitals),{once:true});
})();
