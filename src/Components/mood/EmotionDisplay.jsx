import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Smile, Frown, Meh, Zap, Cloud, Sparkles, Coffee, Heart } from "lucide-react";

const emotionConfig = {
  happy: {
    icon: Smile,
    color: "from-yellow-400 to-orange-500",
    emoji: "😊",
    message: "You're radiating joy!",
    bgColor: "bg-yellow-50"
  },
  sad: {
    icon: Frown,
    color: "from-purple-500 to-indigo-600",
    emoji: "😢",
    message: "It's okay to feel this way",
    bgColor: "bg-purple-50"
  },
  calm: {
    icon: Cloud,
    color: "from-blue-400 to-cyan-500",
    emoji: "😌",
    message: "Your energy is peaceful",
    bgColor: "bg-blue-50"
  },
  stressed: {
    icon: Zap,
    color: "from-red-500 to-pink-600",
    emoji: "😰",
    message: "Take a deep breath",
    bgColor: "bg-red-50"
  },
  excited: {
    icon: Sparkles,
    color: "from-pink-500 to-rose-600",
    emoji: "🤩",
    message: "Your excitement is contagious!",
    bgColor: "bg-pink-50"
  },
  tired: {
    icon: Coffee,
    color: "from-gray-500 to-slate-600",
    emoji: "😴",
    message: "Rest is productive too",
    bgColor: "bg-gray-50"
  },
  neutral: {
    icon: Meh,
    color: "from-gray-400 to-gray-500",
    emoji: "😐",
    message: "A balanced state of being",
    bgColor: "bg-gray-50"
  },
  anxious: {
    icon: Heart,
    color: "from-orange-500 to-red-500",
    emoji: "😟",
    message: "You're stronger than you think",
    bgColor: "bg-orange-50"
  },
  angry: {
    icon: Zap,
    color: "from-red-600 to-red-800",
    emoji: "😠",
    message: "Your feelings are valid",
    bgColor: "bg-red-50"
  }
};

export default function EmotionDisplay({ emotion, intensity = 5, response }) {
  const [showResponse, setShowResponse] = useState(false);
  const config = emotionConfig[emotion] || emotionConfig.neutral;
  const Icon = config.icon;

  useEffect(() => {
    if (response) {
      const timer = setTimeout(() => setShowResponse(true), 500);
      return () => clearTimeout(timer);
    }
  }, [response]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className={`${config.bgColor} rounded-3xl p-8 border-2 border-white/50 backdrop-blur-sm`}>
        <div className="flex flex-col items-center gap-6">
          {/* Emotion Icon with Pulse */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`w-32 h-32 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-2xl`}
          >
            <span className="text-6xl">{config.emoji}</span>
          </motion.div>

          {/* Emotion Label */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800 capitalize mb-2">
              {emotion}
            </h3>
            <p className="text-lg text-gray-600">{config.message}</p>
          </div>

          {/* Intensity Bar */}
          <div className="w-full max-w-md">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Intensity</span>
              <span>{intensity}/10</span>
            </div>
            <div className="h-3 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${intensity * 10}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
              />
            </div>
          </div>

          {/* AI Response */}
          {showResponse && response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 mb-1">Feelora says:</p>
                  <p className="text-gray-700 leading-relaxed">{response}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
