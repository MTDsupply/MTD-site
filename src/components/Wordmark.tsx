"use client";
import Image from "next/image";
import wordmark from "../../public/logo-wordmark.png";
import wordmarkWhite from "../../public/logo-wordmark-white.png";

/** The wordmark, used intact. */
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
      <Image src={src} alt="" priority={priority} className="h-full w-auto" draggable={false} />
    </span>
  );
}
