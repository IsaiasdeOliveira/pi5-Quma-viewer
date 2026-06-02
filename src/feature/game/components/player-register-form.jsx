import { Controller, useForm } from 'react-hook-form';
import { registerPlayer } from '../api';
import { cn } from '@core/helpers';
import { useGameContext } from '../context/game-context';
import { useEffect, useState } from 'react';

export function PlayerRegisterForm() {
  const { player, setPlayer } = useGameContext();
  const [isUsingToken, setIsUsingToken] = useState(false);

  const form = useForm({
    defaultValues: {
      ai_player_name: player?.ai_player_name || 'Meu Jogador',
      ai_player_avatar:
        player?.ai_player_avatar || 'https://example.com/avatar.png',
      group_name: player?.group_name || 'Meu Grupo',
      ai_player_description:
        player?.ai_player_description || 'Descrição do meu jogador de IA',
      ai_player_move_endpoint:
        player?.ai_player_move_endpoint || 'https://example.com/move-endpoint',
      existing_token: '',
    },
  });

  const { formState, control, handleSubmit, reset } = form;
  const { isSubmitting, errors } = formState;

  async function onSubmit(dto) {
    try {
      if (isUsingToken) {
        setPlayer({
          player_access_token: dto.existing_token,
          ai_player_name: dto.ai_player_name,
          ai_player_avatar: dto.ai_player_avatar,
          group_name: dto.group_name,
          ai_player_description: dto.ai_player_description,
          ai_player_move_endpoint: dto.ai_player_move_endpoint,
          id: player?.id || dto.existing_token.slice(0, 8),
        });
        return;
      }

      const response = await registerPlayer({ ...dto });
      if (!response?.player_access_token)
        throw new Error('Resposta inesperada da API');
      setPlayer(response);

      reset({
        ai_player_name: response?.ai_player_name,
        ai_player_avatar: response?.ai_player_avatar,
        group_name: response?.group_name,
        ai_player_description: response?.ai_player_description,
        ai_player_move_endpoint: response?.ai_player_move_endpoint,
        existing_token: '',
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex flex-col px-4 gap-4 bg-zinc-900 border border-purple-950 p-6 rounded-2xl max-w-lg mx-auto shadow-xl">
      {/* ABAS ESTILO GAMER NO TOPO */}
      <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
        <button
          type="button"
          onClick={() => setIsUsingToken(false)}
          className={cn(
            'py-2 px-4 rounded-lg text-xs font-bold tracking-wide transition-all duration-200',
            !isUsingToken
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          🤖 Novo Registro
        </button>
        <button
          type="button"
          onClick={() => setIsUsingToken(true)}
          className={cn(
            'py-2 px-4 rounded-lg text-xs font-bold tracking-wide transition-all duration-200',
            isUsingToken
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
        >
          🔑 Entrar por Token
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 text-white"
      >
        {isUsingToken && (
          <Controller
            name="existing_token"
            control={control}
            rules={{ required: 'O token é obrigatório' }}
            render={({ field }) => (
              <div className="flex flex-col gap-1 bg-purple-950/20 p-3 rounded-xl border border-purple-500/20">
                <label className="text-[11px] uppercase tracking-wider font-bold text-purple-400">
                  Chave do Token (Access Token)
                </label>
                <input
                  className="border border-zinc-800 bg-zinc-950 rounded-lg px-4 py-2 text-sm font-mono focus:border-purple-500 focus:outline-none"
                  type="text"
                  placeholder="Cole seu player_access_token aqui"
                  {...field}
                />
                {errors.existing_token && (
                  <span className="text-red-400 text-xs mt-1">
                    {errors.existing_token.message}
                  </span>
                )}
              </div>
            )}
          />
        )}

        {/* CAMPOS REUTILIZÁVEIS (Aparecem nos dois fluxos) */}
        <div
          className={cn('flex flex-col gap-3', isUsingToken && 'opacity-80')}
        >
          <Controller
            name="group_name"
            control={control}
            rules={{ required: 'Nome do grupo obrigatório' }}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">Nome do Grupo</label>
                <input
                  className="border border-zinc-800 bg-zinc-950 rounded-lg px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  type="text"
                  {...field}
                />
              </div>
            )}
          />

          <Controller
            name="ai_player_name"
            control={control}
            rules={{ required: 'Nome do jogador obrigatório' }}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">
                  Nome do Jogador (IA)
                </label>
                <input
                  className="border border-zinc-800 bg-zinc-950 rounded-lg px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  type="text"
                  {...field}
                />
              </div>
            )}
          />

          <Controller
            name="ai_player_avatar"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">URL do Avatar</label>
                <input
                  className="border border-zinc-800 bg-zinc-950 rounded-lg px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  type="text"
                  {...field}
                />
              </div>
            )}
          />

          <Controller
            name="ai_player_description"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">Descrição</label>
                <input
                  className="border border-zinc-800 bg-zinc-950 rounded-lg px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  type="text"
                  {...field}
                />
              </div>
            )}
          />

          <Controller
            name="ai_player_move_endpoint"
            control={control}
            rules={{ required: 'Endpoint obrigatório' }}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">
                  Endpoint de Movimento
                </label>
                <input
                  className="border border-zinc-800 bg-zinc-950 rounded-lg px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  type="text"
                  {...field}
                />
              </div>
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-bold tracking-wide rounded-xl hover:brightness-110 shadow-lg transition-all active:scale-[0.98]"
        >
          {isSubmitting
            ? 'Processando...'
            : isUsingToken
              ? 'Injetar Token & Entrar'
              : 'Cadastrar Novo Jogador'}
        </button>
      </form>
    </div>
  );
}
