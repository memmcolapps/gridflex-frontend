import { Spinner } from "./spinner";
import { Progress } from "./progress";
import { Card } from "./card";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  /**
   * Type of loading animation to display
   * @default "spinner"
   */
  variant?: "spinner" | "card" | "skeleton" | "inline";

  /**
   * Loading message to display
   */
  message?: string;

  /**
   * Optional progress value (0-100) for card variant
   */
  progress?: number;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Size of the spinner
   */
  size?: "sm" | "md" | "lg";

  /**
   * Full screen loading overlay
   */
  fullScreen?: boolean;
}

/**
 * Spinner variant - Just the spinning icon with optional message
 */
function SpinnerVariant({
  message,
  size = "md",
  className,
}: Omit<LoadingAnimationProps, "variant" | "progress" | "fullScreen">) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className,
      )}
    >
      <Spinner className={sizeClasses[size]} />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  );
}

/**
 * Card variant - Loading state within a card with progress support
 */
function CardVariant({
  message = "Processing...",
  progress,
  className,
}: Omit<LoadingAnimationProps, "variant" | "size" | "fullScreen">) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Card className="w-full max-w-md border-none bg-white p-10 shadow-sm">
        <div className="mb-4 flex items-center justify-center">
          <Spinner className="size-6" />
        </div>

        {progress !== undefined && (
          <>
            <p className="mt-2 mb-3 text-center text-sm text-gray-500">
              {progress}%
            </p>
            <Progress value={progress} className="mb-3 w-full rounded-full" />
          </>
        )}

        <p className="text-center text-sm text-gray-500">{message}</p>
      </Card>
    </div>
  );
}

/**
 * Skeleton variant - Placeholder skeleton for content
 */
function SkeletonVariant({
  className,
}: Omit<
  LoadingAnimationProps,
  "variant" | "message" | "progress" | "size" | "fullScreen"
>) {
  return (
    <div className={cn("space-y-4", className)}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Inline variant - Compact loading indicator for inline use
 */
function InlineVariant({
  message,
  className,
}: Omit<
  LoadingAnimationProps,
  "variant" | "progress" | "size" | "fullScreen"
>) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Spinner className="size-4" />
      {message && <span className="text-sm text-gray-600">{message}</span>}
    </div>
  );
}

/**
 * LoadingAnimation component - A versatile loading state component
 * with multiple variants that match the app's design system
 */
export function LoadingAnimation({
  variant = "spinner",
  message,
  progress,
  className,
  size = "md",
  fullScreen = false,
}: LoadingAnimationProps) {
  const content =
    variant === "spinner" ? (
      <SpinnerVariant message={message} size={size} className={className} />
    ) : variant === "card" ? (
      <CardVariant
        message={message}
        progress={progress}
        className={className}
      />
    ) : variant === "skeleton" ? (
      <SkeletonVariant className={className} />
    ) : (
      <InlineVariant message={message} className={className} />
    );

  if (fullScreen) {
    return (
      <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

export { SpinnerVariant, CardVariant, SkeletonVariant, InlineVariant };
