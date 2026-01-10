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
}

/**
 * Extract metadata from audio buffer
 */
export async function extractMetadata(buffer: Buffer, mimeType: string): Promise<AudioMetadata> {
  try {
    const metadata = await parseBuffer(buffer, { mimeType });
    
    const common = metadata.common || {};
    const format = metadata.format || {};
    
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
