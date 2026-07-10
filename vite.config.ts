import { defineConfig } from 'vite';

// GitHub Pages 配置
// 仓库名是 personal-homepage，所以 base 设置为 '/personal-homepage/'
export default defineConfig({
  base: '/personal-homepage/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
  },
});