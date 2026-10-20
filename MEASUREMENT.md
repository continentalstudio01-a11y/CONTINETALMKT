# Mensuração e privacidade

`dist/measurement-config.js`: IDs públicos vazios. GA4 e Pixel não estão ativos.
`dist/tracking.js`: carregamento condicionado ao consentimento de estatísticas/marketing, preferências revisáveis pelo rodapé. Não enviar tokens nem valores de formulários à mensuração.

Eventos: contact_click, briefing_submit, meeting_request, service_select, process_panel_view, site_performance, support_open e support_topic. Os eventos do Conti registram apenas tema e abertura, sem texto digitado.
Cliques e solicitações não comprovam recebimento de conversa, lead qualificado, reunião confirmada ou venda.

UTMs são preservadas nos links internos e podem ser incluídas na mensagem enviada pelo visitante ao WhatsApp. Uma referência aleatória é mantida na sessão; campos dos formulários não são armazenados pelo site. A persistência adicional da campanha na sessão depende da preferência de estatísticas.

Observações de performance usam PerformanceObserver para LCP/CLS e Navigation Timing. Não há pontuação Lighthouse nem INP de campo medido nesta implementação. Para avaliar Core Web Vitals, validar em navegador/dispositivos e reunir dados de campo.

Consulte INTEGRATIONS.md para requisitos de ativação, domínio, Search Console, agenda e CRM.
