/**
 * 首屏滚动提示
 */
export class ScrollHint {
  private element: HTMLElement;
  private scrollContainer: HTMLElement;

  constructor() {
    this.element = document.getElementById('scroll-hint')!;
    this.scrollContainer = document.getElementById('scroll-container')!;
    this.bindEvents();
    this.setVisible(true);
  }

  private bindEvents(): void {
    this.element.addEventListener('click', () => {
      const skillsSection = document.getElementById('skills-section');
      skillsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /** 仅在首屏显示，离开首屏后隐藏 */
  setVisible(visible: boolean): void {
    this.element.classList.toggle('hidden', !visible);
  }

  dispose(): void {
    this.element.remove();
  }
}
