import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { RootStore } from './store/RootStore.ts';

export const rootStore = RootStore.create({
  meters: [],
  areasCache: {},
  offset: 0,
  total: 0,
});

createRoot(document.getElementById('root')!).render(<App />);
