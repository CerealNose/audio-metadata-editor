import { parseBuffer } from 'music-metadata';
import { Buffer } from 'buffer';

/**
 * Represents extracted audio metadata
 */
export interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  albumArtist?: string;
  year?: number;
  genre?: string;
  trackNumber?: number;
  totalTracks?: number;
  comment?: string;
  composer?: string;
  duration?: number;
  artwork?: Buffer | Uint8Array;
  artworkMimeType?: string;
}

/**
 * Extract metadata from audio buffer
 */
export async function extractMetadata(buffer: Buffer, mimeType: string): Promise<AudioMetadata> {
  try {
    const metadata = await parseBuffer(buffer, { mimeType });
    
    const common = metadata.common || {};
    const format = metadata.format || {};
    
    let artwork: Buffer | Uint8Array | undefined;
    let artworkMimeType: string | undefined;
    if (metadata.common?.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0];
      artwork = picture.data as Buffer | Uint8Array;
      artworkMimeType = picture.format;
    }
    
    return {
      title: common.title,
      artist: common.artist,
      album: common.album,
      albumArtist: common.albumartist,
      year: common.year,
      genre: Array.isArray(common.genre) ? common.genre[0] : common.genre,
      trackNumber: common.track?.no ?? undefined,
      totalTracks: common.track?.of ?? undefined,
      comment: common.comment?.[0]?.text,
      composer: common.composer?.[0],
      duration: format.duration ?? undefined,
      artwork,
      artworkMimeType,
    };
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return {};
  }
}

/**
 * Validate audio file format
 */
export function validateAudioFormat(filename: string, mimeType: string): boolean {
  const validFormats = ['audio/mpeg', 'audio/wav', 'audio/x-wav'];
  const validExtensions = ['.mp3', '.wav'];
  
  const hasValidMime = validFormats.includes(mimeType);
  const hasValidExtension = validExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  
  return hasValidMime || hasValidExtension;
}

/**
 * Get MIME type from filename
 */
export function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  switch (ext) {
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    default:
      return 'audio/mpeg';
  }
}

/**
 * Get audio format from filename
 */
export function getAudioFormat(filename: string): 'mp3' | 'wav' {
  const ext = filename.toLowerCase().split('.').pop();
  if (ext === 'wav') return 'wav';
  return 'mp3';
}

export function validateImageFormat(filename: string, mimeType: string): boolean {
  const validMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  const hasValidMime = validMimes.includes(mimeType);
  const hasValidExtension = validExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  
  return hasValidMime || hasValidExtension;
}

export function getImageMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}
