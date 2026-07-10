export interface TypewriterOptions {
  lines: string[];
  speed?: number;
  onComplete?: () => void;
}

export class TypewriterText {
  private host: HTMLElement;
  private fullText: string;
  private speed: number;
  private onComplete?: () => void;
  private contentEl: HTMLElement;
  private cursorEl: HTMLElement;
  private paused = false;
  private cancelled = false;

  constructor(host: HTMLElement, options: TypewriterOptions) {
    this.host = host;
    this.fullText = options.lines.join('\n\n');
    this.speed = options.speed ?? 42;
    this.onComplete = options.onComplete;

    this.host.className = 'typewriter';
    this.host.innerHTML = `
      <div class="typewriter-body" role="button" tabindex="0" aria-label="点击暂停或继续打字动画">
        <div class="typewriter-stack">
          <p class="typewriter-ghost" aria-hidden="true"></p>
          <p class="typewriter-visible">
            <span class="typewriter-content"></span><span class="typewriter-cursor" aria-hidden="true"></span>
          </p>
        </div>
      </div>
    `;

    const ghostEl = this.host.querySelector('.typewriter-ghost') as HTMLElement;
    ghostEl.textContent = this.fullText;

    this.contentEl = this.host.querySelector('.typewriter-content') as HTMLElement;
    this.cursorEl = this.host.querySelector('.typewriter-cursor') as HTMLElement;

    const body = this.host.querySelector('.typewriter-body') as HTMLElement;
    body.addEventListener('click', () => this.togglePause());
    body.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.togglePause();
      }
    });
  }

  restart(): void {
    this.cancelled = true;
    this.paused = false;
    this.host.classList.remove('typewriter-paused');
    this.cursorEl.classList.remove('typewriter-cursor-done');
    this.contentEl.textContent = '';
    this.cancelled = false;
    this.typeLines();
  }

  private async typeLines(): Promise<void> {
    for (let i = 0; i < this.fullText.length; i += 1) {
      if (this.cancelled) return;

      while (this.paused && !this.cancelled) {
        await this.wait(80);
      }

      this.contentEl.textContent = this.fullText.slice(0, i + 1);
      await this.wait(this.speed);
    }

    this.cursorEl.classList.add('typewriter-cursor-done');
    this.onComplete?.();
  }

  private togglePause(): void {
    if (this.cancelled || this.cursorEl.classList.contains('typewriter-cursor-done')) return;
    this.paused = !this.paused;
    this.host.classList.toggle('typewriter-paused', this.paused);
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  dispose(): void {
    this.cancelled = true;
    this.host.replaceChildren();
  }
}
