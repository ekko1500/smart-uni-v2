"use client";

import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function ToastDestructive({ message, type }) {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      variant: type === "destructive" ? "destructive" : "default",
      title:
        type === "destructive"
          ? "Uh oh! Something went wrong."
          : "Notification",
      description: message,
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  };

  return (
    <Button variant="outline" onClick={showToast}>
      Show Toast
    </Button>
  );
}
