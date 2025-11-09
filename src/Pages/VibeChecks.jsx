import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Mic, Camera, MessageSquare } from "lucide-react";
import VoiceRecorder from "../components/mood/VoiceRecorder";
import CameraFeed from "../components/mood/CameraFeed";
import EmotionDisplay from "../components/mood/EmotionDisplay";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const moodColors = {
  happy: "#FFD60A",
  sad: "#9B59B6",
  calm: "#87CEEB",
  stressed: "#FF6B6B",
  excited: "#FF6B9D",
  tired: "#95A5A6",
  neutral: "#BDC3C7",
  anxious: "#FF8C42",
  angry: "#E74C3C"
};

export default function VibeCheck() {
  const [activeTab, setActiveTab] = useState("voice");
  const [analyzedMood, setAnalyzedMood] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  const analyzeMoodMutation = useMutation({
    mutationFn: async ({ transcript, inputType }) => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze the emotional tone and content of this message. Provide an empathetic, warm response.
        
Message: "${transcript}"

Respond with JSON in this exact format:
{
  "emotion": "happy" or "sad" or "calm" or "stressed" or "excited" or "tired" or "neutral" or "anxious" or "angry",
  "intensity": number from 1-10,
  "response": "A warm, empathetic 2-3 sentence response that acknowledges their feelings and offers gentle support or encouragement",
  "tags": ["keyword1", "keyword2", "keyword3"]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            emotion: { type: "string" },
            intensity: { type: "number" },
            response: { type: "string" },
            tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      const moodEntry = await base44.entities.MoodEntry.create({
        emotion: result.emotion,
        emotion_intensity: result.intensity,
        input_type: inputType,
        transcript: transcript,
        ai_response: result.response,
        mood_color: moodColors[result.emotion] || moodColors.neutral,
        tags: result.tags
      });

      return { ...result, moodEntry };
    },
    onSuccess: (data) => {
      setAnalyzedMood(data);
      queryClient.invalidateQueries({ queryKey: ['recent-moods'] });
      
      // Speak the response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    }
  });

  const handleVoiceTranscript = async (transcript) => {
    setIsAnalyzing(true);
    try {
      await analyzeMoodMutation.mutateAsync({ transcript, inputType: 'voice' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setIsAnalyzing(true);
    try {
      await analyzeMoodMutation.mutateAsync({ transcript: textInput, inputType: 'text' });
      setTextInput("");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCameraCapture = async (file) => {
    // Upload and potentially analyze, for now just show a message
    setAnalyzedMood({
      emotion: "calm",
      intensity: 5,
      response: "I see you! Remember, camera-based emotion detection is coming soon. For now, use voice or text to share your feelings.",
      tags: ["visual", "selfie"]
    });
  };

  const resetMood = () => {
    setAnalyzedMood(null);
    setTextInput("");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: analyzedMood
            ? `linear-gradient(135deg, ${moodColors[analyzedMood.emotion]}20 0%, ${moodColors[analyzedMood.emotion]}40 100%)`
            : "linear-gradient(135deg, #F0F9FF 0%, #E0E7FF 100%)"
        }}
        transition={{ duration: 1 }}
      />

      <div className="p-6 md:p-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-3">
            Vibe Check 💫
          </h1>
          <p className="text-lg text-gray-600">
            Share how you're feeling through voice, camera, or text
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!analyzedMood ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="voice" className="flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      Voice
                    </TabsTrigger>
                    <TabsTrigger value="camera" className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Camera
                    </TabsTrigger>
                    <TabsTrigger value="text" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Text
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="voice" className="space-y-6 p-6">
                    <VoiceRecorder 
                      onTranscriptComplete={handleVoiceTranscript}
                      isAnalyzing={isAnalyzing}
                    />
                  </TabsContent>

                  <TabsContent value="camera" className="space-y-6 p-6">
                    <CameraFeed onCapture={handleCameraCapture} />
                  </TabsContent>

                  <TabsContent value="text" className="space-y-6 p-6">
                    <div className="max-w-2xl mx-auto space-y-4">
                      <Textarea
                        placeholder="Type how you're feeling... Let it all out 💭"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="min-h-[200px] text-lg resize-none border-2 focus:border-yellow-400"
                      />
                      <Button
                        onClick={handleTextSubmit}
                        disabled={!textInput.trim() || isAnalyzing}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-lg py-6"
                      >
                        {isAnalyzing ? "Analyzing your vibe..." : "Share My Feelings"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <EmotionDisplay
                emotion={analyzedMood.emotion}
                intensity={analyzedMood.intensity}
                response={analyzedMood.response}
              />
              <div className="text-center">
                <Button
                  onClick={resetMood}
                  variant="outline"
                  size="lg"
                  className="bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  Check Another Vibe
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
