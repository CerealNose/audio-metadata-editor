export interface AudioFile {
  id: number;
  userId: number;
  fileName: string;
  fileKey: string;
  fileUrl: string;
  fileSize: number;
  duration?: number | null;
  format: 'mp3' | 'wav';
  title?: string | null;
  artist?: string | null;
  album?: string | null;
  albumArtist?: string | null;
  year?: number | null;
  genre?: string | null;
  trackNumber?: number | null;
  totalTracks?: number | null;
  comment?: string | null;
  composer?: string | null;
  isModified: number;
  modifiedFileKey?: string | null;
  modifiedFileUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

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
}
