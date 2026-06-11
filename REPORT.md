# Relatório de Decisões Arquiteturais e Componentização - QumAI Viewer

Este relatório detalha as motivações técnicas, escolhas de design e engenharia de componentes adotadas no desenvolvimento do ecossistema frontend da **QumAI**, em estrita conformidade com os requisitos avaliados da disciplina de Projeto Integrador V.

---

##  1. Motivação das Decisões de Design e UI/UX

A interface foi projetada sob o paradigma de **Dashboard de Alta Performance**, visto que o monitoramento de uma arena de inteligência artificial exige a leitura instantânea de dados voláteis.

* **Abordagem de Cores e Contraste:** Optamos por uma interface baseada em *Dark Mode* profundo com acentos em roxo e fuchsia de alta intensidade. Essa escolha mitiga a fadiga visual durante longas sessões de testes e destaca de forma imediata o status crítico das partidas (ex: tags pulsantes para conexões de Socket e realces dourados para blocos de nível 4 formados).
* **Escalabilidade Tipográfica:** Refatoramos a exibição dos nicks dos jogadores e IDs para `text-xl font-black`. A motivação foi puramente ergonômica: permitir que o painel de visualização seja legível à distância quando projetado ou exibido em telas menores dentro do ambiente de sala de aula do torneio.

---

##  2. Arquitetura e Montagem dos Componentes

A divisão de diretórios foi estruturada para isolar o estado global de renderizações locais e garantir que a aplicação permaneça leve:

###  O Módulo de Jogo (`/src/feature/game`)
Esta é a feature mais crítica do sistema e sua montagem foi dividida em três subcomponentes isolados:
* **Grid do Tabuleiro (Matriz 5x5):** Montado utilizando CSS Grid dinâmico que mapeia o array `gameState.board`. Cada célula foi isolada logicamente com travas de renderização condicional. A motivação foi performance: evitar que a movimentação de um professor force o tabuleiro inteiro a recalcular seus estilos.
* **Cards de Placar e Identificação:** Localizados no topo da arena, esses componentes utilizam funções extratoras flexíveis capazes de ler dados brutos em formato de objeto ou string pura, adaptando o layout dinamicamente para mostrar o nome ou o ID do jogador (UUID) sem estourar o limite de blocos da tela.
* **Painel de Histórico de Ações (Sidebar):** Posicionado de forma independente na lateral direita, possui um container com rolagem isolada (`scrollbar-thin`). Isso garante que a rolagem contínua dos logs de jogadas não interfira na visualização estática do mapa.

###  Roteamento e UI Primitiva (`/src/routes` e `/src/ui`)
* **Uso do React Router DOM:** Implementamos o roteamento centralizado para separar as responsabilidades da aplicação. Usamos o hook `useNavigate` para permitir uma transição suave entre a listagem de jogos (Home) e os detalhes avançados da partida, sem causar recargas de página (*Single Page Application*).
* **Componentes Primitivos (`/src/ui`):** Elementos como o `<Typography />` foram criados para centralizar as regras de estilo de texto, garantindo que qualquer alteração de fonte ou peso reflita instantaneamente em todo o sistema.

---

##  3. Engenharia de Soluções dos Requisitos Mínimos

Para cumprir as metas obrigatórias de entrega, desenvolvemos soluções de engenharia específicas para cada requisito:

### Inserção e Persistência do Access Token (`localStorage`)
No painel de gerenciamento do jogador, o token JWT gerado pela API do professor é interceptado e gravado diretamente no `localStorage` do navegador. A motivação para essa abordagem foi blindar a sessão do usuário: caso a internet caia ou a página seja atualizada no meio de um embate, os hooks de autenticação resgatam o token do armazenamento local automaticamente, mantendo a conexão com as rotas protegidas ativa.

### Listagem e Detalhes de Partidas Finalizadas
* A página principal consome os endpoints HTTP para renderizar a lista de jogos ativos.
* Através de uma verificação reativa do status (`status === 'FINISHED'`), o sistema altera os estilos do card para tons avermelhados de encerramento e renderiza o botão "Ver Detalhes da Partida", encaminhando o espectador para a rota de auditoria final daquela partida específica.

###  Tela de Espectador em Tempo Real (Arquitetura Híbrida)
O maior desafio técnico do frontend foi garantir que a tela atualizasse "no meio do tempo" sem congelar. Solucionamos isso integrando duas fontes de dados:
1. **Conexão por Sockets:** O componente escuta o stream ao vivo do WebSocket para mover as peças e atualizar a numeração dos anos no tabuleiro instantaneamente a cada segundo de turno.
2. **Fallback Sincronizado por HTTP:** Sabendo que servidores de campeonato sofrem gargalos ou bloqueios de Sockets, implementamos uma chamada HTTP secundária periódica. Se a rota principal de jogadas falhar, o código engole o erro de forma silenciosa e puxa o histórico de logs através do endpoint de turnos (`/turns`) ou movimentos (`/moves`) do Swagger, garantindo que o contador totalizador de ações nunca fique zerado e a tela continue atualizando dinamicamente.
