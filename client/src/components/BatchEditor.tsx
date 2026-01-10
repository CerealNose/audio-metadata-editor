import { useState } from "react";
import { ArrowLeft, Save, CheckCircle2, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface BatchEditorProps {
  fileIds: number[];
  onClose: () => void;
  onComplete: () => void;
}

export default function BatchEditor({ fileIds, onClose, onComplete }: BatchEditorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(fileIds));
  const [metadata, setMetadata] = useState({
    artist: "",
    album: "",
    genre: "",
    year: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const batchUpdateMutation = (trpc.audio.batchUpdateMetadata as any).useMutation();

  const toggleFile = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === fileIds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(fileIds));
    }
  };

  const handleChange = (field: string, value: string) => {
    setMetadata((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one file");
      return;
    }

    if (!metadata.artist && !metadata.album && !metadata.genre && !metadata.year) {
      toast.error("Please enter at least one metadata field");
      return;
    }

    setIsSaving(true);
    try {
      const updateData: any = {};
      if (metadata.artist) updateData.artist = metadata.artist;
      if (metadata.album) updateData.album = metadata.album;
      if (metadata.genre) updateData.genre = metadata.genre;
      if (metadata.year) updateData.year = parseInt(metadata.year);

      await (batchUpdateMutation as any).mutateAsync({
        fileIds: Array.from(selectedIds),
        metadata: updateData,
      });

      toast.success(`Updated ${selectedIds.size} file(s) successfully`);
      onComplete();
    } catch (error) {
      toast.error("Failed to update files");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container max-w-4xl">
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
          <h1 className="text-3xl font-bold mb-2">Batch Edit Metadata</h1>
          <p className="text-muted-foreground">
            Update metadata for multiple files at once
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* File Selection */}
          <div className="lg:col-span-1">
            <Card className="card-elegant p-6">
              <h3 className="font-semibold mb-4">Select Files</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div className="flex items-center gap-3 p-2 hover:bg-muted rounded">
                  <Checkbox
                    checked={selectedIds.size === fileIds.length && fileIds.length > 0}
                    onCheckedChange={toggleAll}
                  />
                  <span className="text-sm font-medium">
                    {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select all"}
                  </span>
                </div>
                <div className="h-px bg-border my-2"></div>
                {fileIds.map((id) => (
                  <div key={id} className="flex items-center gap-3 p-2 hover:bg-muted rounded">
                    <Checkbox
                      checked={selectedIds.has(id)}
                      onCheckedChange={() => toggleFile(id)}
                    />
                    <span className="text-sm">File {id}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                {selectedIds.size} of {fileIds.length} selected
              </p>
            </Card>
          </div>

          {/* Batch Metadata Form */}
          <div className="lg:col-span-2">
            <Card className="card-elegant p-8">
              <h3 className="text-lg font-semibold mb-6">Metadata to Apply</h3>
              <div className="space-y-6">
                <div>
                  <label className="label-elegant">Artist</label>
                  <Input
                    value={metadata.artist}
                    onChange={(e) => handleChange("artist", e.target.value)}
                    placeholder="Leave empty to skip this field"
                    className="input-elegant"
                  />
                </div>

                <div>
                  <label className="label-elegant">Album</label>
                  <Input
                    value={metadata.album}
                    onChange={(e) => handleChange("album", e.target.value)}
                    placeholder="Leave empty to skip this field"
                    className="input-elegant"
                  />
                </div>

                <div>
                  <label className="label-elegant">Genre</label>
                  <Input
                    value={metadata.genre}
                    onChange={(e) => handleChange("genre", e.target.value)}
                    placeholder="Leave empty to skip this field"
                    className="input-elegant"
                  />
                </div>

                <div>
                  <label className="label-elegant">Year</label>
                  <Input
                    type="number"
                    value={metadata.year}
                    onChange={(e) => handleChange("year", e.target.value)}
                    placeholder="Leave empty to skip this field"
                    className="input-elegant"
                  />
                </div>

                <div className="divider-elegant"></div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Only fields with values will be updated. Leave fields empty to preserve existing metadata.
                  </p>
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
                    disabled={isSaving || selectedIds.size === 0}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Updating..." : `Update ${selectedIds.size} File(s)`}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
