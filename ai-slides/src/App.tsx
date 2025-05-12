import { useState } from 'react'
import SlideEditor from './components/SlideEditor'
import SlidePreview from './components/SlidePreview'
import PromptInput from './components/PromptInput'

function App() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  const handlePromptSubmit = async (prompt: string) => {
    // TODO: Implement AI slide generation
    const newSlide: Slide = {
      id: Date.now(),
      content: prompt,
      style: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontSize: '2rem',
      },
    }
    setSlides([...slides, newSlide])
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Slide Deck Creator</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <PromptInput onSubmit={handlePromptSubmit} />
            <SlideEditor
              slides={slides}
              currentSlide={currentSlide}
              onSlideChange={setCurrentSlide}
            />
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <SlidePreview
              slide={slides[currentSlide]}
              totalSlides={slides.length}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App 