import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Heart, Lock, Music, Pizza, IceCream, Zap, Rocket, Camera, Send, X,
  Infinity as InfinityIcon, Smile, Coffee
} from 'lucide-react';
import Typewriter from '../components/Typewriter';
import confetti from 'canvas-confetti';
import SignatureCanvas from 'react-signature-canvas';
// Top pe import add karo
import BackgroundMusic from '../components/BackgroundMusic';

// Images
import pic1 from '../assets/images/pic1.jpg';
import pic2 from '../assets/images/pic2.jpg';
import pic3 from '../assets/images/pic3.jpg';
import pic4 from '../assets/images/pic4.jpg';

const OurJourney = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({});
  const [isNewYear, setIsNewYear] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mood, setMood] = useState("");
  const [isSleepyMode, setIsSleepyMode] = useState(false);

  // Vault States
  const [showVault, setShowVault] = useState(false);
  const [moodScore, setMoodScore] = useState(50);
  const [selfObsessionScore, setSelfObsessionScore] = useState(50);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dangerLevel, setDangerLevel] = useState("");
  const [vaultStatus, setVaultStatus] = useState("idle");

  const [nakhraChecks, setNakhraChecks] = useState({ noAnger: false });
  const [bhau, setBhau] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [agreeConfidentiality, setAgreeConfidentiality] = useState(false);
  const signatureRef = useRef(null);
  const [signatureData, setSignatureData] = useState(null);

  // Luck Counter
  const [luckValue, setLuckValue] = useState(0);
  const [luckStatus, setLuckStatus] = useState("Calculating Luck...");
  const [isInfinity, setIsInfinity] = useState(false);

  const CORRECT_PASSWORD = "10202019";

  // Mood Handler
  const handleMoodClick = async (m) => {
    setMood(m.msg);

    if (m.label === "Happy") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FF69B4', '#FFFFFF']
      });
    } else if (m.label === "Romantic") {
      const duration = 5 * 1000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FF1493', '#FF69B4'] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FF1493', '#FF69B4'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();

      setTimeout(() => {
        setShowVault(true);
        // Reset form
        setNakhraChecks({ noAnger: false });
        setBhau("");
        setPassword("");
        setPasswordError("");
        setMoodScore(40);
        setSelfObsessionScore(60);
        setAgreeConfidentiality(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setDangerLevel("");
        setSignatureData(null);
        signatureRef.current?.clear();
      }, 6000);
    } else if (m.label === "Sleepy") {
      setIsSleepyMode(true);
      setTimeout(() => setIsSleepyMode(false), 6000);
    }

    try {
      await axios.post('https://newyear-n16i.onrender.com/api/mood', {
        mood: m.label,
        message: m.msg
      });
    } catch (err) {
      console.error("Mood update failed:", err);
    }
  };

  // File Handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      const lvl = Math.random();
      if (lvl < 0.33) setDangerLevel("Low");
      else if (lvl < 0.66) setDangerLevel("Medium");
      else setDangerLevel("Extreme");
    };
    reader.readAsDataURL(file);
  };

  // Password Validation
  const validatePassword = () => {
    if (password !== CORRECT_PASSWORD) {
      setPasswordError("Access Denied! Password is: 1020....");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const canSubmit = () => {
    return nakhraChecks.noAnger &&
      bhau !== "" &&
      password === CORRECT_PASSWORD &&
      agreeConfidentiality &&
      signatureData &&
      selectedFile;
  };

  // Vault Submit
  const submitVault = async () => {
    if (!canSubmit()) {
      alert("Pehle saare nakhre poore karo! 😏");
      return;
    }

    setVaultStatus("sending");

    try {
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      await axios.post('https://newyear-n16i.onrender.com/api/romantic-reveal', {
        moodScore,
        selfObsessionScore,
        bhau,
        image: base64Image,
        signature: signatureData,
        message: "Vault unlocked! Check the attachment for the reveal. 🔥"
      });

      setVaultStatus("success");
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF1493', '#FFFFFF']
      });

      setTimeout(() => {
        setShowVault(false);
        setVaultStatus("idle");
        setSelectedFile(null);
        setPreviewUrl(null);
        setDangerLevel("");
      }, 4000);
    } catch (err) {
      console.error(err);
      alert("Technical Glitch! Try again my love.");
      setVaultStatus("idle");
    }
  };

  // Signature Update
  const updateSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setSignatureData(signatureRef.current.toDataURL());
    } else {
      setSignatureData(null);
    }
  };

  // Countdown, Scroll, Luck Effect
  useEffect(() => {
    const targetDate = new Date("2026-01-01T00:00:00").getTime(); // Local midnight

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setIsNewYear(true);
        triggerFirecrackers();
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);

    const runLuckCounter = async () => {
      for (let i = 0; i <= 40; i++) { setLuckValue(i); await new Promise(r => setTimeout(r, 80)); }
      setLuckStatus("Wait... itna luck kaise? 🤨");
      await new Promise(r => setTimeout(r, 1500));
      setLuckStatus("Deep database checking...");
      for (let i = 41; i <= 70; i++) { setLuckValue(i); await new Promise(r => setTimeout(r, 150)); }
      setLuckStatus("Itna luck toh mera ho hi nahi sakta... ❤️");
      await new Promise(r => setTimeout(r, 2000));
      setLuckStatus("Oh wait! Mere pass toh Aap ho! 🥰");
      for (let i = 71; i <= 99; i++) { setLuckValue(i); await new Promise(r => setTimeout(r, 90)); }
      for (let i = 1; i <= 99; i++) {
        const decimal = i < 10 ? `0${i}` : i;
        setLuckValue(`99.${decimal}`);
        await new Promise(r => setTimeout(r, 100));
      }
      setLuckStatus("Mera luck toh Infinity hai aapke saath! ♾️");
      setIsInfinity(true);
    };

    runLuckCounter();

    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const triggerFirecrackers = () => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const photos = [
    { id: 1, url: pic1, title: 'The Day I Got Lucky', caption: 'Where it all started... I still wonder how you said yes! 😂' },
    { id: 2, url: pic2, title: 'Hazardous Smile', caption: 'Warning: Looking at this smile for too long causes permanent heart melt. 😍' },
    { id: 3, url: pic3, title: 'The Great Date', caption: 'Remember this? You ate my fries and I still loved you. That is true love! 🍟' },
    { id: 4, url: pic4, title: 'Caught in the Moment', caption: 'The way you look at me makes me forget how to use my brain. 🧠❌' },
  ];

  const getSelfObsessionLabel = () => {
    if (selfObsessionScore <= 30) return "Just Cute";
    if (selfObsessionScore <= 70) return "Crush";
    return "Apsara level (System Hang)";
  };

  const getDangerMessage = () => {
    if (dangerLevel === "Low") return "Handle with care.";
    if (dangerLevel === "Medium") return "Heartbeat badhne wali hai.";
    if (dangerLevel === "Extreme") return "Oxygen cylinder saath rakho, hosh udne wale hain!";
    return "";
  };

  return (
    <div className="min-h-screen bg-[#050505] py-8 px-4 relative overflow-hidden selection:bg-[#D4AF37] selection:text-black text-sm">

      {/* Sleepy Overlay */}
      <AnimatePresence>
        {isSleepyMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[500] pointer-events-none flex flex-col items-center justify-center"
          >
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
              <p className="text-white font-serif italic text-2xl md:text-3xl tracking-[0.3em] mb-4 text-center">Shhh... Queen is Sleepy 🌙</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Romantic Vault Modal */}
      <AnimatePresence>
        {showVault && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-[#0f0f0f] via-[#1a0a1a] to-[#0f0f0f] border border-[#FF1493]/20 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-hidden shadow-2xl shadow-[#FF1493]/20 relative overflow-y-auto scrollbar-thin scrollbar-thumb-[#333333] scrollbar-track-transparent"
            >
              <div className="relative bg-gradient-to-b from-[#FF1493]/10 to-transparent pt-10 pb-8 px-8">
                <button onClick={() => setShowVault(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10">
                  <X size={20} className="text-gray-400" />
                </button>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FF1493]/20 to-[#FF69B4]/20 border border-[#FF1493]/30 mb-6 shadow-lg">
                    <Lock className="text-[#FF1493] animate-pulse" size={36} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight">Private Love Vault</h2>
                  <p className="text-[#FF69B4] text-sm uppercase tracking-widest mt-3 font-medium">For Your Eyes Only ♡</p>
                </div>
              </div>

              <div className="px-8 pb-8 pt-4 space-y-10">
                {vaultStatus !== "success" ? (
                  <>
                    {/* Nakhra Checklist */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <p className="text-gray-300 text-sm uppercase tracking-wider mb-4 font-semibold">Mandatory Nakhra Checklist ✨</p>
                      <label className="flex items-center gap-4 cursor-pointer">
                        <input type="checkbox" checked={nakhraChecks.noAnger} onChange={(e) => setNakhraChecks({ ...nakhraChecks, noAnger: e.target.checked })} className="w-6 h-6 accent-[#FF1493] rounded-lg" />
                        <span className="text-white text-base">Main aaj bilkul gussa nahi karungi 😇</span>
                      </label>
                    </div>

                    {/* Bhau */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <label className="text-gray-300 text-sm uppercase tracking-wider font-semibold block mb-4">Photo ke badle demand 💝</label>
                      <select value={bhau} onChange={(e) => setBhau(e.target.value)} className="w-full px-6 py-4 bg-black/40 border border-white/20 rounded-xl text-white focus:border-[#FF1493] focus:ring-4 focus:ring-[#FF1493]/20">
                        <option value="">Select...</option>
                        <option value="kitkat">Kitkat 🍫</option>
                        <option value="Hide">Hide $ Seek (biscuit)</option>
                        <option value="Dark">Dark 🍫</option>
                        <option value="praise">1 Ghante ki extra tareef 😍</option>
                      </select>
                    </div>

                    {/* Password */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <label className="text-gray-300 text-sm uppercase tracking-wider font-semibold block mb-4">Secret Password 🔐 [Mandatory For Sending This]</label>
                      <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }} placeholder="Hint: 1020...." className="w-full px-6 py-4 bg-black/40 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-[#FF1493] focus:ring-4 focus:ring-[#FF1493]/20" />
                      {passwordError && <p className="text-red-400 text-sm mt-3 italic">{passwordError}</p>}
                    </div>

                    {/* Meters */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="flex justify-between mb-4"><span className="text-gray-300 text-sm uppercase">Romantic Mood</span><span className="text-[#FF1493] font-bold text-xl">{moodScore}% {moodScore > 85 ? '🥵' : '💖'}</span></div>
                      <input type="range" min="0" max="100" value={moodScore} onChange={(e) => setMoodScore(e.target.value)} className="w-full h-2 bg-gray-700 rounded-full accent-[#FF1493]" />
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="flex justify-between mb-4"><span className="text-gray-300 text-sm uppercase">Aaj kitni sundar ho?</span><span className="text-[#D4AF37] font-bold text-xl">{getSelfObsessionLabel()}</span></div>
                      <input type="range" min="0" max="100" value={selfObsessionScore} onChange={(e) => setSelfObsessionScore(e.target.value)} className="w-full h-2 bg-gray-700 rounded-full accent-[#D4AF37]" />
                    </div>

                    {/* Photo Upload */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                      <label className="block cursor-pointer">
                        <div className="w-full h-64 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#FF1493]/50 overflow-hidden relative group">
                          {previewUrl ? (
                            <>
                              <img src={previewUrl} alt="preview" className="w-full h-full object-cover brightness-75 group-hover:brightness-100" />
                              <div className="absolute inset-0 flex items-center justify-center"><p className="text-white text-xl font-bold uppercase">Ready to Send 🔥</p></div>
                              {dangerLevel && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3 rounded-full text-white font-bold">Danger: {dangerLevel} — {getDangerMessage()}</div>}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-[#FF1493]">
                              <Camera size={48} className="mb-4" />
                              <p className="text-sm uppercase tracking-widest font-semibold">Upload Your Magic ✨</p>
                              <p className="text-xs mt-2 text-gray-500">Fully Encrypted • For Love Only</p>
                            </div>
                          )}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>

                    {/* Confidentiality */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                      <button onClick={() => setAgreeConfidentiality(!agreeConfidentiality)} className={`w-full py-4 rounded-xl font-bold uppercase ${agreeConfidentiality ? 'bg-gradient-to-r from-[#FF1493] to-[#FF69B4] text-white shadow-lg' : 'bg-gray-800/50 text-gray-400 border border-gray-700'}`}>
                        {agreeConfidentiality ? '✓ ' : ''}I agree Love won't faint after seeing this 😂
                      </button>
                    </div>

                    {/* Signature */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <p className="text-gray-300 text-sm uppercase tracking-wider font-semibold mb-4 text-center">Your Royal Signature ✍️</p>
                      <div className="rounded-xl overflow-hidden border border-white/20 bg-black/30">
                        <SignatureCanvas
                          ref={signatureRef}
                          penColor="#FF1493"
                          canvasProps={{ height: 180, className: 'w-full rounded-xl' }}
                          onEnd={updateSignature}
                        />
                      </div>
                      <button onClick={() => { signatureRef.current?.clear(); setSignatureData(null); }} className="mt-3 text-gray-400 hover:text-white text-sm underline block text-center">
                        Clear signature
                      </button>
                    </div>

                    {/* Send Button */}
                    <button
                      onClick={submitVault}
                      disabled={vaultStatus === "sending" || !canSubmit()}
                      className="w-full py-6 bg-gradient-to-r from-[#FF1493] to-[#FF69B4] text-white rounded-2xl font-black uppercase tracking-widest text-lg shadow-2xl hover:shadow-[#FF1493]/60 flex items-center justify-center gap-4 disabled:opacity-60"
                    >
                      {vaultStatus === "sending" ? "Encrypting Your Magic... ✨" : <>Send to Love <Send size={24} /></>}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-16 px-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-28 h-28 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                      <Heart className="text-green-400" size={60} fill="currentColor" />
                    </motion.div>
                    <h2 className="text-4xl font-serif text-white mb-6">Vault Delivered!</h2>
                    <p className="text-gray-300 text-lg italic max-w-sm mx-auto">
                      "Phone already vibrating... <br />Your secret is now in the safest hands. ❤️"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Progress */}
      <motion.div className="fixed top-0 left-0 h-1 bg-[#D4AF37] z-[100] shadow-[0_0_15px_#D4AF37]" style={{ width: `${scrollProgress}%` }} />

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-[20%] left-[10%] text-yellow-400"><Pizza size={60} /></motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-[60%] right-[15%] text-pink-400"><IceCream size={50} /></motion.div>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-[10%] left-[20%] text-blue-400"><Zap size={40} /></motion.div>
        <div className="absolute top-1/2 left-5 animate-spin-slow"><Rocket size={40} className="text-blue-400" /></div>
      </div>

      {/* Mood Selector */}
      <div className="max-w-md mx-auto mt-4 mb-10 relative z-10 text-center glass-card p-6 rounded-[2rem] border-white/10 backdrop-blur-xl">
        <p className="text-gray-400 text-[10px] uppercase mb-4 tracking-widest font-bold">How is the Queen feeling right now?</p>
        <div className="flex justify-center gap-10">
          {[
            { icon: <Smile size={32} />, label: "Happy", msg: "I knew it! My presence is magical. 😎" },
            { icon: <Heart className="text-[#FF1493]" size={32} />, label: "Romantic", msg: "Entering the Secret Love Vault... 🔥" },
            { icon: <Coffee size={32} />, label: "Sleepy", msg: "Zzz... the surprise just started! ☕" },
          ].map((m, i) => (
            <button key={i} onClick={() => handleMoodClick(m)} className="text-gray-500 hover:text-[#D4AF37] transition-all transform hover:scale-110 flex flex-col items-center gap-2">
              <motion.div whileTap={{ scale: 0.8 }}>{m.icon}</motion.div>
              <span className="text-[10px] uppercase font-bold tracking-tighter">{m.label}</span>
            </button>
          ))}
        </div>
        <AnimatePresence>
          {mood && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 text-pink-400 text-[10px] italic font-bold">{mood}</motion.p>}
        </AnimatePresence>
      </div>

      {/* Countdown */}
      <div className="max-w-xl mx-auto mb-20 relative z-10 text-center px-4">
        {!isNewYear ? (
          <motion.div className="glass-card p-8 rounded-[2.5rem] border-[#D4AF37]/40 bg-black/60 backdrop-blur-3xl inline-block shadow-2xl">
            <p className="text-pink-400 text-[9px] uppercase tracking-widest mb-6 font-black">Counting down to 2026 Chaos</p>
            <div className="flex gap-4 md:gap-10 justify-center items-center">
              {[{ label: 'Days', value: timeLeft.days }, { label: 'Hrs', value: timeLeft.hours }, { label: 'Min', value: timeLeft.minutes }, { label: 'Sec', value: timeLeft.seconds }].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-5xl font-black text-[#D4AF37] tracking-tighter">{item.value || '0'}</div>
                  <div className="text-[9px] uppercase text-gray-500 mt-1 font-bold">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} className="text-5xl font-serif text-[#D4AF37] drop-shadow-[0_0_30px_rgba(212,175,55,0.8)]">🎉 HAPPY 2026! 🎉</motion.div>
        )}
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-24 relative z-10 px-4">
        <h1 className="text-4xl md:text-7xl font-serif text-[#D4AF37] mb-8 tracking-tighter uppercase">
          Our Beautiful <span className="italic text-white underline decoration-pink-500/30 underline-offset-4">Chaos</span>
        </h1>
        <div className="max-w-xl mx-auto p-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-white/80 text-lg italic font-serif leading-relaxed text-center">
          <Typewriter text="Every second spent with you is like a romantic movie (where I am the hero and you are the much smarter heroine). From grayscale to 4K Ultra HD..." />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 relative z-10 px-4">
        <motion.div whileHover={{ y: -10 }} className="glass-card p-10 rounded-[2.5rem] border-white/5 text-center backdrop-blur-sm">
          <h4 className="text-gray-500 text-[11px] uppercase mb-4 tracking-[0.2em] font-bold">Arguments Won</h4>
          <p className="text-5xl font-black text-[#D4AF37] mb-3">0</p>
          <p className="text-sm text-pink-300 italic">Haar kar jeetne wale ko 'Aapka Love' kehte hain! 🏳️</p>
        </motion.div>

        <motion.div whileHover={{ y: -10 }} className="glass-card p-10 rounded-[2.5rem] border-[#D4AF37]/30 text-center backdrop-blur-sm bg-gradient-to-b from-transparent to-[#D4AF37]/5">
          <h4 className="text-gray-500 text-[11px] uppercase mb-4 tracking-[0.2em] font-bold">My Luck Level</h4>
          <div className="h-16 flex items-center justify-center">
            {!isInfinity ? (
              <p className="text-5xl font-black text-[#D4AF37] tracking-tighter">{luckValue}{typeof luckValue === 'number' ? '%' : ''}</p>
            ) : (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} className="text-[#D4AF37]"><InfinityIcon size={60} strokeWidth={3} /></motion.div>
            )}
          </div>
          <p className="mt-4 text-xs text-white font-light italic h-10 flex items-center justify-center text-center px-2">{luckStatus}</p>
        </motion.div>

        <motion.div whileHover={{ y: -10 }} className="glass-card p-10 rounded-[2.5rem] border-white/5 text-center backdrop-blur-sm">
          <h4 className="text-gray-500 text-[11px] uppercase mb-4 tracking-[0.2em] font-bold">Smile Impact</h4>
          <p className="text-5xl font-black text-[#D4AF37] mb-3">Max</p>
          <p className="text-sm text-pink-300 italic">Permanent Heart Melt state active! 😍</p>
        </motion.div>
      </div>

      {/* Gallery */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-10 max-w-7xl mx-auto space-y-10 px-4 relative z-10">
        {photos.map((photo, index) => (
          <motion.div key={photo.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }} whileHover={{ y: -15, rotate: index % 2 === 0 ? 1 : -1 }} className="relative group overflow-hidden rounded-[3rem] border-2 border-white/10 bg-black shadow-2xl">
            <div className="absolute top-6 right-8 z-20 bg-black/60 backdrop-blur-md p-3 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <Heart size={24} className="text-pink-500 fill-pink-500" />
            </div>
            <img src={photo.url} alt={photo.title} className="w-full h-auto object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-12 translate-y-6 group-hover:translate-y-0 text-left">
              <h4 className="text-[#D4AF37] font-serif text-3xl mb-3">{photo.title}</h4>
              <p className="text-gray-300 text-base italic font-light leading-relaxed">{photo.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <motion.div className="mt-20 flex justify-center pb-24 relative z-10">
        <button onClick={() => navigate('/treats')} className="group flex items-center gap-4 px-12 py-5 rounded-full border border-[#D4AF37] text-[#D4AF37] relative overflow-hidden transition-all duration-500">
          <Heart size={20} className="relative z-10 animate-pulse" fill="currentColor" />
          <span className="relative z-10 font-black text-xs tracking-[0.4em] uppercase">FEED ME NOW</span>
        </button>
      </motion.div>
      <BackgroundMusic />
      <div className="text-center text-gray-700 text-[8px] uppercase opacity-40 font-bold tracking-widest mb-10">Established 2019 • Forever to go</div>
    </div>
  );
};

export default OurJourney;
