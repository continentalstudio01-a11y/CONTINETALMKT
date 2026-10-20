# Continental MKT — integrações e operação

## Implementado
- Sete serviços com seleção de pacotes, preços iniciais aprovados e condições de escopo.
- Páginas próprias para todos os sete serviços, estilos de projeto, resultados, reunião e privacidade.
- Solicitação de reunião por WhatsApp: preferência de data/hora, sem reservar agenda.
- UTM nos links internos e na mensagem de WhatsApp; referência aleatória da sessão.
- Preferências de privacidade com estatística e marketing separados.
- Carregadores de GA4 e Pixel bloqueados até configuração e consentimento.
- Eventos de intenção: contact_click, briefing_submit, meeting_request, service_select, process_panel_view.
- Observações de LCP/CLS e tempos de navegação enviadas apenas se a mensuração estatística estiver ativada. Não equivalem a um laudo de Core Web Vitals. INP ainda precisa de medição própria.

## IDs e verificações pendentes
1. Inserir somente os IDs públicos das propriedades corretas em dist/measurement-config.js. Nenhum ID de campanha/cliente de outra conversa foi reutilizado. Tokens e chaves não pertencem ao navegador.
2. Validar GA4 e Meta nas contas do proprietário. Cliques são intenção; não disparar Lead/Purchase como se houvesse confirmação de conversa ou venda.
3. Receber domínio e acesso/autorização de DNS. Migrar canônicas, sitemap, imagens e redirecionamentos em uma atualização coordenada.
4. Verificar Search Console com o método da conta do proprietário e enviar o sitemap.
5. Conectar agenda autorizada e regras reais de disponibilidade antes de oferecer reserva automática.
6. Conectar futuramente o CRM próprio de Lucas, conforme decisão registrada em 19/10/2026. O site atual não tem backend de leads nem painel privado; nenhum cadastro pessoal é mantido no navegador ou em um banco do site.
7. Receber depoimentos, imagens e autorizações de clientes para adicionar novas provas. As referências demonstrativas não são portfólio de cliente.
8. Definir valores dos três pacotes do Google e confirmar volumes, prazos e condições comerciais.

## Decisão registrada em 19/10/2026 — CRM próprio
Lucas já possui um CRM próprio. A integração de agendamento e acompanhamento comercial fica salva para uma etapa futura, sem ativação nesta atualização. Não pressupor adoção de Zoho CRM nem troca de sistema. O provedor de agenda será definido conforme os recursos do CRM existente.

Fluxo desejado: contato no site → cadastro/atualização no CRM próprio → solicitação e confirmação de reunião → proposta → negociação → venda ou perda.

Na retomada:
1. Identificar o endereço e os recursos atuais do CRM próprio.
2. Verificar a API ou os webhooks disponíveis e a autenticação autorizada pelo proprietário.
3. Mapear serviços, contatos, origem de campanha, referência e etapas do funil.
4. Conectar os formulários e a agenda, com prevenção de duplicidades, registro de falhas e confirmação real antes de reservar horários.
5. Testar o percurso completo em ambiente apropriado, incluindo mudança de etapa e confirmação comercial da venda.

Até lá, manter os formulários e a solicitação de reunião por WhatsApp funcionando como estão, sem apresentar a integração como ativa.

## Especificação do CRM a conectar
- Campos: id interno, referência, data de criação, nome, empresa, canal, serviço, origem/campanha, responsável, etapa, próxima ação e data, proposta e resultado.
- Etapas: novo contato → diagnóstico → reunião → proposta → negociação → ganho/perdido.
- Captura e atualização no servidor, com acesso restrito à equipe; não expor leads em endpoints públicos.
- Confirmar contato recebido antes de marcar lead; registrar compra somente após confirmação comercial.
- Dados pessoais nunca devem ir como parâmetros de eventos analíticos.
- Consentimento de comunicação, retenção e solicitações de exclusão precisam seguir a operação acordada com a empresa.

## Publicação
Rodar `python scripts/build-styles.py` depois de editar estilos em styles/. O resultado é um CSS compartilhado com os módulos específicos de dashboard e pacotes carregados apenas onde necessários.

## Assistente Conti
Mascote original em SVG/CSS e ajuda guiada local, sem API de IA. Mensagens ficam apenas na memória da página. A transferência ao WhatsApp exige ação do visitante. Rodar `python scripts/build-support.py` após editar pacotes: ele gera `dist/support-data.json` com os valores publicados. Não adicionar atendimento online, acesso a campanhas ou respostas generativas como se estivessem conectados.
