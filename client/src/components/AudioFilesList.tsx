import { Music, Edit3, Download, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";
import ArtworkDisplay from "./ArtworkDisplay";

interface AudioFilesListProps {
  files: any[];
  isLoading: boolean;
  onEdit: (fileId: number) => void;
  onDelete: (fileId: number) => void;
}

export default function AudioFilesList({
  files,
  isLoading,
  onEdit,
  onDelete,
}: AudioFilesListProps) {
  const handleDownload = async (fileId: number) => {
    try {
      const result = await (trpc.audio.getDownloadUrl as any).query({ id: fileId });
      const link = document.createElement("a");
      link.href = result.url;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("File downloaded successfully");
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="card-elegant p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <Card className="card-elegant p-12 text-center">
        <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Files Yet</h3>
        <p className="text-muted-foreground">
          Upload your first audio file to get started
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Your Audio Files</h2>
      {(files as any[]).map((file: any) => (
        <Card key={file.id} className="card-elegant p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <ArtworkDisplay
                  artworkUrl={(file as any).artworkUrl}
                  fileName={file.fileName}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{file.title || file.fileName}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {file.artist || "Unknown Artist"}
                  </p>
                  {(file as any).artworkUrl && (
                    <p className="text-xs text-accent mt-1">Has artwork</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Album</p>
                  <p className="font-medium truncate">{file.album || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Year</p>
                  <p className="font-medium">{file.year || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Genre</p>
                  <p className="font-medium truncate">{file.genre || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Track</p>
                  <p className="font-medium">
                    {file.trackNumber || "—"}
                    {file.totalTracks && `/${file.totalTracks}`}
                  </p>
                </div>
              </div>

              {file.isModified === 1 && (
                <div className="mt-3">
                  <span className="badge-elegant">Modified</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(file.id)}
                className="gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(file.id)}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(file.id)}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
