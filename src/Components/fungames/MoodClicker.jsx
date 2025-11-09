import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Zap } from "lucide-react";

export default function MoodClicker() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [clickEffect, setClickEffect] = useState(null);

  const moodStages = [
    { threshold: 0, emoji: "😐", message: "Just starting...", color: "from-gray-500 to-gray-600" },
    { threshold: 50, emoji: "😊", message: "Feeling good!", color: "from-yellow-400 to-orange-500" },
    { threshold: 150, emoji: "😄", message: "Happy vibes!", color: "from-green-400 to-emerald-500" },
    { threshold: 300, emoji: "🤩", message: "Ecstatic!", color: "from-pink-500 to-purple-500" },
    { threshold: 500, emoji: "🚀", message: "Unstoppable!", color: "from-cyan-400 to-blue-500" },
  ];

  const currentStage = [...moodStages].reverse().find(stage => count >= stage.threshold) || moodStages[0];

  const handleClick = (e) => {
    const newCount = count + multiplier;
    setCount(newCount);

    // Create click effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setClickEffect({ x, y, value: `+${multiplier}` });
    setTimeout(() => setClickEffect(null), 500);

    // Upgrade multiplier
    if (newCount >= 100 && multiplier === 1) setMultiplier(2);
    if (newCount >= 300 && multiplier === 2) setMultiplier(5);
    if (newCount >= 600 && multiplier === 5) setMultiplier(10);
  };

  const reset = () => {
    setCount(0);
    setMultiplier(1);
  };

  return (
    <Card className="border-white/10 bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>⚡ Mood Energy Clicker</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm font-normal text-yellow-400">
              <Zap className="w-4 h-4" />
              x{multiplier}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={reset}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-gray-400 text-sm">{currentStage.message}</p>
          <div className={`text-6xl font-bold bg-gradient-to-r ${currentStage.color} bg-clip-text text-transparent`}>
            {count}
          </div>
          <p className="text-gray-500 text-xs">Energy Points</p>
        </div>

        <div className="flex justify-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            className={`relative w-48 h-48 rounded-full bg-gradient-to-br ${currentStage.color} shadow-2xl flex items-center justify-center text-8xl cursor-pointer hover:scale-105 transition-transform`}
          >
            {currentStage.emoji}
            
            {clickEffect && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -50 }}
                className="absolute text-2xl font-bold text-yellow-400 pointer-events-none"
                style={{ left: clickEffect.x, top: clickEffect.y }}
              >
                {clickEffect.value}
              </motion.div>
            )}
          </motion.button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress to next level</span>
            <span>{count} / {moodStages.find(s => s.threshold > count)?.threshold || "MAX"}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${currentStage.color}`}
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min(100, (count / (moodStages.find(s => s.threshold > count)?.threshold || count)) * 100)}%` 
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center text-sm">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-400">Total Clicks</p>
            <p className="text-white font-bold text-xl">{Math.ceil(count / multiplier)}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-400">Multiplier</p>
            <p className="text-yellow-400 font-bold text-xl">×{multiplier}</p>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs">
          Keep clicking to boost your mood energy! Unlock higher multipliers as you progress 🌟
        </p>
      </CardContent>
    </Card>
  );
}