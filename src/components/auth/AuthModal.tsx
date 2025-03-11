
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthModalContent } from "./AuthModalContent";
import { useAuth } from "@/contexts/AuthContext";

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Don't show login button if user is already authenticated
  if (user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login / Sign Up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <AuthModalContent onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
