import * as THREE from 'three';

/**
 * 光照系统 - 三点光源设置
 */
export class Lighting {
  private mainLight: THREE.DirectionalLight;
  private fillLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;
  private rimLight: THREE.DirectionalLight;

  constructor() {
    // 主光源（Key Light）- 右前方
    this.mainLight = new THREE.DirectionalLight(0xFFF8DC, 1.8);
    this.mainLight.position.set(3, 5, 3);
    this.mainLight.castShadow = true;

    // 补光（Fill Light）- 左侧
    this.fillLight = new THREE.DirectionalLight(0xFFB6C1, 0.6);
    this.fillLight.position.set(-2, 3, 2);

    // 环境光 - 整体提亮
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);

    // 边缘光（Rim Light）- 后方，增加立体感
    this.rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.rimLight.position.set(0, 3, -5);
  }

  /**
   * 将所有光源添加到场景
   */
  addToScene(scene: THREE.Scene): void {
    scene.add(this.mainLight);
    scene.add(this.fillLight);
    scene.add(this.ambientLight);
    scene.add(this.rimLight);
  }

  /**
   * 更新主光源强度
   */
  setMainLightIntensity(intensity: number): void {
    this.mainLight.intensity = intensity;
  }

  /**
   * 更新补光颜色（可根据主题调整）
   */
  setFillLightColor(color: THREE.ColorRepresentation): void {
    this.fillLight.color.set(color);
  }

  /**
   * 清理资源
   */
  dispose(): void {
    // DirectionalLight 没有需要手动释放的资源
  }
}