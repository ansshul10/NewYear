import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock, AlertCircle } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(false);

  const correctPassword = "10202019";

  const handleEntry = () => {
    if (password === correctPassword) {
      navigate('/journey');
    } else {
      const jokes = [
        "Arey? Tum wo special person nahi ho! 🤨",
        "Wrong Password! Lagta hai kisi ne galat insaan ko link bhej diya. 😂",
        "Access Denied! Sirf asli 'Queen' ko entry milegi. Try again!",
        "Hmm... Itna dimaag mat lagao, sahi date daalo! 🧐",
        "Ye password toh meri ex ka bhi nahi tha! (Just kidding) 😜"
      ];
      setError(jokes[Math.floor(Math.random() * jokes.length)]);
      setPassword('');
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black flex flex-col justify-center items-center">
      {/* Background Video */}
      <video 
        autoPlay loop muted playsInline
        className="absolute z-0 w-full h-full object-cover opacity-30"
      >
        <source src="/videos/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Luxury Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-4xl flex flex-col items-center text-center px-6">
        
        {/* Poetic Intro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-[10px] font-bold border border-[#D4AF37]/30 px-4 py-1 rounded-full bg-white/5 backdrop-blur-sm">
            PRIVATE ACCESS ONLY
          </span>
        </motion.div>

        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-5xl md:text-8xl font-serif text-[#D4AF37] mb-6 drop-shadow-2xl"
        >
          Happy New Year <br /> 
          <span className="text-white italic">2026</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-xl text-pink-100/60 text-sm md:text-base italic mb-12"
        >
          "This year, I don't want any resolutions other than being the reason behind your smile every single day. 
          Enter our private world to see what I have planned for you."
        </motion.p>

        {/* Input & Button Container with extra Bottom Margin */}
        <div className="mb-24 w-full flex justify-center">
          <AnimatePresence mode="wait">
            {!showInput ? (
              <motion.button
                key="btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInput(true)}
                className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-black rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all uppercase tracking-widest flex items-center gap-3"
              >
                <Lock size={18} /> OPEN OUR SURPRISE
              </motion.button>
            ) : (
              <motion.div 
                key="input"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-8 rounded-[2rem] border-[#D4AF37]/30 w-full max-w-sm bg-black/60 backdrop-blur-xl"
              >
                <div className="flex justify-center mb-4 text-[#D4AF37]">
                  <Unlock size={32} className="animate-pulse" />
                </div>
                <p className="text-white text-[10px] mb-4 uppercase tracking-[0.2em] font-semibold">Verification Required</p>
                
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter our special date"
                  className="w-full bg-white/5 border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-center text-[#D4AF37] outline-none mb-4 focus:border-[#D4AF37]/60 transition-all"
                />

                {error && (
                  <motion.div 
                    initial={{ y: -5 }} animate={{ y: 0 }}
                    className="text-red-400 text-[10px] mb-4 flex items-center justify-center gap-2 italic"
                  >
                    <AlertCircle size={12} /> {error}
                  </motion.div>
                )}

                <button 
                  onClick={handleEntry}
                  className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-white transition-all uppercase text-[10px] tracking-widest"
                >
                  Confirm Identity
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FIXED FOOTER TEXT: Ab ye hamesha screen ke bottom par rahega */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 w-full text-center"
      >
        <p className="text-[10px] text-gray-500 tracking-[0.5em] uppercase border-t border-white/10 pt-4 inline-block px-10">
          Locked with Love • Since 2019
        </p>
      </motion.div>
    </div>
  );
};

export default Landing;