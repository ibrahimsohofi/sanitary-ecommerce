/**
 * Image Service for Sanitary E-Commerce Platform
 * Handles dynamic image generation, optimization, and CDN delivery
 */

// Base image URLs from Unsplash for different categories
const baseImageUrls = {
  toilets: "photo-1584622650111-993a426fbf0a",
  sinks: "photo-1620626011761-996317b8d101",
  faucets: "photo-1584622781564-1d987468c7b3",
  showers: "photo-1631889993959-41b4e9c6e3c5",
  bathtubs: "photo-1552321554-5fefe8c9ef14",
  accessories: "photo-1584622650111-993a426fbf0a",
  furniture: "photo-1552321554-5fefe8c9ef14",
};

type CategoryKey = keyof typeof baseImageUrls;

export type ImageSize = "thumb" | "small" | "medium" | "large" | "xl";

const imageSizes: Record<ImageSize, string> = {
  thumb: "150",
  small: "300",
  medium: "500",
  large: "800",
  xl: "1200",
};

/**
 * Generate product image URL with variations
 * Uses hue, saturation, and brightness variations to create unique images
 */
export const generateProductImageUrl = (
  productId: number,
  category: CategoryKey,
  size: ImageSize = "medium",
): string => {
  const baseImage = baseImageUrls[category] || baseImageUrls.toilets;
  const imageSize = imageSizes[size];

  // Create variations based on product ID
  const hueVariations = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  const satVariations = [0, -20, -40, -60];
  const brightnessVariations = [0, 5, -5, 10, -10];

  const hue = hueVariations[productId % hueVariations.length];
  const sat = satVariations[(productId * 2) % satVariations.length];
  const brightness =
    brightnessVariations[(productId * 3) % brightnessVariations.length];

  // Build Unsplash URL with transformations
  const params = new URLSearchParams({
    w: imageSize,
    h: imageSize,
    fit: "crop",
    auto: "format",
    q: "80",
  });

  let url = `https://images.unsplash.com/${baseImage}?${params.toString()}`;

  // Add color variations if needed
  if (hue !== 0) url += `&hue=${hue}`;
  if (sat !== 0) url += `&sat=${sat}`;
  if (brightness !== 0) url += `&bri=${brightness}`;

  return url;
};

/**
 * Generate gallery images for a product (3-4 different views)
 */
export const generateGalleryImages = (
  productId: number,
  category: CategoryKey,
  count = 3,
): string[] => {
  const images: string[] = [];

  for (let i = 0; i < count; i++) {
    // Use different variations for each gallery image
    const variantId = productId + i * 100;
    images.push(generateProductImageUrl(variantId, category, "large"));
  }

  return images;
};

/**
 * Get optimized image URL for CDN (future implementation)
 */
export const getCDNImageUrl = (
  productId: number,
  size: ImageSize = "medium",
): string => {
  // This will be replaced with actual CDN URLs in production
  const cdnBaseUrl =
    import.meta.env.VITE_CDN_URL || "https://cdn.sanitaryshop.com";
  const imageSize = imageSizes[size];

  return `${cdnBaseUrl}/products/${productId}/${imageSize}.webp`;
};

/**
 * Get manufacturer image URL (for licensed images)
 */
export const getManufacturerImageUrl = (
  brand: string,
  productSku: string,
  size: ImageSize = "medium",
): string => {
  const brandUrls: Record<string, string> = {
    roca: "https://www.roca.com/media/catalog/product",
    grohe: "https://www.grohe.com/media/catalog/product",
    hansgrohe: "https://www.hansgrohe.com/media/product",
    "villeroy-boch": "https://www.villeroy-boch.com/media/catalog/product",
    duravit: "https://www.duravit.com/media/catalog/product",
  };

  const baseUrl =
    brandUrls[brand.toLowerCase().replace(/\s+/g, "-")] || brandUrls.roca;
  const imageSize = imageSizes[size];

  return `${baseUrl}/${productSku}/${imageSize}.jpg`;
};

/**
 * Generate responsive image srcset
 */
export const generateImageSrcSet = (
  productId: number,
  category: CategoryKey,
): string => {
  const sizes: ImageSize[] = ["small", "medium", "large", "xl"];

  return sizes
    .map((size) => {
      const url = generateProductImageUrl(productId, category, size);
      const width = imageSizes[size];
      return `${url} ${width}w`;
    })
    .join(", ");
};

/**
 * Image optimization utilities
 */
export const imageUtils = {
  // Check if WebP is supported
  isWebPSupported: (): boolean => {
    if (typeof window === "undefined") return false;

    const canvas = document.createElement("canvas");
    if (canvas.getContext && canvas.getContext("2d")) {
      return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
    }
    return false;
  },

  // Lazy load image
  lazyLoadImage: (imgElement: HTMLImageElement, src: string): void => {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            imgElement.src = src;
            observer.disconnect();
          }
        });
      });

      observer.observe(imgElement);
    } else {
      // Fallback for browsers without IntersectionObserver
      imgElement.src = src;
    }
  },

  // Preload critical images
  preloadImage: (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  },
};

/**
 * Get category from product category_id
 */
export const getCategoryKey = (categoryId: number): CategoryKey => {
  const categoryMap: Record<number, CategoryKey> = {
    1: "toilets",
    2: "sinks",
    3: "faucets",
    4: "showers",
    5: "bathtubs",
    6: "accessories",
    7: "furniture",
  };

  return categoryMap[categoryId] || "toilets";
};

/**
 * Image service class for advanced usage
 */
export class ImageService {
  private cdnEnabled: boolean;

  constructor(cdnEnabled = false) {
    this.cdnEnabled = cdnEnabled;
  }

  getProductImage(
    productId: number,
    categoryId: number,
    size: ImageSize = "medium",
  ): string {
    if (this.cdnEnabled) {
      return getCDNImageUrl(productId, size);
    }

    const category = getCategoryKey(categoryId);
    return generateProductImageUrl(productId, category, size);
  }

  getGalleryImages(productId: number, categoryId: number, count = 3): string[] {
    const category = getCategoryKey(categoryId);
    return generateGalleryImages(productId, category, count);
  }

  getResponsiveSrcSet(productId: number, categoryId: number): string {
    const category = getCategoryKey(categoryId);
    return generateImageSrcSet(productId, category);
  }
}

// Export default instance
export const imageService = new ImageService();

// Export all utilities
export default {
  generateProductImageUrl,
  generateGalleryImages,
  getCDNImageUrl,
  getManufacturerImageUrl,
  generateImageSrcSet,
  getCategoryKey,
  imageUtils,
  ImageService,
};
