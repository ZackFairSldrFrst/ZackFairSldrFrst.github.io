// Types
const SlideStyle = {
  backgroundColor: String,
  textColor: String,
  fontSize: String,
  fontFamily: String,
  backgroundImage: String,
  layout: String
};

// Components
const PromptInput = ({ onSubmit }) => {
  const [prompt, setPrompt] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
          Enter your slide prompt
        </label>
        <div className="mt-1">
          <textarea
            id="prompt"
            name="prompt"
            rows={3}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Describe what you want on your slide..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Generate Slide
      </button>
    </form>
  );
};

const SlideEditor = ({ slides, currentSlide, onSlideChange }) => {
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
  );
};

const SlidePreview = ({ slide, totalSlides }) => {
  if (!slide) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No slide selected</p>
      </div>
    );
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
  );
};

// Main App Component
function App() {
  const [slides, setSlides] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const handlePromptSubmit = async (prompt) => {
    // TODO: Implement AI slide generation
    const newSlide = {
      id: Date.now(),
      content: prompt,
      style: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontSize: '2rem',
      },
    };
    setSlides([...slides, newSlide]);
  };

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
  );
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(<App />); 