import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function VoiceRecorder({ onTranscriptComplete, isAnalyzing }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      setTranscript("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (transcript.trim()) {
        onTranscriptComplete(transcript.trim());
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="relative"
        animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Button
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
          className={cn(
            "w-24 h-24 rounded-full transition-all duration-300",
            isRecording 
              ? "bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700" 
              : "bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600",
            isAnalyzing && "opacity-50 cursor-not-allowed"
          )}
        >
          {isAnalyzing ? (
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </Button>
        
        <AnimatePresence>
          {isRecording && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500/30"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500/20"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
            </>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="text-sm font-medium text-gray-600">
        {isAnalyzing ? "Analyzing your vibe..." : isRecording ? "Listening... Tap to stop" : "Tap to share your feelings"}
      </p>

      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-md p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200"
          >
            <p className="text-sm text-gray-700 leading-relaxed">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
