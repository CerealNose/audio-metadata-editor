import { describe, it, expect } from "vitest";
import {
  validateImageFormat,
  getImageMimeType,
} from "./audioProcessor";

describe("Artwork Functionality", () => {
  describe("validateImageFormat", () => {
    it("should accept JPEG files", () => {
      const result = validateImageFormat("cover.jpg", "image/jpeg");
      expect(result).toBe(true);
    });

    it("should accept PNG files", () => {
      const result = validateImageFormat("cover.png", "image/png");
      expect(result).toBe(true);
    });

    it("should accept GIF files", () => {
      const result = validateImageFormat("cover.gif", "image/gif");
      expect(result).toBe(true);
    });

    it("should accept WebP files", () => {
      const result = validateImageFormat("cover.webp", "image/webp");
      expect(result).toBe(true);
    });

    it("should accept JPEG files with .jpeg extension", () => {
      const result = validateImageFormat("cover.jpeg", "image/jpeg");
      expect(result).toBe(true);
    });

    it("should validate by extension if mime type is wrong", () => {
      const result = validateImageFormat("cover.jpg", "application/octet-stream");
      expect(result).toBe(true);
    });

    it("should reject non-image files", () => {
      const result = validateImageFormat("document.pdf", "application/pdf");
      expect(result).toBe(false);
    });

    it("should reject text files", () => {
      const result = validateImageFormat("readme.txt", "text/plain");
      expect(result).toBe(false);
    });

    it("should be case-insensitive for extensions", () => {
      const result1 = validateImageFormat("COVER.JPG", "image/jpeg");
      const result2 = validateImageFormat("Cover.Png", "image/png");
      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });
  });

  describe("getImageMimeType", () => {
    it("should return image/jpeg for .jpg files", () => {
      const mimeType = getImageMimeType("cover.jpg");
      expect(mimeType).toBe("image/jpeg");
    });

    it("should return image/jpeg for .jpeg files", () => {
      const mimeType = getImageMimeType("cover.jpeg");
      expect(mimeType).toBe("image/jpeg");
    });

    it("should return image/png for .png files", () => {
      const mimeType = getImageMimeType("cover.png");
      expect(mimeType).toBe("image/png");
    });

    it("should return image/gif for .gif files", () => {
      const mimeType = getImageMimeType("cover.gif");
      expect(mimeType).toBe("image/gif");
    });

    it("should return image/webp for .webp files", () => {
      const mimeType = getImageMimeType("cover.webp");
      expect(mimeType).toBe("image/webp");
    });

    it("should return image/jpeg as default for unknown extensions", () => {
      const mimeType = getImageMimeType("cover.bmp");
      expect(mimeType).toBe("image/jpeg");
    });

    it("should be case-insensitive", () => {
      const mimeType1 = getImageMimeType("COVER.JPG");
      const mimeType2 = getImageMimeType("Cover.Png");
      expect(mimeType1).toBe("image/jpeg");
      expect(mimeType2).toBe("image/png");
    });

    it("should handle files without extension", () => {
      const mimeType = getImageMimeType("cover");
      expect(mimeType).toBe("image/jpeg");
    });
  });
});
