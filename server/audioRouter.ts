import { z } from 'zod';
import { protectedProcedure, router } from './_core/trpc';
import { createAudioFile, getAudioFileById, getUserAudioFiles, updateAudioFileMetadata, deleteAudioFile } from './db';
import { storagePut, storageGet } from './storage';
import { extractMetadata, validateAudioFormat, getMimeType, getAudioFormat } from './audioProcessor';
import { nanoid } from 'nanoid';


/**
 * Metadata validation schema
 */
const metadataSchema = z.object({
  title: z.string().optional(),
  artist: z.string().optional(),
  album: z.string().optional(),
  albumArtist: z.string().optional(),
  year: z.number().optional(),
  genre: z.string().optional(),
  trackNumber: z.number().optional(),
  totalTracks: z.number().optional(),
  comment: z.string().optional(),
  composer: z.string().optional(),
});

export const audioRouter = router({
  /**
   * List all audio files for the current user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const files = await getUserAudioFiles(ctx.user.id);
    return files;
  }),

  /**
   * Get a specific audio file by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const file = await getAudioFileById(input.id);
      if (!file || file.userId !== ctx.user.id) {
        throw new Error('File not found or access denied');
      }
      return file;
    }),

  /**
   * Create audio file record from upload
   */
  createFromUpload: protectedProcedure
    .input(z.object({
      fileName: z.string(),
      fileBuffer: z.instanceof(Buffer),
      fileSize: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Validate file format
      const mimeType = getMimeType(input.fileName);
      if (!validateAudioFormat(input.fileName, mimeType)) {
        throw new Error('Invalid audio format. Only MP3 and WAV files are supported.');
      }

      // Extract metadata
      const metadata = await extractMetadata(input.fileBuffer, mimeType);

      // Upload to S3
      const fileKey = `audio/${ctx.user.id}/${nanoid()}/${input.fileName}`;
      const { url: fileUrl } = await storagePut(fileKey, input.fileBuffer, mimeType);

      // Create database record
      const format = getAudioFormat(input.fileName);
      const result = await createAudioFile({
        userId: ctx.user.id,
        fileName: input.fileName,
        fileKey,
        fileUrl,
        fileSize: input.fileSize,
        format,
        duration: metadata.duration ? Math.round(metadata.duration) : undefined,
        title: metadata.title,
        artist: metadata.artist,
        album: metadata.album,
        albumArtist: metadata.albumArtist,
        year: metadata.year,
        genre: metadata.genre,
        trackNumber: metadata.trackNumber,
        totalTracks: metadata.totalTracks,
        comment: metadata.comment,
        composer: metadata.composer,
      });

      return { success: true, fileId: result[0].insertId };
    }),

  /**
   * Update audio file metadata
   */
  updateMetadata: protectedProcedure
    .input(z.object({
      id: z.number(),
      metadata: metadataSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      const file = await getAudioFileById(input.id);
      if (!file || file.userId !== ctx.user.id) {
        throw new Error('File not found or access denied');
      }

      await updateAudioFileMetadata(input.id, {
        ...input.metadata,
        isModified: 1,
      });

      return { success: true };
    }),

  /**
   * Get download URL for audio file
   */
  getDownloadUrl: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const file = await getAudioFileById(input.id);
      if (!file || file.userId !== ctx.user.id) {
        throw new Error('File not found or access denied');
      }

      // Return the modified file URL if available, otherwise original
      const fileKey = file.modifiedFileKey || file.fileKey;
      const { url } = await storageGet(fileKey);

      return { url, fileName: file.fileName, isModified: file.isModified === 1 };
    }),

  /**
   * Delete audio file
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const file = await getAudioFileById(input.id);
      if (!file || file.userId !== ctx.user.id) {
        throw new Error('File not found or access denied');
      }

      await deleteAudioFile(input.id);
      return { success: true };
    }),

  /**
   * Batch update metadata for multiple files
   */
  batchUpdateMetadata: protectedProcedure
    .input(z.object({
      fileIds: z.array(z.number()),
      metadata: metadataSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify all files belong to user
      const files = await Promise.all(
        input.fileIds.map(id => getAudioFileById(id))
      );

      for (const file of files) {
        if (!file || file.userId !== ctx.user.id) {
          throw new Error('One or more files not found or access denied');
        }
      }

      // Update all files
      await Promise.all(
        input.fileIds.map(id =>
          updateAudioFileMetadata(id, {
            ...input.metadata,
            isModified: 1,
          })
        )
      );

      return { success: true, updatedCount: input.fileIds.length };
    }),
});
