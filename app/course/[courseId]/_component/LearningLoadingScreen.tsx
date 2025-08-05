import React, { useState, useEffect } from "react";

const LearningLoadingScreen = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  const learningQuotes = [
    {
      text: "If you can't explain it simply, you don't understand it well enough.",
      author: "Albert Einstein",
      technique: "Feynman Technique",
    },
    {
      text: "The Feynman Technique: Explain it to a child, identify gaps, simplify further.",
      author: "Richard Feynman",
      technique: "Feynman Technique",
    },
    {
      text: "Black box thinking: Learn from failure by treating mistakes as data, not disasters.",
      author: "Matthew Syed",
      technique: "Black Box Thinking",
    },
    {
      text: "Spaced repetition: Review information at increasing intervals for long-term retention.",
      author: "Hermann Ebbinghaus",
      technique: "Spaced Learning",
    },
    {
      text: "Active recall: Test yourself instead of just re-reading. Struggle strengthens memory.",
      author: "Learning Science",
      technique: "Active Learning",
    },
    {
      text: "Interleaving: Mix different topics together rather than studying one at a time.",
      author: "Cognitive Science",
      technique: "Interleaved Practice",
    },
    {
      text: "The best way to learn is to teach. Explaining forces you to organize your thoughts.",
      author: "Learning Principle",
      technique: "Teaching Method",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % learningQuotes.length);
    }, 3000); // Change quote every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const currentQuoteData = learningQuotes[currentQuote];
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full">
      {/* Floating Books Animation */}
      <div className="relative mb-12">
        <div className="flex space-x-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-16 h-20 bg-gradient-to-br ${
                i === 0
                  ? "from-red-400 to-red-600"
                  : i === 1
                  ? "from-blue-400 to-blue-600"
                  : "from-green-400 to-green-600"
              } rounded-lg shadow-lg transform`}
              style={{
                animation: `float${i + 1} 2s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div className="w-full h-2 bg-white bg-opacity-30 rounded-t-lg"></div>
              <div className="p-2">
                <div className="w-full h-1 bg-white bg-opacity-40 rounded mb-1"></div>
                <div className="w-3/4 h-1 bg-white bg-opacity-40 rounded mb-1"></div>
                <div className="w-1/2 h-1 bg-white bg-opacity-40 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animated Brain with Gears */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
          {/* Brain Icon */}
          <svg
            className="w-12 h-12 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.686 2 6 4.686 6 8c0 1.104.895 2 2 2s2-.896 2-2c0-1.104.895-2 2-2s2 .896 2 2c0 1.104.895 2 2 2s2-.896 2-2c0-3.314-2.686-6-6-6zm0 8c-1.105 0-2 .895-2 2v8c0 1.104.895 2 2 2s2-.896 2-2v-8c0-1.105-.895-2-2-2z" />
          </svg>
        </div>

        {/* Spinning Gears */}
        <div
          className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full shadow-md"
          style={{ animation: "spin 1.5s linear infinite" }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
          </div>
        </div>

        <div
          className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-400 rounded-full shadow-md"
          style={{ animation: "spin 2s linear infinite reverse" }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Learning Quote Section */}
      <div className="text-center mb-8 max-w-2xl mx-auto px-6">
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-30">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
              {currentQuoteData.technique}
            </span>
          </div>

          <blockquote
            key={currentQuote}
            className="text-lg text-gray-700 font-medium mb-3 leading-relaxed"
            style={{ animation: "fadeInOut 3s ease-in-out" }}
          >
            "{currentQuoteData.text}"
          </blockquote>

          <cite className="text-sm text-gray-500 font-medium">
            — {currentQuoteData.author}
          </cite>
        </div>
      </div>

      {/* Loading Text with Typewriter Effect */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Preparing Your Learning Journey
        </h2>
        <div className="flex items-center justify-center space-x-1">
          <span className="text-base text-gray-600">
            Loading course content
          </span>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-indigo-500 rounded-full"
                style={{
                  animation: `bounce 1.4s ease-in-out infinite`,
                  animationDelay: `${i * 0.16}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ animation: "progress 2.5s ease-in-out infinite" }}
        ></div>
      </div>

      {/* Floating Learning Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Lightbulb */}
        <div
          className="absolute top-20 left-10 w-8 h-8 text-yellow-400 opacity-60"
          style={{ animation: "floatSlow 4s ease-in-out infinite" }}
        >
          💡
        </div>

        {/* Graduation Cap */}
        <div
          className="absolute top-32 right-16 w-8 h-8 text-indigo-500 opacity-60"
          style={{ animation: "floatSlow 4s ease-in-out infinite 1s" }}
        >
          🎓
        </div>

        {/* Target */}
        <div
          className="absolute bottom-32 left-20 w-8 h-8 text-red-500 opacity-60"
          style={{ animation: "floatSlow 4s ease-in-out infinite 2s" }}
        >
          🎯
        </div>

        {/* Rocket */}
        <div
          className="absolute bottom-20 right-10 w-8 h-8 text-purple-500 opacity-60"
          style={{ animation: "floatSlow 4s ease-in-out infinite 0.5s" }}
        >
          🚀
        </div>

        {/* Trophy */}
        <div
          className="absolute top-1/2 left-8 w-8 h-8 text-yellow-500 opacity-60"
          style={{ animation: "floatSlow 4s ease-in-out infinite 1.5s" }}
        >
          🏆
        </div>

        {/* Puzzle Piece */}
        <div
          className="absolute top-1/2 right-12 w-8 h-8 text-green-500 opacity-60"
          style={{ animation: "floatSlow 4s ease-in-out infinite 2.5s" }}
        >
          🧩
        </div>
      </div>

      <style jsx>{`
        @keyframes float1 {
          0%,
          100% {
            transform: translateY(0px) rotate(-2deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translateY(0px) rotate(1deg);
          }
          50% {
            transform: translateY(-15px) rotate(-1deg);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translateY(0px) rotate(-1deg);
          }
          50% {
            transform: translateY(-12px) rotate(1deg);
          }
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(-5px) translateX(-5px);
          }
          75% {
            transform: translateY(-15px) translateX(3px);
          }
        }
      `}</style>
    </div>
  );
};

export default LearningLoadingScreen;
