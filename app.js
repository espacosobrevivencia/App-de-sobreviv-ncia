"use strict";

const APP_VERSION = "1.0.0";
const STORAGE = {
  checklist: "sobrevivencia_checklist_v1",
  contacts: "sobrevivencia_contacts_v1"
};

const DEFAULT_CHECKLIST = [
  "Água","Lanterna","Power bank","Rádio","Primeiros socorros","Comida",
  "Documentos","Mapa offline","Abrigo / lona","Ferramentas","Comunicação"
].map((text,index)=>({id:`padrao-${index}`,text,category:"Kit principal",done:false}));

const EMERGENCIES = [
  {id:"apagao",icon:"🔦",title:"Apagão",summary:"Segurança, iluminação, energia e comunicação.",steps:[
    "Confirme se o problema está apenas no imóvel ou também na região.",
    "Use lanterna em vez de chama aberta sempre que possível.",
    "Preserve a bateria do celular e do rádio.",
    "Mantenha geladeira e freezer fechados.",
    "Se usar gerador a combustível, mantenha-o ao ar livre e longe de portas e janelas.",
    "Defina horários curtos para verificar informações e comunicação."
  ],dont:["Não use gerador ou motor a combustão em ambiente fechado.","Não toque em fiação caída ou instalações elétricas danificadas."]},

  {id:"enchente",icon:"🌊",title:"Enchente",summary:"Saia de áreas de risco e evite água contaminada.",steps:[
    "Vá para local alto e seguro se houver risco de subida da água.",
    "Siga ordens de evacuação da Defesa Civil.",
    "Evite contato com água de inundação.",
    "Se for seguro, desligue a energia elétrica antes que a água alcance as instalações.",
    "Use somente água e alimentos que não tenham sido contaminados.",
    "Não retorne a áreas interditadas sem liberação."
  ],dont:["Não atravesse alagamentos sem necessidade.","Não toque em equipamentos elétricos molhados ou fios caídos."],calls:["199","193"]},

  {id:"tempestade",icon:"⛈️",title:"Tempestade severa",summary:"Abrigo, raios e vento forte.",steps:[
    "Procure uma construção resistente.","Permaneça longe de janelas.",
    "Evite áreas abertas, árvores isoladas, postes e estruturas metálicas durante raios.",
    "Afaste-se de objetos que possam ser lançados pelo vento.","Mantenha lanterna, calçado e celular acessíveis."
  ],dont:["Não permaneça em área aberta durante descargas elétricas.","Não se aproxime de estruturas ou fios danificados."],calls:["199","193"]},

  {id:"incendio",icon:"🔥",title:"Incêndio",summary:"Prioridade: sair e chamar os Bombeiros.",steps:[
    "Avise as pessoas próximas.","Inicie a saída imediatamente.","Use a rota de fuga mais segura.",
    "Se houver fumaça, permaneça mais baixo.","Feche portas ao sair se isso não atrasar a fuga.",
    "Quando estiver em local seguro, ligue 193.","Informe endereço, tipo de incêndio e riscos conhecidos."
  ],dont:["Não retorne para buscar objetos.","Não use elevadores.","Não tente combater um incêndio grande ou em rápida expansão."],calls:["193"]},

  {id:"terremoto",icon:"🏚️",title:"Terremoto",summary:"Abaixe-se, proteja-se e segure-se.",steps:[
    "Durante o tremor, abaixe-se.","Proteja cabeça e pescoço.","Busque cobertura resistente se disponível.",
    "Afaste-se de vidros e objetos que possam cair.","Depois do tremor, verifique feridos, fogo, vazamentos e danos estruturais.",
    "Prepare-se para novos tremores."
  ],dont:["Não use elevadores.","Não retorne a uma construção claramente danificada."]},

  {id:"transito",icon:"🚗",title:"Acidente de trânsito",summary:"Proteja a cena e evite agravar ferimentos.",steps:[
    "Priorize sua própria segurança.","Sinalize o local sem se expor ao tráfego.","Ligue 192 ou 193.",
    "Informe localização, número de vítimas e riscos visíveis.",
    "Não mova uma vítima com suspeita de trauma, salvo perigo imediato.",
    "Em sangramento externo intenso, faça pressão direta usando material limpo.",
    "Observe respiração e consciência até o socorro chegar."
  ],dont:["Não ofereça comida, bebida ou medicamentos a uma pessoa gravemente ferida.","Não retire o capacete de motociclista sem necessidade imediata e treinamento."],calls:["192","193","190"]},

  {id:"inconsciente",icon:"🫁",title:"Pessoa inconsciente",summary:"Verifique segurança, resposta e respiração.",steps:[
    "Confirme que o local é seguro.","Tente obter resposta chamando a pessoa e tocando-a com cuidado.",
    "Peça ajuda.","Ligue 192 e coloque o telefone no viva-voz.","Observe se a pessoa respira normalmente.",
    "Se não respirar normalmente, siga imediatamente as instruções do serviço de emergência.",
    "Faça RCP se você souber executá-la.","Se respirar, monitore continuamente."
  ],dont:["Não dê líquidos, alimentos ou medicamentos a uma pessoa inconsciente.","Não movimente uma vítima com suspeita de trauma, salvo perigo imediato."],calls:["192"]},

  {id:"hemorragia",icon:"🩸",title:"Hemorragia",summary:"Pressão direta e socorro rápido.",steps:[
    "Garanta que o local seja seguro.","Use luvas ou outra barreira se disponível.",
    "Aplique pressão direta firme e contínua sobre o ferimento usando gaze ou tecido limpo.",
    "Se o material encharcar, mantenha-o no lugar e coloque outro por cima.","Em sangramento intenso, ligue 192 ou 193.",
    "Mantenha a vítima aquecida e monitore consciência e respiração.",
    "Torniquetes exigem indicação correta e treinamento. Em situação real, siga orientação profissional sempre que possível."
  ],dont:["Não retire objeto profundamente encravado.","Não perca tempo limpando profundamente uma ferida antes de controlar um sangramento grave."],calls:["192","193"]},

  {id:"queimadura",icon:"🧯",title:"Queimadura",summary:"Interrompa o calor, resfrie e não use receitas caseiras.",steps:[
    "Interrompa o contato com a fonte de calor sem se colocar em risco.",
    "Resfrie a área com água corrente fria e jato suave por aproximadamente 10 minutos.",
    "Retire anéis, relógios e itens apertados próximos se não estiverem aderidos à pele.",
    "Proteja a área com material limpo.","Procure atendimento em queimaduras extensas, profundas, químicas ou elétricas.",
    "Em casos graves, ligue 192 ou 193."
  ],dont:["Não use gelo diretamente.","Não fure bolhas.","Não aplique manteiga, pó de café, creme dental ou receitas caseiras.","Não arranque roupa grudada à pele."],calls:["192","193"]},

  {id:"cobra",icon:"🐍",title:"Picada de cobra",summary:"Repouso e atendimento médico rápido.",steps:[
    "Afaste-se da serpente.","Mantenha a pessoa calma e em repouso.",
    "Retire anéis, pulseiras, calçados ou objetos que possam apertar com o inchaço.",
    "Se possível, lave o local com água e sabão.","Procure atendimento médico o mais rápido possível.",
    "Se for seguro, fotografe a serpente à distância."
  ],dont:["Não faça torniquete ou garrote.","Não corte o local.","Não tente sugar o veneno.","Não aplique substâncias ou receitas caseiras.","Não ofereça bebida alcoólica.","Não tente capturar a serpente."],calls:["192"]},

  {id:"insolacao",icon:"☀️",title:"Insolação",summary:"Resfriar e buscar ajuda em casos graves.",steps:[
    "Leve a pessoa para local fresco, sombreado e ventilado.","Remova excesso de roupas.",
    "Inicie resfriamento com água fresca, compressas frias ou banho frio.",
    "Se houver confusão, desmaio, convulsão ou temperatura muito elevada, ligue 192.",
    "Se a pessoa estiver plenamente consciente e conseguir engolir, ofereça água ou líquido não alcoólico."
  ],dont:["Não dê líquidos a pessoa inconsciente ou com dificuldade para engolir.","Não deixe uma pessoa em quadro grave sozinha."],calls:["192"]},

  {id:"desidratacao",icon:"💧",title:"Desidratação",summary:"Reposição de líquidos e atenção a sinais graves.",steps:[
    "Leve a pessoa para um local fresco.","Reduza esforço físico.",
    "Se estiver consciente e conseguir engolir, ofereça água em pequenos volumes frequentes.",
    "Se usar solução de reidratação industrializada, siga exatamente as instruções do produto.",
    "Procure atendimento se houver confusão, desmaio, incapacidade de beber, vômitos persistentes ou piora rápida."
  ],dont:["Não force líquido em pessoa inconsciente.","Não improvise concentrações de sais ou produtos químicos sem fonte confiável."],calls:["192"]},

  {id:"perdido",icon:"🧭",title:"Perdido em área rural",summary:"Pare, preserve energia e aumente a chance de localização.",steps:[
    "PARE: interrompa a caminhada impulsiva.","OBSERVE: relembre o último ponto conhecido, horário, terreno, clima e recursos.",
    "PENSE: avalie se permanecer no local é mais seguro que continuar andando.","AJA: prepare abrigo, água, sinalização e comunicação.",
    "Use o GPS deste app para coordenadas.","Use o MAPS.ME para mapa e navegação offline.",
    "Economize bateria usando brilho baixo e horários definidos para checagem."
  ],dont:["Não continue andando sem objetivo de navegação claro.","Não dependa de um único método de orientação."]},

  {id:"comunicacoes",icon:"📡",title:"Colapso das comunicações",summary:"Economize energia e use alternativas.",steps:[
    "Teste chamadas, SMS e dados sem repetir tentativas continuamente.","Defina horários de checagem.",
    "Use rádio ou Meshtastic se já estiverem configurados.","Utilize pontos de encontro previamente combinados.",
    "Escreva mensagens curtas: quem, onde, condição e próximo passo.","Preserve bateria."
  ],dont:["Não esgote a bateria tentando conexão continuamente.","Não dependa de apenas um aplicativo ou equipamento."]}
];

const KNOTS = [
  {icon:"➿",name:"Nó direito",use:"Unir duas pontas semelhantes em tarefas leves.",warning:"Pode escorregar sob condições inadequadas. Não é nó de escalada ou resgate."},
  {icon:"🪢",name:"Lais de guia",use:"Criar uma alça fixa.",warning:"Não trate uma montagem simples como sistema de segurança de vida."},
  {icon:"🧵",name:"Volta do fiel",use:"Fixação rápida em postes, galhos ou objetos cilíndricos.",warning:"Pode afrouxar em algumas condições. Use redundância quando necessário."},
  {icon:"🔗",name:"Nó de escota",use:"Unir cabos, inclusive de espessuras diferentes.",warning:"Inspecione a orientação e o acabamento."},
  {icon:"8️⃣",name:"Nó oito",use:"Nó de parada e base de outras montagens.",warning:"Escalada e resgate exigem treinamento e equipamento apropriado."},
  {icon:"🧷",name:"Volta redonda + dois cotes",use:"Prender corda a poste, árvore ou argola.",warning:"Inspecione a corda e o ponto de ancoragem."}
];

const MODULES = [
  ["agua","💧","Água","Tratamento, armazenamento e cálculo."],
  ["abrigo","🏕️","Abrigo","Chuva, vento, frio, calor e lona."],
  ["nos","🪢","Nós e cordas","Referência rápida."],
  ["navegacao","🧭","Navegação","GPS, distância e azimute."],
  ["energia","🔋","Energia","Bateria e power banks."],
  ["comunicacao","📻","Comunicação","Rádio e redes locais."],
  ["contatos","📞","Contatos","Números locais."],
  ["dados","💾","Backup","Exportar e importar dados."],
  ["fontes","📚","Fontes e limites","Referências do aplicativo."]
];

const view = document.getElementById("view");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const toast = document.getElementById("toast");
const networkStatus = document.getElementById("networkStatus");
const installButton = document.getElementById("installButton");
const importInput = document.getElementById("importInput");

let installPrompt = null;
let toastTimer = null;

const clone = value => JSON.parse(JSON.stringify(value));
const uid = (prefix="id") => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const escapeHTML = value => String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
function loadJSON(key,fallback){try{const saved=localStorage.getItem(key);return saved?JSON.parse(saved):clone(fallback)}catch{return clone(fallback)}}
function saveJSON(key,value){localStorage.setItem(key,JSON.stringify(value))}
function getChecklist(){const items=loadJSON(STORAGE.checklist,DEFAULT_CHECKLIST);if(!localStorage.getItem(STORAGE.checklist))saveJSON(STORAGE.checklist,items);return items}
function getContacts(){return loadJSON(STORAGE.contacts,[])}
function showToast(message){clearTimeout(toastTimer);toast.textContent=message;toast.hidden=false;toastTimer=setTimeout(()=>toast.hidden=true,2400)}
function openModal(title,html){modalTitle.textContent=title;modalBody.innerHTML=html;modal.hidden=false;document.body.style.overflow="hidden"}
function closeModal(){modal.hidden=true;modalBody.innerHTML="";document.body.style.overflow=""}
function pageHeader(icon,title,description){return `<header class="page-header"><h1>${icon} ${title}</h1><p>${description}</p></header>`}
function navCard(target,icon,title,description,extra=""){return `<button class="action-card ${extra}" data-nav="${target}"><span class="emoji">${icon}</span><span><strong>${title}</strong><small>${description}</small></span></button>`}

function emergencyCalls(numbers=["190","192","193","199"]){
  const names={"190":"Polícia","192":"SAMU","193":"Bombeiros","199":"Defesa Civil"};
  return `<div class="emergency-calls">${numbers.map(n=>`<a class="call-button" href="tel:${n}">📞 ${n} · ${names[n]||"Ligar"}</a>`).join("")}</div>`;
}

function renderHome(){
  view.innerHTML=`
  <section class="hero"><span class="hero-label">Centro de ação rápida</span><h1>PARE → OBSERVE → PENSE → AJA</h1><p>Use este aplicativo para decidir o próximo passo. Para conteúdo aprofundado, continue usando MAPS.ME, Kiwix, PDFs e vídeos offline.</p><div class="stop-grid"><div>✋ PARE</div><div>👀 OBSERVE</div><div>🧠 PENSE</div><div>➡️ AJA</div></div></section>
  <section class="panel"><h2>📞 Telefones de emergência</h2><p>Toque para abrir o discador. A chamada depende de serviço telefônico disponível.</p>${emergencyCalls()}</section>
  <div class="search-wrapper"><span>⌕</span><input id="globalSearch" class="search" type="search" autocomplete="off" placeholder="Buscar queimadura, água, GPS..."></div><div id="searchResults" class="search-results"></div>
  <div class="section-title"><h2>Acesso rápido</h2><span>disponível offline</span></div>
  <div class="quick-grid">
    ${navCard("emergencias","🆘","Emergências","Protocolos rápidos","danger")}
    ${navCard("agua","💧","Água","Tratar e calcular")}
    ${navCard("navegacao","🧭","Navegação","GPS e bearing")}
    ${navCard("energia","🔋","Energia","Autonomia")}
    ${navCard("checklist","🎒","Checklist","Kit e preparo")}
    ${navCard("contatos","📞","Contatos","Números locais")}
    ${navCard("nos","🪢","Nós","Consulta rápida")}
    ${navCard("mais","☰","Mais","Todos os módulos")}
  </div>
  <div class="section-title"><h2>Estado do aplicativo</h2></div>
  <section class="panel"><div class="status-line"><span>Versão</span><span class="pill">${APP_VERSION}</span></div><div class="status-line"><span>Dados pessoais</span><span class="pill">somente local</span></div><div class="status-line"><span>APIs externas</span><span class="pill">nenhuma</span></div></section>`;
}

function renderEmergencies(){
  view.innerHTML=`${pageHeader("🆘","Emergências","Ações curtas para os primeiros minutos.")}
  <section class="panel"><h2>PARE → OBSERVE → PENSE → AJA</h2><ol class="protocol"><li><strong>PARE:</strong> interrompa ações impulsivas.</li><li><strong>OBSERVE:</strong> identifique riscos, feridos e recursos.</li><li><strong>PENSE:</strong> escolha a ação que reduz mais risco.</li><li><strong>AJA:</strong> execute e reavalie.</li></ol>${emergencyCalls()}</section>
  <div class="list">${EMERGENCIES.map(e=>`<article class="list-card clickable" data-emergency="${e.id}"><h3>${e.icon} ${e.title}</h3><p>${e.summary}</p></article>`).join("")}</div>`;
}
function showEmergency(id){
  const e=EMERGENCIES.find(x=>x.id===id);if(!e)return;
  openModal(`${e.icon} ${e.title}`,`<div class="notice danger"><strong>Primeiro:</strong> não se coloque em risco para ajudar outra pessoa.</div><h3>O que fazer</h3><ol class="protocol">${e.steps.map(s=>`<li>${s}</li>`).join("")}</ol>${e.dont?`<h3>Evite</h3><ul class="dont">${e.dont.map(s=>`<li>${s}</li>`).join("")}</ul>`:""}${e.calls?emergencyCalls(e.calls):""}<div class="notice warning">Guia resumido. Se houver serviço de emergência disponível, siga a orientação profissional.</div>`);
}

function waterCalculator(prefix){
  return `<form id="${prefix}WaterForm"><div class="form-grid"><div class="field"><label>Pessoas</label><input name="people" type="number" min="1" value="1" required></div><div class="field"><label>Dias</label><input name="days" type="number" min="1" value="3" required></div><div class="field"><label>Litros por pessoa/dia</label><input name="liters" type="number" min="0.1" step="0.1" value="3" required></div><div class="field"><label>Reserva extra (%)</label><input name="reserve" type="number" min="0" value="20" required></div></div><button class="btn primary full" type="submit">Calcular água</button><div id="${prefix}WaterResult" class="result" hidden></div></form>`;
}
function renderWater(){
  view.innerHTML=`${pageHeader("💧","Água","Fonte segura, tratamento verificável e armazenamento limpo.")}
  <section class="panel"><h2>Ordem prática</h2><ol class="protocol"><li>Prefira água potável lacrada ou fornecida por fonte confiável.</li><li>Evite água com sinais de esgoto, combustível, químicos ou contaminação industrial.</li><li>Filtrar ou coar remove partículas, mas não garante sozinho que a água esteja segura.</li><li>Para a alternativa de fervura, filtre ou coe e mantenha a água fervendo por 5 minutos após o início da ebulição.</li><li>Guarde água tratada em recipiente limpo e tampado.</li></ol></section>
  <section class="panel"><h2>⚠️ Tratamento químico</h2><div class="notice warning">Este aplicativo <strong>não calcula dosagens químicas.</strong> Concentrações diferentes exigem procedimentos diferentes.</div><p>Siga somente a concentração e as instruções escritas no produto ou em fonte oficial confiável.</p><p>Se concentração, rótulo ou instrução estiverem ilegíveis, não improvise.</p></section>
  <section class="panel"><h2>Calculadora de planejamento</h2><p>O valor diário é editável. Ajuste ao seu planejamento e às condições reais.</p>${waterCalculator("main")}</section>`;
}
function renderShelter(){
  view.innerHTML=`${pageHeader("🏕️","Abrigo","Reduza exposição sem criar um risco novo.")}
  <section class="panel"><h2>Escolha do local</h2><ul class="protocol"><li>Evite leitos secos de rios e locais sujeitos a enchente.</li><li>Evite encostas instáveis.</li><li>Observe galhos mortos, rochas e objetos acima.</li><li>Observe drenagem, vento e rota de saída.</li></ul></section>
  <section class="panel"><h2>Chuva e vento</h2><ul class="protocol"><li>Incline a cobertura para escoar água.</li><li>Evite bolsas de água sobre a lona.</li><li>Use pontos de ancoragem sólidos.</li><li>Abrigos mais baixos normalmente oferecem menos superfície ao vento.</li></ul></section>
  <section class="panel"><h2>Frio</h2><ul class="protocol"><li>Isole o corpo do chão.</li><li>Mantenha roupas secas.</li><li>Reduza a passagem direta do vento.</li><li>Evite suor excessivo no frio.</li></ul></section>
  <section class="panel"><h2>Calor</h2><ul class="protocol"><li>Priorize sombra e ventilação.</li><li>Evite transformar lona ou plástico fechado em uma estufa.</li><li>Reduza esforço nos horários mais quentes.</li></ul></section>
  <section class="panel"><h2>🔥 Fogo</h2><div class="notice danger">Nunca use fogareiro, carvão, chama ou gerador dentro de abrigo fechado.</div><p>Mantenha materiais inflamáveis afastados e tenha uma forma de apagar o fogo.</p></section>`;
}
function renderKnots(){
  view.innerHTML=`${pageHeader("🪢","Nós e cordas","Consulta para tarefas gerais. Não é treinamento de escalada ou resgate.")}
  <div class="notice warning">Um nó conhecido não transforma uma corda comum em equipamento de segurança de vida.</div>
  <div class="list">${KNOTS.map(k=>`<article class="list-card"><h3>${k.icon} ${k.name}</h3><p><strong>Uso:</strong> ${k.use}</p><div class="meta">⚠️ ${k.warning}</div></article>`).join("")}</div>
  <section class="panel" style="margin-top:12px"><h2>Arquivos locais</h2><p>Na PWA não vou tentar acessar automaticamente seus vídeos e PDFs. Quando transformarmos em APK poderemos adicionar um seletor de arquivo nativo para associar arquivos a cada nó.</p></section>`;
}

function navigationTools(prefix){
  return `<section class="panel"><h2>📍 Minha posição</h2><p>O GPS pode fornecer coordenadas sem internet.</p><button class="btn primary" data-gps="${prefix}">Obter coordenadas</button><div id="${prefix}GpsResult" class="result" hidden></div></section>
  <section class="panel"><h2>Distância e azimute</h2><form id="${prefix}DistanceForm"><div class="form-grid"><div class="field"><label>Latitude A</label><input name="lat1" type="number" step="any" required></div><div class="field"><label>Longitude A</label><input name="lon1" type="number" step="any" required></div><div class="field"><label>Latitude B</label><input name="lat2" type="number" step="any" required></div><div class="field"><label>Longitude B</label><input name="lon2" type="number" step="any" required></div></div><button class="btn primary full" type="submit">Calcular</button><div id="${prefix}DistanceResult" class="result" hidden></div></form></section>
  <section class="panel"><h2>Decimal → DMS</h2><form id="${prefix}DmsForm"><div class="form-grid"><div class="field"><label>Latitude</label><input name="lat" type="number" step="any" min="-90" max="90" required></div><div class="field"><label>Longitude</label><input name="lon" type="number" step="any" min="-180" max="180" required></div></div><button class="btn primary full" type="submit">Converter</button><div id="${prefix}DmsResult" class="result" hidden></div></form></section>`;
}
function renderNavigation(){view.innerHTML=`${pageHeader("🧭","Navegação","Complemento para o MAPS.ME: coordenadas, distância e direção.")}<div class="notice">Use GPS + mapa + observação do terreno. Não dependa de apenas um método.</div>${navigationTools("nav")}`}

function energyTools(prefix){
  return `<section class="panel"><h2>Autonomia da bateria</h2><form id="${prefix}RuntimeForm"><div class="form-grid"><div class="field"><label>Bateria atual (%)</label><input name="battery" type="number" min="0.1" max="100" step="0.1" value="80" required></div><div class="field"><label>Consumo médio (% por hora)</label><input name="drain" type="number" min="0.01" step="0.01" value="5" required></div></div><button class="btn primary full" type="submit">Estimar autonomia</button><div id="${prefix}RuntimeResult" class="result" hidden></div></form></section>
  <section class="panel"><h2>Cargas do power bank</h2><form id="${prefix}PowerForm"><div class="form-grid"><div class="field"><label>Power bank (mAh)</label><input name="pbMah" type="number" min="1" value="20000" required></div><div class="field"><label>Tensão nominal do banco (V)</label><input name="pbV" type="number" min="0.1" step="0.01" value="3.7" required></div><div class="field"><label>Eficiência (%)</label><input name="eff" type="number" min="1" max="100" value="80" required></div><div class="field"><label>Bateria celular (mAh)</label><input name="phoneMah" type="number" min="1" value="5000" required></div><div class="field"><label>Tensão celular (V)</label><input name="phoneV" type="number" min="0.1" step="0.01" value="3.85" required></div></div><button class="btn primary full" type="submit">Estimar cargas</button><div id="${prefix}PowerResult" class="result" hidden></div></form></section>`;
}
function renderEnergy(){
  view.innerHTML=`${pageHeader("🔋","Energia","Planejamento de bateria e power banks.")}
  <section class="panel"><h2>Economia</h2><ul class="protocol"><li>Reduza brilho.</li><li>Use modo economia.</li><li>Use modo avião quando não precisar procurar rede.</li><li>Defina horários de comunicação.</li><li>Evite vídeo, jogos e tarefas pesadas.</li><li>Proteja power banks contra calor e água.</li></ul></section>${energyTools("energy")}
  <div class="notice warning">Estes valores são estimativas. Conversão de tensão, temperatura, cabo, desgaste e outras perdas alteram o resultado.</div>`;
}
function renderCommunication(){
  view.innerHTML=`${pageHeader("📻","Comunicação","Redundância é mais importante que depender de apenas um aplicativo.")}
  <section class="panel"><h2>Plano rápido</h2><ol class="protocol"><li>Defina quem precisa receber informação.</li><li>Informe: quem / onde / condição / próximo passo.</li><li>Defina horários fixos para contato.</li><li>Tenha um ponto de encontro físico.</li></ol></section>
  <section class="panel"><h2>📻 Rádio</h2><p>Mantenha equipamentos, baterias, frequências e canais testados antes da emergência.</p></section>
  <section class="panel"><h2>📡 Meshtastic</h2><p>Pode formar redes locais de mensagens usando dispositivos compatíveis. O alcance depende do terreno, antena, posicionamento e existência de outros nós.</p></section>
  <section class="panel"><h2>💬 Bitchat</h2><p>Comunicação local pode ser útil quando outras pessoas próximas também possuírem a solução configurada. Teste tudo antes de depender dela.</p></section>
  <section class="panel"><h2>Código Morse</h2><p>Reservado para uma versão futura.</p></section>`;
}

function renderChecklist(){
  const items=getChecklist(), completed=items.filter(i=>i.done).length, percent=items.length?Math.round(completed/items.length*100):0;
  view.innerHTML=`${pageHeader("🎒","Checklist","Itens salvos localmente neste aparelho.")}
  <section class="panel"><div class="status-line"><span><strong>${completed}</strong> de <strong>${items.length}</strong> marcados</span><span class="pill">${percent}%</span></div><div class="progress"><span style="width:${percent}%"></span></div></section>
  <section class="panel"><h2>Adicionar item</h2><form id="checklistAddForm"><div class="form-grid"><div class="field"><label>Item</label><input name="text" maxlength="100" placeholder="Ex.: filtro de água" required></div><div class="field"><label>Categoria</label><input name="category" maxlength="60" placeholder="Ex.: Água"></div></div><button class="btn primary full" type="submit">Adicionar</button></form></section>
  <div class="list">${items.length?items.map(i=>`<article class="check-item ${i.done?"done":""}"><input type="checkbox" data-check="${escapeHTML(i.id)}" ${i.done?"checked":""}><div class="check-content"><strong>${escapeHTML(i.text)}</strong><small>${escapeHTML(i.category||"Sem categoria")}</small></div><div class="mini-actions"><button class="mini-button" data-edit-check="${escapeHTML(i.id)}">✎</button><button class="mini-button" data-delete-check="${escapeHTML(i.id)}">🗑</button></div></article>`).join(""):`<div class="empty">Nenhum item.</div>`}</div>`;
}

function renderCalculators(){
  view.innerHTML=`${pageHeader("🧮","Calculadoras","Ferramentas pequenas e totalmente offline.")}
  <section class="panel"><h2>💧 Água</h2>${waterCalculator("calc")}</section>${energyTools("calcEnergy")}
  <section class="panel"><h2>📏 Conversão de unidades</h2><form id="unitForm"><div class="form-grid"><div class="field"><label>Valor</label><input name="value" type="number" step="any" required></div><div class="field"><label>Conversão</label><select name="conversion"><option value="km-mi">km → milhas</option><option value="mi-km">milhas → km</option><option value="m-ft">metros → pés</option><option value="ft-m">pés → metros</option><option value="l-gal">litros → galões US</option><option value="gal-l">galões US → litros</option><option value="c-f">°C → °F</option><option value="f-c">°F → °C</option><option value="kg-lb">kg → lb</option><option value="lb-kg">lb → kg</option></select></div></div><button class="btn primary full" type="submit">Converter</button><div id="unitResult" class="result" hidden></div></form></section>
  ${navigationTools("calcNav")}
  <section class="panel"><h2>🪢 Comprimento de corda</h2><form id="ropeForm"><div class="form-grid"><div class="field"><label>Número de trechos</label><input name="segments" type="number" min="1" value="1" required></div><div class="field"><label>Comprimento por trecho (m)</label><input name="length" type="number" min="0.01" step="0.01" required></div><div class="field"><label>Margem extra (%)</label><input name="margin" type="number" min="0" value="20" required></div><div class="field"><label>Extra para nós (m)</label><input name="extra" type="number" min="0" step="0.01" value="0" required></div></div><button class="btn primary full" type="submit">Estimar</button><div id="ropeResult" class="result" hidden></div></form><div class="notice warning">Esta calculadora mede comprimento. Não calcula resistência, carga segura ou adequação para escalada/resgate.</div></section>`;
}

function renderContacts(){
  const contacts=getContacts();
  view.innerHTML=`${pageHeader("📞","Contatos","Números personalizados armazenados somente neste aparelho.")}
  <section class="panel"><h2>Emergência Brasil</h2>${emergencyCalls()}</section>
  <section class="panel"><h2>Adicionar contato</h2><form id="contactAddForm"><div class="form-grid"><div class="field"><label>Nome</label><input name="name" maxlength="80" required></div><div class="field"><label>Telefone</label><input name="phone" inputmode="tel" maxlength="40" required></div></div><div class="field" style="margin-top:10px"><label>Observação</label><input name="note" maxlength="120" placeholder="Ex.: ponto de encontro"></div><button class="btn primary full" type="submit">Salvar contato</button></form></section>
  <div class="list">${contacts.length?contacts.map(c=>`<article class="list-card contact-card"><div><div class="contact-name">${escapeHTML(c.name)}</div><div class="contact-number">${escapeHTML(c.phone)}</div>${c.note?`<div class="meta">${escapeHTML(c.note)}</div>`:""}<div class="btn-row"><button class="btn" data-edit-contact="${escapeHTML(c.id)}">Editar</button><button class="btn danger" data-delete-contact="${escapeHTML(c.id)}">Excluir</button></div></div><a class="call-circle" href="tel:${escapeHTML(c.phone)}">📞</a></article>`).join(""):`<div class="empty">Nenhum contato personalizado.</div>`}</div>`;
}
function renderMore(){view.innerHTML=`${pageHeader("☰","Mais","Todos os módulos do aplicativo.")}<div class="card-grid">${MODULES.map(i=>navCard(i[0],i[1],i[2],i[3])).join("")}</div>`}
function renderData(){
  const checklist=getChecklist(),contacts=getContacts();
  view.innerHTML=`${pageHeader("💾","Backup e dados","Faça backups porque o armazenamento do navegador pode ser apagado pelo sistema ou pelo usuário.")}
  <section class="panel"><div class="status-line"><span>Checklist</span><span class="pill">${checklist.length} itens</span></div><div class="status-line"><span>Contatos</span><span class="pill">${contacts.length}</span></div><div class="status-line"><span>Nuvem</span><span class="pill">desativada</span></div></section>
  <section class="panel"><h2>Exportar / importar</h2><p>O backup contém apenas checklist e contatos personalizados.</p><div class="btn-row"><button class="btn primary" data-action="export">Exportar</button><button class="btn" data-action="import">Importar</button></div></section>
  <section class="panel"><h2>Limpar dados</h2><p>Restaura o checklist inicial e apaga seus contatos personalizados.</p><button class="btn danger" data-action="clear">Limpar dados locais</button></section>`;
}
function renderSources(){
  view.innerHTML=`${pageHeader("📚","Fontes e limites","Protocolos oficiais e orientação profissional têm prioridade.")}
  <section class="panel"><h2>Fontes principais</h2><ul class="protocol"><li>Ministério da Saúde — SAMU 192.</li><li>Ministério da Saúde / Biblioteca Virtual em Saúde — primeiros socorros.</li><li>Ministério da Saúde e Instituto Butantan — acidentes com serpentes.</li><li>Ministério da Saúde — cuidados com água.</li><li>ANATEL — números de emergência.</li><li>Defesa Civil — emergências e telefone 199.</li></ul></section>
  <section class="panel"><h2>Limites</h2><ul class="protocol"><li>Não substitui profissional de saúde ou serviço de emergência.</li><li>Não calcula doses químicas para água.</li><li>Não certifica nós, cordas ou ancoragens.</li><li>GPS fornece coordenadas; MAPS.ME continua sendo responsável pelo mapa.</li><li>Cálculos de energia são estimativas.</li></ul></section>`;
}

function renderView(name){
  const map={home:renderHome,emergencias:renderEmergencies,agua:renderWater,abrigo:renderShelter,nos:renderKnots,navegacao:renderNavigation,energia:renderEnergy,comunicacao:renderCommunication,checklist:renderChecklist,calculadoras:renderCalculators,contatos:renderContacts,dados:renderData,fontes:renderSources,mais:renderMore};
  (map[name]||renderHome)();
  const morePages=["agua","abrigo","nos","navegacao","energia","comunicacao","contatos","dados","fontes"];
  document.querySelectorAll(".nav-button").forEach(b=>b.classList.toggle("active",b.dataset.nav===name||(b.dataset.nav==="mais"&&morePages.includes(name))));
  window.scrollTo(0,0);
}

const radians=v=>v*Math.PI/180, degrees=v=>v*180/Math.PI;
function distanceBearing(lat1,lon1,lat2,lon2){
  const R=6371.0088,p1=radians(lat1),p2=radians(lat2),dLat=radians(lat2-lat1),dLon=radians(lon2-lon1);
  const a=Math.sin(dLat/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dLon/2)**2;
  const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  const y=Math.sin(dLon)*Math.cos(p2),x=Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dLon);
  return {distance:R*c,bearing:(degrees(Math.atan2(y,x))+360)%360};
}
function decimalToDMS(value,latitude){
  const absolute=Math.abs(value),d=Math.floor(absolute),fullMinutes=(absolute-d)*60,m=Math.floor(fullMinutes),s=(fullMinutes-m)*60;
  const direction=latitude?(value>=0?"N":"S"):(value>=0?"E":"W");
  return `${d}° ${m}' ${s.toFixed(2)}" ${direction}`;
}
function getGPS(prefix){
  const result=document.getElementById(prefix+"GpsResult");result.hidden=false;result.innerHTML="<small>Obtendo posição...</small>";
  if(!navigator.geolocation){result.innerHTML="<strong>GPS indisponível.</strong>";return}
  navigator.geolocation.getCurrentPosition(pos=>{
    const lat=pos.coords.latitude,lon=pos.coords.longitude,accuracy=pos.coords.accuracy,text=`${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    result.innerHTML=`<strong class="coord">${text}</strong><small>Precisão informada: ±${Math.round(accuracy)} m</small><button class="btn" data-copy="${text}">Copiar</button>`;
  },error=>{
    const errors={1:"Permissão de localização negada.",2:"Posição indisponível.",3:"Tempo limite para obter localização."};
    result.innerHTML=`<strong>Não foi possível obter a posição.</strong><small>${errors[error.code]||error.message}</small>`;
  },{enableHighAccuracy:true,timeout:15000,maximumAge:30000});
}
async function copyText(text){try{await navigator.clipboard.writeText(text);showToast("Coordenadas copiadas")}catch{showToast("Não foi possível copiar")}}
function calculateWater(form,resultId){
  const d=new FormData(form),people=Number(d.get("people")),days=Number(d.get("days")),liters=Number(d.get("liters")),reserve=Number(d.get("reserve")),base=people*days*liters,total=base*(1+reserve/100),r=document.getElementById(resultId);
  r.hidden=false;r.innerHTML=`<strong>${total.toFixed(1)} L</strong><small>Base: ${base.toFixed(1)} L + ${reserve}% de reserva.</small>`;
}
function calculateRuntime(form,resultId){
  const d=new FormData(form),battery=Number(d.get("battery")),drain=Number(d.get("drain")),time=battery/drain,h=Math.floor(time),m=Math.round((time-h)*60),r=document.getElementById(resultId);
  r.hidden=false;r.innerHTML=`<strong>≈ ${h} h ${m} min</strong><small>Supondo consumo médio constante de ${drain}% por hora.</small>`;
}
function calculatePower(form,resultId){
  const d=new FormData(form),pbMah=Number(d.get("pbMah")),pbV=Number(d.get("pbV")),eff=Number(d.get("eff"))/100,phoneMah=Number(d.get("phoneMah")),phoneV=Number(d.get("phoneV"));
  const powerWh=pbMah*pbV/1000,usableWh=powerWh*eff,phoneWh=phoneMah*phoneV/1000,charges=usableWh/phoneWh,r=document.getElementById(resultId);
  r.hidden=false;r.innerHTML=`<strong>≈ ${charges.toFixed(2)} cargas completas</strong><small>Banco: ${powerWh.toFixed(1)} Wh. Energia utilizável estimada: ${usableWh.toFixed(1)} Wh.</small>`;
}
function calculateDistance(form,prefix){
  const d=new FormData(form),lat1=Number(d.get("lat1")),lon1=Number(d.get("lon1")),lat2=Number(d.get("lat2")),lon2=Number(d.get("lon2"));
  if(lat1<-90||lat1>90||lat2<-90||lat2>90||lon1<-180||lon1>180||lon2<-180||lon2>180){showToast("Coordenada inválida");return}
  const a=distanceBearing(lat1,lon1,lat2,lon2),r=document.getElementById(prefix+"DistanceResult");r.hidden=false;r.innerHTML=`<strong>${a.distance.toFixed(3)} km</strong><small>Azimute inicial: ${a.bearing.toFixed(1)}° · distância em linha geodésica, não por estrada.</small>`;
}
function calculateDMS(form,prefix){
  const d=new FormData(form),lat=Number(d.get("lat")),lon=Number(d.get("lon")),r=document.getElementById(prefix+"DmsResult");r.hidden=false;r.innerHTML=`<strong class="coord">${decimalToDMS(lat,true)}</strong><small class="coord">${decimalToDMS(lon,false)}</small>`;
}
function calculateUnit(form){
  const d=new FormData(form),value=Number(d.get("value")),type=d.get("conversion");let answer=0,unit="";
  switch(type){case"km-mi":answer=value*.6213711922;unit="mi";break;case"mi-km":answer=value/.6213711922;unit="km";break;case"m-ft":answer=value*3.280839895;unit="ft";break;case"ft-m":answer=value/3.280839895;unit="m";break;case"l-gal":answer=value*.2641720524;unit="gal US";break;case"gal-l":answer=value/.2641720524;unit="L";break;case"c-f":answer=value*9/5+32;unit="°F";break;case"f-c":answer=(value-32)*5/9;unit="°C";break;case"kg-lb":answer=value*2.2046226218;unit="lb";break;case"lb-kg":answer=value/2.2046226218;unit="kg";break}
  const r=document.getElementById("unitResult");r.hidden=false;r.innerHTML=`<strong>${answer.toFixed(3)} ${unit}</strong>`;
}
function calculateRope(form){
  const d=new FormData(form),segments=Number(d.get("segments")),length=Number(d.get("length")),margin=Number(d.get("margin")),extra=Number(d.get("extra")),base=segments*length,total=base*(1+margin/100)+extra,r=document.getElementById("ropeResult");
  r.hidden=false;r.innerHTML=`<strong>${total.toFixed(2)} m</strong><small>Base: ${base.toFixed(2)} m · margem: ${margin}% · extra: ${extra.toFixed(2)} m.</small>`;
}

function editChecklist(id){
  const item=getChecklist().find(i=>i.id===id);if(!item)return;
  openModal("Editar item",`<form id="checklistEditForm" data-id="${escapeHTML(id)}"><div class="field"><label>Item</label><input name="text" maxlength="100" value="${escapeHTML(item.text)}" required></div><div class="field" style="margin-top:10px"><label>Categoria</label><input name="category" maxlength="60" value="${escapeHTML(item.category||"")}"></div><button class="btn primary full" type="submit">Salvar</button></form>`);
}
function editContact(id){
  const c=getContacts().find(i=>i.id===id);if(!c)return;
  openModal("Editar contato",`<form id="contactEditForm" data-id="${escapeHTML(id)}"><div class="field"><label>Nome</label><input name="name" value="${escapeHTML(c.name)}" required></div><div class="field" style="margin-top:10px"><label>Telefone</label><input name="phone" value="${escapeHTML(c.phone)}" required></div><div class="field" style="margin-top:10px"><label>Observação</label><input name="note" value="${escapeHTML(c.note||"")}"></div><button class="btn primary full" type="submit">Salvar</button></form>`);
}
function exportBackup(){
  const backup={app:"Sobrevivência Offline",version:1,created:new Date().toISOString(),checklist:getChecklist(),contacts:getContacts()};
  const blob=new Blob([JSON.stringify(backup,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),link=document.createElement("a");
  link.href=url;link.download="sobrevivencia-backup-"+new Date().toISOString().slice(0,10)+".json";document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);showToast("Backup exportado");
}
async function importBackup(file){
  try{
    const backup=JSON.parse(await file.text());
    if(!Array.isArray(backup.checklist)||!Array.isArray(backup.contacts))throw new Error();
    if(!confirm("Substituir checklist e contatos atuais pelo backup?"))return;
    saveJSON(STORAGE.checklist,backup.checklist);saveJSON(STORAGE.contacts,backup.contacts);showToast("Backup importado");renderView("dados");
  }catch{showToast("Não foi possível importar o backup")}finally{importInput.value=""}
}
function clearData(){
  if(!confirm("Apagar checklist e contatos personalizados?"))return;
  localStorage.removeItem(STORAGE.checklist);localStorage.removeItem(STORAGE.contacts);getChecklist();showToast("Dados restaurados");renderView("dados");
}
function searchDatabase(){
  const emergencies=EMERGENCIES.map(i=>({type:"emergency",id:i.id,icon:i.icon,title:i.title,description:i.summary,keywords:(i.title+" "+i.summary+" "+i.steps.join(" ")+" "+i.dont.join(" ")).toLowerCase()}));
  const modules=MODULES.map(i=>({type:"view",id:i[0],icon:i[1],title:i[2],description:i[3],keywords:(i[2]+" "+i[3]).toLowerCase()}));
  return [...emergencies,...modules,{type:"view",id:"checklist",icon:"🎒",title:"Checklist",description:"Itens e kit",keywords:"checklist mochila kit preparo"},{type:"view",id:"calculadoras",icon:"🧮",title:"Calculadoras",description:"Água, energia, GPS e unidades",keywords:"calculadora água energia bateria gps coordenadas corda unidades"}];
}
function search(query){
  const box=document.getElementById("searchResults");if(!box)return;const text=query.trim().toLowerCase();if(!text){box.innerHTML="";return}
  const results=searchDatabase().filter(i=>i.keywords.includes(text)).slice(0,8);
  box.innerHTML=results.length?results.map(i=>`<button class="search-result" data-search-type="${i.type}" data-search-id="${i.id}">${i.icon} <strong>${i.title}</strong><small>${i.description}</small></button>`).join(""):`<div class="empty">Nenhum resultado local.</div>`;
}

view.addEventListener("click",event=>{
  const navigation=event.target.closest("[data-nav]");if(navigation){renderView(navigation.dataset.nav);return}
  const emergency=event.target.closest("[data-emergency]");if(emergency){showEmergency(emergency.dataset.emergency);return}
  const result=event.target.closest("[data-search-type]");if(result){result.dataset.searchType==="emergency"?showEmergency(result.dataset.searchId):renderView(result.dataset.searchId);return}
  const gps=event.target.closest("[data-gps]");if(gps){getGPS(gps.dataset.gps);return}
  const copy=event.target.closest("[data-copy]");if(copy){copyText(copy.dataset.copy);return}
  const editCheck=event.target.closest("[data-edit-check]");if(editCheck){editChecklist(editCheck.dataset.editCheck);return}
  const deleteCheck=event.target.closest("[data-delete-check]");if(deleteCheck){const id=deleteCheck.dataset.deleteCheck;if(confirm("Excluir este item?")){saveJSON(STORAGE.checklist,getChecklist().filter(i=>i.id!==id));renderChecklist()}return}
  const editContactButton=event.target.closest("[data-edit-contact]");if(editContactButton){editContact(editContactButton.dataset.editContact);return}
  const deleteContactButton=event.target.closest("[data-delete-contact]");if(deleteContactButton){const id=deleteContactButton.dataset.deleteContact;if(confirm("Excluir este contato?")){saveJSON(STORAGE.contacts,getContacts().filter(i=>i.id!==id));renderContacts()}return}
  const action=event.target.closest("[data-action]");if(action){if(action.dataset.action==="export")exportBackup();if(action.dataset.action==="import")importInput.click();if(action.dataset.action==="clear")clearData()}
});
view.addEventListener("input",event=>{if(event.target.id==="globalSearch")search(event.target.value)});
view.addEventListener("change",event=>{const checkbox=event.target.closest("[data-check]");if(!checkbox)return;const items=getChecklist(),item=items.find(i=>i.id===checkbox.dataset.check);if(!item)return;item.done=checkbox.checked;saveJSON(STORAGE.checklist,items);renderChecklist()});
view.addEventListener("submit",event=>{
  event.preventDefault();const form=event.target;
  if(form.id==="checklistAddForm"){const d=new FormData(form),items=getChecklist();items.push({id:uid("check"),text:String(d.get("text")).trim(),category:String(d.get("category")).trim(),done:false});saveJSON(STORAGE.checklist,items);renderChecklist();showToast("Item adicionado");return}
  if(form.id==="contactAddForm"){const d=new FormData(form),contacts=getContacts();contacts.push({id:uid("contact"),name:String(d.get("name")).trim(),phone:String(d.get("phone")).trim(),note:String(d.get("note")).trim()});saveJSON(STORAGE.contacts,contacts);renderContacts();showToast("Contato salvo");return}
  if(form.id==="mainWaterForm")return calculateWater(form,"mainWaterResult");
  if(form.id==="calcWaterForm")return calculateWater(form,"calcWaterResult");
  if(form.id==="energyRuntimeForm")return calculateRuntime(form,"energyRuntimeResult");
  if(form.id==="calcEnergyRuntimeForm")return calculateRuntime(form,"calcEnergyRuntimeResult");
  if(form.id==="energyPowerForm")return calculatePower(form,"energyPowerResult");
  if(form.id==="calcEnergyPowerForm")return calculatePower(form,"calcEnergyPowerResult");
  if(form.id==="navDistanceForm")return calculateDistance(form,"nav");
  if(form.id==="calcNavDistanceForm")return calculateDistance(form,"calcNav");
  if(form.id==="navDmsForm")return calculateDMS(form,"nav");
  if(form.id==="calcNavDmsForm")return calculateDMS(form,"calcNav");
  if(form.id==="unitForm")return calculateUnit(form);
  if(form.id==="ropeForm")return calculateRope(form);
});
modal.addEventListener("click",event=>{if(event.target.closest("[data-close-modal]"))closeModal()});
modal.addEventListener("submit",event=>{
  event.preventDefault();const form=event.target;
  if(form.id==="checklistEditForm"){const d=new FormData(form),items=getChecklist(),item=items.find(i=>i.id===form.dataset.id);if(item){item.text=String(d.get("text")).trim();item.category=String(d.get("category")).trim();saveJSON(STORAGE.checklist,items)}closeModal();renderChecklist();showToast("Item atualizado")}
  if(form.id==="contactEditForm"){const d=new FormData(form),contacts=getContacts(),c=contacts.find(i=>i.id===form.dataset.id);if(c){c.name=String(d.get("name")).trim();c.phone=String(d.get("phone")).trim();c.note=String(d.get("note")).trim();saveJSON(STORAGE.contacts,contacts)}closeModal();renderContacts();showToast("Contato atualizado")}
});
document.querySelector(".bottom-nav").addEventListener("click",event=>{const b=event.target.closest("[data-nav]");if(b)renderView(b.dataset.nav)});
document.getElementById("homeButton").addEventListener("click",()=>renderView("home"));
importInput.addEventListener("change",()=>{const file=importInput.files?.[0];if(file)importBackup(file)});

function updateConnection(){
  if(navigator.onLine){networkStatus.textContent="● online · offline preparado";networkStatus.className="online"}
  else{networkStatus.textContent="● offline · usando cache";networkStatus.className="offline"}
}
window.addEventListener("online",updateConnection);
window.addEventListener("offline",updateConnection);
window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();installPrompt=event;installButton.hidden=false});
installButton.addEventListener("click",async()=>{if(!installPrompt){showToast("Use o menu do navegador para instalar");return}installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;installButton.hidden=true});
window.addEventListener("appinstalled",()=>{installPrompt=null;installButton.hidden=true;showToast("Aplicativo instalado")});
async function registerServiceWorker(){if(!("serviceWorker" in navigator))return;try{await navigator.serviceWorker.register("./service-worker.js",{scope:"./"})}catch(error){console.error("Erro no Service Worker:",error)}}

getChecklist();
updateConnection();
renderView("home");
registerServiceWorker();
