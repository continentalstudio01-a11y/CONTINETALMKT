# Continental MKT

Site oficial da Continental MKT: serviços, pacotes, resultados, solicitação de reunião e o assistente Conti.

## Estrutura
- `dist/`: site completo em HTML, CSS e JavaScript, com imagens e fontes locais.
- `styles/`: fontes dos estilos compartilhados.
- `scripts/build.mjs`: build sem dependências externas, atualização dos preços do assistente e configuração dos endereços de SEO.
- `INTEGRATIONS.md`: integrações pendentes e decisão de conectar futuramente ao CRM próprio.
- `MEASUREMENT.md`: mensuração e privacidade.

## Executar as verificações
Requer Node.js 22 ou superior. Não há dependências npm.

```bash
npm run build
npm run check
```

Para visualizar, sirva `dist/` com um servidor HTTP estático, por exemplo `python -m http.server 8080 --directory dist`.

## Deploy na Vercel
Importe este repositório e mantenha o diretório raiz como `.`. O arquivo `vercel.json` define o preset Other, o build `node scripts/build.mjs` e a saída `dist`.

O build usa `SITE_URL`, quando configurada, ou a URL de produção disponibilizada pela Vercel para atualizar canônicas, sitemap e prévias. Previews recebem `noindex`. Para um domínio próprio, configure `SITE_URL` com sua origem HTTPS e faça um novo deploy.

As páginas são múltiplos arquivos HTML; não configurar um rewrite geral para `index.html`, pois isso substituiria as páginas de serviços.

## Integrações
O assistente tem respostas guiadas locais. O formulário de reunião solicita um horário pelo WhatsApp, sujeito à confirmação da equipe. CRM próprio e agenda automática ficam para uma etapa futura.

GA4 e Pixel Meta estão desativados, com IDs vazios em `dist/measurement-config.js`. Chaves privadas e tokens nunca devem ser colocados no site ou no repositório.
