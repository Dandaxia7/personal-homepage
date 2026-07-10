/**
 * 角色台词气泡
 */
export class DialogueBubble {
  private element: HTMLElement;
  private textElement: HTMLElement;
  private hideTimeout: number | null = null;
  private isVisible = false;

  constructor() {
    this.element = document.createElement('div');
    this.element.id = 'dialogue-bubble';
    this.element.className = 'dialogue-bubble';
    this.element.setAttribute('role', 'status');
    this.element.setAttribute('aria-live', 'polite');
    this.element.innerHTML = `
      <div class="dialogue-bubble-content">
        <p class="dialogue-bubble-text"></p>
      </div>
      <div class="dialogue-bubble-tail"></div>
    `;
    this.textElement = this.element.querySelector('.dialogue-bubble-text')!;
    document.body.appendChild(this.element);
  }

  show(text: string, duration = 4000): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    this.textElement.textContent = text;
    this.element.classList.add('visible');
    this.isVisible = true;

    this.hideTimeout = window.setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide(): void {
    this.element.classList.remove('visible');
    this.isVisible = false;
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  get visible(): boolean {
    return this.isVisible;
  }

  dispose(): void {
    this.hide();
    this.element.remove();
  }
}
