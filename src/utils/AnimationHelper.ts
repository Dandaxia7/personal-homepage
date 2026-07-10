/**
 * 缓动函数
 */
export const Easing = {
  /**
   * 线性
   */
  linear: (t: number): number => t,

  /**
   * 缓入
   */
  easeIn: (t: number): number => t * t,

  /**
   * 缓出
   */
  easeOut: (t: number): number => t * (2 - t),

  /**
   * 缓入缓出
   */
  easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  /**
   * 弹性缓出
   */
  easeOutElastic: (t: number): number => {
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  },

  /**
   * 弹跳缓出
   */
  easeOutBounce: (t: number): number => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
};

/**
 * 简单的补间动画类
 */
export class Tween {
  private startValue: number;
  private endValue: number;
  private duration: number;
  private easing: (t: number) => number;
  private startTime: number = 0;
  private isRunning: boolean = false;
  private onUpdate: ((value: number) => void) | null = null;
  private onComplete: (() => void) | null = null;

  constructor(
    startValue: number,
    endValue: number,
    duration: number,
    easing: (t: number) => number = Easing.easeOut
  ) {
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.easing = easing;
  }

  /**
   * 设置更新回调
   */
  setOnUpdate(callback: (value: number) => void): this {
    this.onUpdate = callback;
    return this;
  }

  /**
   * 设置完成回调
   */
  setOnComplete(callback: () => void): this {
    this.onComplete = callback;
    return this;
  }

  /**
   * 开始动画
   */
  start(): this {
    this.startTime = performance.now();
    this.isRunning = true;
    return this;
  }

  /**
   * 更新动画
   */
  update(): boolean {
    if (!this.isRunning) return false;

    const elapsed = performance.now() - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    const easedProgress = this.easing(progress);
    const currentValue = this.startValue + (this.endValue - this.startValue) * easedProgress;

    if (this.onUpdate) {
      this.onUpdate(currentValue);
    }

    if (progress >= 1) {
      this.isRunning = false;
      if (this.onComplete) {
        this.onComplete();
      }
      return false;
    }

    return true;
  }

  /**
   * 停止动画
   */
  stop(): void {
    this.isRunning = false;
  }
}

/**
 * 弹跳缩放动画
 */
export class BounceAnimation {
  private tweens: Tween[] = [];
  private target: { scale: number };

  constructor(private onUpdate: (scale: number) => void) {
    this.target = { scale: 1.0 };
  }

  /**
   * 播放弹跳动画
   */
  play(): void {
    // 清除之前的动画
    this.tweens = [];

    // 创建弹跳序列
    const timeline = [
      { value: 1.1, duration: 100 },  // 放大
      { value: 0.95, duration: 100 }, // 缩小
      { value: 1.02, duration: 80 },  // 小幅放大
      { value: 1.0, duration: 80 },   // 恢复
    ];

    let delay = 0;
    let lastValue = 1.0;

    timeline.forEach((keyframe) => {
      const tween = new Tween(lastValue, keyframe.value, keyframe.duration, Easing.easeOut);
      tween.setOnUpdate((value) => {
        this.target.scale = value;
        this.onUpdate(value);
      });

      // 使用闭包实现延迟
      setTimeout(() => {
        tween.start();
        this.tweens.push(tween);
      }, delay);

      delay += keyframe.duration;
      lastValue = keyframe.value;
    });
  }

  /**
   * 更新动画
   */
  update(): void {
    this.tweens = this.tweens.filter(tween => tween.update());
  }

  /**
   * 是否正在播放
   */
  isPlaying(): boolean {
    return this.tweens.length > 0;
  }

  /**
   * 停止动画
   */
  stop(): void {
    this.tweens.forEach(tween => tween.stop());
    this.tweens = [];
  }
}