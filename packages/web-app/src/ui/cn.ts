import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// The tailwind-merge package only knows Tailwind's own font sizes. Without these, it reads `text-salad-small` as a
// color and drops it when a `text-salad-*` color follows (src/ui/tailwind.css defines both).
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'salad-xx-small',
        'salad-x-small',
        'salad-small',
        'salad-medium',
        'salad-medium-large',
        'salad-large',
        'salad-single-large',
        'salad-double-large',
        'salad-triple-large',
        'salad-x-large',
        'salad-xx-large',
      ],
    },
  },
})

/**
 * Joins class names, drops falsy ones, and resolves Tailwind conflicts so the last class wins (shadcn/ui's `cn`).
 *
 * @example
 *   cn('px-2 text-salad-small', isWide && 'px-4') // 'text-salad-small px-4' when isWide
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))
