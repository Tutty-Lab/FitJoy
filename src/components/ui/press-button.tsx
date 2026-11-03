import { Button, type ButtonProps } from "@animate-ui/react/primitives/buttons/button"
import { cn } from "@/lib/utils"

// Springy press/hover feedback for primary actions. Pass `asChild` to wrap a <Link>.
function PressButton({ className, hoverScale = 1.02, tapScale = 0.95, ...props }: ButtonProps) {
  return <Button data-press hoverScale={hoverScale} tapScale={tapScale} className={cn(className)} {...props} />
}

export { PressButton }
