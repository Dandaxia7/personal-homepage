import { Theme, THEMES } from './types';

/**
 * 主题管理器 - 管理网站的主题配色
 */
export class ThemeManager {
  private currentTheme: string = 'pink';

  /**
   * 设置主题
   */
  setTheme(themeName: string): void {
    const theme = THEMES[themeName];
    if (!theme) {
      console.warn(`主题 "${themeName}" 不存在`);
      return;
    }

    this.currentTheme = themeName;

    // 更新 CSS 变量
    const root = document.documentElement;
    root.setAttribute('data-theme', themeName);

    // 也可以直接设置 CSS 变量（用于自定义主题）
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-background-top', theme.background);
    root.style.setProperty('--color-particle', theme.particle);
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): string {
    return this.currentTheme;
  }

  /**
   * 获取当前主题配置
   */
  getCurrentThemeConfig(): Theme | undefined {
    return THEMES[this.currentTheme];
  }

  /**
   * 获取所有可用主题
   */
  getAvailableThemes(): string[] {
    return Object.keys(THEMES);
  }

  /**
   * 自定义主题颜色
   */
  setCustomColors(colors: Partial<Theme>): void {
    const root = document.documentElement;
    
    if (colors.primary) {
      root.style.setProperty('--color-primary', colors.primary);
    }
    if (colors.secondary) {
      root.style.setProperty('--color-secondary', colors.secondary);
    }
    if (colors.background) {
      root.style.setProperty('--color-background-top', colors.background);
    }
    if (colors.particle) {
      root.style.setProperty('--color-particle', colors.particle);
    }
    if (colors.ground) {
      root.style.setProperty('--color-ground', colors.ground);
    }
  }
}