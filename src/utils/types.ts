import * as THREE from 'three';

/**
 * 场景接口 - 所有场景必须实现这些方法
 */
export interface IScene {
  init(): Promise<void>;
  update(delta: number): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

/**
 * 主题配色接口
 */
export interface Theme {
  primary: string;      // 主色调
  secondary: string;    // 辅助色
  background: string;   // 背景色
  particle: string;     // 粒子颜色
  ground: string;       // 地面颜色
}

/**
 * 预设主题
 */
export const THEMES: Record<string, Theme> = {
  pink: {
    primary: '#FF69B4',
    secondary: '#FFB6C1',
    background: '#FFE4E8',
    particle: '#FFC0CB',
    ground: 'rgba(255, 182, 193, 0.6)',
  },
  blue: {
    primary: '#4169E1',
    secondary: '#87CEEB',
    background: '#E6F3FF',
    particle: '#B0E0E6',
    ground: 'rgba(135, 206, 235, 0.6)',
  },
  purple: {
    primary: '#9370DB',
    secondary: '#DDA0DD',
    background: '#F5F0FF',
    particle: '#E6E6FA',
    ground: 'rgba(221, 160, 221, 0.6)',
  },
};

/**
 * 内容配置接口 - 用于后续扩展
 */
export interface ContentConfig {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  projects: Project[];
  social: SocialLinks;
}

export interface Project {
  name: string;
  description: string;
  url?: string;
  image?: string;
}

export interface SocialLinks {
  github?: string;
  twitter?: string;
  email?: string;
  linkedin?: string;
}

/**
 * 粒子系统配置
 */
export interface ParticleConfig {
  count: number;
  bounds: THREE.Vector3;
  color: string;
  size: number;
}

/**
 * 动画时间线关键帧
 */
export interface Keyframe {
  time: number;  // 0-1 的归一化时间
  value: number; // 值
}