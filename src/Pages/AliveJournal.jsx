import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, BookOpen, Calendar, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AliveJournal() {
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: "", content: "", date: format(new Date(), 'yyyy-MM-dd') });
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const { data: entries = [] } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: () => base44.entities.JournalEntry.list('-date'),
    initialData: []
  });

  const { data: moods = [] } = useQuery({
    queryKey: ['mood-history'],
    queryFn: () => base44.entities.MoodEntry.list('-created_date', 30),
    initialData: []
  });

  const createEntryMutation = useMutation({
    mutationFn: (entryData) => base44.entities.JournalEntry.create(entryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      setShowForm(false);
      setNewEntry({ title: "", content: "", date: format(new Date(), 'yyyy-MM-dd') });
    }
  });

  const generatePrompts = async () => {
    setIsGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 3 thoughtful, introspective journal prompts that encourage self-reflection and emotional awareness. Make them warm and engaging.
        
        Format as JSON array of strings.`,
        response_json_schema: {
          type: "object",
          properties: {
            prompts: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      
      setNewEntry(prev => ({
        ...prev,
        reflection_prompts: result.prompts
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (newEntry.content.trim()) {
      createEntryMutation.mutate(newEntry);
    }
  };

  // Prepare chart data
  const emotionScores = {
    happy: 10, excited: 9, calm: 7, neutral: 5, tired: 4, anxious: 3, sad: 2, stressed: 1, angry: 0
  };
  
  const chartData = moods
    .slice(0, 14)
    .reverse()
    .map(mood => ({
      date: format(new Date(mood.created_date), 'MMM d'),
      score: emotionScores[mood.emotion] || 5,
      emotion: mood.emotion
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-navy mb-2">Alive Journal 📖</h1>
            <p className="text-gray-600">Your emotional journey, beautifully documented</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Entry
          </Button>
        </motion.div>

        {/* Mood Trend Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Your Emotional Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                      labelStyle={{ color: '#1F2937', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#A855F7" 
                      strokeWidth={3}
                      fill="url(#colorScore)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* New Entry Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Write Your Heart Out
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Entry title (optional)"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    className="text-lg"
                  />
                  <Input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  />
                  <Textarea
                    placeholder="What's on your mind today? Write freely..."
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                    className="min-h-[200px] text-base resize-none"
                  />
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={generatePrompts}
                      variant="outline"
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isGenerating ? "Generating..." : "Get Reflection Prompts"}
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!newEntry.content.trim() || createEntryMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      Save Entry
                    </Button>
                  </div>

                  {newEntry.reflection_prompts && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-purple-50 rounded-xl p-4 space-y-2"
                    >
                      <p className="font-semibold text-purple-900 mb-2">💭 Reflection Prompts:</p>
                      {newEntry.reflection_prompts.map((prompt, i) => (
                        <p key={i} className="text-sm text-purple-800">• {prompt}</p>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Journal Entries */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Past Entries
          </h2>
          
          {entries.length > 0 ? (
            <div className="grid gap-6">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          {entry.title && (
                            <CardTitle className="text-xl mb-2">{entry.title}</CardTitle>
                          )}
                          <p className="text-sm text-gray-500">
                            {format(new Date(entry.date), "EEEE, MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {entry.content}
                      </p>
                      {entry.reflection_prompts && entry.reflection_prompts.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-semibold text-purple-700 mb-2">Reflection Prompts:</p>
                          <div className="space-y-1">
                            {entry.reflection_prompts.map((prompt, i) => (
                              <p key={i} className="text-sm text-gray-600">• {prompt}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="border-none shadow-lg">
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No journal entries yet</p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Write Your First Entry
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}