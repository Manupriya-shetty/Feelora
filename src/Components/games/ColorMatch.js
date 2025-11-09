import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Zap } from "lucide-react";

const colorMoods = [
  { color: "#FFD60A", name: "yellow", mood: "Happy" },
  { color: "#87CEEB", name: "blue", mood: "Calm" },
  { color: "#9B59B6", name: "purple", mood: "Sad" },
  { color: "#FF6B6B", name: "red", mood: "Stressed" },
  { color: "#FF6B9D", name: "pink", mood: "Excited" },
  { color: "#2ECC71", name: "green", mood: "Peaceful" },
];

export default function ColorMatch() {
  const [targetMood, setTargetMood] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [timeLeft, isPlaying]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setFeedback("");
    generateNewTarget();
  };

  const generateNewTarget = () => {
    const randomMood = colorMoods[Math.floor(Math.random() * colorMoods.length)];
    setTargetMood(randomMood);
  };

  const handleColorClick = (selectedMood) => {
    if (!isPlaying) return;

    if (selectedMood.name === targetMood.name) {
      setScore(score + 1);
      setFeedback("✨ Perfect!");
      setTimeout(() => setFeedback(""), 500);
      generateNewTarget();
    } else {
      setFeedback("💫 Try again!");
      setTimeout(() => setFeedback(""), 500);
    }
  };

  return (
    <Card className="border-white/10 bg-gradient-to-br from-pink-900/30 to-orange-900/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>🎨 Color Mood Matcher</span>
          <div className="flex items-center gap-4">
            {isPlaying && (
              <div className="flex items-center gap-2 text-sm font-normal">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">{timeLeft}s</span>
              </div>
            )}
            <span className="text-sm font-normal text-gray-400">Score: {score}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPlaying && timeLeft === 30 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-white text-xl mb-6">Match colors to moods as fast as you can!</p>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 shadow-lg"
            >
              Start Game
            </Button>
          </div>
        ) : timeLeft === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-white text-2xl font-bold mb-2">Game Over!</p>
            <p className="text-gray-400 mb-6">Final Score: {score}</p>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg mb-4">Find the color for:</p>
              <motion.div
                key={targetMood?.mood}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-bold text-white mb-2"
              >
                {targetMood?.mood}
              </motion.div>
              {feedback && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl text-yellow-400"
                >
                  {feedback}
                </motion.p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {colorMoods.map((mood) => (
                <motion.button
                  key={mood.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleColorClick(mood)}
                  className="aspect-square rounded-2xl shadow-xl"
                  style={{ backgroundColor: mood.color }}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}