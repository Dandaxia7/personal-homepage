/**
 * 滚动控制器
 * 管理垂直滚动布局、区域切换、箭头显示/隐藏
 */

export interface ScrollSection {
  id: string;
  element: HTMLElement;
  index: number;
}

type SectionChangeCallback = (index: number, sectionId: string) => void;

const ARROW_SVG = {
  up: '<path d="M10 25 L20 15 L30 25" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  down: '<path d="M10 15 L20 25 L30 15" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
};

export class ScrollController {
  private container: HTMLElement;
  private sections: ScrollSection[] = [];
  private currentSectionIndex = 0;
  private isScrolling = false;
  private scrollThreshold = 30;
  private accumulatedScroll = 0;
  private upArrow: HTMLElement;
  private downArrow: HTMLElement;
  private arrowVisibilityTimeout: number | null = null;
  private sectionChangeCallbacks: SectionChangeCallback[] = [];

  constructor() {
    this.container = document.getElementById('scroll-container')!;
    this.initSections();
    const arrows = this.createFixedArrows();
    this.upArrow = arrows.up;
    this.downArrow = arrows.down;
    this.bindEvents();
    this.notifySectionChange();
  }

  private initSections(): void {
    const sectionElements = this.container.querySelectorAll('.scroll-section');
    sectionElements.forEach((element, index) => {
      const section = element as HTMLElement;
      this.sections.push({
        id: section.id,
        element: section,
        index,
      });
    });
  }

  /** 创建固定定位的上下箭头，避免被 section 毛玻璃层遮挡 */
  private createFixedArrows(): { up: HTMLElement; down: HTMLElement } {
    const layer = document.createElement('div');
    layer.id = 'scroll-arrows';
    layer.className = 'scroll-arrows-layer';
    layer.setAttribute('aria-hidden', 'true');

    const up = document.createElement('button');
    up.className = 'scroll-arrow scroll-arrow-up';
    up.setAttribute('aria-label', '向上滚动');
    up.innerHTML = `<svg width="40" height="40" viewBox="0 0 40 40">${ARROW_SVG.up}</svg>`;

    const down = document.createElement('button');
    down.className = 'scroll-arrow scroll-arrow-down';
    down.setAttribute('aria-label', '向下滚动');
    down.innerHTML = `<svg width="40" height="40" viewBox="0 0 40 40">${ARROW_SVG.down}</svg>`;

    layer.append(up, down);
    document.body.appendChild(layer);

    up.addEventListener('click', () => this.scrollToSection(this.currentSectionIndex - 1));
    down.addEventListener('click', () => this.scrollToSection(this.currentSectionIndex + 1));

    return { up, down };
  }

  private bindEvents(): void {
    this.container.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    this.container.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  onSectionChange(callback: SectionChangeCallback): void {
    this.sectionChangeCallbacks.push(callback);
  }

  scrollToSectionById(sectionId: string): void {
    const section = this.sections.find((s) => s.id === sectionId);
    if (section) {
      this.scrollToSection(section.index);
    }
  }

  private handleWheel(event: WheelEvent): void {
    if (this.isScrolling) {
      event.preventDefault();
      return;
    }

    const delta = event.deltaY;
    this.accumulatedScroll += delta;

    if (Math.abs(this.accumulatedScroll) >= this.scrollThreshold) {
      event.preventDefault();

      const direction = this.accumulatedScroll > 0 ? 1 : -1;
      const targetIndex = this.currentSectionIndex + direction;

      if (targetIndex >= 0 && targetIndex < this.sections.length) {
        this.scrollToSection(targetIndex);
      }

      this.accumulatedScroll = 0;
    }
  }

  private handleScroll(): void {
    const containerHeight = this.container.clientHeight;

    this.sections.forEach((section, index) => {
      const rect = section.element.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      const relativeTop = rect.top - containerRect.top;

      if (Math.abs(relativeTop) < containerHeight / 2) {
        if (this.currentSectionIndex !== index) {
          this.currentSectionIndex = index;
          this.notifySectionChange();
        }
      }
    });
  }

  private handleMouseMove(event: MouseEvent): void {
    const mouseY = event.clientY;
    const windowHeight = window.innerHeight;
    const threshold = 100;

    if (this.arrowVisibilityTimeout) {
      clearTimeout(this.arrowVisibilityTimeout);
    }

    this.updateArrowVisibility(mouseY, windowHeight, threshold);

    this.arrowVisibilityTimeout = window.setTimeout(() => {
      this.hideAllArrows();
    }, 3000);
  }

  private updateArrowVisibility(mouseY: number, windowHeight: number, threshold: number): void {
    const nearTop = mouseY < threshold;
    const nearBottom = mouseY > windowHeight - threshold;
    const currentIndex = this.currentSectionIndex;

    const showUp = nearTop && currentIndex > 0;
    const showDown = nearBottom && currentIndex < this.sections.length - 1;

    this.setArrowVisible(this.upArrow, showUp);
    this.setArrowVisible(this.downArrow, showDown);
  }

  private setArrowVisible(arrow: HTMLElement, show: boolean): void {
    arrow.classList.toggle('visible', show);
  }

  private hideAllArrows(): void {
    this.setArrowVisible(this.upArrow, false);
    this.setArrowVisible(this.downArrow, false);
  }

  scrollToSection(index: number): void {
    if (this.isScrolling || index < 0 || index >= this.sections.length) {
      return;
    }

    this.isScrolling = true;
    const targetSection = this.sections[index];

    targetSection.element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    this.currentSectionIndex = index;
    this.notifySectionChange();

    setTimeout(() => {
      this.isScrolling = false;
      this.accumulatedScroll = 0;
    }, 1200);
  }

  private notifySectionChange(): void {
    const section = this.sections[this.currentSectionIndex];
    if (!section) return;

    this.sectionChangeCallbacks.forEach((cb) => {
      cb(this.currentSectionIndex, section.id);
    });
  }

  getCurrentSectionIndex(): number {
    return this.currentSectionIndex;
  }

  getCurrentSectionId(): string {
    return this.sections[this.currentSectionIndex]?.id ?? '';
  }

  dispose(): void {
    this.container.removeEventListener('wheel', this.handleWheel.bind(this));
    this.container.removeEventListener('scroll', this.handleScroll.bind(this));
    window.removeEventListener('mousemove', this.handleMouseMove.bind(this));

    if (this.arrowVisibilityTimeout) {
      clearTimeout(this.arrowVisibilityTimeout);
    }

    document.getElementById('scroll-arrows')?.remove();
  }
}
