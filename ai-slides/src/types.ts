export interface SlideStyle {
  backgroundColor: string
  textColor: string
  fontSize: string
  fontFamily?: string
  backgroundImage?: string
  layout?: 'center' | 'left' | 'right' | 'grid'
}

export interface Slide {
  id: number
  content: string
  style: SlideStyle
}

export interface PromptInputProps {
  onSubmit: (prompt: string) => void
}

export interface SlideEditorProps {
  slides: Slide[]
  currentSlide: number
  onSlideChange: (index: number) => void
}

export interface SlidePreviewProps {
  slide: Slide | undefined
  totalSlides: number
} 