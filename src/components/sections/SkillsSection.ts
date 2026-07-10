import { SkillRadar } from '../visualization/SkillRadar';
import { TechTimeline } from '../visualization/TechTimeline';
import { TechTagCloud } from '../visualization/TechTagCloud';

export class SkillsSection {
  private root: HTMLElement;
  private radar: SkillRadar | null = null;
  private timeline: TechTimeline | null = null;
  private tagCloud: TechTagCloud | null = null;
  private onTagClick?: (tagName: string) => void;

  constructor(onTagClick?: (tagName: string) => void) {
    this.onTagClick = onTagClick;
    const mount = document.querySelector('#skills-section .skills-content');
    if (!mount) {
      throw new Error('Skills section mount point not found');
    }
    this.root = mount as HTMLElement;
    this.mount();
  }

  private mount(): void {
    this.root.className = 'skills-content';
    this.root.innerHTML = `
      <div class="skills-grid">
        <div class="skills-radar-wrap">
          <h3 class="skills-block-title">技能雷达</h3>
          <div class="skill-radar-host"></div>
        </div>
        <div class="skills-timeline-wrap">
          <h3 class="skills-block-title">成长时间线</h3>
          <div class="tech-timeline-host"></div>
        </div>
        <div class="skills-tags-wrap">
          <h3 class="skills-block-title">技术标签</h3>
          <div class="tech-tag-cloud-host"></div>
        </div>
      </div>
    `;

    const radarHost = this.root.querySelector('.skill-radar-host') as HTMLElement;
    const timelineHost = this.root.querySelector('.tech-timeline-host') as HTMLElement;
    const tagHost = this.root.querySelector('.tech-tag-cloud-host') as HTMLElement;

    this.radar = new SkillRadar(radarHost);
    this.timeline = new TechTimeline(timelineHost);
    this.tagCloud = new TechTagCloud(tagHost, undefined, this.onTagClick);
  }

  dispose(): void {
    this.radar?.dispose();
    this.timeline?.dispose();
    this.tagCloud?.dispose();
    this.root.replaceChildren();
  }
}
