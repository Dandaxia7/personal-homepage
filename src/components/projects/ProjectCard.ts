import { Project, projectCategoryLabels } from '../../data/projects';

export interface ProjectCardOptions {
  onOpen: (project: Project, cardEl: HTMLElement) => void;
}

export function createProjectCard(project: Project, options: ProjectCardOptions): HTMLElement {
  const card = document.createElement('article');
  card.className = 'project-card';
  card.dataset.projectId = project.id;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `查看项目详情：${project.title}`);

  const thumbClass = project.thumbnail
    ? 'project-card-thumb'
    : `project-card-thumb project-card-thumb--${project.category}`;

  const thumbInner = project.thumbnail
    ? `<img class="project-card-image" alt="${project.title} 预览图" data-src="${project.thumbnail}" />`
    : `<span class="project-card-thumb-label">${project.title.charAt(0)}</span>`;

  const techTags = project.techStack
    .slice(0, 4)
    .map((tech) => `<span class="project-card-tech">${tech}</span>`)
    .join('');

  const extraTech =
    project.techStack.length > 4
      ? `<span class="project-card-tech project-card-tech-more">+${project.techStack.length - 4}</span>`
      : '';

  card.innerHTML = `
    <div class="${thumbClass}">${thumbInner}</div>
    <div class="project-card-body">
      <span class="project-card-category">${projectCategoryLabels[project.category]}</span>
      <h3 class="project-card-title">${project.title}</h3>
      <p class="project-card-desc">${project.description}</p>
      <div class="project-card-techs">${techTags}${extraTech}</div>
    </div>
  `;

  const open = () => options.onOpen(project, card);

  card.addEventListener('click', open);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });

  return card;
}
