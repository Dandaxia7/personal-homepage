import * as THREE from 'three';
import { BounceAnimation } from '../utils/AnimationHelper';

/**
 * 点击处理器 - 检测点击模型并触发动画
 */
export class ClickHandler {
  private camera: THREE.Camera;
  private target: THREE.Object3D;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private bounceAnimation: BounceAnimation;
  private cooldown: boolean = false;
  private readonly cooldownTime: number = 500; // 冷却时间（毫秒）
  private enabled = true;
  private onModelClickCallback: (() => void) | null = null;
  private readonly boundOnClick = this.onClick.bind(this);

  constructor(camera: THREE.Camera, target: THREE.Object3D) {
    this.camera = camera;
    this.target = target;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // 创建弹跳动画
    this.bounceAnimation = new BounceAnimation((scale) => {
      target.scale.setScalar(scale);
    });

    this.bindEvents();
  }

  /**
   * 绑定事件监听
   */
  private bindEvents(): void {
    window.addEventListener('click', this.boundOnClick);
  }

  /**
   * 点击处理
   */
  private onClick(event: MouseEvent): void {
    if (!this.enabled || this.cooldown) return;

    // 计算鼠标位置
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 设置射线
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 检测交叉
    const intersects = this.raycaster.intersectObject(this.target, true);

    if (intersects.length > 0) {
      this.onModelClick();
    }
  }

  setOnModelClick(callback: () => void): void {
    this.onModelClickCallback = callback;
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  /**
   * 模型被点击
   */
  private onModelClick(): void {
    // 设置冷却
    this.cooldown = true;
    setTimeout(() => {
      this.cooldown = false;
    }, this.cooldownTime);

    // 播放弹跳动画
    this.bounceAnimation.play();
    this.onModelClickCallback?.();
  }

  /**
   * 更新动画
   */
  update(): void {
    this.bounceAnimation.update();
  }

  /**
   * 清理资源
   */
  dispose(): void {
    window.removeEventListener('click', this.boundOnClick);
    this.bounceAnimation.stop();
  }
}