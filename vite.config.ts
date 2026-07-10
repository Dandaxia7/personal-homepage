import { defineConfig } from 'vite';

// GitHub Pages 配置
// 如果仓库名是 <username>.github.io，base 设置为 '/'
// 如果仓库名是其他名称，base 设置为 '/<repository-name>/'
export default defineConfig({
  base: '/', // 默认值，如果您的仓库名不是 <username>.github.io，需要修改这里
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
  },
});