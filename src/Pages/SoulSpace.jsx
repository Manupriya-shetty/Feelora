import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Music, Heart, RefreshCw, Headphones, BookHeart } from "lucide-react";

export default function SoulSpace() {
  const [affirmation, setAffirmation] = useState(null);
  const [musicRecs, setMusicRecs] = useState(null);
  const [tips, setTips] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: recentMoods = [] } = useQuery({
    queryKey: ['recent-moods-soul'],
    queryFn: () => base44.entities.MoodEntry.list('-created_date', 5),
    initialData: []
  });

  const dominantMood = recentMoods.length > 0 ? recentMoods[0].emotion : 'neutral';

  const generateAffirmation = async () => {
    setIsLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a beautiful, personalized affirmation for someone feeling ${dominantMood}. 
        Make it empowering, warm, and uplifting. Keep it to 2-3 sentences.`,
        response_json_schema: {
          type: "object",
          properties: {
            affirmation: { type: "string" }
          }
        }
      });
      setAffirmation(result.affirmation);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMusicRecs = async () => {
    setIsLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Recommend 5 songs or music genres that would help someone feeling ${dominantMood}. 
        Consider music that either matches their mood for catharsis or helps shift it positively.`,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  artist: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });
      setMusicRecs(result.recommendations);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTips = async () => {
    setIsLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Provide 4 practical, actionable tips for someone feeling ${dominantMood}. 
        Make them realistic, compassionate, and easy to implement. Each should be 1-2 sentences.`,
        response_json_schema: {
          type: "object",
          properties: {
            tips: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      setTips(result.tips);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-16 h-16 text-yellow-500" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-pink-600 bg-clip-text text-transparent mb-3">
            Soul Space
          </h1>
          <p className="text-xl text-gray-600">
            Personalized affirmations, music, and wisdom for your journey
          </p>
        </motion.div>

        {/* Current Mood Context */}
        {recentMoods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="border-none shadow-lg bg-gradient-to-br from-white to-yellow-50">
              <CardContent className="p-6">
                <p className="text-center text-gray-700">
                  Based on your recent vibes, you're feeling mostly{" "}
                  <span className="font-bold text-xl capitalize text-yellow-600">{dominantMood}</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-pink-100 to-rose-100 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-900">
                  <Heart className="w-5 h-5" />
                  Daily Affirmation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={generateAffirmation}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  {isLoading ? "Generating..." : "Generate Affirmation"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-purple-100 to-indigo-100 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Music className="w-5 h-5" />
                  Music for Your Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={generateMusicRecs}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  {isLoading ? "Finding songs..." : "Get Music Recommendations"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-yellow-100 to-orange-100 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900">
                  <BookHeart className="w-5 h-5" />
                  Mood Balance Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={generateTips}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  {isLoading ? "Crafting tips..." : "Get Wellness Tips"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Display Generated Content */}
        <div className="space-y-6">
          {affirmation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-none shadow-2xl bg-gradient-to-br from-pink-50 to-rose-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-600" />
                      Your Affirmation
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={generateAffirmation}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl text-center font-serif text-gray-800 leading-relaxed italic">
                    "{affirmation}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {musicRecs && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-none shadow-2xl bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-purple-600" />
                    Music Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {musicRecs.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200"
                      >
                        <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                        <p className="text-sm text-gray-600">{rec.artist}</p>
                        <p className="text-sm text-purple-700 mt-2">{rec.reason}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {tips && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-none shadow-2xl bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-600" />
                    Wellness Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tips.map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-yellow-200"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{tip}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Empty State */}
        {!affirmation && !musicRecs && !tips && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <Sparkles className="w-12 h-12 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Your Soul Space Awaits
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Choose from the options above to receive personalized affirmations, music recommendations, or wellness tips tailored to your emotional journey.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}