import * as THREE from 'three';

/**
 * 樱花粒子系统 - 创建飘落的樱花花瓣效果
 */
export class ParticleSystem {
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private points: THREE.Points;
  private velocities: Float32Array;
  private sways: Float32Array;
  private rotations: Float32Array;
  private count: number;
  private bounds: THREE.Vector3;

  constructor(count: number = 200, bounds: THREE.Vector3 = new THREE.Vector3(10, 20, 10)) {
    this.count = count;
    this.bounds = bounds;
    
    // 创建几何体
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    this.sways = new Float32Array(count);
    this.rotations = new Float32Array(count);

    // 初始化粒子
    for (let i = 0; i < count; i++) {
      // 位置
      positions[i * 3] = (Math.random() - 0.5) * bounds.x;     // x
      positions[i * 3 + 1] = Math.random() * bounds.y;          // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * bounds.z;  // z

      // 颜色（浅粉、白色、淡黄的混合）
      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        // 浅粉色
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.85 + Math.random() * 0.1;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (colorChoice < 0.85) {
        // 白色
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      } else {
        // 淡黄色
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      }

      // 速度
      this.velocities[i * 3] = (Math.random() - 0.5) * 0.002;  // x 方向漂移
      this.velocities[i * 3 + 1] = -Math.random() * 0.015 - 0.005; // 下落速度
      this.velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;  // z 方向漂移

      // 摆动参数
      this.sways[i] = Math.random() * 0.02 + 0.01;
      this.rotations[i] = Math.random() * Math.PI * 2;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // 创建材质 - 使用圆形粒子而不是方形
    this.material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      // 使用圆形纹理让粒子更柔和
      map: this.createCircleTexture(),
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(this.geometry, this.material);
  }

  /**
   * 创建圆形纹理（让粒子更柔和，更像花瓣）
   */
  private createCircleTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    
    // 绘制柔和的圆形（模拟花瓣形状）
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    // 绘制椭圆形（更像花瓣）
    ctx.ellipse(32, 32, 28, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * 更新粒子状态
   */
  update(_delta: number): void {
    const positions = this.geometry.attributes.position.array as Float32Array;
    const time = performance.now() * 0.001;

    for (let i = 0; i < this.count; i++) {
      // 更新位置
      positions[i * 3] += this.velocities[i * 3] + Math.sin(time + this.rotations[i]) * this.sways[i];
      positions[i * 3 + 1] += this.velocities[i * 3 + 1];
      positions[i * 3 + 2] += this.velocities[i * 3 + 2];

      // 如果粒子落到地面以下，重置到顶部
      if (positions[i * 3 + 1] < -5) {
        positions[i * 3] = (Math.random() - 0.5) * this.bounds.x;
        positions[i * 3 + 1] = this.bounds.y;
        positions[i * 3 + 2] = (Math.random() - 0.5) * this.bounds.z;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * 获取 Points 对象
   */
  getPoints(): THREE.Points {
    return this.points;
  }

  /**
   * 更新粒子颜色（根据主题）
   */
  updateColor(color: THREE.ColorRepresentation): void {
    this.material.color.set(color);
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}