import { DialogueBubble } from '../ui/DialogueBubble';
import { DialogueContext, getRandomDialogue } from '../data/dialogues';

/**
 * 角色台词管理器
 * 负责触发时机与台词内容调度
 */
export class DialogueManager {
  private bubble: DialogueBubble;
  private idleTimer: number | null = null;
  private hasShownFirstVisit = false;
  private lastSectionId: string | null = null;
  private readonly idleDelay = 10000;

  constructor() {
    this.bubble = new DialogueBubble();
  }

  /** 场景加载完成后显示欢迎语 */
  onSceneReady(): void {
    if (this.hasShownFirstVisit) return;
    this.hasShownFirstVisit = true;

    setTimeout(() => {
      this.show('firstVisit', 5000);
      this.resetIdleTimer();
    }, 800);
  }

  /** 区域切换时显示对应台词 */
  onSectionChange(sectionId: string): void {
    if (sectionId === this.lastSectionId) return;
    this.lastSectionId = sectionId;
    this.resetIdleTimer();

    const contextMap: Record<string, DialogueContext | null> = {
      'scene-section': null,
      'skills-section': 'skills',
      'projects-section': 'projects',
      'about-section': 'contact',
    };

    const context = contextMap[sectionId];
    if (context) {
      this.show(context);
    } else if (sectionId !== 'scene-section') {
      this.show('scrolling');
    }
  }

  /** 点击角色时显示随机台词 */
  onModelClick(): void {
    this.resetIdleTimer();
    this.show('click', 3000);
  }

  /** 页面停留超时显示 idle 台词 */
  private resetIdleTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    this.idleTimer = window.setTimeout(() => {
      if (!this.bubble.visible) {
        this.show('idle', 4000);
      }
      this.resetIdleTimer();
    }, this.idleDelay);
  }

  private show(context: DialogueContext, duration?: number): void {
    const text = getRandomDialogue(context);
    this.bubble.show(text, duration);
  }

  dispose(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    this.bubble.dispose();
  }
}
