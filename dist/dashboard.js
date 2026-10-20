(() => {
  const tabs = [...document.querySelectorAll('[data-panel]')];
  if (!tabs.length) return;
  const panels = [...document.querySelectorAll('.work-panel')];
  const selectPanel = (key, focus = false) => {
    if (!tabs.some(tab => tab.dataset.panel === key)) return;
    tabs.forEach(tab => {
      const active = tab.dataset.panel === key;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panels.forEach(panel => { panel.hidden = panel.id !== 'panel-' + key; });
    history.replaceState(null, '', '#painel-' + key);
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectPanel(tab.dataset.panel));
    tab.addEventListener('keydown', event => {
      let next;
      if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % tabs.length;
      if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault(); selectPanel(tabs[next].dataset.panel, true);
    });
  });
  document.querySelectorAll('[data-open-panel]').forEach(button => button.addEventListener('click', () => selectPanel(button.dataset.openPanel, true)));
  const applyHash = () => {
    if (location.hash.startsWith('#painel-')) selectPanel(location.hash.slice(8));
  };
  applyHash();
  window.addEventListener('hashchange', applyHash);
  const goals = {
    messages: ['Do anúncio à conversa.', 'Apresentamos a oferta a pessoas com maior propensão a iniciar uma conversa. Ao tocar no anúncio, elas seguem para o atendimento no WhatsApp.', 'Objetivo de engajamento com mensagens.', 'Imagem ou vídeo, texto da oferta e botão para o WhatsApp.'],
    local: ['Sua oferta presente na região.', 'A divulgação local busca apresentar sua empresa ao público da área atendida. Analisamos alcance e impressões para acompanhar a entrega.', 'Objetivo de reconhecimento para ampliar a divulgação.', 'Uma oferta clara com identificação do negócio e da região atendida.'],
    visits: ['Um caminho até o seu site.', 'O anúncio apresenta sua oferta e leva a uma página com mais informações. Acompanhamos acessos e, quando a mensuração está configurada, o que acontece depois do clique.', 'Objetivo de tráfego para visitas à página de destino.', 'Imagem ou vídeo, mensagem e link para o site ou landing page.']
  };
  document.getElementById('campaign-goal').addEventListener('change', event => {
    const content = goals[event.target.value];
    ['campaign-goal-title', 'campaign-goal-copy', 'campaign-level', 'campaign-ad'].forEach((id, index) => { document.getElementById(id).textContent = content[index]; });
  });
  document.getElementById('creative-format').addEventListener('change', event => {
    document.getElementById('creative-preview').dataset.format = event.target.value;
    document.getElementById('creative-format-caption').textContent = event.target.value === 'story' ? 'Stories 9:16' : 'Feed 4:5';
  });
  const reports = {
    messages: { name: 'Campanha de mensagens', metrics: [['68', 'Conversas'], ['R$ 3,15', 'Custo por conversa'], ['8.164', 'Pessoas alcançadas'], ['R$ 214,37', 'Investimento']], reading: 'A campanha gerou 68 conversas, com custo médio de R$ 3,15. Isso representa oportunidades de atendimento, não vendas confirmadas. O período desta campanha não foi informado.', next: 'Cruzar os contatos com os atendimentos e as vendas registradas pela empresa para avaliar a qualidade das conversas.' },
    local: { name: 'Divulgação local · 7 dias', metrics: [['7.472', 'Impressões'], ['6.656', 'Pessoas alcançadas'], ['257', 'Cliques'], ['R$ 147,00', 'Investimento total informado']], reading: 'Em 7 dias, o anúncio teve 7.472 exibições, alcançou 6.656 pessoas e recebeu 257 cliques. Impressões contam exibições; alcance conta pessoas. Os cliques não indicam quantas vendas aconteceram.', next: 'Verificar o que aconteceu após o clique e quais mensagens ou ofertas atraíram contatos mais alinhados ao negócio.' }
  };
  const picker = document.getElementById('report-campaign');
  const renderReport = () => {
    const report = reports[picker.value];
    const stats = document.getElementById('report-stats');
    stats.replaceChildren(...report.metrics.map(([value, label]) => {
      const card = document.createElement('div'); card.className = 'report-stat';
      const number = document.createElement('b'); number.textContent = value;
      const caption = document.createElement('span'); caption.textContent = label;
      card.append(number, caption); return card;
    }));
    document.getElementById('report-reading').textContent = report.reading;
    document.getElementById('report-next').textContent = report.next;
    const content = document.getElementById('report-content');
    content.classList.remove('data-arrive');
    requestAnimationFrame(() => content.classList.add('data-arrive'));
  };
  picker.addEventListener('change', renderReport); renderReport();
  document.getElementById('download-report').addEventListener('click', () => {
    const report = reports[picker.value];
    const rows = [['Continental MKT', report.name], ['Indicador', 'Resultado'], ...report.metrics.map(([value, label]) => [label, value]), ['Leitura', report.reading], ['Próximo passo', report.next], ['Fonte', 'Dados históricos fornecidos pela Continental MKT. Cliente não identificado. Sem garantia de resultados futuros.']];
    const csv = '\uFEFF' + rows.map(row => row.map(value => '"' + value.replaceAll('"', '""') + '"').join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url; link.download = 'continental-relatorio-' + picker.value + '.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
