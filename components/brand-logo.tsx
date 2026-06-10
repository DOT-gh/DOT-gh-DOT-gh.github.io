import { GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  /** Tailwind size classes for the square badge, e.g. "h-7 w-7" */
  className?: string
  /** Tailwind size classes for the icon inside, e.g. "h-4 w-4" */
  iconClassName?: string
}

/**
 * Unified brand mark: a green rounded square with a white graduation cap.
 * Used in both the main site header and the teacher panel header.
 */
export function BrandLogo({ className, iconClassName }: BrandLogoProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/30 select-none",
        "h-7 w-7",
        className,
      )}
      aria-hidden="true"
    >
      <GraduationCap className={cn("text-primary-foreground", "h-4 w-4", iconClassName)} />
    </div>
  )
}
