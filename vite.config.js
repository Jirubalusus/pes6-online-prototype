import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/pes6-online-prototype/',
  plugins: [react()],
});
