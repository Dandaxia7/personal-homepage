import { TechTag, techLevelLabels, techTags } from '../../data/skills';

export class TechTagCloud {
  private container: HTMLElement;
  private tooltip: HTMLElement;
  private tags: TechTag[];
  private onTagClick?: (tagName: string) => void;

  constructor(
    container: HTMLElement,
    tags: TechTag[] = techTags,
    onTagClick?: (tagName: string) => void
  ) {
    this.container = container;
    this.tags = tags;
    this.onTagClick = onTagClick;

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tech-tag-tooltip';
    this.tooltip.hidden = true;

    this.container.classList.add('tech-tag-cloud');
    this.container.append(this.tooltip);
    this.render();
  }

  private getFontSize(years: number): number {
    return Math.min(18, Math.max(12, 11 + years * 1.5));
  }

  private render(): void {
    this.tags.forEach((tag) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `tech-tag tech-tag-${tag.level}`;
      button.textContent = tag.name;
      button.style.fontSize = `${this.getFontSize(tag.years)}px`;
      button.setAttribute('aria-label', `${tag.name} ${techLevelLabels[tag.level]}`);

      button.addEventListener('mouseenter', (event) => {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        this.tooltip.hidden = false;
        this.tooltip.innerHTML = `
          <strong>${tag.name}</strong>
          <span>${techLevelLabels[tag.level]} · ${tag.years} 年 · ${tag.projects} 个项目</span>
        `;
        this.tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
        this.tooltip.style.top = `${rect.top - containerRect.top - 8}px`;
      });

      button.addEventListener('mouseleave', () => {
        this.tooltip.hidden = true;
      });

      button.addEventListener('click', () => {
        this.onTagClick?.(tag.name);
      });

      this.container.appendChild(button);
    });
  }

  dispose(): void {
    this.container.replaceChildren();
    this.container.classList.remove('tech-tag-cloud');
  }
}
