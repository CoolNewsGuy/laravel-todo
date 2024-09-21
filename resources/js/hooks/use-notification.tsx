import { CheckCircle, Info, TriangleAlert } from "lucide-react";
import { useToast } from "./use-toast";

interface NotificationShowerProps {
  message: string;
  state: "neutral" | "success" | "error";
}

export function useNotification() {
  const { toast } = useToast();

  return {
    show({ message, state }: NotificationShowerProps) {
      switch (state) {
        case "neutral":
          toast({
            description: (
              <div className="flex items-center gap-3">
                <Info />
                <div>{message}</div>
              </div>
            ),
          });
          break;

        case "success":
          toast({
            variant: "success",
            description: (
              <div className="flex items-center gap-3">
                <CheckCircle />
                <div>{message}</div>
              </div>
            ),
          });

          break;
        case "error":
          toast({
            variant: "destructive",
            description: (
              <div className="flex items-center gap-3">
                <TriangleAlert />
                <div>{message}</div>
              </div>
            ),
          });
      }
    },
  };
}
