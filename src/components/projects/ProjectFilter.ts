import { ProjectCategory, projectCategoryLabels } from '../../data/projects';

export type FilterValue = ProjectCategory | 'all';

export interface ProjectFilterOptions {
  onChange: (value: FilterValue) => void;
}

const FILTER_ORDER: FilterValue[] = ['all', '3d', 'web', 'tool', 'learning'];

export class ProjectFilter {
  private container: HTMLElement;
  private active: FilterValue = 'all';
  private onChange: (value: FilterValue) => void;
  private buttons = new Map<FilterValue, HTMLButtonElement>();

  constructor(container: HTMLElement, options: ProjectFilterOptions) {
    this.container = container;
    this.onChange = options.onChange;
    this.container.className = 'project-filter';
    this.container.setAttribute('role', 'tablist');
    this.container.setAttribute('aria-label', '项目分类筛选');
    this.render();
  }

  setActive(value: FilterValue): void {
    if (this.active === value) return;
    this.active = value;
    this.updateActiveState();
  }

  getActive(): FilterValue {
    return this.active;
  }

  private render(): void {
    FILTER_ORDER.forEach((value) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'project-filter-btn';
      button.dataset.filter = value;
      button.textContent = projectCategoryLabels[value];
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', value === this.active ? 'true' : 'false');

      button.addEventListener('click', () => {
        this.active = value;
        this.updateActiveState();
        this.onChange(value);
      });

      this.buttons.set(value, button);
      this.container.appendChild(button);
    });

    this.updateActiveState();
  }

  private updateActiveState(): void {
    this.buttons.forEach((button, value) => {
      const isActive = value === this.active;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  dispose(): void {
    this.container.replaceChildren();
    this.container.classList.remove('project-filter');
    this.buttons.clear();
  }
}
