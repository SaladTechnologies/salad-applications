import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactElement } from 'react'
import { buttonVariants } from './button-variants.ts'
import { cn } from './cn.ts'

/** The props of {@link Button}: a `<button>`'s, plus the variant and size. */
export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Renders the only child (a link, for one) with the button's classes and props, instead of a `<button>`. */
    asChild?: boolean
  }

/** A button in the rebuilt UI's style (shadcn/ui's Button). */
export const Button = ({ className, variant, size, asChild = false, ...props }: ButtonProps): ReactElement => {
  const Component = asChild ? Slot : 'button'
  return <Component data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
