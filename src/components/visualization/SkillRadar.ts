import { SkillDimension, skillDimensions } from '../../data/skills';
import { clamp, getCssVar, getHexVertex, hexToRgba } from '../../utils/dom';

const SIDES = 6;
const GRID_LEVELS = 3;
const MAX_SCORE = 5;

export class SkillRadar {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tooltip: HTMLElement;
  private detailPanel: HTMLElement;
  private dimensions: SkillDimension[];
  private progress = 0;
  private hoveredIndex: number | null = null;
  private animationId: number | null = null;
  private isVisible = false;
  private logicalSize = 360;
  private observer: IntersectionObserver;
  private resizeObserver: ResizeObserver;
  private readonly boundResize = this.handleResize.bind(this);
  private readonly boundMouseMove = this.handleMouseMove.bind(this);
  private readonly boundClick = this.handleClick.bind(this);
  private readonly boundMouseLeave = this.handleMouseLeave.bind(this);

  constructor(container: HTMLElement, dimensions: SkillDimension[] = skillDimensions) {
    this.container = container;
    this.dimensions = dimensions;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'skill-radar-canvas';
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', '技能雷达图');

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'skill-radar-tooltip';
    this.tooltip.hidden = true;

    this.detailPanel = document.createElement('div');
    this.detailPanel.className = 'skill-radar-detail';
    this.detailPanel.hidden = true;

    this.container.append(this.canvas, this.tooltip, this.detailPanel);

    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context unavailable');
    this.ctx = context;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && this.progress < 1) {
            this.startAnimation();
          } else if (this.isVisible) {
            this.draw();
          }
        });
      },
      { threshold: 0.3 }
    );

    this.bindEvents();
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.container);
    this.handleResize();
    this.observer.observe(this.container);
  }

  private bindEvents(): void {
    window.addEventListener('resize', this.boundResize);
    this.canvas.addEventListener('mousemove', this.boundMouseMove);
    this.canvas.addEventListener('mouseleave', this.boundMouseLeave);
    this.canvas.addEventListener('click', this.boundClick);
  }

  private startAnimation(): void {
    if (this.animationId !== null) return;
    const start = performance.now();
    const duration = 900;

    const tick = (now: number) => {
      this.progress = clamp((now - start) / duration, 0, 1);
      this.draw();
      if (this.progress < 1) {
        this.animationId = requestAnimationFrame(tick);
      } else {
        this.animationId = null;
      }
    };

    this.animationId = requestAnimationFrame(tick);
  }

  private getLayout() {
    const size = this.logicalSize;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.28;
    return { cx, cy, radius, size };
  }

  private getDataPoints(progress = this.progress) {
    const { cx, cy, radius } = this.getLayout();
    return this.dimensions.map((item, index) => {
      const valueRadius = (item.score / MAX_SCORE) * radius * progress;
      return getHexVertex(index, SIDES, valueRadius, cx, cy);
    });
  }

  private getLabelPoints() {
    const { cx, cy, radius } = this.getLayout();
    return this.dimensions.map((item, index) => ({
      item,
      index,
      point: getHexVertex(index, SIDES, radius + 28, cx, cy),
    }));
  }

  private draw(): void {
    const { cx, cy, radius, size } = this.getLayout();
    const primary = getCssVar('--color-primary', '#FF69B4');
    const secondary = getCssVar('--color-text-light', '#999999');
    const ctx = this.ctx;

    ctx.clearRect(0, 0, size, size);

    for (let level = 1; level <= GRID_LEVELS; level += 1) {
      const levelRadius = (radius * level) / GRID_LEVELS;
      ctx.beginPath();
      for (let i = 0; i < SIDES; i += 1) {
        const [x, y] = getHexVertex(i, SIDES, levelRadius, cx, cy);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = hexToRgba(primary, 0.18);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (let i = 0; i < SIDES; i += 1) {
      const [x, y] = getHexVertex(i, SIDES, radius, cx, cy);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = hexToRgba(primary, 0.12);
      ctx.stroke();
    }

    const points = this.getDataPoints();
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = hexToRgba(primary, 0.28);
    ctx.fill();
    ctx.strokeStyle = primary;
    ctx.lineWidth = 2;
    ctx.stroke();

    points.forEach(([x, y], index) => {
      const isHovered = this.hoveredIndex === index;
      ctx.beginPath();
      ctx.arc(x, y, isHovered ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? primary : '#ffffff';
      ctx.strokeStyle = primary;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    });

    ctx.font = '12px sans-serif';
    ctx.fillStyle = secondary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    this.getLabelPoints().forEach(({ item, point: [x, y] }) => {
      ctx.fillText(item.name, x, y);
    });
  }

  private getVertexIndexAt(x: number, y: number): number | null {
    const points = this.getDataPoints(1);
    for (let i = 0; i < points.length; i += 1) {
      const [px, py] = points[i];
      const distance = Math.hypot(px - x, py - y);
      if (distance <= 14) return i;
    }
    return null;
  }

  private handleMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const index = this.getVertexIndexAt(x, y);

    if (index === this.hoveredIndex) return;
    this.hoveredIndex = index;

    if (index === null) {
      this.tooltip.hidden = true;
    } else {
      const item = this.dimensions[index];
      this.tooltip.hidden = false;
      this.tooltip.innerHTML = `
        <strong>${item.name}</strong>
        <span>${item.score} / ${MAX_SCORE}</span>
        <p>${item.description}</p>
      `;
      this.tooltip.style.left = `${event.clientX - rect.left}px`;
      this.tooltip.style.top = `${event.clientY - rect.top - 12}px`;
    }

    this.draw();
  }

  private handleMouseLeave(): void {
    this.hoveredIndex = null;
    this.tooltip.hidden = true;
    this.draw();
  }

  private handleClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const index = this.getVertexIndexAt(x, y);
    if (index === null) {
      this.detailPanel.hidden = true;
      return;
    }

    const item = this.dimensions[index];
    this.detailPanel.hidden = false;
    this.detailPanel.innerHTML = `
      <button class="skill-radar-detail-close" aria-label="关闭详情">×</button>
      <h3>${item.name}</h3>
      <p class="skill-radar-detail-score">熟练度：${item.score} / ${MAX_SCORE}</p>
      <p>${item.description}</p>
      <p class="skill-radar-detail-projects">相关项目：${item.projects.join('、')}</p>
    `;
    this.detailPanel.querySelector('.skill-radar-detail-close')?.addEventListener('click', () => {
      this.detailPanel.hidden = true;
    }, { once: true });
  }

  private handleResize(): void {
    const rect = this.container.getBoundingClientRect();
    const size = Math.min(Math.max(rect.width, 280), 420);
    if (rect.width <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    this.logicalSize = size;
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
    this.canvas.width = Math.round(size * dpr);
    this.canvas.height = Math.round(size * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.draw();
  }

  dispose(): void {
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
    this.observer.disconnect();
    this.resizeObserver.disconnect();
    window.removeEventListener('resize', this.boundResize);
    this.canvas.removeEventListener('mousemove', this.boundMouseMove);
    this.canvas.removeEventListener('mouseleave', this.boundMouseLeave);
    this.canvas.removeEventListener('click', this.boundClick);
    this.container.replaceChildren();
  }
}
