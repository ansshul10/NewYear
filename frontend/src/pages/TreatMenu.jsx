import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FoodCard from '../components/FoodCard';
import confetti from 'canvas-confetti';
import axios from 'axios';
import { PlusCircle, Clock, Heart, Crown, Sparkles, Send } from 'lucide-react';

// ALL LOCAL IMAGES
import kitkat from '../assets/images/kitkat.jpg';
import oreo from '../assets/images/oreo.jpg';
import hideseek from '../assets/images/hideseek.jpg';
import chaumin from '../assets/images/chaumin.jpg';
import manchurian from '../assets/images/manchurian.jpg';
import noodles from '../assets/images/noodles.jpg';
import patties from '../assets/images/patties.jpg';
import dosa from '../assets/images/dosa.jpg';
import samosa from '../assets/images/samosa.jpg';

// LOCAL SOUNDS
const chimeSound = "/assets/sounds/cowbell.wav";
const heartbeatSound = "/assets/sounds/cowbell.wav";

const items = [
  { id: 4, name: "Veg Chaumein", description: "Spicy and loaded with veggies.", options: ["Half Plate", "Full Plate"], image: chaumin, loveMsg: "Thodi si teekhi, bilkul tumhare nakhre jaisi 🌶️😍", nickname: "Spicy Nakhra 🔥" },
  { id: 5, name: "Veg Manchurian", description: "Crispy balls in hot garlic sauce.", options: ["Half Plate", "Full Plate"], image: manchurian, loveMsg: "Ye balls mere dil se bhi zyada crispy hain jab tum paas hoti ho 🥵", nickname: "Hot Garlic Balls 🥵" },
  { id: 6, name: "Singapuri Noodles", description: "Authentic spicy street style.", options: ["Half Plate", "Full Plate"], image: noodles, loveMsg: "Lambi lambi noodles... jaise meri umar bhar ki mohabbat 🍜♾️", nickname: "Forever Noodles ♾️" },
  { id: 7, name: "Aloo Patties", description: "Crispy layers with spicy filling.", options: ["Single", "Double (Couple)"], image: patties, loveMsg: "Double wali couple ke liye... kyunki single toh main kabhi nahi reh sakta 💑", nickname: "Couple Patties 💕" },
  { id: 8, name: "Masala Dosa", description: "Served with hot sambhar & chutney.", options: ["Standard Size"], image: dosa, loveMsg: "Crisp from outside, soft from inside... exactly like my love for you 🥰", nickname: "Crispy Love Dosa 🥞" },
  { id: 9, name: "Samosa", description: "Crispy triangle filled with spicy aloo goodness.", options: ["Single", "Plate of 2 (Couple Special)"], image: samosa, loveMsg: "Triangle shape mein bhi mera dil tumhare liye perfect fit hai 🥟❤️", nickname: "Queen's Crispy Samosa 🥟" },
  { id: 1, name: "KitKat", description: "The classic chocolate break.", options: ["Standard Pack"], image: kitkat, loveMsg: "Break ke saath mera dil bhi break ho jaata hai jab tum nahi hoti 💔→❤️", nickname: "Queen's KitKat ❤️" },
  { id: 2, name: "Oreo Cadbury", description: "Sweet crunch in every bite.", options: ["Family Pack"], image: oreo, loveMsg: "Twist, lick, dunk... jaise main tumhare saath karna chahta hoon 😉", nickname: "Twisted Oreos 😏" },
  { id: 3, name: "Hide & Seek", description: "Hidden chocolate chips for you.", options: ["Standard Pack"], image: hideseek, loveMsg: "Tumhare dil mein chhup kar rehna chahta hoon forever 🫣", nickname: "Hidden Kisses 💋" },
];

const TreatMenu = () => {
  const [basket, setBasket] = useState([]);
  const [isOrdered, setIsOrdered] = useState(false);
  const [customItem, setCustomItem] = useState("");
  const [loveNote, setLoveNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [orderCountdown, setOrderCountdown] = useState(0);

  const chimeRef = useRef(null);
  const heartRef = useRef(null);

  useEffect(() => {
    chimeRef.current = new Audio(chimeSound);
    heartRef.current = new Audio(heartbeatSound);
    chimeRef.current.preload = 'auto';
    heartRef.current.preload = 'auto';
  }, []);

  const playSound = (type = "chime") => {
    const audio = type === "heart" ? heartRef.current : chimeRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.7;
      audio.play().catch(() => {});
    }
  };

  const celebrateAdd = () => {
    playSound("chime");
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#FF1493', '#D4AF37', '#FFD700', '#FFFFFF'],
      shapes: ['heart'],
      scalar: 1.4
    });
  };

  const showLoveToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 4000);
  };

  const addToBasket = (item, selectedQty) => {
    const newItem = { ...item, selectedQty, nickname: item.nickname || item.name };
    setBasket(prev => [...prev, newItem]);
    celebrateAdd();
    showLoveToast(item.loveMsg);
    if (basket.length + 1 === 3) playSound("heart");
  };

  const addCustomItem = () => {
    if (!customItem.trim()) return;
    setBasket(prev => [...prev, { 
      id: Date.now(), 
      name: customItem, 
      selectedQty: "Queen's Royal Wish", 
      nickname: `Queen's "${customItem}" 👑`
    }]);
    celebrateAdd();
    showLoveToast("Tumhari har wish meri command hai, meri Rani! ❤️");
    setCustomItem("");
  };

  const handleOrder = () => {
    if (loading || basket.length === 0) return;
    setLoading(true);
    let count = 3;
    setOrderCountdown(count);
    const interval = setInterval(() => {
      count--;
      setOrderCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        finalizeOrder();
      }
    }, 1000);
  };

  const finalizeOrder = async () => {
    playSound("heart");
    try {
      await axios.post('http://localhost:5000/api/orders', {
        items: basket,
        loveNote: loveNote || "All my love included ❤️"
      });

      const duration = 3 * 1000;
      const end = Date.now() + duration;
      const colors = ['#D4AF37', '#FF1493', '#FFD700', '#FF69B4', '#FFFFFF'];
      const fireworks = () => {
        confetti({ particleCount: 120, spread: 120, origin: { x: 0.2, y: 0.4 }, colors });
        confetti({ particleCount: 120, spread: 120, origin: { x: 0.8, y: 0.4 }, colors });
        confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 }, colors, shapes: ['heart'] });
        if (Date.now() < end) requestAnimationFrame(fireworks);
      };
      fireworks();

      setIsOrdered(true);
      setBasket([]);
      setLoveNote("");
    } catch (err) {
      console.error(err);
      alert("Order failed! But I'll bring everything manually ❤️");
    } finally {
      setLoading(false);
      setOrderCountdown(0);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 relative overflow-hidden">
      {/* Floating Background Hearts */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [-20, 20, -20] }}
            transition={{ repeat: Infinity, duration: 12 + i * 2 }}
            className="absolute text-pink-500"
            style={{ left: `${10 + i * 15}%`, top: '20%' }}
          >
            <Heart size={32} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10 pb-32">

        {/* Header - Mobile Optimized */}
        <div className="text-center mb-10">
          <motion.h2 className="text-4xl xs:text-5xl sm:text-6xl font-serif text-gold mb-6 flex items-center justify-center gap-3 flex-wrap leading-tight">
            <AnimatePresence>
              {basket.length >= 3 && (
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}>
                  <Crown className="text-yellow-400 animate-pulse" size={36} />
                </motion.div>
              )}
            </AnimatePresence>
            Forever Royal Menu
            <AnimatePresence>
              {basket.length >= 3 && (
                <motion.div initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: 0 }}>
                  <Crown className="text-yellow-400 animate-pulse" size={36} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.h2>

          <motion.div className="glass-card p-5 sm:p-8 border-pink-500/40 rounded-3xl mx-2 sm:mx-auto">
            <p className="text-gold font-bold mb-4 flex items-center justify-center gap-3 text-base sm:text-xl">
              <Clock size={24} className="sm:size-28" /> OPEN 24/7 • 365 DAYS A YEAR
            </p>
            <p className="italic text-gray-200 text-sm sm:text-base leading-relaxed text-center px-2">
              "This menu is not just for New Year; it's open for you forever. However, for orders placed after New Year, there might be slight delays, so please don't get angry. Your treat will reach you safely between{' '}
              <span className="text-pink-400 font-bold text-base sm:text-lg">6:30 PM to 7:00 PM</span> because of your parents at home. Your happiness is my priority!" ❤️
            </p>
          </motion.div>
        </div>

        {/* Secret Love Note */}
        <div className="mb-10 mx-2 max-w-2xl mx-auto">
          <label className="text-pink-300 text-sm sm:text-base mb-3 block text-center uppercase tracking-widest font-bold">
            Want to send me a secret love note? 💌
          </label>
          <textarea
            placeholder="Type something sweet... (makes me melt 🫠)"
            value={loveNote}
            onChange={(e) => setLoveNote(e.target.value)}
            className="w-full bg-white/10 border border-pink-500/40 rounded-2xl px-5 py-4 text-white placeholder-gray-400 focus:border-gold focus:ring-4 focus:ring-gold/20 text-sm sm:text-base"
            rows="4"
          />
        </div>

        {/* Custom Wish */}
        <div className="mb-12 mx-2">
          <label className="text-pink-300 text-sm sm:text-base mb-3 block text-center uppercase tracking-widest font-bold">
            Anything else in your mind?
          </label>
          <div className="glass-card p-4 rounded-full flex items-center gap-4 border-2 border-gold/50 w-full">
            <input 
              type="text" 
              placeholder="Bolo na meri jaan... kya chahiye? 🥺"
              className="bg-transparent outline-none text-white w-full text-sm sm:text-base"
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
            />
            <button onClick={addCustomItem} className="text-gold hover:scale-125 transition-transform">
              <PlusCircle size={36} />
            </button>
          </div>
        </div>

        {/* Menu Grid - Perfect Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-32 px-2">
          {items.map(item => (
            <FoodCard key={item.id} item={item} onAdd={addToBasket} />
          ))}
        </div>

        {/* Love Toast - Mobile Friendly */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 60, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="fixed top-16 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-50 pointer-events-none"
            >
              <div className="glass-card backdrop-blur-xl bg-gradient-to-r from-[#FF1493]/20 via-[#FF69B4]/20 to-gold/20 border border-gold/40 rounded-full px-6 py-4 shadow-2xl flex items-center gap-3 max-w-md mx-auto">
                <div className="p-2 bg-gradient-to-br from-[#FF1493] to-gold rounded-full">
                  <Heart className="text-white" size={24} fill="currentColor" />
                </div>
                <p className="text-gold font-serif italic text-sm sm:text-base leading-tight">
                  {showToast}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fixed Bottom Basket - Mobile Safe */}
        <AnimatePresence>
          {basket.length > 0 && !isOrdered && (
            <motion.div 
              initial={{ y: 150 }} 
              animate={{ y: 0 }} 
              exit={{ y: 150 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t-4 border-gold p-5 sm:p-8 pb-[max(env(safe-area-inset-bottom,1rem),2rem)] rounded-t-3xl backdrop-blur-2xl shadow-2xl"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                  <h4 className="text-gold font-black uppercase tracking-widest text-lg sm:text-2xl flex items-center gap-3">
                    <Sparkles size={24} className="animate-pulse" />
                    Queen's Basket ({basket.length})
                    <Sparkles size={24} className="animate-pulse" />
                  </h4>
                  <button onClick={() => setBasket([])} className="text-gray-400 hover:text-white text-sm underline">
                    Clear All
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-5 max-h-28 overflow-y-auto">
                  {basket.map((i, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-gradient-to-r from-pink-600/30 to-gold/30 px-4 py-2 rounded-full text-sm border border-pink-500/50"
                    >
                      {i.nickname} <span className="text-pink-300 font-bold">({i.selectedQty})</span>
                    </motion.div>
                  ))}
                </div>

                <button 
                  onClick={handleOrder}
                  disabled={loading}
                  className="w-full py-4 sm:py-6 bg-gradient-to-r from-gold via-[#FFD700] to-gold text-black font-black rounded-3xl shadow-2xl hover:shadow-gold/80 uppercase tracking-widest text-base sm:text-xl relative overflow-hidden disabled:opacity-70"
                >
                  <span className="absolute inset-0 bg-white/30 animate-ping" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {orderCountdown > 0 ? (
                      <>{orderCountdown}... Sending Love! ❤️</>
                    ) : loading ? (
                      "Packing Your Treats..."
                    ) : (
                      <>
                        Send Order With Love
                        <Send size={20} className="animate-pulse" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Success Modal - Mobile Perfect */}
        <AnimatePresence>
          {isOrdered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-4">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center glass-card p-8 sm:p-12 rounded-3xl sm:rounded-[4rem] border-4 border-gold w-full max-w-md">
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-pink-500 to-gold rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Heart className="text-white" size={48} sm:size-64 fill="currentColor" />
                </motion.div>
                <h2 className="text-gold text-3xl sm:text-5xl font-serif mb-5">Order Received!</h2>
                <p className="text-gray-300 text-base sm:text-xl italic leading-relaxed mb-6 px-2">
                  "Wait 30 minutes patiently... Your delivery partner is busy picking the best treats for you!"
                </p>
                <div className="bg-white/5 p-5 rounded-3xl border border-pink-500/30">
                  <p className="text-pink-400 font-bold uppercase tracking-widest text-sm mb-1">Safe Delivery Window</p>
                  <p className="text-white font-bold text-xl sm:text-3xl">6:30 PM - 7:00 PM</p>
                </div>
                <button onClick={() => setIsOrdered(false)} className="mt-8 text-gray-400 hover:text-white text-sm uppercase underline">
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TreatMenu;