import { useState, useRef } from "react";
import { Upload, Music } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AudioUploadZoneProps {
  onSuccess: () => void;
}

export default function AudioUploadZone({ onSuccess }: AudioUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createMutation = trpc.audio.createFromUpload.useMutation();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("audio/")) {
      toast.error("Please select an audio file (MP3 or WAV)");
      return;
    }

    const validTypes = ["audio/mpeg", "audio/wav", "audio/x-wav"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only MP3 and WAV files are supported");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
      return;
    }

    setIsUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      await createMutation.mutateAsync({
        fileName: file.name,
        fileBuffer: new Uint8Array(buffer) as any,
        fileSize: file.size,
      });
      onSuccess();
    } catch (error) {
      toast.error("Failed to upload file");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <Card
      className={`card-elegant p-8 text-center transition-all duration-200 cursor-pointer ${
        isDragging ? "border-accent bg-accent/5" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mpeg,audio/wav,audio/x-wav,.mp3,.wav"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="mb-4">
        {isDragging ? (
          <Music className="w-12 h-12 text-accent mx-auto animate-bounce" />
        ) : (
          <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2">
        {isDragging ? "Drop your file here" : "Upload Audio File"}
      </h3>

      <p className="text-sm text-muted-foreground mb-6">
        Drag and drop your MP3 or WAV file here, or click to select
      </p>

      <Button
        disabled={isUploading}
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {isUploading ? "Uploading..." : "Select File"}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        Maximum file size: 100MB
      </p>
    </Card>
  );
}
