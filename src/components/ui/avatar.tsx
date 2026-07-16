import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";

export interface AvatarProps extends Omit<ImageProps, "alt" | "src" | "width" | "height"> {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ name, src, size = "md", className, ...props }: AvatarProps) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const sizes = { sm: { className: "h-8 w-8 text-xs", pixels: 32 }, md: { className: "h-10 w-10 text-sm", pixels: 40 }, lg: { className: "h-12 w-12 text-base", pixels: 48 } };

  return src ? (
    <Image src={src} alt={name} width={sizes[size].pixels} height={sizes[size].pixels} className={cn("rounded-full object-cover", sizes[size].className, className)} {...props} />
  ) : (
    <span aria-label={name} role="img" className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-foreground", sizes[size].className, className)}>
      {initials}
    </span>
  );
}
