import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, BookHeart, Camera, Heart, Home, Gamepad2, Laugh, Palette } from "lucide-react";
import { motion } from "framer-motion";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
    color: "from-pink-500 to-rose-500"
  },
  {
    title: "Vibe Check",
    url: createPageUrl("VibeCheck"),
    icon: Camera,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Alive Journal",
    url: createPageUrl("AliveJournal"),
    icon: BookHeart,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Soul Space",
    url: createPageUrl("SoulSpace"),
    icon: Sparkles,
    color: "from-yellow-400 to-orange-500"
  },
  {
    title: "Mind Games",
    url: createPageUrl("MindGames"),
    icon: Gamepad2,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Fun Zone",
    url: createPageUrl("FunZone"),
    icon: Laugh,
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Art Space",
    url: createPageUrl("ArtSpace"),
    icon: Palette,
    color: "from-indigo-500 to-purple-500"
  }
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }
        
        :root {
          --navy: #0A0E27;
          --dark-bg: #0F1419;
          --card-bg: #1A1F2E;
          --yellow: #FFD60A;
          --pink-glow: #FF6B9D;
          --sky-blue: #87CEEB;
        }
        
        body {
          background: #0F1419;
          color: #E5E7EB;
        }
        
        .mood-gradient-happy {
          background: linear-gradient(135deg, #FFD60A 0%, #FFA500 100%);
        }
        
        .mood-gradient-calm {
          background: linear-gradient(135deg, #87CEEB 0%, #4A90E2 100%);
        }
        
        .mood-gradient-sad {
          background: linear-gradient(135deg, #9B59B6 0%, #6C5CE7 100%);
        }
        
        .mood-gradient-excited {
          background: linear-gradient(135deg, #FF6B9D 0%, #FF8FAB 100%);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 214, 10, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 214, 10, 0.6); }
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes stars {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100vh); }
        }
        
        .stars {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 200vh;
          pointer-events: none;
        }
        
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: stars 20s linear infinite;
        }
      `}</style>
      
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A0E27] via-[#0F1419] to-[#1A1F2E]">
        {/* Starry Background Effect */}
        <div className="stars">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                opacity: Math.random() * 0.5 + 0.2
              }}
            />
          ))}
        </div>

        {/* Dark Glassmorphism Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/50">
                    <Heart className="w-5 h-5 text-white" fill="white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                    Feelora
                  </h1>
                  <p className="text-xs text-gray-400 -mt-1">The Alive Journal</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-2">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <Link key={item.title} to={item.url}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all
                          ${isActive 
                            ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg shadow-' + item.color.split('-')[1] + '-500/50' 
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                          }
                        `}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.title}</span>
                      </motion.button>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Active Indicator */}
              <div className="lg:hidden flex items-center gap-2">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  if (!isActive) return null;
                  return (
                    <div key={item.title} className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${item.color} text-white text-sm font-medium shadow-lg`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-safe overflow-x-auto">
          <div className="flex items-center justify-start px-2 py-3 min-w-max">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link key={item.title} to={item.url} className="flex-shrink-0 px-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className={`
                      p-2.5 rounded-2xl transition-all
                      ${isActive 
                        ? 'bg-gradient-to-br ' + item.color + ' shadow-lg shadow-' + item.color.split('-')[1] + '-500/50' 
                        : 'bg-white/5'
                      }
                    `}>
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <span className={`text-[10px] font-medium whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {item.title}
                    </span>
                  </motion.button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 pb-24 md:pb-8 relative">
          {children}
        </main>
      </div>
    </>
  );
}