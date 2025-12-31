import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

const FoodCard = ({ item, onAdd }) => {
  const [selectedQty, setSelectedQty] = useState(item.options[0]);

  const handleAdd = () => {
    onAdd(item, selectedQty);
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="glass-card bg-white/5 border border-white/10 p-5 rounded-[2.5rem] flex flex-col h-full shadow-xl"
    >
      {/* Food Image Container */}
      <div className="w-full h-52 mb-6 overflow-hidden rounded-[2rem] bg-gray-900 relative">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {/* NO FALLBACK - Only local image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
      
      {/* Title & Description */}
      <div className="flex-grow">
        <h3 className="text-white text-2xl font-bold mb-2 font-serif text-center tracking-wide">
          {item.name}
        </h3>
        <p className="text-gray-400 text-xs mb-6 text-center italic leading-relaxed px-2">
          {item.description}
        </p>
      </div>
      
      {/* Quantity & Action Section */}
      <div className="mt-auto">
        <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 block text-center">
          Select Portion / Size
        </label>
        
        <div className="flex gap-2 mb-6 justify-center flex-wrap px-2">
          {item.options.map(opt => (
            <button 
              key={opt}
              type="button"
              onClick={() => setSelectedQty(opt)}
              className={`px-4 py-2 text-[11px] rounded-full border transition-all duration-300 font-medium whitespace-nowrap ${
                selectedQty === opt 
                  ? 'border-[#D4AF37] bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]' 
                  : 'border-white/20 text-white hover:border-white/50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        
        {/* Add to Basket Button */}
        <button 
          onClick={handleAdd}
          className="w-full py-4 bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white text-[12px] font-black rounded-2xl transition-all duration-300 uppercase tracking-[0.2em] shadow-lg active:scale-95"
        >
          Add to Selection
        </button>
      </div>
    </motion.div>
  );
};

export default FoodCard;