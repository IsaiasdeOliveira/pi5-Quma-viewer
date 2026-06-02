import { useGameContext } from '../context/game-context';
import { useGameSocket } from '../hooks/useGameSocket';
import { Typography } from '@ui/text/typography';
import { cn } from '@core/helpers';

export function ViewGame({ gameId }) {
  const { spectator } = useGameContext();
  const { connected, gameState } = useGameSocket(
    gameId,
    spectator?.[gameId]?.spectator_access_token || null
  );

  // Mapeando os jogadores reais que vêm de dentro do gameState do Socket
  const turingPlayer = gameState?.turing_player;
  const lovelacePlayer = gameState?.lovelace_player;
  const statusPartida = gameState?.status || 'AGUARDANDO';
  const turnoAtual = gameState?.current_turn_number || 0;
  const timeDaVez = gameState?.current_turn_team_id; // 1 para Turing, 2 para Lovelace

  return (
    <div
      className={cn(
        'flex flex-col gap-4 py-4 w-full text-white flex-1 animate-fade-in bg-zinc-900'
      )}
    >
      {/* 1. CABEÇALHO DA ARENA AO VIVO */}
      <div className="flex justify-between items-center border-b border-purple-500/10 pb-4 w-full px-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
            Transmissão Oficial Via WebSockets
          </span>
          <Typography
            variant={'h1'}
            asTag={'h1'}
            className="text-2xl font-black text-zinc-100 tracking-wide mt-0.5"
          >
            Arena #{gameId?.slice(0, 8) || gameId}
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          {/* Status da Conexão do Socket */}
          <span
            className={cn(
              'px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider border',
              connected
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse'
            )}
          >
            {connected ? '🛰️ SOCKET CONECTADO' : '⚠️ RECONECTANDO...'}
          </span>

          {/* Status da Partida */}
          <span
            className={cn(
              'px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider border uppercase',
              statusPartida === 'RUNNING'
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 animate-pulse'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            )}
          >
            ● {statusPartida === 'RUNNING' ? 'AO VIVO' : statusPartida}
          </span>
        </div>
      </div>

      {/* 2. LAYOUT EM DUAS COLUNAS (TABULEIRO VS TELEMETRIA) */}
      <div className="flex flex-col lg:flex-row gap-6 w-full flex-1 mt-2">
        {/* COLUNA ESQUERDA: O SEU TABULEIRO ADAPTADO PARA O TEMA ESCURO */}
        <div className="flex-1 flex flex-col gap-4 bg-zinc-950/40 border border-purple-500/10 p-6 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-sm tracking-wide text-zinc-300 font-mono">
              🏫 MONITOR DE SALAS DE AULA
            </h3>
            <span className="text-[11px] text-fuchsia-400 font-mono font-bold">
              Turno Atual: #{turnoAtual}
            </span>
          </div>

          {!gameState?.board ? (
            <div className="flex-1 min-h-[350px] bg-zinc-950/40 rounded-xl border border-zinc-900 flex items-center justify-center text-zinc-500 font-mono text-xs italic">
              Aguardando primeira sincronização da matriz...
            </div>
          ) : (
            /* Renderização dinâmica da sua matriz 5x5 */
            <div className="grid grid-cols-5 gap-3 bg-zinc-950/60 rounded-xl p-4 border border-zinc-900">
              {gameState?.board?.map((row) => {
                return row?.map((cell, c) => {
                  const hasProfessor = !!cell?.professor;
                  const isLevel4 = cell?.level === 4;

                  return (
                    <div
                      key={c}
                      className={cn(
                        'border p-3 rounded-xl flex flex-col gap-2 items-center justify-center transition-all duration-300 min-h-[85px]',
                        'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700',
                        {
                          'border-purple-500/20 bg-purple-950/5':
                            cell?.level === 1,
                          'border-purple-500/40 bg-purple-950/10':
                            cell?.level === 2,
                          'border-fuchsia-500/40 bg-fuchsia-950/20':
                            cell?.level === 3,
                          'border-amber-500 bg-amber-500/10 shadow-[inset_0_0_10px_rgba(245,158,11,0.2)]':
                            isLevel4,
                        }
                      )}
                    >
                      <span
                        className={cn(
                          'text-[9px] font-bold px-1.5 py-0.5 rounded font-mono',
                          isLevel4
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-zinc-800 text-zinc-400'
                        )}
                      >
                        {isLevel4 ? '🎓 Graduada' : `${cell?.level || 0}º Ano`}
                      </span>

                      {hasProfessor && (
                        <span className="text-[10px] font-bold truncate max-w-full text-purple-300 bg-zinc-900 px-2 py-0.5 rounded border border-purple-500/20">
                          👨‍🏫 {cell?.professor}
                        </span>
                      )}
                    </div>
                  );
                });
              })}
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: PAINEL DE TELEMETRIA LATERAL COM NOMES REAIS */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          {/* CARD DE QUEM ESTÁ JOGANDO (DINÂMICO) */}
          <div className="bg-zinc-950/40 border border-purple-500/10 p-4 rounded-2xl backdrop-blur-md">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2.5">
              ⚡ Controle de Rodada
            </span>

            <div className="flex flex-col gap-2">
              {/* JOGADOR TURING */}
              <div
                className={cn(
                  'p-2.5 rounded-xl border transition-all text-xs flex justify-between items-center font-mono',
                  timeDaVez === 1
                    ? 'bg-purple-950/30 border-purple-500 text-purple-300 font-bold'
                    : 'bg-zinc-900/20 border-zinc-900 opacity-40'
                )}
              >
                <span className="truncate max-w-[150px]">
                  🤖 {turingPlayer?.ai_player_name || 'Turing Bot'}
                </span>
                {timeDaVez === 1 && (
                  <span className="animate-pulse text-[9px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-400 border border-purple-500/30">
                    Pensando
                  </span>
                )}
              </div>

              {/* JOGADOR LOVELACE (Mostra Renan Cláudio, Claudinho, etc. conforme entrarem) */}
              <div
                className={cn(
                  'p-2.5 rounded-xl border transition-all text-xs flex justify-between items-center font-mono',
                  timeDaVez === 2
                    ? 'bg-fuchsia-950/30 border-fuchsia-500 text-fuchsia-300 font-bold'
                    : 'bg-zinc-900/20 border-zinc-900 opacity-40'
                )}
              >
                <span className="truncate max-w-[150px]">
                  🧠 {lovelacePlayer?.ai_player_name || 'Aguardando Rival...'}
                </span>
                {timeDaVez === 2 && (
                  <span className="animate-pulse text-[9px] bg-fuchsia-500/20 px-1.5 py-0.5 rounded text-fuchsia-400 border border-fuchsia-500/30">
                    Pensando
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* HISTÓRICO DE MOVIMENTOS EM TEMPO REAL (Mapeado do array da API) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl min-h-[220px]">
            <div className="border-b border-zinc-800 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
                Histórico de Ações
              </span>
              <span className="text-[9px] text-zinc-600 font-mono">
                FEED LIVE
              </span>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-[10px] flex flex-col gap-2 max-h-56 pr-1">
              {/* Se o seu gameState tiver logs ou histórico, mapeamos aqui. Caso não venha ainda, deixamos o feed ativo */}
              {gameState?.logs?.length > 0 ? (
                gameState.logs.map((log, index) => (
                  <div
                    key={index}
                    className="border-b border-zinc-900 pb-1.5 last:border-none"
                  >
                    <span className="text-purple-400 font-bold">
                      [T#{log.turno}]
                    </span>{' '}
                    <span className="text-zinc-300 font-semibold">
                      {log.jogador}:
                    </span>{' '}
                    <span className="text-zinc-400">{log.acao}</span>
                  </div>
                ))
              ) : (
                <div className="text-[10px] text-zinc-600 italic py-2">
                  Nenhum movimento registrado neste turno ainda...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
