(() => {
 const form=document.getElementById('meeting-request');if(!form)return;
 const date=form.elements.namedItem('date');
 const now=new Date();date.min=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 const service=form.elements.namedItem('service');const slug=new URLSearchParams(location.search).get('servico');
 if([...service.options].some(option=>option.value===slug))service.value=slug;
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  if(date.value<date.min){date.setCustomValidity('Escolha hoje ou uma data futura.');date.reportValidity();return;}date.setCustomValidity('');
  const values=form.elements;
  const text='Olá, Continental MKT! Quero solicitar uma reunião.\nNome: '+values.namedItem('name').value.trim()+'\nEmpresa: '+values.namedItem('company').value.trim()+'\nServiço: '+service.selectedOptions[0].text+'\nData de preferência: '+date.value.split('-').reverse().join('/')+'\nHorário de preferência: '+values.namedItem('time').value+' (Brasília)\nObjetivo: '+values.namedItem('goal').value.trim()+'\nAguardo confirmação de disponibilidade.';
  window.Continental?.track('meeting_request',{service:service.value,channel:'whatsapp',placement:'meeting_form'});
  document.getElementById('meeting-status').textContent='Abrindo a solicitação. O horário depende de confirmação da equipe.';
  const href='https://wa.me/5588997057623?text='+encodeURIComponent(text);
  location.assign(window.Continental?.contactUrl(href)||href);
 });
 date.addEventListener('input',()=>date.setCustomValidity(''));
})();
