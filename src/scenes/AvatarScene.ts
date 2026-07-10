import * as THREE from 'three';
import { SceneBase } from './SceneBase';
import { Model } from '../components/Model';
import { Lighting } from '../components/Lighting';
import { ParticleSystem } from '../components/ParticleSystem';
import { Ground } from '../components/Ground';
import { MouseTracker } from '../interactions/MouseTracker';
import { ClickHandler } from '../interactions/ClickHandler';
import { EyeTracker } from '../interactions/EyeTracker';
import { LoadingScreen } from '../ui/LoadingScreen';

/**
 * 头像展示场景
 */
export class AvatarScene extends SceneBase {
  private model: Model;
  private lighting: Lighting;
  private particleSystem: ParticleSystem;
  private ground: Ground;
  private mouseTracker: MouseTracker | null = null;
  private clickHandler: ClickHandler | null = null;
  private eyeTracker: EyeTracker | null = null;
  private loadingScreen: LoadingScreen;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.model = new Model();
    this.lighting = new Lighting();
    // 粒子系统覆盖更大的垂直范围（3个区域的高度）
    this.particleSystem = new ParticleSystem(300, new THREE.Vector3(15, 30, 15));
    this.ground = new Ground(3, 0xFFB6C1);
    this.loadingScreen = new LoadingScreen();
  }

  /**
   * 初始化场景
   */
  async init(): Promise<void> {
    // 设置相机位置 - 调整以覆盖多个区域
    // 相机位置不变，但粒子系统覆盖更大的范围
    this.camera.position.set(0, 1.2, 2.5);
    this.camera.lookAt(0, 1.2, 0);

    // 添加光照
    this.lighting.addToScene(this.scene);

    // 添加地面
    this.scene.add(this.ground.getMesh());

    // 添加粒子系统
    this.scene.add(this.particleSystem.getPoints());

    // 加载模型
    try {
      this.loadingScreen.updateTip('正在加载 3D 模型...');
      
      await this.model.load(
        '/chibi_anime_girl_web_preview.glb',
        (percent) => {
          this.loadingScreen.updateProgress(percent);
        }
      );

      // 将模型添加到场景
      const modelGroup = this.model.getModel();
      if (modelGroup) {
        this.scene.add(modelGroup);
        
        // 初始化鼠标追踪器
        this.mouseTracker = new MouseTracker(modelGroup);
        
        // 初始化点击处理器
        this.clickHandler = new ClickHandler(this.camera, modelGroup);
        
        // 初始化眼珠追踪器
        this.eyeTracker = new EyeTracker(modelGroup);
      }

      // 隐藏加载界面
      this.loadingScreen.updateProgress(100);
      setTimeout(() => {
        this.loadingScreen.hide();
      }, 500);

      this.isInitialized = true;
    } catch (error) {
      console.error('场景初始化失败:', error);
      this.loadingScreen.updateTip('加载失败，请刷新页面重试');
    }
  }

  /**
   * 更新场景
   */
  update(delta: number): void {
    if (!this.isInitialized) return;

    // 更新模型动画
    this.model.update(delta);
    
    // 更新粒子系统
    this.particleSystem.update(delta);
    
    // 更新地面动画
    this.ground.update(delta);
    
    // 更新鼠标追踪
    if (this.mouseTracker) {
      this.mouseTracker.update();
    }
    
    // 更新眼珠追踪
    if (this.eyeTracker) {
      this.eyeTracker.update();
    }
    
    // 更新点击处理
    if (this.clickHandler) {
      this.clickHandler.update();
    }
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.model.dispose();
    this.lighting.dispose();
    this.particleSystem.dispose();
    this.ground.dispose();
    if (this.mouseTracker) {
      this.mouseTracker.dispose();
    }
    if (this.clickHandler) {
      this.clickHandler.dispose();
    }
    if (this.eyeTracker) {
      this.eyeTracker.dispose();
    }
    super.dispose();
  }
}