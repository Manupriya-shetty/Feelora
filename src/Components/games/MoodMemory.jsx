import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Trophy } from "lucide-react";

const emojis = ["😊", "😢", "😌", "😰", "🤩", "😴", "😐", "😠"];

export default function MoodMemory() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    const selectedEmojis = emojis.slice(0, 6);
    const gameCards = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, matched: false }));
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matched, cards]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <Card className="border-white/10 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>🧠 Mood Memory Match</span>
          <div className="flex items-center gap-4 text-sm font-normal">
            <span className="text-gray-400">Moves: {moves}</span>
            <Button
              onClick={initializeGame}
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-6 p-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl text-center"
            >
              <Trophy className="w-12 h-12 mx-auto mb-2 text-white" />
              <p className="text-2xl font-bold text-white mb-1">You Won! 🎉</p>
              <p className="text-white/90">Completed in {moves} moves</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-4 gap-3">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            const isMatched = matched.includes(index);

            return (
              <motion.div
                key={card.id}
                className="aspect-square cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(index)}
              >
                <div className="relative w-full h-full" style={{ perspective: "1000px" }}>
                  <motion.div
                    className="w-full h-full relative"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Back of card */}
                    <div
                      className={`absolute inset-0 rounded-xl flex items-center justify-center ${
                        isMatched
                          ? "bg-gradient-to-br from-green-500 to-emerald-500"
                          : "bg-gradient-to-br from-purple-500 to-pink-500"
                      } shadow-lg`}
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      {!isFlipped && (
                        <div className="text-4xl">❓</div>
                      )}
                    </div>

                    {/* Front of card */}
                    <div
                      className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="text-5xl">{card.emoji}</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Match all the mood emojis to win! Train your memory while connecting with emotions.
        </p>
      </CardContent>
    </Card>
  );
}