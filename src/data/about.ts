export type ContactPlatform = 'github' | 'email' | 'blog' | 'linkedin';

export interface ContactLink {
  id: ContactPlatform;
  label: string;
  url?: string;
  email?: string;
}

export const profileIntro = {
  name: '个人主页作者',
  lines: [
    '你好，我是南京大学软件学院的大四学生，热爱用代码构建有温度的 Web 体验。',
    '目前专注前端工程、Three.js 图形渲染与 AI Agent 应用方向，也在探索可视化与交互设计。',
    '我相信持续交付与细节打磨同样重要——这个主页正是我技术栈的一次集中实践。',
  ],
};

export const contactLinks: ContactLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/dandaxia7',
  },
  {
    id: 'email',
    label: 'Email',
    email: '231250146@smail.nju.edu.cn',
  },
  {
    id: 'blog',
    label: '博客',
    url: 'https://dandaxia7.github.io/personal-homepage/',
  },
];
