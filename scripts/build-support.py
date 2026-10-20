"""Build the assistant's approved service data from the public package page."""
from pathlib import Path
from html.parser import HTMLParser
import json
root=Path(__file__).resolve().parent.parent
class Offers(HTMLParser):
 def __init__(self):
  super().__init__();self.depth=0;self.slug=None;self.capture=None;self.capture_depth=0;self.buffer=[];self.offers={}
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='div':
   self.depth+=1
   if a.get('data-offer'):self.slug=a['data-offer'];self.offers[self.slug]={}
   if self.slug and a.get('class')=='offer-amount':self.capture='price';self.capture_depth=self.depth;self.buffer=[]
 def handle_data(self,data):
  if self.capture:self.buffer.append(data)
 def handle_endtag(self,tag):
  if tag=='div':
   if self.capture and self.depth==self.capture_depth:
    self.offers[self.slug]['price']=' '.join(' '.join(self.buffer).split());self.capture=None
   self.depth-=1
parser=Offers();parser.feed((root/'dist/pacotes/index.html').read_text())
services={
 'trafego-pago':{'name':'Gestão de tráfego pago','description':'Planejamos os anúncios, acompanhamos a campanha e apresentamos os indicadores. A verba de anúncios é separada da gestão.','note':'O escopo, os canais, os criativos e os relatórios são alinhados na proposta.'},
 'panfletagem-digital':{'name':'Panfletagem digital','description':'Sua oferta divulgada para o público da região, com segmentação, mensagem e relatório.','note':'Período, objetivo de impressões e composição da verba são definidos antes da contratação.'},
 'sites':{'name':'Sites e landing pages','description':'Criamos páginas para apresentar sua empresa e facilitar contatos. Você pode comparar landing page, site institucional e sistema personalizado.','note':'Páginas, revisões, prazo, domínio, hospedagem e integrações são detalhados na proposta.'},
 'perfil-google':{'name':'Perfil da Empresa no Google','description':'Há três opções: Básico, para cadastro e ajustes essenciais; Presença Local, para completar o perfil; e Pro, com acompanhamento e automação de respostas por IA.','note':'Os valores estão sob consulta. Verificação e publicação dependem dos processos do Google; não há garantia de posição.'},
 'criativos':{'name':'Criativos e copywriting','description':'Imagens, vídeos e textos para comunicar a oferta, mostrar o benefício e convidar o público ao próximo passo.','note':'Quantidade de peças, formatos, revisões e prazo são definidos na proposta.'},
 'whatsapp-funil':{'name':'WhatsApp e funil de vendas','description':'Organizamos as etapas de atendimento, os fluxos e o acompanhamento comercial.','note':'Implementação a partir de R$ 2.497, com manutenção separada de R$ 497/mês. Canais, ferramentas e início da manutenção são alinhados na proposta.'},
 'automacao-ia':{'name':'Automação com inteligência artificial','description':'Automação de atendimento e processos para clínicas e outros negócios, com encaminhamento de casos para a equipe.','note':'Plano inicial a partir de R$ 1.497/mês, mais R$ 2.997 de implantação. Primeiro mês a partir de R$ 4.494. Integrações e consumo de ferramentas são detalhados na proposta.'}}
for slug,item in services.items():
 item['price']=parser.offers.get(slug,{}).get('price','Valores sob consulta')
 item['url']='/pacotes/?servico='+slug
 item['details']='/servicos/'+slug+'/'
(root/'dist/support-data.json').write_text(json.dumps({'services':services},ensure_ascii=False,separators=(',',':'))+'\n')
print('Built support-data.json: 7 services, prices from package HTML.')
