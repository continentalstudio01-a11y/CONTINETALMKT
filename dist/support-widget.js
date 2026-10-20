(() => {
 const core=window.ContinentalSupport;if(!core||document.getElementById('conti-widget'))return;
 const labels={services:'Conhecer os serviços',meeting:'Agendar uma conversa',support:'Já sou cliente',human:'Falar com a equipe',reports:'Relatórios e resultados','trafego-pago':'Tráfego pago','panfletagem-digital':'Panfletagem digital',sites:'Sites e landing pages','perfil-google':'Perfil no Google',criativos:'Criativos e copy','whatsapp-funil':'WhatsApp e funil','automacao-ia':'Automação com IA'};
 const robot = variant => `<svg viewBox="0 0 120 142" class="conti-robot" aria-hidden="true" focusable="false"><defs><linearGradient id="conti-shell-${variant}" x2=".8" y2="1"><stop stop-color="#fffdf4"/><stop offset="1" stop-color="#e9d6b9"/></linearGradient></defs><ellipse class="conti-shadow" cx="60" cy="135" rx="29" ry="4" fill="#1e252918"/><g class="conti-body"><path d="M51 112v12m18-12v12" stroke="#b8aa96" stroke-width="7" stroke-linecap="round"/><path d="M43 124h14m7 0h14" stroke="#1e2529" stroke-width="8" stroke-linecap="round"/><g class="conti-left-arm"><path d="M37 88q-12 4-12 19" fill="none" stroke="#e50916" stroke-width="9" stroke-linecap="round"/><circle cx="25" cy="109" r="7" fill="#fff8e9" stroke="#d8c5a7" stroke-width="2"/></g><g class="conti-wave"><path d="M83 88q15-4 15-20" fill="none" stroke="#e50916" stroke-width="9" stroke-linecap="round"/><path d="M94 66v-8m5 7v-11m5 12v-7" stroke="#fff8e9" stroke-width="4" stroke-linecap="round"/><circle cx="99" cy="67" r="7" fill="#fff8e9" stroke="#d8c5a7" stroke-width="1.5"/></g><rect x="35" y="76" width="50" height="42" rx="17" fill="url(#conti-shell-${variant})" stroke="#d8c5a7" stroke-width="2"/><path d="M42 85h36" stroke="#fffef8" stroke-width="3" stroke-linecap="round"/><rect x="47" y="93" width="26" height="14" rx="7" fill="#e50916"/><text x="60" y="102.5" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="8" fill="#fffaf0">CM</text><g class="conti-head"><path d="M60 22v-8" stroke="#1e2529" stroke-width="3" stroke-linecap="round"/><circle class="conti-antenna" cx="60" cy="10" r="5" fill="#e50916"/><rect x="17" y="43" width="12" height="24" rx="6" fill="#bd0915"/><rect x="91" y="43" width="12" height="24" rx="6" fill="#bd0915"/><rect x="24" y="24" width="72" height="58" rx="24" fill="url(#conti-shell-${variant})" stroke="#d8c5a7" stroke-width="2"/><path d="M37 30q23-10 46 0" fill="none" stroke="#fffef8" stroke-width="4" stroke-linecap="round"/><rect x="31" y="38" width="58" height="31" rx="14" fill="#1e2529"/><g class="conti-eyes"><rect x="43" y="47" width="7" height="11" rx="3.5" fill="#fff5df"/><rect x="70" y="47" width="7" height="11" rx="3.5" fill="#fff5df"/></g><path d="M54 61q6 4 12 0" stroke="#ff7480" stroke-width="2" fill="none" stroke-linecap="round"/></g></g></svg>`;
 const widget=document.createElement('aside');widget.id='conti-widget';widget.className='conti-widget';widget.setAttribute('aria-label','Ajuda Continental MKT');
 widget.innerHTML=`<section id="conti-panel" class="conti-panel" role="dialog" aria-modal="false" aria-labelledby="conti-title" aria-describedby="conti-description" hidden><header class="conti-panel-header"><div class="conti-avatar">${robot('header')}</div><div><h2 id="conti-title">Conti <span>Continental MKT</span></h2><p id="conti-description">Seu guia por aqui.</p></div><button type="button" class="conti-close" aria-label="Fechar ajuda">✕</button></header><div class="conti-messages" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversa com o assistente"></div><div class="conti-controls"><div class="conti-utility"><button type="button" data-conti-menu>Voltar ao menu</button><a data-conti-human href="https://wa.me/5588997057623" target="_blank" rel="noopener noreferrer" data-service="support">Atendimento humano ↗</a></div><form class="conti-form"><label class="conti-sr-only" for="conti-question">Sua dúvida para o assistente</label><input id="conti-question" name="question" type="text" maxlength="400" placeholder="Como posso ajudar?" autocomplete="off" enterkeyhint="send" required><button type="submit" aria-label="Enviar pergunta">↑</button></form><p class="conti-disclosure">Ajuda automática sobre o site. <a href="/privacidade/">Privacidade</a></p></div></section><button type="button" id="conti-launcher" class="conti-launcher" aria-expanded="false" aria-controls="conti-panel" aria-label="Abrir ajuda com o Conti"><span class="conti-hint">Posso ajudar?</span>${robot('launcher')}<span class="conti-launcher-label">Conti · Ajuda</span></button>`;
 document.body.append(widget);
 const panel=widget.querySelector('#conti-panel'),launcher=widget.querySelector('#conti-launcher'),close=widget.querySelector('.conti-close'),log=widget.querySelector('.conti-messages'),form=widget.querySelector('form'),input=widget.querySelector('input'),human=widget.querySelector('[data-conti-human]');
 let data={services:{}},loaded=false,loading=null,lastQuestion='',started=false,busy=false;
 const track=(event,params)=>window.Continental?.track(event,params);
 const updateHuman=()=>{
  const text='Olá, Continental MKT! Preciso de ajuda.\nPágina: '+location.pathname+(lastQuestion?'\nMinha dúvida: '+lastQuestion:'');
  human.href='https://wa.me/5588997057623?text='+encodeURIComponent(text);
 };
 const load=()=>{
  if(loaded)return Promise.resolve();
  if(!loading){const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),4000);loading=fetch('/support-data.json',{credentials:'omit',signal:controller.signal}).then(response=>{if(!response.ok)throw new Error('support data');return response.json();}).then(value=>{if(value&&typeof value.services==='object')data=value;loaded=true;}).catch(()=>{loaded=true;}).finally(()=>clearTimeout(timeout));}
  return loading;
 };
 const addMessage=(text,user=false)=>{
  const article=document.createElement('div');article.className='conti-message '+(user?'conti-user':'conti-answer');
  const who=document.createElement('span');who.className='conti-sr-only';who.textContent=user?'Você: ':'Conti: ';
  const body=document.createElement('p');body.textContent=text;article.append(who,body);log.append(article);
  while(log.children.length>32)log.firstElementChild.remove();
  return article;
 };
 const scroll=()=>{log.scrollTop=log.scrollHeight;};
 const safeLink=(value)=>{
  const url=new URL(value,location.origin);
  return url.origin===location.origin||url.protocol==='mailto:'||url.hostname==='wa.me'?url:null;
 };
 const display=answer=>{
  const article=addMessage(answer.text),actions=document.createElement('div');actions.className='conti-actions';
  (answer.links||[]).forEach(item=>{const url=safeLink(item.url);if(!url)return;const a=document.createElement('a');a.href=url.href;a.textContent=item.label;actions.append(a);});
  if(answer.human){const a=document.createElement('a');a.href=human.href;a.target='_blank';a.rel='noopener noreferrer';a.dataset.service='support';a.className='conti-primary';a.textContent='Falar com a equipe no WhatsApp ↗';actions.append(a);}
  (answer.suggestions||[]).forEach(topic=>{const button=document.createElement('button');button.type='button';button.dataset.contiTopic=topic;button.textContent=labels[topic]||'Mais informações';actions.append(button);});
  article.append(actions);scroll();
 };
 const ask=async(text,topic)=>{
  if(busy)return;busy=true;form.setAttribute('aria-busy','true');form.querySelector('button').disabled=true;
  const clean=String(text).trim().slice(0,400);if(!clean){busy=false;form.removeAttribute('aria-busy');form.querySelector('button').disabled=false;return;}
  lastQuestion=clean;updateHuman();addMessage(clean,true);scroll();
  try{await load();const answer=core.reply(clean,data,topic);display(answer);track('support_topic',{service:answer.intent,placement:'assistant'});}
  finally{busy=false;form.removeAttribute('aria-busy');form.querySelector('button').disabled=false;}
 };
 const setOpen=value=>{
  panel.hidden=!value;launcher.setAttribute('aria-expanded',String(value));widget.classList.toggle('conti-open',value);
  if(value){
   if(!started){display(core.reply('',data,'welcome'));started=true;}
   updateHuman();close.focus({preventScroll:true});load();track('support_open',{placement:'assistant'});
  }else launcher.focus({preventScroll:true});
 };
 launcher.addEventListener('click',()=>setOpen(panel.hidden));
 close.addEventListener('click',()=>setOpen(false));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden&&widget.contains(document.activeElement)){event.preventDefault();setOpen(false);}});
 widget.addEventListener('click',event=>{const button=event.target.closest('[data-conti-topic]');if(button)ask(button.textContent,button.dataset.contiTopic);});
 widget.querySelector('[data-conti-menu]').addEventListener('click',()=>{display(core.reply('',data,'services'));});
 form.addEventListener('submit',event=>{event.preventDefault();if(busy||!input.value.trim())return;const text=input.value;input.value='';ask(text);});
 // Keep the mascot still when the page is not visible, and hide it behind site dialogs.
 document.addEventListener('visibilitychange',()=>widget.classList.toggle('conti-paused',document.hidden));
})();
