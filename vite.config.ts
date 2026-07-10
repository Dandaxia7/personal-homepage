import { defineConfig } from 'vite';

// GitHub Pages 配置
// 仓库名是 personal-homepage，所以 base 设置为 '/personal-homepage/'
// 开发环境使用根路径，生产环境（包括 GitHub Actions）使用仓库路径
const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export default defineConfig({
  base: isDev ? '/' : '/personal-homepage/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
  },
});