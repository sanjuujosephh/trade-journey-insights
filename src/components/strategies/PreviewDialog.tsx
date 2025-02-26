
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    title: string;
    description: string;
    image: string;
  } | null;
}

export function PreviewDialog({ isOpen, onOpenChange, item }: PreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{item?.title}</DialogTitle>
        </DialogHeader>
        {item && (
          <div className="mt-4">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full rounded-lg"
            />
            <p className="mt-4 text-muted-foreground">{item.description}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

