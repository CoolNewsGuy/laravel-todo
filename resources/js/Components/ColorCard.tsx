import { cn } from "@/lib/utils";

interface ColorCardProps {
  color: string;
  className?: string;
}

export default function ColorCard({ color, className }: ColorCardProps) {
  return (
    <div className={cn("rounded-md overflow-hidden", className)}>
      <div className="h-[12rem]" style={{ backgroundColor: color }}></div>
      <div className="flex justify-center text-lg uppercase p-3 border dark:bg-gray-800 dark:border-gray-700 rounded-b-md">
        {color}
      </div>
    </div>
  );
}
