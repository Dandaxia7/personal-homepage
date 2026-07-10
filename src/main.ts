import './styles/main.css';
import { AvatarScene } from './scenes/AvatarScene';
import { ScrollController } from './controllers/ScrollController';

// 获取 canvas 元素
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

if (!canvas) {
  throw new Error('Canvas element not found');
}

// 创建并初始化场景
const scene = new AvatarScene(canvas);

// 初始化场景
scene.init().then(() => {
  console.log('场景初始化完成');
  // 启动渲染循环
  scene.start();
  
  // 初始化滚动控制器
  new ScrollController();
  console.log('滚动控制器初始化完成');
}).catch((error) => {
  console.error('场景初始化失败:', error);
});

// 窗口大小改变处理
window.addEventListener('resize', () => {
  scene.resize(window.innerWidth, window.innerHeight);
});