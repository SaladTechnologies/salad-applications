import { cva } from 'class-variance-authority'

/**
 * The button's classes for each variant and size (shadcn/ui's Button). Without Tailwind's Preflight (see tailwind.css),
 * the base classes reset what the browser's button style sets: border, background, margin, and font.
 */
export const buttonVariants = cva(
  [
    'm-0 inline-flex cursor-pointer items-center justify-center gap-2 border-0 border-solid bg-transparent font-[inherit]',
    'rounded-md text-salad-medium font-medium whitespace-nowrap transition-colors outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-border text-foreground hover:bg-foreground/10',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'text-foreground hover:bg-foreground/10',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-10 px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
