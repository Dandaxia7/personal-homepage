import { profileIntro } from '../../data/about';
import { ContactLinks } from '../about/ContactLinks';
import { TypewriterText } from '../about/TypewriterText';

export class AboutSection {
  private root: HTMLElement;
  private typewriter: TypewriterText | null = null;
  private contacts: ContactLinks | null = null;

  constructor() {
    const mount = document.querySelector('#about-section .about-content');
    if (!mount) {
      throw new Error('About section mount point not found');
    }
    this.root = mount as HTMLElement;
    this.mount();
  }

  private mount(): void {
    this.root.className = 'about-content';
    this.root.innerHTML = `
      <div class="about-intro-host"></div>
      <div class="about-footer">
        <div class="contact-links-host"></div>
      </div>
    `;

    const introHost = this.root.querySelector('.about-intro-host') as HTMLElement;
    const contactHost = this.root.querySelector('.contact-links-host') as HTMLElement;

    this.typewriter = new TypewriterText(introHost, { lines: profileIntro.lines });
    this.contacts = new ContactLinks(contactHost);
  }

  onSectionEnter(): void {
    this.typewriter?.restart();
  }

  dispose(): void {
    this.typewriter?.dispose();
    this.contacts?.dispose();
    this.root.replaceChildren();
  }
}
