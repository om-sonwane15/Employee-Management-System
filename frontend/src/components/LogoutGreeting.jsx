import React, { useState, useEffect } from 'react';
import { CheckCircle, Heart, Star, Sparkles } from 'lucide-react';

const LogoutGreeting = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Phase transitions
    const phaseTimer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 800);

    // Auto-hide after 5 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500); // Wait for fade out animation
    }, 5000);

    return () => {
      clearInterval(phaseTimer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white/25 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white">
        {/* Animated Icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <div className={`absolute inset-0 bg-white/20 rounded-full transition-all duration-500 ${
              animationPhase === 0 ? 'scale-100' : animationPhase === 1 ? 'scale-110' : animationPhase === 2 ? 'scale-105' : 'scale-100'
            }`}>
              <div className="w-full h-full flex items-center justify-center">
                {animationPhase === 0 && <CheckCircle className="w-12 h-12 animate-bounce" />}
                {animationPhase === 1 && <Heart className="w-12 h-12 animate-pulse" />}
                {animationPhase === 2 && <Star className="w-12 h-12 animate-spin" />}
                {animationPhase === 3 && <Sparkles className="w-12 h-12 animate-bounce" />}
              </div>
            </div>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* Animated Text */}
        <div className="space-y-4">
          <h1 className={`text-4xl md:text-5xl font-bold transition-all duration-500 ${
            animationPhase === 0 ? 'transform translate-y-0 opacity-100' : 
            animationPhase === 1 ? 'transform -translate-y-2 opacity-100' : 
            animationPhase === 2 ? 'transform translate-y-1 opacity-100' : 
            'transform translate-y-0 opacity-100'
          }`}>
            {animationPhase === 0 && "Thank You! 😊"}
            {animationPhase === 1 && "Come Back Soon! 💝"}
            {animationPhase === 2 && "Have a Great Day! ⭐"}
            {animationPhase === 3 && "See You Later! ✨"}
          </h1>
          
          <p className={`text-xl md:text-2xl text-blue-100 transition-all duration-500 ${
            animationPhase % 2 === 0 ? 'opacity-100' : 'opacity-80'
          }`}>
            {animationPhase === 0 && "You've been successfully logged out"}
            {animationPhase === 1 && "Your session has ended securely"}
            {animationPhase === 2 && "All your data has been saved"}
            {animationPhase === 3 && "Until next time!"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-100 ease-linear"
              style={{ 
                width: `${((5000 - (Date.now() % 5000)) / 5000) * 100}%`,
                animation: 'shrink 5s linear forwards'
              }}
            ></div>
          </div>
          <p className="text-sm text-blue-100 mt-2">Redirecting...</p>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        .fade-out {
          animation: fadeOut 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LogoutGreeting;
