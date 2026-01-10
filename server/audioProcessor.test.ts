import { describe, it, expect } from "vitest";
import {
  validateAudioFormat,
  getMimeType,
  getAudioFormat,
} from "./audioProcessor";

describe("Audio Processor", () => {
  describe("validateAudioFormat", () => {
    it("should accept MP3 files with audio/mpeg mime type", () => {
      const result = validateAudioFormat("song.mp3", "audio/mpeg");
      expect(result).toBe(true);
    });

    it("should accept WAV files with audio/wav mime type", () => {
      const result = validateAudioFormat("song.wav", "audio/wav");
      expect(result).toBe(true);
    });

    it("should accept WAV files with audio/x-wav mime type", () => {
      const result = validateAudioFormat("song.wav", "audio/x-wav");
      expect(result).toBe(true);
    });

    it("should accept files based on extension even with wrong mime type", () => {
      const result = validateAudioFormat("song.mp3", "application/octet-stream");
      expect(result).toBe(true);
    });

    it("should reject non-audio files", () => {
      const result = validateAudioFormat("document.pdf", "application/pdf");
      expect(result).toBe(false);
    });

    it("should reject files with wrong extension and mime type", () => {
      const result = validateAudioFormat("document.txt", "text/plain");
      expect(result).toBe(false);
    });

    it("should be case-insensitive for file extensions", () => {
      const result1 = validateAudioFormat("SONG.MP3", "audio/mpeg");
      const result2 = validateAudioFormat("Song.Mp3", "audio/mpeg");
      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });
  });

  describe("getMimeType", () => {
    it("should return audio/mpeg for MP3 files", () => {
      const mimeType = getMimeType("song.mp3");
      expect(mimeType).toBe("audio/mpeg");
    });

    it("should return audio/wav for WAV files", () => {
      const mimeType = getMimeType("song.wav");
      expect(mimeType).toBe("audio/wav");
    });

    it("should return audio/mpeg as default for unknown extensions", () => {
      const mimeType = getMimeType("song.flac");
      expect(mimeType).toBe("audio/mpeg");
    });

    it("should be case-insensitive", () => {
      const mimeType1 = getMimeType("SONG.MP3");
      const mimeType2 = getMimeType("Song.Mp3");
      expect(mimeType1).toBe("audio/mpeg");
      expect(mimeType2).toBe("audio/mpeg");
    });

    it("should handle files without extension", () => {
      const mimeType = getMimeType("song");
      expect(mimeType).toBe("audio/mpeg");
    });
  });

  describe("getAudioFormat", () => {
    it("should return mp3 for MP3 files", () => {
      const format = getAudioFormat("song.mp3");
      expect(format).toBe("mp3");
    });

    it("should return wav for WAV files", () => {
      const format = getAudioFormat("song.wav");
      expect(format).toBe("wav");
    });

    it("should return mp3 as default for unknown extensions", () => {
      const format = getAudioFormat("song.flac");
      expect(format).toBe("mp3");
    });

    it("should be case-insensitive", () => {
      const format1 = getAudioFormat("SONG.WAV");
      const format2 = getAudioFormat("Song.Wav");
      expect(format1).toBe("wav");
      expect(format2).toBe("wav");
    });

    it("should handle files without extension", () => {
      const format = getAudioFormat("song");
      expect(format).toBe("mp3");
    });
  });
});
