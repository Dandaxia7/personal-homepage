import * as THREE from 'three';
import { IScene } from '../utils/types';

/**
 * 场景基类 - 提供场景管理的基础功能
 * 所有具体场景应继承此类并实现抽象方法
 */
export abstract class SceneBase implements IScene {
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected renderer: THREE.WebGLRenderer;
  protected canvas: HTMLCanvasElement;
  protected clock: THREE.Clock;
  protected isInitialized: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.clock = new THREE.Clock();
    
    this.setupRenderer();
  }

  /**
   * 配置渲染器
   */
  private setupRenderer(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
  }

  /**
   * 初始化场景 - 子类必须实现
   */
  abstract init(): Promise<void>;

  /**
   * 更新场景 - 子类必须实现
   * @param delta - 帧间隔时间（秒）
   */
  abstract update(delta: number): void;

  /**
   * 调整场景大小
   */
  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * 渲染场景
   */
  protected render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 启动渲染循环
   */
  start(): void {
    this.animate();
  }

  /**
   * 动画循环
   */
  private animate = (): void => {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    this.update(delta);
    this.render();
  };

  /**
   * 清理资源
   */
  dispose(): void {
    this.scene.clear();
    this.renderer.dispose();
  }
}