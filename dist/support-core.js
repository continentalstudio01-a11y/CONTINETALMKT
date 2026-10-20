(() => {
 const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const serviceSlugs=['trafego-pago','panfletagem-digital','sites','perfil-google','criativos','whatsapp-funil','automacao-ia'];
 const classify = value => {
  const text=normalize(value);
  if(serviceSlugs.includes(text))return text;
  if(/quem e voce|voce e (?:um |uma )?(?:bot|robo|ia)|como voce funciona/.test(text))return 'about';
  if(/reuniao|agendar|agendamento|marcar.*horario/.test(text))return 'meeting';
  if(/privacidade|dados pessoais|meus dados|lgpd/.test(text))return 'privacy';
  if(/relatorio|resultado|metricas|alcance|impressoes/.test(text))return 'reports';
  if(/suporte|problema|reclamacao|erro|pagamento|boleto|nota fiscal|cancelar/.test(text)||(/(?:minha|meu)\s+(?:campanha|projeto|site|pedido)/.test(text)&&!/quanto|preco|orcamento|criar|fazer|contratar/.test(text)))return 'support';
  if(/contato|email|telefone|humano|pessoa|lucas|atendente|falar com/.test(text))return 'human';
  if(/funil|crm|automacao.*whats|whats.*automacao/.test(text))return 'whatsapp-funil';
  if(/google|maps|meu negocio/.test(text))return 'perfil-google';
  if(/automacao|inteligencia artificial|\bia\b|clinica|chatbot|robo/.test(text))return 'automacao-ia';
  if(/criativo|copy|arte|video|roteiro/.test(text))return 'criativos';
  if(/panfletagem|panfleto|divulgacao local/.test(text))return 'panfletagem-digital';
  if(/whats/.test(text))return 'human';
  if(/landing|\bsite\b|sites|sistema/.test(text))return 'sites';
  if(/trafego|meta ads|anuncio|campanha/.test(text))return 'trafego-pago';
  if(/pacote|preco|valor|custa|orcamento|servico/.test(text))return 'services';
  if(/contato|email|telefone|humano|pessoa|lucas|atendente/.test(text))return 'human';
  if(/^(oi|ola|bom dia|boa tarde|boa noite|ajuda)[!.? ]*$/.test(text))return 'welcome';
  return 'fallback';
 };
 const reply = (input,data={},topic) => {
  const intent=topic||classify(input),services=data.services||{};
  if(serviceSlugs.includes(intent)){
   const item=services[intent];
   if(!item)return {intent,text:'Confira as opções e as condições atualizadas na página deste serviço.',links:[{label:'Ver pacotes',url:'/pacotes/?servico='+intent}],suggestions:['meeting','human']};
   const links=[{label:'Ver pacotes e condições',url:'/pacotes/?servico='+intent},{label:'Como funciona',url:'/servicos/'+intent+'/'}];
   if(intent==='sites')links.push({label:'Comparar estilos de site',url:'/modelos/'});
   return {intent,text:item.name+'\n'+item.price+'\n\n'+item.description+'\n\n'+item.note,links,suggestions:['meeting','human']};
  }
  const answers={
   about:{text:'Sou o Conti, assistente virtual da Continental MKT, com respostas guiadas pelo conteúdo do site. Posso explicar os serviços e os próximos passos. Para analisar o seu caso ou consultar uma campanha, encaminho você à equipe.',suggestions:['services','human']},
   welcome:{text:'Olá! Sou o Conti, assistente virtual da Continental MKT. Posso ajudar a conhecer os serviços, os pacotes e o próximo passo para o seu negócio. O que você procura?',suggestions:['services','meeting','support']},
   services:{text:'Escolha o serviço que combina com o que você precisa. Vou mostrar o investimento inicial, explicar o funcionamento e levar você aos detalhes.',suggestions:serviceSlugs},
   meeting:{text:'Você pode escolher uma data e um horário de preferência na página de reunião. A solicitação é enviada pelo WhatsApp, e a equipe confirma a disponibilidade antes de reservar.',links:[{label:'Solicitar uma reunião',url:'/reuniao/'}],suggestions:['services','human']},
   reports:{text:'No site há dois resumos históricos: divulgação local e campanha de mensagens. Você pode comparar os indicadores e baixar um CSV. Para consultar uma campanha sua, fale com a equipe; eu não tenho acesso às contas dos clientes.',links:[{label:'Ver relatórios',url:'/#painel-reports'},{label:'Entender os resultados',url:'/resultados/'}],suggestions:['support','human']},
   support:{text:'Já é cliente ou precisa resolver algo? A equipe pode verificar seu caso pelo WhatsApp. Informe a empresa, o serviço e o que aconteceu. Eu não consulto contas, pagamentos ou campanhas em andamento.',human:true,suggestions:['reports','services']},
   human:{text:'O atendimento da Continental MKT acontece pelo WhatsApp ou pelo e-mail continentalmkt01@gmail.com. Use o botão abaixo para conversar com a equipe. O tempo de resposta depende da disponibilidade.',human:true,links:[{label:'Enviar e-mail',url:'mailto:continentalmkt01@gmail.com'}],suggestions:['meeting','services']},
   privacy:{text:'As mensagens desta ajuda ficam somente na memória desta página. Não envie senhas, documentos ou dados sensíveis. Ao escolher falar com a equipe, a última mensagem pode ser incluída no WhatsApp para você revisar e enviar.',links:[{label:'Ler a Política de Privacidade',url:'/privacidade/'}],suggestions:['human']},
   fallback:{text:'Posso orientar sobre os serviços e o funcionamento do site. Para uma análise específica ou uma dúvida que eu não consiga responder, a equipe pode ajudar pelo WhatsApp.',human:true,suggestions:['services','meeting','support']}
  };
  return {intent,...(answers[intent]||answers.fallback)};
 };
 window.ContinentalSupport=Object.freeze({classify,reply,serviceSlugs});
})();
