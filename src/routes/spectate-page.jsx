import { useState } from 'react';
import { useParams } from 'react-router';
import { cn } from '@core/helpers';
import { Typography } from '@ui/text/typography';

export function SpectatePage() {
  const { gameId } = useParams();
  const [isRegistered, setIsRegistered] = useState(false); // Simulação de controle de registro
  const [nome, setNome] = useState('Meu Espectador');
  const [avatar, setAvatar] = useState('https://example.com/avatar.png');

  function handleRegister(e) {
    e.preventDefault();
    // Aqui vai a sua chamada real: registerSpectator(gameId, { name, avatar })
    setIsRegistered(true);
  }

  // CASO AINDA NÃO SEJA ESPECTADOR: Mostra o formulário idêntico ao de Jogador (Largo e imponente)
  if (!isRegistered) {
    return (
      <div className="flex flex-col gap-6 w-full text-white flex-1 animate-fade-in">
        {/* Topo da página */}
        <div className="flex justify-between items-center border-b border-purple-500/10 pb-4 w-full">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
              Modo Transmissão
            </span>
            <Typography
              variant={'h1'}
              asTag={'h1'}
              className="text-2xl font-black text-zinc-100 tracking-wide mt-0.5"
            >
              Arena #{gameId?.slice(0, 8) || gameId}
            </Typography>
          </div>
          <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full font-mono font-bold animate-pulse">
            🌐 Aguardando Entrada
          </span>
        </div>

        {/* Formulário Estilizado de Ponta a Ponta */}
        <div className="bg-zinc-950/40 border border-purple-500/10 p-8 rounded-2xl max-w-4xl w-full mx-auto shadow-xl backdrop-blur-md mt-4">
          <div className="mb-6 border-b border-zinc-800/50 pb-4">
            <h2 className="text-lg font-bold text-zinc-100">
              Registro de Espectador
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Para assistir e analisar este confronto tático de IA em tempo
              real, identifique-se na secretaria da arena.
            </p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  Nome do Espectador
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="border border-zinc-800 bg-zinc-950/80 rounded-lg px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none text-zinc-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  URL do seu Avatar (Foto)
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="border border-zinc-800 bg-zinc-950/80 rounded-lg px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none text-zinc-200 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 px-5 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-bold tracking-wide rounded-xl hover:brightness-110 shadow-[0_4px_12px_rgba(168,85,247,0.2)] transition-all active:scale-[0.99]"
            >
              📺 Conectar e Transmitir Partida
            </button>
          </form>
        </div>
      </div>
    );
  }

  // CASO JÁ ESTEJA CONECTADO: Renderiza o Tabuleiro e a Telemetria Lateral abaixo
  return <GameArenaView gameId={gameId} />;
}
