/**
 * TODO: 画像でも動画でも大丈夫なように
 *
 * クリックされたときにYouTubeの動画をいい感じに表示する
 *
 * HTML側でトリガーにしたい要素に TRIGGER_SELECTOR を設定する
 * 動画のURLは TRIGGER_SELECTOR の値に設定する
 */
const LIGHTBOX_SRC_ATTR = "data-lightbox-src";

const TRIGGER_SELECTOR = `[${LIGHTBOX_SRC_ATTR}]`;

/**
 * 渡された要素をDOMツリーから削除する
 *
 */
const close = (el: HTMLElement) => {
  el.parentElement?.removeChild(el);
  document.body.style.overflow = ""; // スクロール許可
};

/**
 * YouTube動画の埋め込みURLを受け取って<iframe>を返す
 */
const createIframe = (src: string): HTMLIFrameElement => {
  const iframe = document.createElement("iframe");
  iframe.addEventListener(
    "load",
    () => {
      iframe.classList.add("loaded");
    },
    { once: true }
  );

  // TODO: width, heightを指定しないとどうなる？
  iframe.width = "560";
  iframe.height = "315";
  iframe.src = src;
  iframe.frameBorder = "0";
  iframe.allow = "autoplay; encrypted-media; picture-in-picture";
  iframe.allowFullscreen = true;

  return iframe;
};

/**
 * YouTube動画の埋め込みURLを受け取り、一連の要素を組み立てて返す
 */
const createLightBox = (src: string): HTMLElement => {
  const lightbox = document.createElement("div");
  lightbox.classList.add("p-lightbox");

  const iframe = createIframe(src);
  iframe.classList.add("p-lightbox__video");

  const overlay = document.createElement("div");
  overlay.classList.add("p-lightbox__overlay");
  overlay.addEventListener("click", function cb() {
    close(lightbox);
    overlay.removeEventListener("click", cb);
  });

  const inner = document.createElement("div");
  inner.classList.add("p-lightbox__inner");

  const videoContainer = document.createElement("div");
  videoContainer.classList.add("p-lightbox__video-container");
  videoContainer.appendChild(iframe);

  inner.appendChild(videoContainer);
  lightbox.appendChild(overlay);
  lightbox.appendChild(inner);

  return lightbox;
};

/**
 * <img>を作る
 */
const createImage = (src: string): HTMLElement => {
  const img = document.createElement("img");
  img.addEventListener(
    "load",
    () => {
      img.classList.add("loaded");
    },
    { once: true }
  );

  // TODO: 固定値にしてしまった -> そもそも指定が必要ない気がする
  img.width = 430;
  img.height = 617;
  img.src = src;

  return img;
};

const createImageBox = (src: string): HTMLDivElement => {
  const lightbox = document.createElement("div");
  lightbox.classList.add("p-lightbox");

  const img = createImage(src);
  img.classList.add("p-lightbox__img");

  const overlay = document.createElement("div");
  overlay.classList.add("p-lightbox__overlay");
  overlay.addEventListener(
    "click",
    () => {
      close(lightbox);
    },
    { once: true }
  );

  const inner = document.createElement("div");
  inner.classList.add("p-lightbox__inner");

  const imgContainer = document.createElement("div");
  imgContainer.classList.add("p-lightbox__img-container");
  imgContainer.appendChild(img);

  inner.appendChild(imgContainer);
  lightbox.appendChild(overlay);
  lightbox.appendChild(inner);

  return lightbox;
};

const onClick = (e: Event) => {
  const trigger = e.currentTarget as HTMLElement;
  const src = trigger.getAttribute(LIGHTBOX_SRC_ATTR);
  if (src === null) {
    throw new Error(`${trigger}に${TRIGGER_SELECTOR}が設定されていない`);
  }

  const lightbox = createImageBox(src);
  document.body.appendChild(lightbox);
  document.body.style.overflow = "hidden"; // スクロールを止める
};

export const init = (): void => {
  const targets = Array.from(document.querySelectorAll(TRIGGER_SELECTOR));
  if (targets.length === 0) {
    return;
  }

  for (const target of targets) {
    target.addEventListener("click", onClick);
  }
};
