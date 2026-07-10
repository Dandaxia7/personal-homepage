/**
 * 加载界面管理器
 */
export class LoadingScreen {
  private element: HTMLElement;
  private progressBar: HTMLElement;
  private percentText: HTMLElement;
  private tipText: HTMLElement;

  constructor() {
    this.element = document.getElementById('loading-screen')!;
    this.progressBar = document.querySelector('.loading-progress-bar')!;
    this.percentText = document.querySelector('.loading-percent')!;
    this.tipText = document.querySelector('.loading-tip')!;
  }

  /**
   * 更新加载进度
   */
  updateProgress(percent: number): void {
    this.progressBar.style.width = `${percent}%`;
    this.percentText.textContent = `${percent}%`;
  }

  /**
   * 更新加载提示文本
   */
  updateTip(text: string): void {
    this.tipText.textContent = text;
  }

  /**
   * 隐藏加载界面
   */
  hide(): void {
    this.element.classList.add('hidden');
    // 完全隐藏后移除元素
    setTimeout(() => {
      this.element.remove();
    }, 500);
  }

  /**
   * 显示加载界面
   */
  show(): void {
    this.element.classList.remove('hidden');
  }
}