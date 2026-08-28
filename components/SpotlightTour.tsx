'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Compass, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Check,
  Wand2
} from 'lucide-react';

export interface TourStep {
  target: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  badge?: string;
}

interface SpotlightTourProps {
  steps: TourStep[];
  tourKey?: string;
  autoStart?: boolean;
}

export default function SpotlightTour({
  steps,
  tourKey = 'elmasry_spotlight_tour_done',
  autoStart = false,
}: SpotlightTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const calculatePosition = useCallback((index: number) => {
    if (!steps || steps.length === 0 || index >= steps.length) {
      setTargetRect(null);
      return;
    }

    const currentStep = steps[index];
    let el: HTMLElement | null = null;

    if (
      currentStep.target.startsWith('[') || 
      currentStep.target.startsWith('#') || 
      currentStep.target.startsWith('.')
    ) {
      el = document.querySelector(currentStep.target);
    } else {
      el = document.querySelector(`[data-tour="${currentStep.target}"]`);
    }

    if (el) {
      // Scroll into view
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Measure coordinates relative to viewport
      const updateRect = () => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      };

      updateRect();
      setTimeout(updateRect, 300);
      setTimeout(updateRect, 600);
    } else {
      setTargetRect(null);
    }
  }, [steps]);

  // Listen for global launch event
  useEffect(() => {
    const handleStartTourEvent = () => {
      setCurrentStepIndex(0);
      setIsOpen(true);
      calculatePosition(0);
    };

    window.addEventListener('start-spotlight-tour', handleStartTourEvent);
    return () => window.removeEventListener('start-spotlight-tour', handleStartTourEvent);
  }, [calculatePosition]);

  // When step changes, recalculate
  useEffect(() => {
    if (isOpen) {
      calculatePosition(currentStepIndex);
      const onScrollOrResize = () => calculatePosition(currentStepIndex);
      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize);
      return () => {
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
      };
    }
  }, [isOpen, currentStepIndex, calculatePosition]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      calculatePosition(nextIdx);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      calculatePosition(prevIdx);
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    localStorage.setItem(tourKey, 'true');
  };

  const handleStartTour = () => {
    setCurrentStepIndex(0);
    setIsOpen(true);
    calculatePosition(0);
  };

  // Floating Round Icon Button in the bottom left (matches user's reference)
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-40 no-print">
        <button
          onClick={handleStartTour}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 text-white shadow-2xl shadow-blue-500/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all border-2 border-white/20 group"
          title="بدء الجولة الاسترشادية التفاعلية"
        >
          <Wand2 className="w-6 h-6 text-white group-hover:rotate-45 transition-transform duration-300 drop-shadow" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping pointer-events-none" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 pointer-events-none" />
        </button>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  if (!currentStep) return null;

  const padding = 12;
  const top = targetRect ? Math.max(0, targetRect.top - padding) : 0;
  const left = targetRect ? Math.max(0, targetRect.left - padding) : 0;
  const width = targetRect ? targetRect.width + padding * 2 : 0;
  const height = targetRect ? targetRect.height + padding * 2 : 0;

  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

  let cardStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 99999,
  };

  if (targetRect && targetRect.width > 0) {
    if (targetRect.top > windowHeight / 2) {
      cardStyle.bottom = `${Math.max(20, windowHeight - targetRect.top + 16)}px`;
      cardStyle.left = `${Math.min(Math.max(20, targetRect.left), windowWidth - 400)}px`;
    } else {
      cardStyle.top = `${Math.min(windowHeight - 240, targetRect.top + targetRect.height + 16)}px`;
      cardStyle.left = `${Math.min(Math.max(20, targetRect.left), windowWidth - 400)}px`;
    }
  } else {
    cardStyle.top = '50%';
    cardStyle.left = '50%';
    cardStyle.transform = 'translate(-50%, -50%)';
  }

  return (
    <div className="no-print">
      
      {/* SVG Spotlight Cutout Mask */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-[9998] transition-all duration-300 ease-out"
        style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh' }}
      >
        <defs>
          <mask id="tourSpotlightMask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && targetRect.width > 0 && (
              <rect
                x={left}
                y={top}
                width={width}
                height={height}
                rx="20"
                ry="20"
                fill="black"
                className="transition-all duration-300 ease-out"
              />
            )}
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.85)"
          mask="url(#tourSpotlightMask)"
        />
      </svg>

      {/* Target Focus Ring */}
      {targetRect && targetRect.width > 0 && (
        <div
          className="fixed pointer-events-none z-[9999] rounded-[22px] border-2 border-blue-500 transition-all duration-300 ease-out"
          style={{
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`,
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.35), 0 0 35px rgba(59, 130, 246, 0.45)',
          }}
        />
      )}

      {/* Floating Tour Card */}
      <div
        style={cardStyle}
        className="w-[92vw] max-w-sm sm:max-w-md bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-2xl border border-slate-700/80 animate-fade-in text-right"
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-3.5">
          
          <button
            onClick={handleComplete}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="font-heading font-extrabold text-sm text-white flex items-center gap-1.5 justify-end">
                {currentStep.title}
              </span>
              <span className="text-[11px] text-blue-400 font-semibold block">
                {currentStep.badge || `خطوة ${currentStepIndex + 1} من ${steps.length}`}
              </span>
            </div>

            <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'w-7 bg-blue-500 shadow-sm shadow-blue-500/50'
                  : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          
          {currentStepIndex > 0 && (
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-all shrink-0 active:scale-95"
              title="السابق"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {currentStepIndex === steps.length - 1 ? (
              <>
                <span>إنهاء الجولة</span>
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Skip Tour Link */}
        <div className="mt-3.5 pt-2 text-center">
          <button
            onClick={handleComplete}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            تخطي الجولة
          </button>
        </div>

      </div>

    </div>
  );
}
