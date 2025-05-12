import { SlideEditorProps } from '../types'

const SlideEditor = ({ slides, currentSlide, onSlideChange }: SlideEditorProps) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Slide Editor</h2>
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              index === currentSlide
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSlideChange(index)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                Slide {index + 1}
              </span>
              <span className="text-xs text-gray-500">
                {slide.content.substring(0, 50)}...
              </span>
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No slides yet. Enter a prompt to generate your first slide!
          </p>
        )}
      </div>
    </div>
  )
}

export default SlideEditor 