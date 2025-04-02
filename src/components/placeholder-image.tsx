import { Home } from 'lucide-react';

interface PlaceholderImageProps {
  className?: string;
}

export function PlaceholderImage({ className }: PlaceholderImageProps) {
  return (
    <div className={`flex items-center justify-center w-full h-full bg-muted ${className}`}>
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <Home className="w-12 h-12 mb-2 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">No image available</p>
      </div>
    </div>
  );
}
