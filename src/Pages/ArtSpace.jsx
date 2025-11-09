import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Smile, Zap, Mountain } from "lucide-react";
import BubblePop from "../components/funGames/BubblePop";
import ZenGarden from "../components/funGames/ZenGarden";
import MoodClicker from "../components/funGames/MoodClicker";

export default function FunZone() {
  const [activeTab, setActiveTab] = useState("bubbles");

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-16 h-16 text-orange-400" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Fun Zone 🎪
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Relaxing and funny games to brighten your mood and melt away stress
          </p>
        </motion.div>

        {/* Games Tabs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-sm border border-white/10 p-1 mb-8">
              <TabsTrigger
                value="bubbles"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                <Smile className="w-4 h-4" />
                <span className="hidden sm:inline">Bubbles</span>
              </TabsTrigger>
              <TabsTrigger
                value="garden"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
              >
                <Mountain className="w-4 h-4" />
                <span className="hidden sm:inline">Zen Garden</span>
              </TabsTrigger>
              <TabsTrigger
                value="clicker"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Clicker</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bubbles" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <BubblePop />
              </motion.div>
            </TabsContent>

            <TabsContent value="garden" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ZenGarden />
              </motion.div>
            </TabsContent>

            <TabsContent value="clicker" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <MoodClicker />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Game Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-white/10">
            <Smile className="w-10 h-10 text-purple-400 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Bubble Pop</h3>
            <p className="text-gray-400 text-sm">
              Pop floating mood bubbles in this fast-paced game. Quick fun to boost your spirits instantly!
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-900/30 to-yellow-900/30 backdrop-blur-sm border border-white/10">
            <Mountain className="w-10 h-10 text-amber-400 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Zen Garden</h3>
            <p className="text-gray-400 text-sm">
              Draw peaceful patterns in virtual sand. A meditative experience to calm your mind and relax.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm border border-white/10">
            <Zap className="w-10 h-10 text-green-400 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Energy Clicker</h3>
            <p className="text-gray-400 text-sm">
              Click to build mood energy! A satisfying idle game that rewards persistence and positive vibes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}