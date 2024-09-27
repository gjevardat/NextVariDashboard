import React, { useCallback } from 'react'
import {  PrevButton,  NextButton,  usePrevNextButtons} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'

import '../css/embla.css'

const EmblaCarousel = (props) => {
  const { slides, options, children, setPageIndex } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      console.log("page index before scroll",emblaApi.selectedScrollSnap());
      emblaApi.scrollNext()
      console.log("page index after scroll",emblaApi.selectedScrollSnap());
      setPageIndex(emblaApi.selectedScrollSnap())
    }
  }, [emblaApi])


  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      console.log("page index before scroll",emblaApi.selectedScrollSnap());
      emblaApi.scrollPrev()
      console.log("page index after scroll",emblaApi.selectedScrollSnap());
      setPageIndex(emblaApi.selectedScrollSnap())
    }
  }, [emblaApi])


  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((index) => (
            <div className="embla__slide" key={index}>
              {children}
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={scrollPrev} disabled={prevBtnDisabled} />
          <NextButton onClick={scrollNext} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
