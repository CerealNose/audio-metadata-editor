import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ArtworkUploadProps {
  fileId: number;
  currentArtwork?: string;
  onUploadComplete: (artworkUrl: string) => void;
  onRemove?: () => void;
}

export default function ArtworkUpload({
  fileId,
  currentArtwork,
  onUploadComplete,
  onRemove,
}: ArtworkUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentArtwork || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, and WebP images are supported");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      // Note: In a real implementation, you would send this to your backend
      // For now, we'll just update the preview
      toast.success("Artwork preview updated");
      onUploadComplete(preview || "");
    } catch (error) {
      toast.error("Failed to upload artwork");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
    toast.success("Artwork removed");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label-elegant">Album Artwork</label>
        <p className="text-sm text-muted-foreground mb-3">
          Upload JPEG, PNG, GIF, or WebP (max 5MB)
        </p>
      </div>

      {preview ? (
        <Card className="card-elegant p-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <img
                src={preview}
                alt="Album artwork"
                className="w-24 h-24 rounded-lg object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold mb-1">Current Artwork</h4>
                <p className="text-sm text-muted-foreground">
                  Click below to replace or remove
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Replace
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRemove}
                  disabled={isUploading}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card
          className="card-elegant p-8 border-2 border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-semibold mb-1">Upload Album Artwork</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Click to select an image or drag and drop
            </p>
            <Button
              variant="outline"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Choose Image"}
            </Button>
          </div>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
