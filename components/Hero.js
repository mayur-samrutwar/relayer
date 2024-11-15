import { motion } from "framer-motion";
import NftCard from "./NftCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const floatingImages = [
    '/nft.jpg', '/nft2.jpg', '/nft3.jpg'
  ];

  return (
    <div className="flex items-center justify-between min-h-[calc(100vh-120px)] gap-20 px-4 overflow-hidden">
      {/* Left side content */}
      <div className="flex-1 relative">
        {[...Array(24)].map((_, index) => (
          <motion.img
            key={index}
            src={floatingImages[index % floatingImages.length]}
            alt=""
            className={`absolute w-8 h-8 rounded-lg opacity-[0.15] -z-10`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
            }}
            initial={{ x: Math.random() * 50 - 25, y: Math.random() * 50 - 25 }}
            animate={{ 
              x: [
                Math.random() * 50 - 25,
                Math.random() * 50 - 25,
                Math.random() * 50 - 25
              ],
              y: [
                Math.random() * 50 - 25,
                Math.random() * 50 - 25,
                Math.random() * 50 - 25
              ],
            }}
            transition={{ 
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

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
        <Link href="/market">
        <motion.button
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Go to marketplace
          <ArrowRight className="ml-2" />
        </motion.button>
        </Link>
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
            className="absolute origin-bottom-left cursor-pointer"
            initial={{ rotate: 0, x: 0 }}
            animate={{ rotate: -15, x: -20 }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <NftCard image="/nft3.jpg" />
          </motion.div>

          {/* Middle card */}
          <motion.div
            className="absolute origin-bottom-left cursor-pointer"
            initial={{ rotate: 0 }}
            animate={{ rotate: 0 }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            transition={{ duration: 0.8 }}
          >
            <NftCard image="/nft2.jpg" />
          </motion.div>

          {/* Front card */}
          <motion.div
            className="absolute origin-bottom-left cursor-pointer"
            initial={{ rotate: 0, x: 0 }}
            animate={{ rotate: 15, x: 20 }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <NftCard image="/nft.jpg" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
