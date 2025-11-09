import React, { useState, useEffect } from "react";
import { base44 } from "../api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Calendar, Heart, ArrowRight, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { format } from "date-fns";

const catchyLines = [
  "Hey gorgeous! Ready to slay today?",
  "Well well well... look who's back 😏",
  "Damn, you look good even in pixels!",
  "Miss me? I knew you would 💋",
  "Back for more? I like your style 😉",
  "Oh, it's YOU again... lucky me! ✨",
  "Ready to make today your b*tch?",
  "Spill the tea, what's on your mind?",
  "Let's catch those vibes, hottie!",
  "You're glowing today... or is that just my screen? 😍",
  "Wanna tell me what's really going on? 🔥",
  "Looking fine! Now let's check that mood",
  "Hey troublemaker, what's the vibe today?",
  "Back again? Can't stay away, huh? 😘",
  "Feeling yourself today? You should be! 💅",
  "Let's get deep... I'm ready if you are 😌",
  "Another day, another slay! Let's go!",
  "You + Me = Best combo ever 💖",
  "Ooh, someone's here for their daily dose of me!",
  "Hey beautiful soul, what's brewing today?",
  "Ready to vibe check or just here to look pretty? 😏",
  "Missed your energy... now spill!",
  "Let's make today iconic, shall we?",
  "Hey babe, how's that gorgeous mind of yours?",
  "You're back! My favorite part of the day ✨"
];

export default function Home() {
  const [greeting, setGreeting] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Pick a random catchy line
    const randomLine = catchyLines[Math.floor(Math.random() * catchyLines.length)];
    setGreeting(randomLine);

    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: recentMoods = [] } = useQuery({
    queryKey: ['recent-moods'],
    queryFn: () => base44.entities.MoodEntry.list('-created_date', 5),
    initialData: []
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journal-count'],
    queryFn: () => base44.entities.JournalEntry.list('-created_date', 1),
    initialData: []
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Hero Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-blue-900/50 rounded-3xl p-8 md:p-12 overflow-hidden backdrop-blur-sm border border-white/10"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <Sparkles className="w-12 h-12 text-yellow-400" />
              </motion.div>
              <motion.h1 
                key={greeting}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-5xl font-bold text-white mb-4"
              >
                {greeting}
              </motion.h1>
              {user && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-purple-200 mb-2"
                >
                  {user.full_name?.split(' ')[0]}, you absolute legend! 🌟
                </motion.p>
              )}
              <p className="text-xl text-purple-200 mb-8 max-w-2xl">
                Let's dive into those feels and make today unforgettable together.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl("VibeCheck")}>
                  <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-semibold shadow-lg shadow-yellow-500/50">
                    <Heart className="w-5 h-5 mr-2" />
                    Check Your Vibe
                  </Button>
                </Link>
                <Link to={createPageUrl("MindGames")}>
                  <Button size="lg" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Play & Chill
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={item}>
            <Card className="border-white/10 shadow-xl bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Mood Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-yellow-400">{recentMoods.length}</div>
                <p className="text-sm text-gray-400 mt-1">Total check-ins</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-white/10 shadow-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Journal Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-400">{journalEntries.length}</div>
                <p className="text-sm text-gray-400 mt-1">Reflections written</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-white/10 shadow-xl bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-cyan-400">
                  {recentMoods.length > 0 ? Math.min(recentMoods.length, 7) : 0}
                </div>
                <p className="text-sm text-gray-400 mt-1">Days of mindfulness</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-white/10 shadow-xl bg-black/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Recent Emotional Journey</CardTitle>
            </CardHeader>
            <CardContent>
              {recentMoods.length > 0 ? (
                <div className="space-y-3">
                  {recentMoods.slice(0, 3).map((mood, index) => (
                    <motion.div
                      key={mood.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                        mood.emotion === 'happy' ? 'from-yellow-400 to-orange-500' :
                        mood.emotion === 'calm' ? 'from-blue-400 to-cyan-500' :
                        mood.emotion === 'sad' ? 'from-purple-500 to-indigo-600' :
                        'from-pink-500 to-rose-600'
                      } flex items-center justify-center text-2xl shadow-lg`}>
                        {mood.emotion === 'happy' ? '😊' :
                         mood.emotion === 'calm' ? '😌' :
                         mood.emotion === 'sad' ? '😢' :
                         mood.emotion === 'excited' ? '🤩' : '😐'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold capitalize text-white">{mood.emotion}</p>
                        <p className="text-sm text-gray-400">
                          {format(new Date(mood.created_date), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      {mood.transcript && (
                        <div className="hidden md:block max-w-xs">
                          <p className="text-sm text-gray-400 truncate">
                            "{mood.transcript.substring(0, 50)}..."
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10 text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-4">No mood entries yet</p>
                  <Link to={createPageUrl("VibeCheck")}>
                    <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 shadow-lg">
                      Record Your First Mood
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
