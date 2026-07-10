import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * 加载进度回调
 */
export type ProgressCallback = (percent: number) => void;

/**
 * 模型加载器 - 处理 GLB/GLTF 模型的加载和管理
 */
export class Model {
  private loader: GLTFLoader;
  private model: THREE.Group | null = null;
  private mixer: THREE.AnimationMixer | null = null;

  constructor() {
    this.loader = new GLTFLoader();
  }

  /**
   * 加载模型
   * @param url - 模型文件路径
   * @param onProgress - 加载进度回调
   */
  async load(url: string, onProgress?: ProgressCallback): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          this.model = gltf.scene;
          
          // 设置动画混合器
          if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.model);
            // 可以在这里播放默认动画
          }

          // 自动调整模型缩放和位置
          this.adjustModel();
          
          resolve(this.model);
        },
        (progress) => {
          if (onProgress && progress.total > 0) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            onProgress(percent);
          }
        },
        (error) => {
          console.error('模型加载失败:', error);
          reject(error);
        }
      );
    });
  }

  /**
   * 调整模型的缩放和位置 - 底部贴合地面
   */
  private adjustModel(): void {
    if (!this.model) return;

    // 计算模型边界框
    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // 计算缩放比例，使模型适合视图
    const maxDimension = Math.max(size.x, size.y, size.z);
    const targetSize = 2; // 目标大小
    const scale = targetSize / maxDimension;
    
    this.model.scale.multiplyScalar(scale);

    // 将模型底部精确贴合 y=0 地面
    // 1. 先将模型中心移到原点
    const scaledCenter = center.clone().multiplyScalar(scale);
    this.model.position.set(-scaledCenter.x, 0, -scaledCenter.z);
    
    // 2. 计算缩放后的底部偏移，将模型上移使其底部在 y=0
    const scaledSize = size.clone().multiplyScalar(scale);
    const bottomOffset = (scaledSize.y / 2) - (scaledCenter.y);
    this.model.position.y = bottomOffset;
  }

  /**
   * 获取模型
   */
  getModel(): THREE.Group | null {
    return this.model;
  }

  /**
   * 更新动画
   */
  update(delta: number): void {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }

  /**
   * 清理资源
   */
  dispose(): void {
    if (this.model) {
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }
    if (this.mixer) {
      this.mixer.stopAllAction();
    }
  }
}