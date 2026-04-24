/**
 * Creates a fly animation from a source element to a target element.
 * Used for add-to-cart and add-to-wishlist effects.
 */
export function flyToElement(
  sourceEl: HTMLElement,
  targetId: string,
  imageUrl?: string,
) {
  // Find the visible target (handles mobile/desktop duplicate IDs)
  const targets = document.querySelectorAll<HTMLElement>(`#${targetId}`);
  let targetEl: HTMLElement | null = null;
  for (const el of targets) {
    if (el.offsetParent !== null || el.getClientRects().length > 0) {
      targetEl = el;
      break;
    }
  }
  if (!targetEl) targetEl = targets[0] ?? null;
  if (!targetEl) return;

  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();

  // Create flying element
  const flyer = document.createElement("div");
  flyer.style.cssText = `
    position: fixed;
    z-index: 9999;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    pointer-events: none;
    left: ${sourceRect.left + sourceRect.width / 2 - 25}px;
    top: ${sourceRect.top + sourceRect.height / 2 - 25}px;
    transition: all 0.75s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  `;

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.cssText = "width:100%;height:100%;object-fit:cover;";
    flyer.appendChild(img);
  } else {
    flyer.style.background = "linear-gradient(135deg, #1a7a74, #31c9c0)";
  }

  document.body.appendChild(flyer);

  // Trigger animation on next frame
  requestAnimationFrame(() => {
    flyer.style.left = `${targetRect.left + targetRect.width / 2 - 10}px`;
    flyer.style.top = `${targetRect.top + targetRect.height / 2 - 10}px`;
    flyer.style.width = "20px";
    flyer.style.height = "20px";
    flyer.style.opacity = "0.3";
  });

  // Bounce target icon when flyer arrives
  setTimeout(() => {
    targetEl!.style.transition = "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
    targetEl!.style.transform = "scale(1.3)";
    setTimeout(() => {
      targetEl!.style.transform = "scale(1)";
    }, 300);
  }, 650);

  // Cleanup
  setTimeout(() => flyer.remove(), 850);
}
