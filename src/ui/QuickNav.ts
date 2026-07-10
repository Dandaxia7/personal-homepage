export interface QuickNavItem {
  id: string;
  label: string;
  icon: string;
  sectionId: string;
}

/**
 * 右侧快速导航悬浮按钮
 */
export class QuickNav {
  private element: HTMLElement;
  private onNavigate: (sectionId: string) => void;

  private readonly items: QuickNavItem[] = [
    {
      id: 'skills',
      label: '技能',
      icon: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" fill="currentColor"/></svg>',
      sectionId: 'skills-section',
    },
    {
      id: 'projects',
      label: '项目',
      icon: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor"/></svg>',
      sectionId: 'projects-section',
    },
    {
      id: 'contact',
      label: '联系',
      icon: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13.5C8 13.5 2 9.5 2 5.5C2 3.5 3.5 2 5.5 2C6.6 2 7.5 2.5 8 3.3C8.5 2.5 9.4 2 10.5 2C12.5 2 14 3.5 14 5.5C14 9.5 8 13.5 8 13.5Z" fill="currentColor"/></svg>',
      sectionId: 'about-section',
    },
  ];

  constructor(onNavigate: (sectionId: string) => void) {
    this.onNavigate = onNavigate;
    this.element = this.createElement();
    document.body.appendChild(this.element);
    this.bindEvents();
  }

  private createElement(): HTMLElement {
    const nav = document.createElement('nav');
    nav.id = 'quick-nav';
    nav.className = 'quick-nav';
    nav.setAttribute('aria-label', '快速导航');

    nav.innerHTML = this.items
      .map(
        (item) => `
        <button class="quick-nav-btn" data-section="${item.sectionId}" aria-label="${item.label}">
          <span class="quick-nav-icon">${item.icon}</span>
          <span class="quick-nav-label">${item.label}</span>
        </button>
      `
      )
      .join('');

    return nav;
  }

  private bindEvents(): void {
    this.element.querySelectorAll('.quick-nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sectionId = (btn as HTMLElement).dataset.section!;
        this.onNavigate(sectionId);
      });
    });
  }

  setActiveSection(sectionId: string): void {
    this.element.querySelectorAll('.quick-nav-btn').forEach((btn) => {
      const el = btn as HTMLElement;
      el.classList.toggle('active', el.dataset.section === sectionId);
    });
  }

  dispose(): void {
    this.element.remove();
  }
}
