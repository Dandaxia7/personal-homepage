import { Project } from '../../data/projects';
import { observeLazyImages } from '../../utils/lazyImage';
import { createProjectCard } from './ProjectCard';

const CARDS_PER_PAGE = 4;

const ARROW_SVG = {
  left: '<path d="M25 10 L15 20 L25 30" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  right: '<path d="M15 10 L25 20 L15 30" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
};

export class ProjectCarousel {
  private host: HTMLElement;
  private viewport: HTMLElement;
  private grid: HTMLElement;
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private dotsHost: HTMLElement;
  private onOpen: (project: Project) => void;
  private projects: Project[] = [];
  private currentPage = 0;
  private disconnectLazy?: () => void;
  private resizeObserver: ResizeObserver | null = null;
  private heightFrame = 0;

  constructor(host: HTMLElement, onOpen: (project: Project) => void) {
    this.host = host;
    this.onOpen = onOpen;
    this.mount();
  }

  setProjects(projects: Project[]): void {
    this.projects = projects;
    this.currentPage = 0;
    this.renderPage();
  }

  private get totalPages(): number {
    return Math.max(1, Math.ceil(this.projects.length / CARDS_PER_PAGE));
  }

  private mount(): void {
    this.host.className = 'project-carousel';
    this.host.innerHTML = `
      <button type="button" class="project-carousel-arrow project-carousel-arrow-prev" aria-label="上一页项目">
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">${ARROW_SVG.left}</svg>
      </button>
      <div class="project-carousel-viewport">
        <div class="project-grid project-grid--paged" role="list"></div>
      </div>
      <button type="button" class="project-carousel-arrow project-carousel-arrow-next" aria-label="下一页项目">
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">${ARROW_SVG.right}</svg>
      </button>
    `;

    this.prevBtn = this.host.querySelector('.project-carousel-arrow-prev') as HTMLButtonElement;
    this.nextBtn = this.host.querySelector('.project-carousel-arrow-next') as HTMLButtonElement;
    this.viewport = this.host.querySelector('.project-carousel-viewport') as HTMLElement;
    this.grid = this.host.querySelector('.project-grid') as HTMLElement;

    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'project-carousel-dots';
    dotsWrap.setAttribute('role', 'tablist');
    dotsWrap.setAttribute('aria-label', '项目分页');
    this.dotsHost = dotsWrap;
    this.host.after(dotsWrap);

    this.prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
    this.nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));

    this.resizeObserver = new ResizeObserver(() => this.syncViewportHeight());
    this.resizeObserver.observe(this.grid);
  }

  private goToPage(page: number): void {
    const clamped = Math.max(0, Math.min(page, this.totalPages - 1));
    if (clamped === this.currentPage) return;
    this.currentPage = clamped;
    this.renderPage();
  }

  private renderPage(): void {
    this.grid.classList.add('project-grid--transitioning');

    window.setTimeout(() => {
      this.disconnectLazy?.();
      this.grid.replaceChildren();

      const start = this.currentPage * CARDS_PER_PAGE;
      const pageProjects = this.projects.slice(start, start + CARDS_PER_PAGE);

      pageProjects.forEach((project) => {
        const card = createProjectCard(project, {
          onOpen: (p) => this.onOpen(p),
        });
        card.setAttribute('role', 'listitem');
        this.grid.appendChild(card);
      });

      this.disconnectLazy = observeLazyImages(this.grid);
      this.updateControls();

      requestAnimationFrame(() => {
        this.grid.classList.remove('project-grid--transitioning');
        this.syncViewportHeight(true);
      });
    }, 180);
  }

  private updateControls(): void {
    const multiPage = this.totalPages > 1;
    this.prevBtn.hidden = !multiPage;
    this.nextBtn.hidden = !multiPage;
    this.dotsHost.hidden = this.projects.length === 0;

    this.prevBtn.disabled = this.currentPage <= 0;
    this.nextBtn.disabled = this.currentPage >= this.totalPages - 1;

    this.dotsHost.replaceChildren();
    for (let i = 0; i < this.totalPages; i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'project-carousel-dot';
      dot.dataset.page = String(i);
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `第 ${i + 1} 页`);
      dot.setAttribute('aria-selected', i === this.currentPage ? 'true' : 'false');
      if (i === this.currentPage) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToPage(i));
      this.dotsHost.appendChild(dot);
    }
  }

  private syncViewportHeight(immediate = false): void {
    cancelAnimationFrame(this.heightFrame);
    this.heightFrame = requestAnimationFrame(() => {
      const nextHeight = this.grid.offsetHeight;
      if (immediate || !this.viewport.style.height) {
        this.viewport.style.height = `${nextHeight}px`;
        return;
      }
      this.viewport.style.height = `${nextHeight}px`;
    });
  }

  setVisible(visible: boolean): void {
    this.host.hidden = !visible;
    this.dotsHost.hidden = !visible || this.projects.length === 0;
  }

  dispose(): void {
    cancelAnimationFrame(this.heightFrame);
    this.resizeObserver?.disconnect();
    this.disconnectLazy?.();
    this.dotsHost.remove();
    this.host.replaceChildren();
  }
}
