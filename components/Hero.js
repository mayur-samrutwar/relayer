import { motion } from "framer-motion";
import NftCard from "./NftCard";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="flex items-center justify-between min-h-[calc(100vh-120px)] gap-20 px-4 overflow-hidden">
      {/* Left side content */}
      <div className="flex-1 relative">
        {/* Floating background images */}
        <motion.img
          src="/nft.jpg"
          alt=""
          className="absolute w-24 h-24 rounded-lg opacity-20 -z-10"
          initial={{ x: -100, y: -50 }}
          animate={{ 
            x: [-100, -80, -100],
            y: [-50, -30, -50],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.img
          src="/nft.jpg"
          alt=""
          className="absolute w-20 h-20 rounded-lg opacity-15 -z-10 right-20 top-20"
          initial={{ x: 100, y: 50 }}
          animate={{ 
            x: [100, 80, 100],
            y: [50, 70, 50],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.img
          src="/nft.jpg"
          alt=""
          className="absolute w-16 h-16 rounded-lg opacity-10 -z-10 left-40 top-0"
          initial={{ x: 0, y: 0 }}
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.img
          src="/nft.jpg"
          alt=""
          className="absolute w-32 h-32 rounded-lg opacity-10 -z-10 -left-20 bottom-20"
          initial={{ x: -50, y: 50 }}
          animate={{ 
            x: [-50, -30, -50],
            y: [50, 30, 50],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.img
          src="/nft.jpg"
          alt=""
          className="absolute w-28 h-28 rounded-lg opacity-15 -z-10 right-0 bottom-0"
          initial={{ x: 50, y: 0 }}
          animate={{ 
            x: [50, 70, 50],
            y: [0, 20, 0],
          }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.img
          src="/nft.jpg"
          alt=""
          className="absolute w-20 h-20 rounded-lg opacity-20 -z-10 right-40 -bottom-10"
          initial={{ x: 0, y: 50 }}
          animate={{ 
            x: [0, -20, 0],
            y: [10, 30, 50],
          }}
          transition={{ 
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.h1 
          className="text-7xl font-black leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Create a new layer of creativity
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 mb-4 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          NFT marketplace for the one who dares to experiments.
        </motion.p>
        <motion.button
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Go to marketplace
          <ArrowRight className="ml-2" />
        </motion.button>
      </div>

      {/* Right side NFT cards */}
      <div className="flex-1 relative h-[500px] -mr-20">
        <motion.div 
          className="absolute left-1/3 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Shadow */}
          <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-[280px] h-[40px] bg-black/10 blur-xl rounded-full" />
          
          {/* Back card */}
          <motion.div
            className="absolute origin-bottom-left"
            initial={{ rotate: 0, x: 0 }}
            animate={{ rotate: -15, x: -20 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <NftCard image="/nft.jpg" />
          </motion.div>

          {/* Middle card */}
          <motion.div
            className="absolute origin-bottom-left"
            initial={{ rotate: 0 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.8 }}
          >
            <NftCard />
          </motion.div>

          {/* Front card */}
          <motion.div
            className="absolute origin-bottom-left"
            initial={{ rotate: 0, x: 0 }}
            animate={{ rotate: 15, x: 20 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <NftCard image="/nft.jpg" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
