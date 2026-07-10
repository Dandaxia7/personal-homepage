import {
  Project,
  projects as allProjects,
} from '../../data/projects';
import { ProjectCarousel } from '../projects/ProjectCarousel';
import { FilterValue, ProjectFilter } from '../projects/ProjectFilter';
import { ProjectModal } from '../projects/ProjectModal';

export class ProjectsSection {
  private root: HTMLElement;
  private carouselHost: HTMLElement;
  private carousel: ProjectCarousel;
  private filter: ProjectFilter;
  private modal: ProjectModal;
  private categoryFilter: FilterValue = 'all';
  private tagFilter: string | null = null;
  private readonly boundProjectFilter = this.onProjectFilter.bind(this);

  constructor(projectList: Project[] = allProjects) {
    this.allProjects = projectList;
    const mount = document.querySelector('#projects-section .projects-content');
    if (!mount) {
      throw new Error('Projects section mount point not found');
    }
    this.root = mount as HTMLElement;
    this.modal = new ProjectModal();
    this.mount();
    window.addEventListener('project-filter', this.boundProjectFilter as EventListener);
  }

  private allProjects: Project[];

  private mount(): void {
    this.root.className = 'projects-content';
    this.root.innerHTML = `
      <div class="project-filter-host"></div>
      <div class="project-carousel-host"></div>
      <p class="project-empty" hidden>暂无匹配的项目</p>
    `;

    const filterHost = this.root.querySelector('.project-filter-host') as HTMLElement;
    this.carouselHost = this.root.querySelector('.project-carousel-host') as HTMLElement;

    this.carousel = new ProjectCarousel(this.carouselHost, (project) => {
      this.modal.open(project);
    });

    this.filter = new ProjectFilter(filterHost, {
      onChange: (value) => {
        this.categoryFilter = value;
        this.tagFilter = null;
        this.applyFilter();
      },
    });

    this.applyFilter();
  }

  private onProjectFilter(event: Event): void {
    const tagName = (event as CustomEvent<string>).detail;
    if (!tagName) return;

    this.tagFilter = tagName;
    this.categoryFilter = 'all';
    this.filter.setActive('all');
    this.applyFilter();
  }

  private getFilteredProjects(): Project[] {
    return this.allProjects.filter((project) => {
      const categoryMatch =
        this.categoryFilter === 'all' || project.category === this.categoryFilter;
      const tagMatch =
        !this.tagFilter ||
        project.techStack.some(
          (tech) => tech.toLowerCase() === this.tagFilter!.toLowerCase()
        );
      return categoryMatch && tagMatch;
    });
  }

  private applyFilter(): void {
    const list = this.getFilteredProjects();
    const emptyEl = this.root.querySelector('.project-empty') as HTMLElement;

    emptyEl.hidden = list.length > 0;
    this.carousel.setVisible(list.length > 0);
    this.carousel.setProjects(list);
  }

  dispose(): void {
    window.removeEventListener('project-filter', this.boundProjectFilter as EventListener);
    this.carousel.dispose();
    this.filter.dispose();
    this.modal.dispose();
    this.root.replaceChildren();
  }
}
