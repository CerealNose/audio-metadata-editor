import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Music, Edit3, Download } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AudioFilesList from "@/components/AudioFilesList";
import AudioUploadZone from "@/components/AudioUploadZone";
import AudioEditor from "@/components/AudioEditor";
import BatchEditor from "@/components/BatchEditor";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedBatchIds, setSelectedBatchIds] = useState<number[]>([]);

  const { data: audioFiles, isLoading, refetch } = trpc.audio.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const handleUploadSuccess = () => {
    setShowUpload(false);
    refetch();
    toast.success("Audio file uploaded successfully");
  };

  const handleEditComplete = () => {
    setSelectedFileId(null);
    refetch();
    toast.success("Metadata updated successfully");
  };

  const handleDelete = async (fileId: number) => {
    if (confirm("Are you sure you want to delete this file?")) {
      try {
        await (trpc.audio.delete as any).mutate({ id: fileId });
        refetch();
        toast.success("File deleted successfully");
      } catch (error) {
        toast.error("Failed to delete file");
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <Music className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Audio Metadata Editor
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Edit MP3 and WAV file metadata with elegance. Manage titles, artists, albums, and more with ease.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="card-elegant p-6 text-left">
              <Upload className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold mb-2">Upload Files</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop or select MP3 and WAV files
              </p>
            </Card>

            <Card className="card-elegant p-6 text-left">
              <Edit3 className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold mb-2">Edit Metadata</h3>
              <p className="text-sm text-muted-foreground">
                Update title, artist, album, year, and more
              </p>
            </Card>

            <Card className="card-elegant p-6 text-left">
              <Download className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold mb-2">Download</h3>
              <p className="text-sm text-muted-foreground">
                Get your files with updated metadata
              </p>
            </Card>
          </div>

          <a href={getLoginUrl()}>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Sign In to Get Started
            </Button>
          </a>
        </div>
      </div>
    );
  }

  if (batchMode && selectedBatchIds.length > 0) {
    return (
      <BatchEditor
        fileIds={selectedBatchIds}
        onClose={() => {
          setBatchMode(false);
          setSelectedBatchIds([]);
        }}
        onComplete={() => {
          setBatchMode(false);
          setSelectedBatchIds([]);
          refetch();
          toast.success("Batch update completed successfully");
        }}
      />
    );
  }

  if (selectedFileId) {
    return (
      <AudioEditor
        fileId={selectedFileId}
        onClose={() => setSelectedFileId(null)}
        onComplete={handleEditComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10">
              <Music className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Audio Metadata Editor</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Manage your audio file metadata with ease.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {showUpload ? (
                <AudioUploadZone onSuccess={handleUploadSuccess} />
              ) : (
                <Card className="card-elegant p-8 text-center">
                  <Upload className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Add New Files</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Upload MP3 or WAV files to edit their metadata
                  </p>
                  <Button
                    onClick={() => setShowUpload(true)}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Upload File
                  </Button>
                </Card>
              )}
            </div>
          </div>

          {/* Files List Section */}
          <div className="lg:col-span-2">
            {audioFiles && audioFiles.length > 0 && (
              <div className="mb-4 flex gap-2">
                <Button
                  onClick={() => {
                    setBatchMode(true);
                    setSelectedBatchIds((audioFiles as any[]).map((f: any) => f.id));
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  Edit All Files
                </Button>
              </div>
            )}
            <AudioFilesList
              files={audioFiles || []}
              isLoading={isLoading}
              onEdit={setSelectedFileId}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
