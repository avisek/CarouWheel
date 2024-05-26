import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import useElementSize from '../hooks/useElementSize'
import { useCallback, useEffect, useMemo, useState } from 'react'
import bezier from 'bezier-easing'

function calculateThetaFromArcLength(L: number, r: number): number {
  const thetaRadians = L / r
  const thetaDegrees = thetaRadians * (180 / Math.PI)
  return thetaDegrees
}

function calculateArcLength(R: number, r: number): number {
  let cosTheta = (2 * r * r - R * R) / (2 * r * r)

  if (cosTheta < -1) cosTheta = -1
  if (cosTheta > 1) cosTheta = 1

  const theta = Math.acos(cosTheta / 2)

  const arcLength = r * theta
  return arcLength
}

export default function CarouWheel() {
  const slides = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven']

  const scaleEasing = useMemo(() => bezier(1, 0, 0.8, 0.8), [])

  const [containerRef, containerSize] = useElementSize()

  const circleBaseSize = (40 / 448) * containerSize.height

  const circleScaleMin = 1
  const circleScaleMax = 3

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: 'center', loop: false, axis: 'y', dragFree: true },
    // [Autoplay({ delay: 1000 })],
  )

  const [scrollProgress, setScrollProgress] = useState(0)
  const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollProgress(emblaApi.scrollProgress())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('pointerUp', (emblaApi) => {
      const { scrollTo } = emblaApi.internalEngine()
      scrollTo.distance(0, true)
    })

    emblaApi.on('scroll', onScroll)

    onScroll(emblaApi)
  }, [emblaApi, onScroll])

  const circles = slides.map((slide, index) => {
    const slideProgress = index / (slides.length - 1)

    const scaleProgress = 1 - Math.abs(slideProgress - scrollProgress)

    const circleScale =
      circleScaleMin +
      scaleEasing(scaleProgress) * (circleScaleMax - circleScaleMin)

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
  })

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

    const position = currentArcLength - totalArcLength / 2

    currentArcLength += circle.arcLength / 2
    currentArcLength += space / 2

    const theta = calculateThetaFromArcLength(position, containerSize.width / 2)

    return {
      ...circle,
      position,
      theta,
    }
  })

  const margin = (circleBaseSize * circleScaleMax) / 2

  return (
    <div className="h-[28rem] min-h-[28rem] w-[36rem] min-w-[28rem] flex text-xs rounded-3xl outline outline-zinc-500/30 resize overflow-hidden">
      <div
        className="basis-0 flex-grow relative"
        style={{
          marginTop: `${margin}px`,
          marginRight: `${margin}px`,
          marginBottom: `${margin}px`,
        }}
      >
        <div
          ref={containerRef}
          className="absolute inset-y-0 right-0 aspect-square rounded-full outline outline-zinc-500/30"
        >
          {positionedCircles.map((circle, index) => (
            <div
              key={index}
              className="absolute inset-0 flex justify-end items-center"
              style={{
                transform: `rotate(${circle.theta}deg)`,
              }}
            >
              <div className="size-0 flex justify-center items-center">
                <div
                  className="shrink-0 flex justify-center items-center rounded-full bg-zinc-500/30"
                  style={{
                    width: `${circleBaseSize}px`,
                    height: `${circleBaseSize}px`,
                    transform: `rotate(${-circle.theta}deg) scale(${
                      circle.scale
                    })`,
                  }}
                >
                  {slides[index]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="basis-0 flex-grow-[2] relative overflow-hidden"
        ref={emblaRef}
      >
        <div className="h-full relative [backface-visibility:hidden] [touch-action:pan-x_pinch-zoom]">
          {slides.map((slide, index) => (
            <div key={index} className="h-full w-full relative">
              <div
                className="absolute inset-0 flex justify-center items-center text-4xl rounded-3xl outline -outline-offset-8 outline-zinc-500/30 snap-center"
                style={{
                  marginTop: `${margin}px`,
                  marginBottom: `${margin}px`,
                }}
              >
                {slide}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
