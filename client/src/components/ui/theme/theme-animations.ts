// animations.ts
export type AnimationVariant = "circle" | "circle-blur" | "polygon" | "gif"
export type AnimationStart =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"

interface Animation {
  name: string
  css: string
}

const getClipOrigin = (start: AnimationStart) => {
  switch (start) {
    case "top-left":
      return "top left"
    case "top-right":
      return "top right"
    case "bottom-left":
      return "bottom left"
    case "bottom-right":
      return "bottom right"
  }
}

export const createAnimation = (
  variant: AnimationVariant,
  start: AnimationStart,
  _url?: string
): Animation => {
  const origin = getClipOrigin(start)

  if (variant === "polygon") {
    return {
      name: `${variant}-${start}`,
      css: `
      ::view-transition-group(root) {
        animation-duration: 0.7s;
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: 1;
      }

      ::view-transition-new(root) {
        animation: reveal-polygon 0.7s ease-out;
        z-index: 2;
      }

      @keyframes reveal-polygon {
        from {
          clip-path: polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%);
        }
        to {
          clip-path: polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%);
        }
      }
      `,
    }
  }

  if (variant === "gif") {
    return {
      name: `${variant}-${start}`,
      css: `
      ::view-transition-group(root) {
        animation-duration: 3s;
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: 1;
      }

      ::view-transition-new(root) {
        animation: reveal-gif 3s ease-in;
        z-index: 2;
      }

      @keyframes reveal-gif {
        from {
          clip-path: circle(0% at ${origin});
        }
        10% {
          clip-path: circle(50% at ${origin});
        }
        90% {
          clip-path: circle(50% at ${origin});
        }
        to {
          clip-path: circle(200% at ${origin});
        }
      }
      `,
    }
  }

  // circle and circle-blur both use clip-path circle
  const blurRadius = variant === "circle-blur" ? "12px" : "0"

  return {
    name: `${variant}-${start}`,
    css: `
      ::view-transition-group(root) {
        animation-duration: 0.7s;
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: 1;
      }

      ::view-transition-new(root) {
        animation: reveal-${start} 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 2;
      }

      @keyframes reveal-${start} {
        from {
          clip-path: circle(0% at ${origin});
          filter: blur(${blurRadius});
        }
        to {
          clip-path: circle(150% at ${origin});
          filter: blur(${blurRadius});
        }
      }
    `,
  }
}
