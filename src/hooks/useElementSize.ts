import { useLayoutEffect, useRef, useState, type MutableRefObject } from 'react'
import useResizeObserver from '@react-hook/resize-observer'

export default function useElementSize<
  T extends HTMLElement = HTMLDivElement,
>(): [MutableRefObject<T | null>, DOMRect] {
  const targetRef = useRef<T | null>(null)
  const [size, setSize] = useState(new DOMRect(0, 0, 0, 0))

  useLayoutEffect(() => {
    targetRef.current && setSize(targetRef.current.getBoundingClientRect())
  }, [targetRef])

  useResizeObserver(targetRef, (entry) => setSize(entry.contentRect))
  return [targetRef, size]
}
