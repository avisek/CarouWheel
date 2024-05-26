import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import useElementSize from '../hooks/useElementSize'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import bezier from 'bezier-easing'

function calculateThetaFromArcLength(L: number, r: number): number {
  if (L <= 0 || r <= 0) {
    console.error('L and r must be positive numbers.')
  }

  const thetaRadians = L / r

  const thetaDegrees = thetaRadians * (180 / Math.PI)
  return thetaDegrees
}

function calculateArcLength(R: number, r: number): number {
  // console.log({ R, r })
  const d = r
  if (R <= 0 || r <= 0 || d <= 0) {
    console.error('R, r, and d must be positive numbers.')
  }
  if (d > R + r || d < Math.abs(R - r)) {
    console.error('The circles do not intersect.')
  }

  let cosTheta = (r * r + d * d - R * R) / (2 * r * d)

  if (cosTheta < -1) cosTheta = -1
  if (cosTheta > 1) cosTheta = 1

  const theta = Math.acos(cosTheta)

  const arcLength = r * theta
  return arcLength
}

export default function CarouWheel() {
  const slides = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven']
  const circleBaseSize = 60

  const scaleEasing = useMemo(() => bezier(0.7, 0, 1, 0.7), [])

  const [containerRef, containerSize] = useElementSize()

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: 'center', loop: false, axis: 'y' },
    // [Autoplay({ delay: 3000 })],
  )

  const [scrollProgress, setScrollProgress] = useState(0)
  const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollProgress(emblaApi.scrollProgress())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onScroll(emblaApi)

    emblaApi.on('scroll', onScroll)
  }, [emblaApi, onScroll])

  const circles = useMemo(
    () =>
      slides.map((slide, index) => {
        const slideProgress = index / (slides.length - 1)

        const scaleProgress = 1 - Math.abs(slideProgress - scrollProgress)

        const minScale = 1
        const maxScale = 3
        const circleScale =
          minScale + scaleEasing(scaleProgress) * (maxScale - minScale)

        const circleSize = circleBaseSize * circleScale

        const arcLength = calculateArcLength(
          containerSize.width / 2,
          circleSize / 2,
        )

        return {
          index,
          progress: slideProgress,
          scale: circleScale,
          size: circleSize,
          arcLength,
        }
      }),
    [scrollProgress, slides],
  )

  const totalArcLength = circles.reduce(
    (total, circle) => total + circle.arcLength,
    0,
  )

  const bigCircleCircumference = (2 * Math.PI * containerSize.width) / 2

  const availableArcLength = (bigCircleCircumference * 180) / 360

  const totalSpace = availableArcLength - totalArcLength

  const space = 0 && totalSpace / (circles.length + 1)

  let currentArcLength = 0
  const positionedCircles = circles.map((circle) => {
    currentArcLength += space / 2
    currentArcLength += circle.arcLength / 2

    const position = currentArcLength

    currentArcLength += circle.arcLength / 2
    currentArcLength += space / 2

    const theta = calculateThetaFromArcLength(position, containerSize.width / 2)

    return {
      ...circle,
      position,
      theta,
    }
  })

  return (
    <div className="min-h-96 flex outline outline-zinc-800 resize _overflow-auto">
      <div className="basis-0 flex-grow relative">
        <div
          ref={containerRef}
          className="absolute inset-y-0 right-0 aspect-square rounded-full border border-zinc-500"
        >
          {positionedCircles.map((circle, index) => {
            // const slideProgress = index / (slides.length - 1)

            // const scaleProgress = 1 - Math.abs(slideProgress - scrollProgress)

            // const minScale = 1
            // const maxScale = 3
            // const circleScale =
            //   minScale + scaleEasing(scaleProgress) * (maxScale - minScale)

            // const circleSize = circleBaseSize * circleScale

            const angle = circle.theta

            return (
              <div
                key={index}
                className="absolute inset-0 flex justify-end items-center"
                style={{
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <div
                  className="size-0 flex justify-center items-center"
                  style={{
                    transform: `rotate(${-angle}deg)`,
                  }}
                >
                  <div
                    className="shrink-0 flex justify-center items-center rounded-full bg-zinc-300/30"
                    style={{
                      width: `${circleBaseSize}px`,
                      height: `${circleBaseSize}px`,
                      transform: `scale(${circle.scale})`,
                    }}
                  >
                    {/* {text} */}
                    {/* {calculateArcLength(
                      containerSize.width / 2,
                      circleSize / 2,
                      containerSize.width / 2 - circleSize / 2,
                    )} */}
                    {circle.arcLength.toFixed(3)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div
        className="basis-0 flex-grow-[2.5] relative overflow-hidden"
        ref={emblaRef}
      >
        <div className="h-full relative">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="h-full flex justify-center items-center text-4xl border border-zinc-600 snap-center"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
