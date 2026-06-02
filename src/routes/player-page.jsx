import { useGameContext } from '@feature/game/context/game-context'; // Ajuste o caminho do seu context se necessário
import { PlayerRegisterForm } from '@feature/game/components/player-register-form'; // Ajuste o caminho do seu formulário
import { Typography } from '@ui/text/typography';
import { cn } from '@core/helpers';
import { useState } from 'react';

export function PlayerPage() {
  const { player, setPlayer } = useGameContext();
  const [copiado, setCopiado] = useState(false);

  // Função para deslogar / trocar de jogador
  function handleDesconectar() {
    setPlayer(null); // Limpa o jogador do contexto e volta para o formulário
  }

  // Função para copiar o Token para a área de transferência
  function handleCopiarToken() {
    if (player?.player_access_token) {
      navigator.clipboard.writeText(player.player_access_token);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000); // Reseta o texto após 2 segundos
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full text-white flex-1 animate-fade-in">
      {/* Título da Página de Ponta a Ponta */}
      <div className="flex justify-between items-center border-b border-purple-500/10 pb-4 w-full">
        <Typography
          variant={'h1'}
          asTag={'h1'}
          className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent"
        >
          Perfil do Jogador (IA)
        </Typography>
        <span
          className={cn(
            'text-xs border px-3 py-1 rounded-full font-mono font-bold transition-all',
            player?.player_access_token
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          )}
        >
          {player?.player_access_token ? '● AUTENTICADO' : '○ DESCONECTADO'}
        </span>
      </div>

      {/* CASO 1: SE O JOGADOR JÁ ESTÁ CONECTADO (Mostra o card gigante igual a Home) */}
      {player?.player_access_token ? (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto mt-4">
          {/* CARD DE IDENTIDADE DO JOGADOR (ESTILO HOME) */}
          <div className="bg-zinc-950/40 border border-purple-500/20 p-6 w-full rounded-2xl shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between backdrop-blur-md">
            {/* Bloco Esquerdo: Avatar e Nome */}
            <div className="flex items-center gap-5 w-full md:w-auto">
              <img
                src={
                  player?.ai_player_avatar ||
                  'https://api.dicebear.com/7.x/bottts/svg?seed=quma'
                }
                alt="Avatar do Jogador"
                className="w-20 h-20 rounded-xl border-2 border-purple-500 p-0.5 bg-zinc-900 object-cover flex-shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                  {player?.group_name || 'Grupo Sem Nome'}
                </span>
                <h2 className="text-2xl font-black text-zinc-100 tracking-wide mt-0.5">
                  {player?.ai_player_name}
                </h2>
                <p className="text-xs text-zinc-400 italic max-w-md mt-1">
                  &ldquo;
                  {player?.ai_player_description ||
                    'Nenhuma descrição fornecida para este mestre de IA.'}
                  &rdquo;
                </p>
              </div>
            </div>

            {/* Bloco Central: Painel de Endpoints/Dados Táticos */}
            <div className="flex-1 flex flex-col gap-2 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/60 w-full md:max-w-md font-mono text-xs">
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span className="text-zinc-500">API Endpoint:</span>
                <span
                  className="text-purple-300 truncate max-w-[240px]"
                  title={player?.ai_player_move_endpoint}
                >
                  {player?.ai_player_move_endpoint}
                </span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-zinc-500">Identificador Interno:</span>
                <span className="text-zinc-400">
                  #{player?.id?.slice(0, 8) || 'N/A'}
                </span>
              </div>
            </div>

            {/* Bloco Direito: Botão de Ação de Desconexão */}
            <div className="w-full md:w-auto flex flex-col gap-2">
              <button
                onClick={handleDesconectar}
                className="px-5 py-2.5 bg-zinc-800 text-red-400 border border-zinc-700/80 hover:bg-red-950/20 hover:border-red-500/30 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 block text-center min-w-[140px]"
              >
                Trocar Jogador
              </button>
            </div>
          </div>

          {/* PAINEL SEGREDO DO TOKEN (Abaixo do card para copiar fácil) */}
          <div className="bg-purple-950/10 border border-purple-500/20 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                🔑 Chave de Acesso da Arena (Token)
              </span>
              <p className="text-sm font-bold text-zinc-300 truncate max-w-lg select-all">
                {player?.player_access_token}
              </p>
            </div>
            <button
              onClick={handleCopiarToken}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-bold font-sans transition-all duration-200 shadow-md flex-shrink-0 w-full sm:w-auto',
                copiado
                  ? 'bg-green-600 text-white'
                  : 'bg-purple-600 text-white hover:bg-purple-500 active:scale-95'
              )}
            >
              {copiado ? '✓ Copiado!' : '📋 Copiar Token'}
            </button>
          </div>
        </div>
      ) : (
        /* CASO 2: SE NÃO ESTÁ LOGADO (Exibe o formulário de cadastro expandido) */
        <div className="mt-4">
          <PlayerRegisterForm />
        </div>
      )}
    </div>
  );
}
