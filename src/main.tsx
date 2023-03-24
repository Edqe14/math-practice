import { createEmotionCache, MantineProvider } from '@mantine/core';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ModalsProvider } from '@mantine/modals';
import App from './App';
import './index.css';
import '@fontsource/inter';

const cache = createEmotionCache({
  key: 'mantine',
  prepend: false,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <MantineProvider
    emotionCache={cache}
    withCSSVariables
    theme={{
      fontFamily: 'Inter, sans-serif',
    }}
  >
    <ModalsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ModalsProvider>
  </MantineProvider>
);
