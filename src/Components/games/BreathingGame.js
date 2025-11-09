import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function BreathingGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState("ready"); // ready, inhale, hold, exhale
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const phases = [
      { name: "inhale", duration: 4000, next: "hold" },
      { name: "hold", duration: 4000, next: "exhale" },
      { name: "exhale", duration: 4000, next: "complete" },
    ];

    let currentPhaseIndex = 0;
    let interval;

    const startPhase = () => {
      const currentPhase = phases[currentPhaseIndex];
      setPhase(currentPhase.name);
      setCount(0);

      interval = setInterval(() => {
        setCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= currentPhase.duration / 1000) {
            clearInterval(interval);
            if (currentPhase.next === "complete") {
              setCycles((c) => c + 1);
              currentPhaseIndex = 0;
              setTimeout(startPhase, 500);
            } else {
              currentPhaseIndex++;
              setTimeout(startPhase, 500);
            }
            return 0;
          }
          return newCount;
        });
      }, 1000);
    };

    startPhase();

    return () => clearInterval(interval);
  }, [isPlaying]);

  const reset = () => {
    setIsPlaying(false);
    setPhase("ready");
    setCount(0);
    setCycles(0);
  };

  const getPhaseText = () => {
    if (phase === "ready") return "Ready to breathe?";
    if (phase === "inhale") return "Breathe In...";
    if (phase === "hold") return "Hold...";
    if (phase === "exhale") return "Breathe Out...";
  };

  const getPhaseColor = () => {
    if (phase === "inhale") return "from-blue-500 to-cyan-500";
    if (phase === "hold") return "from-purple-500 to-pink-500";
    if (phase === "exhale") return "from-green-500 to-emerald-500";
    return "from-gray-500 to-gray-700";
  };

  return (
    <Card className="border-white/10 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>🫁 Breathing Exercise</span>
          <span className="text-sm font-normal text-gray-400">Cycles: {cycles}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center items-center h-80 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl flex items-center justify-center`}
                animate={{
                  scale: phase === "inhale" ? [0.5, 1] : phase === "exhale" ? [1, 0.5] : 1,
                }}
                transition={{
                  duration: phase === "hold" ? 0 : 4,
                  ease: "easeInOut",
                }}
              >
                <div className="text-center">
                  <p className="text-white text-2xl font-bold mb-2">{getPhaseText()}</p>
                  {phase !== "ready" && (
                    <p className="text-white/80 text-6xl font-bold">{Math.ceil(4 - count)}</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-3 justify-center">
          {!isPlaying ? (
            <Button
              onClick={() => setIsPlaying(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Breathing
            </Button>
          ) : (
            <Button
              onClick={() => setIsPlaying(false)}
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={reset}
            size="lg"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        <div className="text-center text-gray-400 text-sm">
          <p>4 seconds in • 4 seconds hold • 4 seconds out</p>
          <p className="mt-1">Focus on your breath and let everything else fade away</p>
        </div>
      </CardContent>
    </Card>
  );
}