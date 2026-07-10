# Three.js 3D 虚拟形象展示项目

## 项目简介

这是一个基于 Three.js 构建的 3D 虚拟形象展示应用，支持加载和渲染 GLB 格式的 3D 模型。项目采用现代化的前端技术栈，提供了流畅的 3D 渲染体验和友好的用户交互界面。

### Github地址
- https://dandaxia7.github.io/personal-homepage/

### 技术栈

- **Three.js** - 3D 渲染引擎
- **Vite** - 下一代前端构建工具
- **TypeScript** - 类型安全的 JavaScript 超集
- **dat.GUI** - 轻量级调试界面

### 主要功能

- 🎨 3D 模型加载与渲染（支持 GLB 格式）
- 🖱️ 交互式相机控制（旋转、缩放、平移）
- 💡 动态光照系统
- 🎛️ 可视化调试面板
- 📦 优化的生产构建
- 🚀 一键部署到 GitHub Pages

---

## 本地开发

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后访问 `http://localhost:5173` 即可查看应用。

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录中。

### 预览生产构建

```bash
npm run preview
```

---

## 部署到 GitHub Pages

### 方式一：使用 npm run deploy（推荐）

项目已配置好部署脚本，使用 `gh-pages` 工具自动构建并部署。

#### 步骤：

1. **确保 package.json 中已配置 deploy 脚本**

   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

2. **安装 gh-pages（已安装可跳过）**

   ```bash
   npm install --save-dev gh-pages
   ```

3. **执行部署命令**

   ```bash
   npm run deploy
   ```

4. **配置 GitHub Pages**

   部署完成后，在 GitHub 仓库设置中：
   
   - 进入 `Settings` > `Pages`
   - `Source` 选择 `Deploy from a branch`
   - `Branch` 选择 `gh-pages` 分支，目录选择 `/(root)`
   - 点击 `Save`

5. **访问应用**

   几分钟后即可通过 `https://<your-username>.github.io/<repo-name>/` 访问。

### 方式二：GitHub Actions 自动部署（可选）

如需配置自动部署，可参考以下步骤：

1. 创建 `.github/workflows/deploy.yml` 文件
2. 在 `Settings` > `Pages` 中选择 `Source: GitHub Actions`
3. 每次推送到 main 分支将自动触发部署

---

## 项目结构

```
three-app/
├── public/                  # 静态资源目录
│   └── *.glb               # 3D 模型文件
├── src/                     # 源代码目录
│   ├── scenes/             # 场景管理
│   │   └── AvatarScene.ts  # 虚拟形象场景
│   ├── main.ts             # 应用入口
│   └── style.css           # 全局样式
├── index.html              # HTML 模板
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── package.json            # 项目依赖和脚本
└── README.md               # 项目文档
```

---

## 配置说明

### Vite 配置

项目使用动态 `base` 配置，自动适配开发和生产环境：

```typescript
// vite.config.ts
const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export default defineConfig({
  base: isDev ? '/' : '/<repo-name>/',  // 生产环境使用仓库名
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
  },
});
```

### 模型文件

3D 模型文件应放置在 `public` 目录中，这样 Vite 会自动将其复制到构建产物。加载模型时使用根路径：

```typescript
// 正确的模型加载方式
const gltf = await loader.loadAsync('/model-name.glb');
```

---

## 常见问题

### Q: 本地开发时模型加载 404？

**A:** 确保模型文件放在 `public` 目录中，而不是 `src/assets`。`public` 目录中的文件会直接复制到构建输出。

### Q: 部署后模型无法加载？

**A:** 检查 `vite.config.ts` 中的 `base` 配置是否正确设置为你的仓库名。

### Q: 如何更换 3D 模型？

**A:** 将新的 GLB 文件放入 `public` 目录，然后在代码中更新模型路径：

```typescript
const gltf = await loader.loadAsync('/your-new-model.glb');
```

### Q: gh-pages 部署失败？

**A:** 确保已安装 `gh-pages` 依赖，并且有权限推送到仓库。可以尝试：

```bash
# 重新安装依赖
npm install gh-pages --save-dev

# 手动部署
npm run deploy
```

---

## 性能优化

项目已内置以下优化：

- ✅ 使用 Terser 压缩代码
- ✅ 禁用 sourcemap（减小文件体积）
- ✅ 优化的构建配置
- ✅ 模型文件缓存策略

---

## 许可证

MIT License

---

## 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。