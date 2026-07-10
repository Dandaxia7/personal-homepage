import * as THREE from 'three';

/**
 * 眼珠追踪器 - 在眼球内添加眼珠并跟随鼠标移动
 */
export class EyeTracker {
  private model: THREE.Object3D;
  private mouse: THREE.Vector2;
  private leftEyeBall: THREE.Mesh | null = null;
  private rightEyeBall: THREE.Mesh | null = null;
  private leftEyeSocket: THREE.Object3D | null = null;
  private rightEyeSocket: THREE.Object3D | null = null;
  private enabled: boolean = true;

  // 眼珠基础位置（相对于模型）
  private leftEyeBasePosition: THREE.Vector3 = new THREE.Vector3();
  private rightEyeBasePosition: THREE.Vector3 = new THREE.Vector3();

  // 眼珠移动限制
  private readonly maxOffsetX = 0.04; // 水平偏移
  private readonly maxOffsetYUp = 0.04; // 向上偏移（较小）
  private readonly maxOffsetYDown = 0.08; // 向下偏移（较大）
  private readonly lerpFactor = 0.08; // 插值系数

  // 当前眼珠偏移
  private leftEyeOffset: THREE.Vector3 = new THREE.Vector3();
  private rightEyeOffset: THREE.Vector3 = new THREE.Vector3();
  private targetOffset: THREE.Vector3 = new THREE.Vector3();

  constructor(model: THREE.Object3D) {
    this.model = model;
    this.mouse = new THREE.Vector2();
    this.findEyes();
    this.createEyeBalls();
    this.bindEvents();
  }

  /**
   * 查找模型中的眼球
   */
  private findEyes(): void {
    // 先打印模型中所有节点名称，用于调试
    console.log('=== 模型节点列表 ===');
    this.model.traverse((child) => {
      console.log('节点:', child.name, '类型:', child.type);
    });
    console.log('===================');
    
    this.model.traverse((child) => {
      const name = child.name.toLowerCase();
      
      // 查找左眼
      if (!this.leftEyeSocket && (
        (name.includes('left') && name.includes('eye')) ||
        name.includes('lefteye') ||
        name.includes('左眼')
      )) {
        this.leftEyeSocket = child;
        console.log('找到左眼:', child.name);
      }
      
      // 查找右眼
      if (!this.rightEyeSocket && (
        (name.includes('right') && name.includes('eye')) ||
        name.includes('righteye') ||
        name.includes('右眼')
      )) {
        this.rightEyeSocket = child;
        console.log('找到右眼:', child.name);
      }
    });

    // 如果没有找到左右眼，尝试查找通用的眼睛
    if (!this.leftEyeSocket || !this.rightEyeSocket) {
      this.model.traverse((child) => {
        if (child.name.toLowerCase().includes('eye')) {
          if (!this.leftEyeSocket) {
            this.leftEyeSocket = child;
          } else if (!this.rightEyeSocket && child !== this.leftEyeSocket) {
            this.rightEyeSocket = child;
          }
        }
      });
    }
  }

  /**
   * 创建眼珠
   */
  private createEyeBalls(): void {
    // 计算模型边界框来估计眼睛位置
    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    console.log('模型尺寸:', size);
    console.log('模型中心:', center);
    
    // 根据模型尺寸计算眼睛位置
    // 模型尺寸约 x:2, y:2, z:1.93，中心在 y:1
    const eyeY = center.y  * 0 + size.y * 0.0;   // 眼睛在模型中心偏上 30%
    const eyeZ = center.z + size.z * 0.34;   // 眼睛大幅前移，确保可见
    const eyeSpacing = size.x * 0.15;       // 两眼间距
    const eyeRadius = size.x * 0.03;        // 眼珠大小（更大）

    // 创建眼珠几何体和材质
    const geometry = new THREE.SphereGeometry(eyeRadius, 16, 16);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x9370db, // 紫色
    });

    // 创建左眼珠
    this.leftEyeBall = new THREE.Mesh(geometry, material.clone());
    this.leftEyeBall.name = 'leftEyeBall';
    
    // 创建右眼珠
    this.rightEyeBall = new THREE.Mesh(geometry, material.clone());
    this.rightEyeBall.name = 'rightEyeBall';

    // 直接添加到模型根节点，使用计算的位置
    console.log('左眼位置:', -eyeSpacing, eyeY, eyeZ);
    console.log('右眼位置:', eyeSpacing + 0.02, eyeY, eyeZ);
    
    this.model.add(this.leftEyeBall);
    this.leftEyeBall.position.set(-eyeSpacing, eyeY, eyeZ);
    this.leftEyeBasePosition.set(-eyeSpacing, eyeY, eyeZ);
    
    this.model.add(this.rightEyeBall);
    this.rightEyeBall.position.set(eyeSpacing + 0.02, eyeY, eyeZ);
    this.rightEyeBasePosition.set(eyeSpacing + 0.02, eyeY, eyeZ);
  }

  /**
   * 绑定鼠标事件
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
  }

  /**
   * 更新眼珠位置 - 眼珠跟随模型旋转，同时在眼睛范围内跟随鼠标移动
   */
  update(): void {
    if (!this.enabled) return;

    // 计算目标偏移（基于鼠标位置）
    this.targetOffset.x = this.mouse.x * this.maxOffsetX;
    // 向上偏移量减小，向下保持原样
    this.targetOffset.y = this.mouse.y > 0 
      ? this.mouse.y * this.maxOffsetYUp 
      : this.mouse.y * this.maxOffsetYDown;

    // 平滑插值
    this.leftEyeOffset.x += (this.targetOffset.x - this.leftEyeOffset.x) * this.lerpFactor;
    this.leftEyeOffset.y += (this.targetOffset.y - this.leftEyeOffset.y) * this.lerpFactor;
    
    this.rightEyeOffset.x += (this.targetOffset.x - this.rightEyeOffset.x) * this.lerpFactor;
    this.rightEyeOffset.y += (this.targetOffset.y - this.rightEyeOffset.y) * this.lerpFactor;

    // 更新眼珠位置 = 基础位置 + 鼠标偏移
    // 眼珠已添加到模型中，会自动跟随模型旋转，这里只需更新相对偏移
    if (this.leftEyeBall) {
      this.leftEyeBall.position.x = this.leftEyeBasePosition.x + this.leftEyeOffset.x;
      this.leftEyeBall.position.y = this.leftEyeBasePosition.y + this.leftEyeOffset.y;
    }

    if (this.rightEyeBall) {
      this.rightEyeBall.position.x = this.rightEyeBasePosition.x + this.rightEyeOffset.x;
      this.rightEyeBall.position.y = this.rightEyeBasePosition.y + this.rightEyeOffset.y;
    }
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
   * 重置眼珠位置
   */
  reset(): void {
    this.leftEyeOffset.set(0, 0, 0);
    this.rightEyeOffset.set(0, 0, 0);
    this.targetOffset.set(0, 0, 0);
  }

  /**
   * 清理资源
   */
  dispose(): void {
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    
    if (this.leftEyeBall) {
      this.leftEyeBall.geometry.dispose();
      if (this.leftEyeBall.material instanceof THREE.Material) {
        this.leftEyeBall.material.dispose();
      }
    }
    
    if (this.rightEyeBall) {
      this.rightEyeBall.geometry.dispose();
      if (this.rightEyeBall.material instanceof THREE.Material) {
        this.rightEyeBall.material.dispose();
      }
    }
  }
}