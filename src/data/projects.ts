export type ProjectCategory = '3d' | 'web' | 'tool' | 'learning';

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  demo?: string;
  github?: string;
  blog?: string;
  techStack: string[];
  highlights: string[];
  category: ProjectCategory;
  stats: {
    linesOfCode?: number;
    duration?: string;
    stars?: number;
  };
}

export const projectCategoryLabels: Record<ProjectCategory | 'all', string> = {
  all: '全部',
  '3d': '3D/图形',
  web: 'Web应用',
  tool: '工具',
  learning: '学习项目',
};

export const projects: Project[] = [
  {
    id: 'personal-homepage',
    title: '3D 个人主页',
    description:
      '基于 Three.js 构建的交互式个人作品集，包含 3D 虚拟形象、技能可视化、项目展示与滚动叙事体验。',
    demo: 'https://dandaxia7.github.io/personal-homepage/',
    github: 'https://github.com/dandaxia7/personal-homepage',
    techStack: ['Three.js', 'TypeScript', 'Vite', 'Canvas', 'CSS Animation'],
    highlights: [
      'GLB 模型加载与鼠标追踪交互',
      'Canvas 技能雷达 + SVG 时间线可视化',
      '滚动分屏叙事与区域台词系统',
    ],
    category: '3d',
    stats: { linesOfCode: 3500, duration: '2 周' },
  },
  {
    id: 'skill-dashboard',
    title: '技能数据看板',
    description: 'Canvas 与 SVG 混合驱动的技术能力可视化面板，支持雷达图、时间线与标签云联动筛选。',
    techStack: ['Canvas', 'SVG', 'TypeScript', 'Vite'],
    highlights: [
      '六边形雷达图入场动画与详情面板',
      '时间线滚动触发绘制动画',
      '标签云点击跳转项目筛选',
    ],
    category: 'web',
    stats: { linesOfCode: 1200, duration: '1 周' },
  },
  {
    id: 'react-component-lib',
    title: 'React 组件库实践',
    description: '从零搭建的可复用 UI 组件库，涵盖 Button、Modal、Tabs 等基础组件与 Storybook 文档。',
    techStack: ['React', 'TypeScript', 'Vite', 'CSS Animation'],
    highlights: [
      '组件 API 设计与 TypeScript 类型推导',
      '主题变量与 CSS 自定义属性',
      '无障碍属性与键盘导航',
    ],
    category: 'web',
    stats: { linesOfCode: 2800, duration: '3 周' },
  },
  {
    id: 'vite-plugin-starter',
    title: 'Vite 插件模板',
    description: '可快速扩展的 Vite 插件脚手架，内置构建配置、类型声明与示例用法。',
    techStack: ['Vite', 'TypeScript', 'Node.js'],
    highlights: [
      'Rollup 插件钩子封装',
      '开发/生产双模式配置',
      'npm 发布流程文档',
    ],
    category: 'tool',
    stats: { linesOfCode: 600, duration: '3 天' },
  },
  {
    id: 'threejs-learning',
    title: 'Three.js 学习笔记',
    description: '系统整理 Three.js 核心概念的小练习合集，涵盖场景、光照、材质与动画。',
    techStack: ['Three.js', 'WebGL', 'JavaScript'],
    highlights: [
      '场景图与渲染循环理解',
      'PBR 材质与灯光实验',
      'OrbitControls 交互练习',
    ],
    category: 'learning',
    stats: { duration: '持续更新' },
  },
  {
    id: 'agent-chat-demo',
    title: 'Agent 对话实验',
    description: '基于 LLM API 的简单对话界面，探索 Prompt 工程与流式响应展示。',
    techStack: ['React', 'TypeScript', 'LLM API', 'Node.js'],
    highlights: [
      'SSE 流式消息渲染',
      '对话历史管理',
      'API Key 环境变量配置',
    ],
    category: 'learning',
    stats: { linesOfCode: 800, duration: '5 天' },
  },
];
