import './styles/main.css';
import { AvatarScene } from './scenes/AvatarScene';
import { ScrollController } from './controllers/ScrollController';
import { QuickNav } from './ui/QuickNav';
import { ScrollHint } from './ui/ScrollHint';
import { DialogueManager } from './interactions/DialogueManager';
import { SkillsSection } from './components/sections/SkillsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { AboutSection } from './components/sections/AboutSection';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

if (!canvas) {
  throw new Error('Canvas element not found');
}

const scene = new AvatarScene(canvas);
const scrollController = new ScrollController();
const dialogueManager = new DialogueManager();

const navigateToSection = (sectionId: string) => {
  scrollController.scrollToSectionById(sectionId);
};

const quickNav = new QuickNav(navigateToSection);
const scrollHint = new ScrollHint();

new SkillsSection((tagName) => {
  scrollController.scrollToSectionById('projects-section');
  window.dispatchEvent(new CustomEvent('project-filter', { detail: tagName }));
});

new ProjectsSection();

const aboutSection = new AboutSection();

scrollController.onSectionChange((_index, sectionId) => {
  const onHero = sectionId === 'scene-section';
  scene.setHeroInteractionEnabled(onHero);
  quickNav.setActiveSection(sectionId);
  dialogueManager.onSectionChange(sectionId);
  scrollHint.setVisible(onHero);
  if (sectionId === 'about-section') {
    aboutSection.onSectionEnter();
  }
});

scene.init().then(() => {
  console.log('场景初始化完成');
  scene.start();
  scene.setHeroInteractionEnabled(true);
  scene.setOnModelClick(() => dialogueManager.onModelClick());
  dialogueManager.onSceneReady();
}).catch((error) => {
  console.error('场景初始化失败:', error);
});

window.addEventListener('resize', () => {
  scene.resize(window.innerWidth, window.innerHeight);
});
