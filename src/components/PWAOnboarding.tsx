import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Radio, Users, Zap, ChevronRight } from 'lucide-react';

interface OnboardingSlide {
  icon: any;
  title: string;
  description: string;
  gradient: string;
}

const slides: OnboardingSlide[] = [
  {
    icon: Calendar,
    title: 'Discover Live Events',
    description: 'Find concerts, festivals, and shows happening near you in real-time',
    gradient: 'from-purple-600 via-purple-700 to-pink-600',
  },
  {
    icon: Radio,
    title: 'Stream in HD',
    description: 'Watch events live with multi-camera angles and crystal-clear quality',
    gradient: 'from-pink-600 via-rose-600 to-orange-600',
  },
  {
    icon: Users,
    title: 'Join the Community',
    description: 'Connect with fans, share moments, and make memories together',
    gradient: 'from-cyan-500 via-blue-600 to-purple-600',
  },
  {
    icon: Zap,
    title: 'Instant Access',
    description: 'Get tickets in seconds and enjoy seamless entry to any event',
    gradient: 'from-yellow-500 via-orange-500 to-red-600',
  },
];

interface PWAOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function PWAOnboarding({ onComplete, onSkip }: PWAOnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden">
      {/* Skip Button */}
      <div className="absolute top-8 right-6 z-10">
        <button
          onClick={onSkip}
          className="text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slides Container */}
      <div className="flex-1 flex items-center justify-center px-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full max-w-md text-center"
          >
            {/* Animated Icon with Gradient Background */}
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="mb-12"
            >
              <div className={`w-32 h-32 mx-auto bg-gradient-to-br ${currentSlideData.gradient} rounded-3xl shadow-2xl flex items-center justify-center`}>
                <Icon className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              {currentSlideData.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              {currentSlideData.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Section */}
      <div className="px-8 pb-12">
        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'w-8 bg-purple-600' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Next/Get Started Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
          >
            <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          {/* Back Button (only show if not first slide) */}
          {currentSlide > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePrev}
              className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Back
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
