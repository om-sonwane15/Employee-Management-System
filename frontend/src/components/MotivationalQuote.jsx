import React, { useState, useEffect } from 'react';
import { 
  Quote, 
  RefreshCw, 
  Heart, 
  Share2, 
  BookOpen, 
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const MotivationalQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [animateQuote, setAnimateQuote] = useState(false);
  const [quoteHistory, setQuoteHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback quotes in case API fails
  const fallbackQuotes = [
    {
      content: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      content: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs"
    },
    {
      content: "Life is what happens to you while you're busy making other plans.",
      author: "John Lennon"
    },
    {
      content: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt"
    },
    {
      content: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle"
    },
    {
      content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      content: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins"
    },
    {
      content: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein"
    },
    {
      content: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt"
    },
    {
      content: "The only limit to our realization of tomorrow will be our doubts of today.",
      author: "Franklin D. Roosevelt"
    },
    {
      content: "Code is like humor. When you have to explain it, it's bad.",
      author: "Cory House"
    },
    {
      content: "First, solve the problem. Then, write the code.",
      author: "John Johnson"
    },
    {
      content: "The best error message is the one that never shows up.",
      author: "Thomas Fuchs"
    },
    {
      content: "Programming isn't about what you know; it's about what you can figure out.",
      author: "Chris Pine"
    },
    {
      content: "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.",
      author: "Patrick McKenzie"
    }
  ];

  // Multiple API sources for quotes
  const fetchQuoteFromAPI = async () => {
    const apiSources = [
      // ZenQuotes API
      {
        url: 'https://zenquotes.io/api/random',
        transform: (data) => ({
          content: data[0]?.q || data[0]?.text,
          author: data[0]?.a || data[0]?.author
        })
      },
      // Quotable API
      {
        url: 'https://api.quotable.io/random',
        transform: (data) => ({
          content: data.content,
          author: data.author
        })
      },
      // DummyJSON Quotes
      {
        url: 'https://dummyjson.com/quotes/random',
        transform: (data) => ({
          content: data.quote,
          author: data.author
        })
      },
      // Type.fit API
      {
        url: 'https://type.fit/api/quotes',
        transform: (data) => {
          const randomQuote = data[Math.floor(Math.random() * data.length)];
          return {
            content: randomQuote.text,
            author: randomQuote.author?.replace(', type.fit', '') || 'Unknown'
          };
        }
      }
    ];

    for (const source of apiSources) {
      try {
        const response = await fetch(source.url);
        if (response.ok) {
          const data = await response.json();
          const quote = source.transform(data);
          if (quote.content && quote.author) {
            return quote;
          }
        }
      } catch (error) {
        console.log(`Failed to fetch from ${source.url}:`, error);
      }
    }

    // If all APIs fail, return a random fallback quote
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  };

  const fetchNewQuote = async () => {
    setLoading(true);
    setAnimateQuote(true);
    
    try {
      const quote = await fetchQuoteFromAPI();
      
      setTimeout(() => {
        setCurrentQuote(quote);
        setQuoteHistory(prev => {
          const newHistory = [quote, ...prev.slice(0, 9)]; // Keep last 10 quotes
          return newHistory;
        });
        setCurrentIndex(0);
        setLiked(false);
        setAnimateQuote(false);
      }, 500);
      
    } catch (error) {
      // Use fallback quote
      const fallbackQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setCurrentQuote(fallbackQuote);
      setQuoteHistory(prev => [fallbackQuote, ...prev.slice(0, 9)]);
      setCurrentIndex(0);
      setLiked(false);
      setAnimateQuote(false);
      toast.error('Failed to fetch new quote, showing inspiring fallback!');
    } finally {
      setLoading(false);
    }
  };

  const navigateQuote = (direction) => {
    if (direction === 'next' && currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentQuote(quoteHistory[newIndex]);
      setAnimateQuote(true);
      setTimeout(() => setAnimateQuote(false), 300);
    } else if (direction === 'prev' && currentIndex < quoteHistory.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentQuote(quoteHistory[newIndex]);
      setAnimateQuote(true);
      setTimeout(() => setAnimateQuote(false), 300);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Removed from favorites' : 'Added to favorites!');
  };

  const handleShare = async () => {
    if (navigator.share && currentQuote) {
      try {
        await navigator.share({
          title: 'Motivational Quote',
          text: `"${currentQuote.content}" - ${currentQuote.author}`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copying to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (currentQuote) {
      const text = `"${currentQuote.content}" - ${currentQuote.author}`;
      navigator.clipboard.writeText(text).then(() => {
        toast.success('Quote copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy quote');
      });
    }
  };

  // Load initial quote
  useEffect(() => {
    fetchNewQuote();
    
    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchNewQuote, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycle quotes every 2 minutes
  useEffect(() => {
    const autoCycle = setInterval(() => {
      fetchNewQuote();
    }, 2 * 60 * 1000);
    
    return () => clearInterval(autoCycle);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        
        @keyframes slideInLeft {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out forwards;
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.8s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .glass-effect {
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-4 w-2 h-2 bg-white/30 rounded-full animate-sparkle"></div>
        <div className="absolute top-1/4 right-8 w-3 h-3 bg-white/20 rounded-full animate-sparkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 right-4 w-2 h-2 bg-white/25 rounded-full animate-sparkle" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white/20 rounded-2xl animate-pulse-slow">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Daily Inspiration</h3>
            <p className="text-purple-100 text-sm">Fuel your motivation</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Navigation buttons */}
          <button
            onClick={() => navigateQuote('prev')}
            disabled={currentIndex >= quoteHistory.length - 1}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={() => navigateQuote('next')}
            disabled={currentIndex <= 0}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={fetchNewQuote}
            disabled={loading}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors group"
          >
            <RefreshCw className={`w-4 h-4 group-hover:scale-110 transition-transform ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quote Content */}
      <div className={`relative z-10 transition-all duration-500 ${animateQuote ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
        {currentQuote ? (
          <div className="space-y-6">
            {/* Quote Text */}
            <div className="relative">
              <Quote className="absolute -top-2 -left-2 w-8 h-8 text-white/30 animate-bounce-in" />
              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed pl-6 animate-slide-in-left">
                "{currentQuote.content}"
              </blockquote>
            </div>
            
            {/* Author */}
            <div className="flex items-center justify-between animate-slide-in-right">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-white/50 rounded-full"></div>
                <div>
                  <p className="text-lg font-semibold text-purple-100">
                    {currentQuote.author}
                  </p>
                  <p className="text-sm text-purple-200">
                    Quote {currentIndex + 1} of {quoteHistory.length}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-lg transition-all duration-300 group ${
                    liked 
                      ? 'bg-red-500/20 text-red-200' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <Heart 
                    className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                      liked ? 'fill-current' : ''
                    }`} 
                  />
                </button>
                
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors group"
                >
                  <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-purple-100">Loading inspiration...</p>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {quoteHistory.length > 1 && (
        <div className="relative z-10 mt-6 flex items-center justify-center space-x-2">
          {quoteHistory.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setCurrentQuote(quoteHistory[index]);
                setAnimateQuote(true);
                setTimeout(() => setAnimateQuote(false), 300);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
          {quoteHistory.length > 5 && (
            <span className="text-white/60 text-xs ml-2">+{quoteHistory.length - 5}</span>
          )}
        </div>
      )}

      {/* Sparkles Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <Sparkles className="absolute top-4 right-4 w-4 h-4 text-yellow-300 animate-sparkle" />
        <Sparkles className="absolute bottom-8 left-8 w-3 h-3 text-yellow-300 animate-sparkle" style={{ animationDelay: '0.5s' }} />
        <Star className="absolute top-1/3 left-1/4 w-3 h-3 text-yellow-300 animate-sparkle" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default MotivationalQuote;
