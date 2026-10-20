(() => {
 const choices = [...document.querySelectorAll('[data-service-choice]')];
 if (!choices.length) return;
 const services = {"trafego-pago": {"name": "Gestão de tráfego pago", "description": "Planejamento, configuração e acompanhamento de campanhas para sua empresa.", "details": "/servicos/trafego-pago/"}, "panfletagem-digital": {"name": "Panfletagem digital", "description": "Divulgue sua oferta para o público da região atendida.", "details": "/servicos/panfletagem-digital/"}, "sites": {"name": "Sites e landing pages", "description": "Uma presença digital para apresentar sua empresa e facilitar contatos.", "details": "/servicos/sites/"}, "perfil-google": {"name": "Perfil da Empresa no Google", "description": "Organize as informações que seus clientes encontram na busca local.", "details": "/servicos/perfil-google/"}, "criativos": {"name": "Criativos e copywriting", "description": "Imagens, vídeos e mensagens para comunicar sua oferta.", "details": "/servicos/criativos/"}, "whatsapp-funil": {"name": "WhatsApp e funil de vendas", "description": "Organize o caminho entre o primeiro contato e o atendimento.", "details": "/servicos/whatsapp-funil/"}};
 services["automacao-ia"] = {name:"Sistemas de automação com IA",description:"Atendimento e processos conectados para clínicas e negócios.",details:"/servicos/automacao-ia/"};
 const dialog = document.getElementById("google-packages-dialog");
 const openGoogle = () => { if (!dialog.open) dialog.showModal(); };
 document.getElementById("open-google-packages").addEventListener("click", openGoogle);
 document.getElementById("close-google-packages").addEventListener("click", () => dialog.close());
 dialog.addEventListener("click", event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
 });
 const applySelection = (slug, announce = false) => {
  const service = services[slug];
  if (!Object.hasOwn(services, slug)) return;
  choices.forEach(link => { if (link.dataset.serviceChoice === slug) link.setAttribute('aria-current','true'); else link.removeAttribute('aria-current'); });
  document.getElementById('selected-service-title').textContent = service.name;
  document.getElementById('selected-service-description').textContent = service.description;
  const contact = document.getElementById('package-contact');
  contact.removeAttribute('target');contact.removeAttribute('data-channel');
  contact.href = 'https://wa.me/5588997057623?text=' + encodeURIComponent('Olá, Continental MKT! Quero conversar sobre ' + service.name + ' para minha empresa.');
  contact.dataset.service = slug;
  if(!['trafego-pago','automacao-ia'].includes(slug)){contact.target='_blank';contact.dataset.channel='whatsapp';}
  contact.textContent = slug === 'trafego-pago' ? 'Agende sua reunião' : slug === 'sites' ? 'Consultar o estilo do projeto' : slug === 'automacao-ia' ? 'Agendar diagnóstico' : 'Solicitar proposta';
  if (['trafego-pago','automacao-ia'].includes(slug)) contact.href='/reuniao/?servico='+slug;
  document.querySelectorAll('[data-offer]').forEach(offer => { offer.hidden = offer.dataset.offer !== slug; });
  document.getElementById('offer-selection-hint').hidden = true;
  if (slug !== 'perfil-google' && dialog.open) dialog.close();
  document.getElementById('package-details').href = service.details;
  document.getElementById('package-details').textContent = 'Conhecer o serviço';
  const panel = document.getElementById('package-selection');
  panel.classList.remove('selection-enter');
  requestAnimationFrame(() => panel.classList.add('selection-enter'));
  if (announce) { document.getElementById('package-announcement').textContent = 'Serviço selecionado: ' + service.name; panel.focus({preventScroll:true}); if (slug !== 'perfil-google') panel.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'}); }
  if (slug === 'perfil-google') openGoogle();
 };
 choices.forEach(link => link.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const destination=new URL(location.href);destination.searchParams.set('servico',link.dataset.serviceChoice);
  history.pushState(null, '', destination.pathname+destination.search);
  applySelection(link.dataset.serviceChoice, true);
 }));
 const readSelection = () => {
  const slug = new URLSearchParams(location.search).get('servico');
  if (Object.hasOwn(services, slug)) { applySelection(slug); return; }
  choices.forEach(link => link.removeAttribute('aria-current'));
  document.querySelectorAll('[data-offer]').forEach(offer => { offer.hidden = true; });
  document.getElementById('offer-selection-hint').hidden = false;
  document.getElementById('package-contact').textContent = 'Conversar sobre meu projeto';
  document.getElementById('package-contact').removeAttribute('data-service');
  if (dialog.open) dialog.close();
  document.getElementById('selected-service-title').textContent = 'Qual serviço você procura?';
  document.getElementById('selected-service-description').textContent = 'Escolha uma opção ao lado para continuar.';
  document.getElementById('package-contact').href = 'https://wa.me/5588997057623?text=' + encodeURIComponent('Olá, quero saber mais sobre os serviços da Continental MKT.');
  document.getElementById('package-details').href = '/#servicos';
  document.getElementById('package-details').textContent = 'Conhecer os serviços';
  document.getElementById('package-announcement').textContent = '';
 }; 
 window.addEventListener('popstate', readSelection);
 readSelection();
})();
