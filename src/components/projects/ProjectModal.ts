import { Project } from '../../data/projects';

export class ProjectModal {
  private overlay: HTMLElement;
  private dialog: HTMLElement;
  private closeBtn: HTMLButtonElement;
  private bodyEl: HTMLElement;
  private lastFocus: HTMLElement | null = null;
  private isOpen = false;
  private readonly boundKeydown = this.onKeydown.bind(this);
  private readonly boundOverlayClick = this.onOverlayClick.bind(this);

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'project-modal-overlay';
    this.overlay.hidden = true;
    this.overlay.setAttribute('role', 'presentation');

    this.dialog = document.createElement('div');
    this.dialog.className = 'project-modal';
    this.dialog.setAttribute('role', 'dialog');
    this.dialog.setAttribute('aria-modal', 'true');
    this.dialog.setAttribute('aria-labelledby', 'project-modal-title');

    this.closeBtn = document.createElement('button');
    this.closeBtn.type = 'button';
    this.closeBtn.className = 'project-modal-close';
    this.closeBtn.setAttribute('aria-label', '关闭项目详情');
    this.closeBtn.textContent = '×';

    this.bodyEl = document.createElement('div');
    this.bodyEl.className = 'project-modal-body';

    this.dialog.append(this.closeBtn, this.bodyEl);
    this.overlay.appendChild(this.dialog);
    document.body.appendChild(this.overlay);

    this.setOverlayClosed();
    this.closeBtn.addEventListener('click', () => this.close());
  }

  /** hidden 属性会被 CSS display:flex 覆盖，需显式关闭交互与布局 */
  private setOverlayClosed(): void {
    this.overlay.hidden = true;
    this.overlay.classList.remove('visible');
    this.overlay.style.display = 'none';
    this.overlay.style.pointerEvents = 'none';
  }

  private setOverlayOpen(): void {
    this.overlay.hidden = false;
    this.overlay.style.display = 'flex';
    this.overlay.style.pointerEvents = 'auto';
  }

  open(project: Project): void {
    if (this.isOpen) this.close(false);

    this.lastFocus = document.activeElement as HTMLElement | null;
    this.isOpen = true;
    this.setOverlayOpen();
    requestAnimationFrame(() => this.overlay.classList.add('visible'));

    this.renderContent(project);
    document.addEventListener('keydown', this.boundKeydown);
    this.overlay.addEventListener('click', this.boundOverlayClick);
    this.closeBtn.focus();
  }

  close(restoreFocus = true): void {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.overlay.classList.remove('visible');
    document.removeEventListener('keydown', this.boundKeydown);
    this.overlay.removeEventListener('click', this.boundOverlayClick);

    window.setTimeout(() => {
      this.setOverlayClosed();
      this.bodyEl.replaceChildren();
    }, 280);

    if (restoreFocus && this.lastFocus) {
      this.lastFocus.focus();
    }
    this.lastFocus = null;
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  private onOverlayClick(event: MouseEvent): void {
    if (event.target === this.overlay) this.close();
  }

  private renderContent(project: Project): void {
    const thumbClass = project.thumbnail
      ? 'project-modal-media'
      : `project-modal-media project-modal-media--${project.category}`;

    const mediaInner = project.thumbnail
      ? `<img src="${project.thumbnail}" alt="${project.title} 演示图" />`
      : `<span class="project-modal-media-label">${project.title}</span>`;

    const highlights = project.highlights
      .map((item) => `<li>${item}</li>`)
      .join('');

    const techStack = project.techStack
      .map((tech) => `<span class="project-modal-tech">${tech}</span>`)
      .join('');

    const stats: string[] = [];
    if (project.stats.linesOfCode) stats.push(`代码量 ${project.stats.linesOfCode.toLocaleString()} 行`);
    if (project.stats.duration) stats.push(`周期 ${project.stats.duration}`);
    if (project.stats.stars) stats.push(`⭐ ${project.stats.stars}`);

    const links: string[] = [];
    if (project.demo) {
      links.push(`<a class="project-modal-link" href="${project.demo}" target="_blank" rel="noopener noreferrer">在线演示</a>`);
    }
    if (project.github) {
      links.push(`<a class="project-modal-link" href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
    }
    if (project.blog) {
      links.push(`<a class="project-modal-link" href="${project.blog}" target="_blank" rel="noopener noreferrer">博客</a>`);
    }

    this.bodyEl.innerHTML = `
      <div class="${thumbClass}">${mediaInner}</div>
      <div class="project-modal-content">
        <h2 id="project-modal-title" class="project-modal-title">${project.title}</h2>
        <p class="project-modal-desc">${project.description}</p>
        <div class="project-modal-techs">${techStack}</div>
        ${stats.length ? `<p class="project-modal-stats">${stats.join(' · ')}</p>` : ''}
        <div class="project-modal-section">
          <h3>技术亮点</h3>
          <ul class="project-modal-highlights">${highlights}</ul>
        </div>
        ${links.length ? `<div class="project-modal-links">${links.join('')}</div>` : ''}
      </div>
    `;
  }

  dispose(): void {
    this.close(false);
    this.overlay.remove();
  }
}
