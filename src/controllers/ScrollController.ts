/**
 * 滚动控制器
 * 管理垂直滚动布局、区域切换、箭头显示/隐藏
 */

export interface ScrollSection {
  id: string;
  element: HTMLElement;
  index: number;
}

export class ScrollController {
  private container: HTMLElement;
  private sections: ScrollSection[] = [];
  private currentSectionIndex: number = 0;
  private isScrolling: boolean = false;
  private scrollThreshold: number = 30; // 滚动阈值（像素）- 降低以更灵敏
  private accumulatedScroll: number = 0;
  private arrows: Map<string, HTMLElement> = new Map();
  private arrowVisibilityTimeout: number | null = null;

  constructor() {
    this.container = document.getElementById('scroll-container')!;
    this.initSections();
    this.initArrows();
    this.bindEvents();
  }

  /**
   * 初始化所有区域
   */
  private initSections(): void {
    const sectionElements = this.container.querySelectorAll('.scroll-section');
    sectionElements.forEach((element, index) => {
      const section = element as HTMLElement;
      this.sections.push({
        id: section.id,
        element: section,
        index
      });
    });
  }

  /**
   * 初始化箭头元素
   */
  private initArrows(): void {
    const arrowElements = this.container.querySelectorAll('.scroll-arrow');
    arrowElements.forEach((element) => {
      const arrow = element as HTMLElement;
      const id = arrow.id;
      this.arrows.set(id, arrow);
      
      // 初始隐藏
      arrow.style.opacity = '0';
      arrow.style.pointerEvents = 'none';
      
      // 绑定点击事件
      arrow.addEventListener('click', () => this.handleArrowClick(arrow));
    });
  }

  /**
   * 绑定事件监听器
   */
  private bindEvents(): void {
    // 监听滚轮事件
    window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    
    // 监听鼠标移动（用于箭头显示）
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // 监听滚动结束
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  /**
   * 处理滚轮事件
   */
  private handleWheel(event: WheelEvent): void {
    // 如果正在滚动动画中，阻止新的滚动
    if (this.isScrolling) {
      event.preventDefault();
      return;
    }

    const delta = event.deltaY;
    this.accumulatedScroll += delta;

    // 超过阈值时切换区域（阻止默认滚动，触发吸附）
    if (Math.abs(this.accumulatedScroll) >= this.scrollThreshold) {
      event.preventDefault();
      
      const direction = this.accumulatedScroll > 0 ? 1 : -1;
      const targetIndex = this.currentSectionIndex + direction;

      // 检查是否在有效范围内
      if (targetIndex >= 0 && targetIndex < this.sections.length) {
        this.scrollToSection(targetIndex);
      }

      this.accumulatedScroll = 0;
    }
    // 未达阈值时：允许默认滚动行为（不调用 preventDefault）
    // 页面会进行正常的缓慢滚动
  }

  /**
   * 处理滚动事件
   */
  private handleScroll(): void {
    // 检测当前可见区域
    const windowHeight = window.innerHeight;
    
    this.sections.forEach((section, index) => {
      const rect = section.element.getBoundingClientRect();
      const isVisible = rect.top < windowHeight && rect.bottom > 0;
      
      if (isVisible && Math.abs(rect.top) < windowHeight / 2) {
        this.currentSectionIndex = index;
      }
    });
  }

  /**
   * 处理鼠标移动
   */
  private handleMouseMove(event: MouseEvent): void {
    const mouseY = event.clientY;
    const windowHeight = window.innerHeight;
    const threshold = 100; // 距离边缘100px内显示箭头

    // 清除之前的定时器
    if (this.arrowVisibilityTimeout) {
      clearTimeout(this.arrowVisibilityTimeout);
    }

    // 显示/隐藏箭头
    this.updateArrowVisibility(mouseY, windowHeight, threshold);

    // 3秒后隐藏箭头
    this.arrowVisibilityTimeout = window.setTimeout(() => {
      this.hideAllArrows();
    }, 3000);
  }

  /**
   * 更新箭头可见性
   */
  private updateArrowVisibility(mouseY: number, windowHeight: number, threshold: number): void {
    const nearTop = mouseY < threshold;
    const nearBottom = mouseY > windowHeight - threshold;

    // 根据当前区域显示对应箭头
    if (this.currentSectionIndex === 0) {
      // 第一个区域：只显示向下箭头
      this.showArrow('scroll-arrow-down', nearBottom);
    } else if (this.currentSectionIndex === this.sections.length - 1) {
      // 最后一个区域：只显示向上箭头
      const arrowId = `scroll-arrow-up${this.sections.length > 2 ? '-2' : ''}`;
      this.showArrow(arrowId, nearTop);
    } else {
      // 中间区域：显示向上和向下箭头
      const upArrowId = this.currentSectionIndex === 1 ? 'scroll-arrow-up' : 'scroll-arrow-up-2';
      const downArrowId = 'scroll-arrow-down-2';
      
      this.showArrow(upArrowId, nearTop);
      this.showArrow(downArrowId, nearBottom);
    }
  }

  /**
   * 显示箭头
   */
  private showArrow(arrowId: string, show: boolean): void {
    const arrow = this.arrows.get(arrowId);
    if (!arrow) return;

    if (show) {
      arrow.style.opacity = '1';
      arrow.style.pointerEvents = 'auto';
    } else {
      arrow.style.opacity = '0';
      arrow.style.pointerEvents = 'none';
    }
  }

  /**
   * 隐藏所有箭头
   */
  private hideAllArrows(): void {
    this.arrows.forEach((arrow) => {
      arrow.style.opacity = '0';
      arrow.style.pointerEvents = 'none';
    });
  }

  /**
   * 处理箭头点击
   */
  private handleArrowClick(arrow: HTMLElement): void {
    const isDownArrow = arrow.classList.contains('scroll-arrow-down');
    const direction = isDownArrow ? 1 : -1;
    const targetIndex = this.currentSectionIndex + direction;

    if (targetIndex >= 0 && targetIndex < this.sections.length) {
      this.scrollToSection(targetIndex);
    }
  }

  /**
   * 滚动到指定区域
   */
  private scrollToSection(index: number): void {
    if (this.isScrolling || index < 0 || index >= this.sections.length) {
      return;
    }

    this.isScrolling = true;
    const targetSection = this.sections[index];

    targetSection.element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // 更新当前区域索引
    this.currentSectionIndex = index;

    // 滚动动画结束后重置状态（延长到1200ms让切换更慢更平滑）
    setTimeout(() => {
      this.isScrolling = false;
      this.accumulatedScroll = 0;
    }, 1200);
  }

  /**
   * 获取当前区域索引
   */
  public getCurrentSectionIndex(): number {
    return this.currentSectionIndex;
  }

  /**
   * 销毁控制器
   */
  public dispose(): void {
    window.removeEventListener('wheel', this.handleWheel.bind(this));
    window.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    window.removeEventListener('scroll', this.handleScroll.bind(this));
    
    if (this.arrowVisibilityTimeout) {
      clearTimeout(this.arrowVisibilityTimeout);
    }
  }
}