import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Star } from "lucide-react";

export default function BubblePop() {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const moods = [
    { emoji: "😊", color: "from-yellow-400 to-orange-500" },
    { emoji: "😌", color: "from-blue-400 to-cyan-500" },
    { emoji: "🤩", color: "from-pink-500 to-rose-500" },
    { emoji: "😄", color: "from-green-400 to-emerald-500" },
    { emoji: "🥳", color: "from-purple-500 to-pink-500" },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (bubbles.length < 8) {
        const newBubble = {
          id: Date.now() + Math.random(),
          x: Math.random() * 80,
          y: 100,
          mood: moods[Math.floor(Math.random() * moods.length)],
          speed: 2 + Math.random() * 3
        };
        setBubbles(prev => [...prev, newBubble]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, bubbles.length]);

  useEffect(() => {
    if (!isPlaying) return;

    const moveInterval = setInterval(() => {
      setBubbles(prev => 
        prev
          .map(bubble => ({ ...bubble, y: bubble.y - bubble.speed }))
          .filter(bubble => bubble.y > -10)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [timeLeft, isPlaying]);

  const startGame = () => {
    setBubbles([]);
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
  };

  const popBubble = (id) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(score + 10);
  };

  return (
    <Card className="border-white/10 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>🫧 Mood Bubble Pop</span>
          <div className="flex items-center gap-4 text-sm font-normal">
            {isPlaying && <span className="text-yellow-400">{timeLeft}s</span>}
            <span className="text-gray-400">Score: {score}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 bg-gradient-to-b from-blue-900/20 to-purple-900/20 rounded-2xl overflow-hidden border border-white/10">
          <AnimatePresence>
            {bubbles.map((bubble) => (
              <motion.button
                key={bubble.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => popBubble(bubble.id)}
                className={`absolute w-16 h-16 rounded-full bg-gradient-to-br ${bubble.mood.color} shadow-lg flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform`}
                style={{
                  left: `${bubble.x}%`,
                  bottom: `${bubble.y}%`,
                }}
              >
                {bubble.mood.emoji}
              </motion.button>
            ))}
          </AnimatePresence>

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-center">
                {timeLeft === 0 ? (
                  <>
                    <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <p className="text-white text-2xl font-bold mb-2">Time's Up!</p>
                    <p className="text-gray-300 mb-4">Final Score: {score}</p>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">🫧</div>
                    <p className="text-white text-xl mb-4">Pop the mood bubbles!</p>
                  </>
                )}
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {timeLeft === 0 ? <><RotateCcw className="w-4 h-4 mr-2" />Play Again</> : "Start Game"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-400 text-sm mt-4">
          Tap the floating mood bubbles before they escape! Quick reflexes bring inner peace ✨
        </p>
      </CardContent>
    </Card>
  );
}