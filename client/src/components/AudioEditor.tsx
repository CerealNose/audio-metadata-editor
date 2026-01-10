import { useState, useEffect } from "react";
import { ArrowLeft, Save, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import ArtworkUpload from "./ArtworkUpload";

interface AudioEditorProps {
  fileId: number;
  onClose: () => void;
  onComplete: () => void;
}

export default function AudioEditor({ fileId, onClose, onComplete }: AudioEditorProps) {
  const [metadata, setMetadata] = useState({
    title: "",
    artist: "",
    album: "",
    albumArtist: "",
    year: "",
    genre: "",
    trackNumber: "",
    totalTracks: "",
    comment: "",
    composer: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [artwork, setArtwork] = useState<string | null>(null);

  const { data: file, isLoading } = trpc.audio.getById.useQuery({ id: fileId });
  const updateMutation = (trpc.audio.updateMetadata as any).useMutation();

  useEffect(() => {
    if (file) {
      setMetadata({
        title: file.title || "",
        artist: file.artist || "",
        album: file.album || "",
        albumArtist: file.albumArtist || "",
        year: file.year ? String(file.year) : "",
        genre: file.genre || "",
        trackNumber: file.trackNumber ? String(file.trackNumber) : "",
        totalTracks: file.totalTracks ? String(file.totalTracks) : "",
        comment: file.comment || "",
        composer: file.composer || "",
      });
      const artworkUrl = (file as any).artworkUrl;
      setArtwork(artworkUrl || null);
    }
  }, [file]);

  const handleChange = (field: string, value: string) => {
    setMetadata((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData: any = {
        title: metadata.title || undefined,
        artist: metadata.artist || undefined,
        album: metadata.album || undefined,
        albumArtist: metadata.albumArtist || undefined,
        year: metadata.year ? parseInt(metadata.year) : undefined,
        genre: metadata.genre || undefined,
        trackNumber: metadata.trackNumber ? parseInt(metadata.trackNumber) : undefined,
        totalTracks: metadata.totalTracks ? parseInt(metadata.totalTracks) : undefined,
        comment: metadata.comment || undefined,
        composer: metadata.composer || undefined,
      };

      await (updateMutation as any).mutateAsync({
        id: fileId,
        metadata: updateData,
      });

      toast.success("Metadata updated successfully");
      onComplete();
    } catch (error) {
      toast.error("Failed to update metadata");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <Card className="card-elegant p-8 w-full max-w-2xl animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-muted rounded"></div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Edit Metadata</h1>
          <p className="text-muted-foreground">
            {file?.fileName}
          </p>
        </div>

        {/* Audio Preview */}
        {file?.fileUrl && (
          <Card className="card-elegant p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Audio Preview</h3>
                <p className="text-sm text-muted-foreground">
                  {file.duration ? `${Math.floor(file.duration / 60)}:${String(file.duration % 60).padStart(2, '0')}` : 'Duration unknown'}
                </p>
              </div>
              <audio
                controls
                src={file.fileUrl}
                className="w-full md:w-auto"
              />
            </div>
          </Card>
        )}

        {/* Metadata Form */}
        <Card className="card-elegant p-8">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="label-elegant">Title</label>
                  <Input
                    value={metadata.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Song title"
                    className="input-elegant"
                  />
                </div>
                <div>
                  <label className="label-elegant">Artist</label>
                  <Input
                    value={metadata.artist}
                    onChange={(e) => handleChange("artist", e.target.value)}
                    placeholder="Artist name"
                    className="input-elegant"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-elegant">Album</label>
                    <Input
                      value={metadata.album}
                      onChange={(e) => handleChange("album", e.target.value)}
                      placeholder="Album name"
                      className="input-elegant"
                    />
                  </div>
                  <div>
                    <label className="label-elegant">Album Artist</label>
                    <Input
                      value={metadata.albumArtist}
                      onChange={(e) => handleChange("albumArtist", e.target.value)}
                      placeholder="Album artist"
                      className="input-elegant"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="divider-elegant"></div>

            {/* Album Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Album Details</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-elegant">Year</label>
                    <Input
                      type="number"
                      value={metadata.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      placeholder="2024"
                      className="input-elegant"
                    />
                  </div>
                  <div>
                    <label className="label-elegant">Genre</label>
                    <Input
                      value={metadata.genre}
                      onChange={(e) => handleChange("genre", e.target.value)}
                      placeholder="Genre"
                      className="input-elegant"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-elegant">Track Number</label>
                    <Input
                      type="number"
                      value={metadata.trackNumber}
                      onChange={(e) => handleChange("trackNumber", e.target.value)}
                      placeholder="1"
                      className="input-elegant"
                    />
                  </div>
                  <div>
                    <label className="label-elegant">Total Tracks</label>
                    <Input
                      type="number"
                      value={metadata.totalTracks}
                      onChange={(e) => handleChange("totalTracks", e.target.value)}
                      placeholder="12"
                      className="input-elegant"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="divider-elegant"></div>

            {/* Additional Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="label-elegant">Composer</label>
                  <Input
                    value={metadata.composer}
                    onChange={(e) => handleChange("composer", e.target.value)}
                    placeholder="Composer name"
                    className="input-elegant"
                  />
                </div>
                <div>
                  <label className="label-elegant">Comment</label>
                  <textarea
                    value={metadata.comment}
                    onChange={(e) => handleChange("comment", e.target.value)}
                    placeholder="Add any comments or notes"
                    className="input-elegant resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="divider-elegant"></div>

            {/* Artwork */}
            <div>
              <ArtworkUpload
                fileId={fileId}
                currentArtwork={artwork || undefined}
                onUploadComplete={(url) => {
                  setArtwork(url);
                  toast.success("Artwork updated");
                }}
                onRemove={() => setArtwork(null)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
