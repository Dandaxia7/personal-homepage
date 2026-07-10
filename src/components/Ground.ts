import * as THREE from 'three';

/**
 * 发光圆盘地面 - 创建角色脚下的发光效果
 */
export class Ground {
  private geometry: THREE.CircleGeometry;
  private material: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;

  constructor(radius: number = 3, color: THREE.ColorRepresentation = 0xFFB6C1) {
    // 创建圆形几何体
    this.geometry = new THREE.CircleGeometry(radius, 64);
    
    // 创建自定义着色器材质
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        varying vec2 vUv;
        
        void main() {
          // 计算到中心的距离
          float dist = length(vUv - 0.5) * 2.0;
          
          // 径向渐变透明度
          float alpha = 1.0 - smoothstep(0.0, 1.0, dist);
          alpha *= 0.6;
          
          // 添加脉冲效果
          float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
          alpha *= pulse;
          
          // 边缘发光效果
          float glow = exp(-dist * 2.0) * 0.3;
          
          gl_FragColor = vec4(uColor + glow, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    
    // 旋转到水平位置
    this.mesh.rotation.x = -Math.PI / 2;
    
    // 位置略低于角色脚底
    this.mesh.position.y = -0.01;
  }

  /**
   * 更新动画
   */
  update(delta: number): void {
    this.material.uniforms.uTime.value += delta;
  }

  /**
   * 获取 Mesh 对象
   */
  getMesh(): THREE.Mesh {
    return this.mesh;
  }

  /**
   * 更新颜色
   */
  setColor(color: THREE.ColorRepresentation): void {
    this.material.uniforms.uColor.value.set(color);
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}