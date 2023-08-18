import type { RefObject } from 'react'
import { useEffect } from 'react'

export const useDetectClickOutsideElement = (ref: RefObject<HTMLElement>, onClickOutside: () => void) => {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target as Element)) {
        onClickOutside()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onClickOutside])
}
