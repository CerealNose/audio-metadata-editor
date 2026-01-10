import { Music } from "lucide-react";

interface ArtworkDisplayProps {
  artworkUrl?: string;
  fileName: string;
  size?: "sm" | "md" | "lg";
}

export default function ArtworkDisplay({
  artworkUrl,
  fileName,
  size = "md",
}: ArtworkDisplayProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  if (artworkUrl) {
    return (
      <img
        src={artworkUrl}
        alt={fileName}
        className={`${sizeClasses[size]} rounded-lg object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center`}
    >
      <Music className={`${size === "sm" ? "w-5 h-5" : size === "md" ? "w-6 h-6" : "w-8 h-8"} text-accent`} />
    </div>
  );
}
