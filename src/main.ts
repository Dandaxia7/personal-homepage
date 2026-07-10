import './styles/main.css';
import { AvatarScene } from './scenes/AvatarScene';
import { ScrollController } from './controllers/ScrollController';
import { QuickNav } from './ui/QuickNav';
import { ScrollHint } from './ui/ScrollHint';
import { DialogueManager } from './interactions/DialogueManager';

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

scrollController.onSectionChange((_index, sectionId) => {
  quickNav.setActiveSection(sectionId);
  dialogueManager.onSectionChange(sectionId);
  scrollHint.setVisible(sectionId === 'scene-section');
});

scene.init().then(() => {
  console.log('场景初始化完成');
  scene.start();
  scene.setOnModelClick(() => dialogueManager.onModelClick());
  dialogueManager.onSceneReady();
}).catch((error) => {
  console.error('场景初始化失败:', error);
});

window.addEventListener('resize', () => {
  scene.resize(window.innerWidth, window.innerHeight);
});
