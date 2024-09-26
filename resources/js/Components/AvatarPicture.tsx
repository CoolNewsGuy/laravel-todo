import { cn } from "@/lib/utils";

export default function AvatarPicture({
  image,
  className,
}: {
  image: string;
  className?: string;
}) {
  return (
    <img
      src={image}
      alt="profile picture"
      className={cn("size-full object-cover", className)}
    />
  );
}
