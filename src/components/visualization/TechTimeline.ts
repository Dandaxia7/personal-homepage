import { TechMilestone, techMilestones } from '../../data/skills';

export class TechTimeline {
  private container: HTMLElement;
  private svg: SVGSVGElement;
  private detailCard: HTMLElement;
  private milestones: TechMilestone[];
  private hasAnimated = false;
  private observer: IntersectionObserver;

  constructor(container: HTMLElement, milestones: TechMilestone[] = techMilestones) {
    this.container = container;
    this.milestones = milestones;

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.classList.add('tech-timeline-svg');
    this.svg.setAttribute('role', 'img');
    this.svg.setAttribute('aria-label', '技术栈时间线');

    this.detailCard = document.createElement('div');
    this.detailCard.className = 'tech-timeline-detail';
    this.detailCard.hidden = true;

    this.container.append(this.svg, this.detailCard);
    this.render();

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !this.hasAnimated) {
          this.hasAnimated = true;
          this.playDrawAnimation();
        }
      },
      { threshold: 0.35 }
    );
    this.observer.observe(this.container);
  }

  private render(): void {
    const width = 720;
    const height = 160;
    const padding = 36;
    const step = (width - padding * 2) / Math.max(this.milestones.length - 1, 1);

    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this.svg.innerHTML = '';

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(padding));
    line.setAttribute('y1', String(height / 2));
    line.setAttribute('x2', String(width - padding));
    line.setAttribute('y2', String(height / 2));
    line.classList.add('tech-timeline-line');
    this.svg.appendChild(line);

    this.milestones.forEach((item, index) => {
      const x = padding + step * index;
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.classList.add('tech-timeline-node');
      group.setAttribute('tabindex', '0');
      group.setAttribute('role', 'button');
      group.dataset.index = String(index);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', String(x));
      circle.setAttribute('cy', String(height / 2));
      circle.setAttribute('r', '6');
      circle.classList.add('tech-timeline-dot');

      const date = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      date.setAttribute('x', String(x));
      date.setAttribute('y', String(height / 2 - 22));
      date.classList.add('tech-timeline-date');
      date.textContent = item.date;

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      title.setAttribute('x', String(x));
      title.setAttribute('y', String(height / 2 + 28));
      title.classList.add('tech-timeline-title');
      title.textContent = item.title;

      group.append(circle, date, title);
      this.svg.appendChild(group);

      const showDetail = () => this.showDetail(item);
      group.addEventListener('mouseenter', showDetail);
      group.addEventListener('focus', showDetail);
      group.addEventListener('mouseleave', () => {
        this.detailCard.hidden = true;
      });
      group.addEventListener('blur', () => {
        this.detailCard.hidden = true;
      });
    });
  }

  private showDetail(item: TechMilestone): void {
    this.detailCard.hidden = false;
    this.detailCard.innerHTML = `
      <h4>${item.title}</h4>
      <p class="tech-timeline-detail-date">${item.date}</p>
      <p>${item.description}</p>
      <div class="tech-timeline-tags">
        ${item.technologies.map((tech) => `<span>${tech}</span>`).join('')}
      </div>
      ${item.project ? `<p class="tech-timeline-detail-project">项目：${item.project}</p>` : ''}
    `;
  }

  private playDrawAnimation(): void {
    const line = this.svg.querySelector('.tech-timeline-line') as SVGLineElement | null;
    if (!line) return;

    const length = line.getTotalLength?.() ?? 640;
    line.style.strokeDasharray = `${length}`;
    line.style.strokeDashoffset = `${length}`;
    line.getBoundingClientRect();
    line.style.transition = 'stroke-dashoffset 1.1s ease';
    line.style.strokeDashoffset = '0';

    this.svg.querySelectorAll('.tech-timeline-node').forEach((node, index) => {
      const element = node as SVGGElement;
      element.style.opacity = '0';
      element.style.transition = `opacity 0.35s ease ${0.15 + index * 0.12}s`;
      requestAnimationFrame(() => {
        element.style.opacity = '1';
      });
    });
  }

  dispose(): void {
    this.observer.disconnect();
    this.container.replaceChildren();
  }
}
