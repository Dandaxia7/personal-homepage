export interface SkillDimension {
  name: string;
  score: number;
  description: string;
  projects: string[];
}

export interface TechMilestone {
  date: string;
  title: string;
  technologies: string[];
  description: string;
  project?: string;
}

export type TechLevel = 'master' | 'advanced' | 'intermediate' | 'beginner';

export interface TechTag {
  name: string;
  level: TechLevel;
  years: number;
  projects: number;
}

export const skillDimensions: SkillDimension[] = [
  {
    name: '前端框架',
    score: 4.5,
    description: 'React、Vue、Next.js',
    projects: ['个人主页', '组件库实践'],
  },
  {
    name: '3D/图形',
    score: 4.0,
    description: 'Three.js、Canvas、WebGL',
    projects: ['个人主页 3D 场景'],
  },
  {
    name: '工程化',
    score: 4.0,
    description: 'TypeScript、Vite、Git',
    projects: ['个人主页', '前端工具链'],
  },
  {
    name: '数据可视化',
    score: 3.5,
    description: 'Canvas、SVG、D3.js',
    projects: ['技能雷达图', '技术时间线'],
  },
  {
    name: 'AI/Agent',
    score: 3.0,
    description: 'LLM API、RAG、Prompt',
    projects: ['Agent 实验项目'],
  },
  {
    name: '后端',
    score: 3.0,
    description: 'Node.js、Express',
    projects: ['API 服务练习'],
  },
];

export const techMilestones: TechMilestone[] = [
  {
    date: '2022.09',
    title: '前端基础',
    technologies: ['HTML/CSS', 'JavaScript'],
    description: '系统学习 Web 基础，完成静态页面与原生 JS 交互练习。',
  },
  {
    date: '2023.06',
    title: '框架与工程化',
    technologies: ['React', 'TypeScript', 'Vite'],
    description: '掌握现代前端框架与 TypeScript 工程化开发流程。',
    project: '课程项目 / 小组作业',
  },
  {
    date: '2024.03',
    title: '图形与可视化',
    technologies: ['Three.js', 'Canvas', 'SVG'],
    description: '探索 3D 图形与数据可视化，构建交互式展示页面。',
    project: '个人主页 3D 场景',
  },
  {
    date: '2025.01',
    title: '全栈与 AI',
    technologies: ['Node.js', 'LLM', 'Agent'],
    description: '向全栈与 AI Agent 方向拓展，实践 API 集成与智能应用。',
  },
];

export const techTags: TechTag[] = [
  { name: 'TypeScript', level: 'advanced', years: 2, projects: 5 },
  { name: 'React', level: 'advanced', years: 2, projects: 4 },
  { name: 'Three.js', level: 'advanced', years: 1, projects: 2 },
  { name: 'Vue', level: 'intermediate', years: 1, projects: 2 },
  { name: 'Vite', level: 'advanced', years: 2, projects: 4 },
  { name: 'Canvas', level: 'intermediate', years: 1, projects: 2 },
  { name: 'Node.js', level: 'intermediate', years: 1, projects: 2 },
  { name: 'Git', level: 'advanced', years: 3, projects: 8 },
  { name: 'LLM API', level: 'beginner', years: 1, projects: 1 },
  { name: 'CSS Animation', level: 'advanced', years: 2, projects: 3 },
  { name: 'WebGL', level: 'intermediate', years: 1, projects: 1 },
  { name: 'ECharts', level: 'beginner', years: 1, projects: 1 },
];

export const techLevelLabels: Record<TechLevel, string> = {
  master: '精通',
  advanced: '熟练',
  intermediate: '掌握',
  beginner: '入门',
};
