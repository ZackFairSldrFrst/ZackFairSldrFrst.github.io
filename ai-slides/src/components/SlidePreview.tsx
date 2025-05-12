import { SlidePreviewProps } from '../types'

const SlidePreview = ({ slide, totalSlides }: SlidePreviewProps) => {
  if (!slide) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No slide selected</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        className="h-[600px] rounded-lg shadow-lg p-8 flex items-center justify-center"
        style={{
          backgroundColor: slide.style.backgroundColor,
          color: slide.style.textColor,
          fontSize: slide.style.fontSize,
          fontFamily: slide.style.fontFamily,
          backgroundImage: slide.style.backgroundImage
            ? `url(${slide.style.backgroundImage})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className={`w-full h-full ${
            slide.style.layout === 'center'
              ? 'flex items-center justify-center text-center'
              : slide.style.layout === 'left'
              ? 'flex items-center'
              : slide.style.layout === 'right'
              ? 'flex items-center justify-end'
              : 'grid grid-cols-2 gap-4'
          }`}
        >
          {slide.content}
        </div>
      </div>
      <div className="text-sm text-gray-500 text-center">
        Slide {totalSlides > 0 ? `${totalSlides} of ${totalSlides}` : '0 of 0'}
      </div>
    </div>
  )
}

export default SlidePreview 