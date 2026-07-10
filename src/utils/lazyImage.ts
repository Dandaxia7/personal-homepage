const loaded = new WeakSet<HTMLImageElement>();

export function observeLazyImages(root: ParentNode = document): () => void {
  const images = Array.from(root.querySelectorAll<HTMLImageElement>('img[data-src]'));
  if (images.length === 0) return () => {};

  const loadImage = (img: HTMLImageElement) => {
    if (loaded.has(img)) return;
    const src = img.dataset.src;
    if (!src) return;
    loaded.add(img);
    img.src = src;
    img.removeAttribute('data-src');
    img.addEventListener(
      'load',
      () => img.classList.add('lazy-loaded'),
      { once: true }
    );
  };

  if (!('IntersectionObserver' in window)) {
    images.forEach(loadImage);
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage(entry.target as HTMLImageElement);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '120px' }
  );

  images.forEach((img) => {
    if (!loaded.has(img)) observer.observe(img);
  });

  return () => observer.disconnect();
}
