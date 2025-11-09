import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eraser, Download, Paintbrush, Pen, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#FFD60A");
  const [brushSize, setBrushSize] = useState(5);
  const [brushType, setBrushType] = useState("round");
  const [lastPos, setLastPos] = useState(null);

  const colors = [
    "#FFD60A", "#FF6B9D", "#87CEEB", "#9B59B6", 
    "#2ECC71", "#E74C3C", "#F39C12", "#3498DB",
    "#E67E22", "#1ABC9C", "#34495E", "#FFFFFF"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1A1F2E";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    setLastPos(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.type.includes("touch")) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getMousePos(e);

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = brushType === "round" ? "round" : "square";
    ctx.lineJoin = "round";

    if (brushType === "glow") {
      ctx.shadowBlur = brushSize * 2;
      ctx.shadowColor = color;
    } else {
      ctx.shadowBlur = 0;
    }

    if (lastPos) {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    if (brushType === "spray") {
      for (let i = 0; i < 20; i++) {
        const offsetX = (Math.random() - 0.5) * brushSize * 2;
        const offsetY = (Math.random() - 0.5) * brushSize * 2;
        ctx.fillStyle = color;
        ctx.fillRect(pos.x + offsetX, pos.y + offsetY, 1, 1);
      }
    }

    setLastPos(pos);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1A1F2E";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `feelora-art-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card className="border-white/10 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full border-2 border-purple-500/30 rounded-2xl cursor-crosshair shadow-2xl bg-[#1A1F2E]"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Controls */}
        <div className="space-y-4">
          {/* Color Palette */}
          <div>
            <p className="text-white text-sm mb-2 font-medium">Colors</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    color === c ? "border-white scale-110 shadow-lg" : "border-white/30"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Brush Type */}
          <div>
            <p className="text-white text-sm mb-2 font-medium">Brush Style</p>
            <div className="flex gap-2">
              {[
                { type: "round", icon: Paintbrush, label: "Round" },
                { type: "square", icon: Pen, label: "Square" },
                { type: "glow", icon: Sparkles, label: "Glow" },
                { type: "spray", icon: Sparkles, label: "Spray" }
              ].map(({ type, icon: Icon, label }) => (
                <Button
                  key={type}
                  size="sm"
                  variant={brushType === type ? "default" : "outline"}
                  onClick={() => setBrushType(type)}
                  className={brushType === type
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                  }
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Brush Size */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-white text-sm font-medium">Brush Size</p>
              <span className="text-gray-400 text-sm">{brushSize}px</span>
            </div>
            <Slider
              value={[brushSize]}
              onValueChange={(value) => setBrushSize(value[0])}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={clearCanvas}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              <Eraser className="w-4 h-4 mr-2" />
              Clear Canvas
            </Button>
            <Button
              onClick={downloadImage}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Art
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}