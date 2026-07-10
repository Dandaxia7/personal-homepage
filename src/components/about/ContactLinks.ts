import { ContactLink, contactLinks as defaultLinks } from '../../data/about';

const ICONS: Record<ContactLink['id'], string> = {
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.36-3.37-1.36-.45-1.17-1.12-1.48-1.12-1.48-.92-.64.07-.63.07-.63 1.02.07 1.55 1.06 1.55 1.06.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.74 0 0 .84-.27 2.75 1.05A9.2 9.2 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.48.1 2.74.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/></svg>',
  email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>',
  blog: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V18z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14M8.34 18.34V9.66h-2.3v8.68h2.3M7.19 8.56a1.33 1.33 0 1 0 0-2.66 1.33 1.33 0 0 0 0 2.66M18.34 18.34v-4.28c0-2.28-1.22-3.34-2.84-3.34-1.31 0-1.89.72-2.22 1.24v-1.07h-2.3c.03.71 0 7.58 0 7.58h2.3v-4.23c0-.21.02-.43.08-.58.18-.43.59-.88 1.28-.88.9 0 1.26.67 1.26 1.66v3.95h2.44z"/></svg>',
};

export class ContactLinks {
  private host: HTMLElement;
  private tooltip: HTMLElement;
  private toastTimer = 0;

  constructor(host: HTMLElement, links: ContactLink[] = defaultLinks) {
    this.host = host;
    this.host.className = 'contact-links';

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'contact-tooltip';
    this.tooltip.hidden = true;

    this.host.append(this.tooltip);
    this.render(links);
  }

  private render(links: ContactLink[]): void {
    links.forEach((link) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `contact-link contact-link-${link.id}`;
      button.setAttribute('aria-label', link.label);
      button.innerHTML = ICONS[link.id];

      button.addEventListener('mouseenter', (event) => {
        this.showTooltip(event.currentTarget as HTMLElement, link.label);
      });
      button.addEventListener('mouseleave', () => {
        this.tooltip.hidden = true;
      });
      button.addEventListener('focus', (event) => {
        this.showTooltip(event.currentTarget as HTMLElement, link.label);
      });
      button.addEventListener('blur', () => {
        this.tooltip.hidden = true;
      });

      button.addEventListener('click', () => this.handleClick(link, button));

      this.host.appendChild(button);
    });
  }

  private showTooltip(anchor: HTMLElement, label: string): void {
    const rect = anchor.getBoundingClientRect();
    const hostRect = this.host.getBoundingClientRect();
    this.tooltip.hidden = false;
    this.tooltip.textContent = label;
    this.tooltip.style.left = `${rect.left - hostRect.left + rect.width / 2}px`;
    this.tooltip.style.top = `${rect.top - hostRect.top - 8}px`;
  }

  private async handleClick(link: ContactLink, button: HTMLElement): Promise<void> {
    if (link.id === 'email' && link.email) {
      try {
        await navigator.clipboard.writeText(link.email);
        this.flashTooltip(button, '已复制email地址');
      } catch {
        this.flashTooltip(button, '已复制email地址');
      }
      return;
    }

    if (link.url) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  }

  private flashTooltip(anchor: HTMLElement, message: string): void {
    window.clearTimeout(this.toastTimer);
    this.showTooltip(anchor, message);
    this.toastTimer = window.setTimeout(() => {
      this.tooltip.hidden = true;
    }, 1600);
  }

  dispose(): void {
    window.clearTimeout(this.toastTimer);
    this.host.replaceChildren();
  }
}
