import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CameraFeed({ onCapture }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const startCamera = async () => {
    try {
      setError(null);
      setIsCameraReady(false);
      
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(() => {
            setIsCameraReady(true);
            setIsActive(true);
          }).catch(err => {
            console.error("Error playing video:", err);
            setError("Unable to start video playback");
          });
        };
      }
      
      setStream(mediaStream);
      
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err.name === 'NotAllowedError') {
        setError("Camera access denied. Please allow camera permissions in your browser settings.");
      } else if (err.name === 'NotFoundError') {
        setError("No camera found on your device.");
      } else {
        setError("Unable to access camera. Please check your device and browser settings.");
      }
      setIsActive(false);
      setIsCameraReady(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setIsCameraReady(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !isCameraReady) {
      setError("Camera is not ready. Please wait a moment.");
      return;
    }
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      if (canvas.width === 0 || canvas.height === 0) {
        setError("Unable to capture image. Please try again.");
        return;
      }
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `mood-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
        } else {
          setError("Failed to capture image. Please try again.");
        }
      }, 'image/jpeg', 0.9);
    } catch (err) {
      console.error("Error capturing frame:", err);
      setError("Error capturing image. Please try again.");
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-800 ml-2">
          📸 Capture your mood! While AI facial analysis is limited, you can snap a selfie as part of your emotional journey. Use voice or text for detailed analysis.
        </AlertDescription>
      </Alert>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden aspect-video shadow-2xl"
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy via-purple-900 to-pink-900">
            <div className="text-center text-white">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-70" />
              </motion.div>
              <p className="text-lg font-medium">Camera is off</p>
              <p className="text-sm text-gray-300 mt-2">Tap the button below to start</p>
            </div>
          </div>
        )}
        
        {isActive && !isCameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
            <div className="text-center text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
              </motion.div>
              <p className="text-lg">Initializing camera...</p>
            </div>
          </div>
        )}
        
        {/* Decorative scanning overlay when ready */}
        <AnimatePresence>
          {isActive && isCameraReady && (
            <>
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-70" />
              </motion.div>
              
              {/* Corner decorations */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-yellow-400" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-yellow-400" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-yellow-400" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-yellow-400" />
            </>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={isActive ? stopCamera : startCamera}
          size="lg"
          className={`flex-1 sm:flex-none ${
            isActive 
              ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700" 
              : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          }`}
        >
          {isActive ? (
            <>
              <CameraOff className="w-5 h-5 mr-2" />
              Stop Camera
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 mr-2" />
              Start Camera
            </>
          )}
        </Button>
        
        {isActive && (
          <Button
            onClick={captureFrame}
            disabled={!isCameraReady}
            size="lg"
            className="flex-1 sm:flex-none bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isCameraReady ? "Capture Mood" : "Loading..."}
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}