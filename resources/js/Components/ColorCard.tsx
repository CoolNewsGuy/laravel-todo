import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface ColorCardProps {
  color: string;
  className?: string;
}

export default function ColorCard({ color, className }: ColorCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyColorToClipboard() {
    await navigator.clipboard.writeText(color);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 500);
  }

  return (
    <div
      className={cn(
        "rounded-md overflow-hidden transition-transform shadow-md cursor-pointer hover:scale-105",
        className
      )}
      title="Copy color"
      onClick={copyColorToClipboard}
    >
      <div className="h-[13rem] relative" style={{ backgroundColor: color }}>
        <Button
          className={cn(
            "absolute right-4 top-4 size-[2.1rem] border-gray-400 border bg-white hover:bg-white/90 transition-colors",
            copied && "bg-green-400 border-transparent hover:bg-green-400"
          )}
          size={"icon"}
          onClick={copyColorToClipboard}
          aria-label={"Copy color to clipboard"}
          title={"Copy color"}
        >
          {copied ? (
            <Check className="stroke-white" size={20} />
          ) : (
            <Copy className="stroke-black" size={17} />
          )}
        </Button>
      </div>

      <div className="flex justify-center text-lg uppercase p-3 border dark:bg-gray-800 dark:border-gray-700 rounded-b-md">
        {color}
      </div>
    </div>
  );
}
