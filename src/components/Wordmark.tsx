import Image from "next/image";
import wordmark from "../../public/logo-wordmark.png";
import wordmarkWhite from "../../public/logo-wordmark-white.png";

/**
 * The wordmark, used intact. The PNG is 2524 px wide, so `sizes` tells
 * next/image to serve a copy a little wider than the rendered height needs
 * instead of the full-width original.
 */
export function Wordmark({
  className = "",
  variant = "dark",
  priority = true,
}: {
  className?: string;
  variant?: "dark" | "white";
  priority?: boolean;
  animate?: boolean;
}) {
  const src = variant === "white" ? wordmarkWhite : wordmark;
  return (
    <span className={`relative block select-none ${className}`} role="img" aria-label="made to disappear">
      <Image src={src} alt="" priority={priority} sizes="240px" className="h-full w-auto" draggable={false} />
    </span>
  );
}
