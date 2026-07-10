import * as THREE from 'three';

/**
 * 鼠标追踪器 - 让目标跟随鼠标方向旋转
 */
export class MouseTracker {
  private target: THREE.Object3D;
  private mouse: THREE.Vector2;
  private targetRotation: THREE.Euler;
  private currentRotation: THREE.Euler;
  private enabled: boolean = true;

  // 旋转限制
  private readonly maxXRotation = Math.PI / 18; // ±10° (向上角度更小，因为模型底部是平的)
  private readonly maxYRotation = Math.PI / 4;  // ±45°
  private readonly lerpFactor = 0.08;            // 插值系数

  constructor(target: THREE.Object3D) {
    this.target = target;
    this.mouse = new THREE.Vector2();
    this.targetRotation = new THREE.Euler();
    this.currentRotation = new THREE.Euler();

    this.bindEvents();
  }

  /**
   * 绑定事件监听
   */
  private bindEvents(): void {
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  /**
   * 鼠标移动处理
   */
  private onMouseMove(event: MouseEvent): void {
    if (!this.enabled) return;

    // 计算归一化鼠标位置 (-1 到 1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 计算目标旋转角度
    this.targetRotation.y = this.mouse.x * this.maxYRotation;
    this.targetRotation.x = -this.mouse.y * this.maxXRotation;
  }

  /**
   * 更新旋转
   */
  update(): void {
    if (!this.enabled) return;

    // 平滑插值
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * this.lerpFactor;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * this.lerpFactor;

    // 应用旋转
    this.target.rotation.x = this.currentRotation.x;
    this.target.rotation.y = this.currentRotation.y;
  }

  /**
   * 启用追踪
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * 禁用追踪
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * 重置旋转
   */
  reset(): void {
    this.targetRotation.set(0, 0, 0);
    this.currentRotation.set(0, 0, 0);
  }

  /**
   * 清理资源
   */
  dispose(): void {
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
  }
}