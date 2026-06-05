import { RootLayout } from '@core/components/root-layout';
import { GameContextProvider } from '@feature/game/context/game-context';
import { AboutPage } from '@routes/about-page';
import { HomePage } from '@routes/home-page';
import { PlayerPage } from '@routes/player-page';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { SpectatePage } from '@routes/spectate-page';

// 1. ADICIONE A IMPORTAÇÃO DA SUA NOVA PÁGINA AQUI EM CIMA:
import { GameDetailsPage } from '@feature/game/components/game-details-page';
// (Ajuste o caminho './pages/game-details-page' se você tiver salvado ela na pasta @routes)

createRoot(document.getElementById('root')).render(
  <GameContextProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path={'about'} element={<AboutPage />} />
          <Route path={'player'} element={<PlayerPage />} />
          <Route path={'spectate/:gameId'} element={<SpectatePage />} />

          {/* 2. ADICIONE ESTA NOVA LINHA AQUI DENTRO DO ROOT LAYOUT: */}
          <Route path={'game-details/:gameId'} element={<GameDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </GameContextProvider>
);
