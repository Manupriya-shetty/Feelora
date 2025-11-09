import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eraser, Sparkles } from "lucide-react";

export default function ZenGarden() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pattern, setPattern] = useState("waves");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1A1F2E";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw sand texture
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillStyle = `rgba(139, 115, 85, ${Math.random() * 0.3})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing && e.type !== "mousedown" && e.type !== "touchstart") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    
    const x = e.type.includes("touch") 
      ? e.touches[0].clientX - rect.left 
      : e.clientX - rect.left;
    const y = e.type.includes("touch")
      ? e.touches[0].clientY - rect.top
      : e.clientY - rect.top;

    ctx.strokeStyle = "#D4A574";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    if (pattern === "waves") {
      ctx.beginPath();
      for (let i = -20; i < 20; i++) {
        const waveY = y + Math.sin(x / 10 + i) * 3;
        if (i === -20) {
          ctx.moveTo(x + i, waveY);
        } else {
          ctx.lineTo(x + i, waveY);
        }
      }
      ctx.stroke();
    } else if (pattern === "circles") {
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.stroke();
    } else if (pattern === "spirals") {
      ctx.beginPath();
      for (let i = 0; i < 360; i += 10) {
        const angle = (i * Math.PI) / 180;
        const radius = i / 20;
        ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      }
      ctx.stroke();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1A1F2E";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw sand texture
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillStyle = `rgba(139, 115, 85, ${Math.random() * 0.3})`;
      ctx.fillRect(x, y, 1, 1);
    }
  };

  return (
    <Card className="border-white/10 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>🪨 Zen Sand Garden</span>
          <div className="flex gap-2">
            {["waves", "circles", "spirals"].map((p) => (
              <Button
                key={p}
                size="sm"
                variant={pattern === p ? "default" : "outline"}
                onClick={() => setPattern(p)}
                className={pattern === p 
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500" 
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                }
              >
                {p}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full border-2 border-amber-600/30 rounded-2xl cursor-crosshair shadow-2xl"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        <div className="flex justify-center gap-3">
          <Button
            onClick={clearCanvas}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Clear Garden
          </Button>
        </div>

        <div className="text-center text-gray-400 text-sm space-y-1">
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Draw patterns in the sand to find your inner peace
          </p>
          <p>Choose a pattern style and let your creativity flow</p>
        </div>
      </CardContent>
    </Card>
  );
}