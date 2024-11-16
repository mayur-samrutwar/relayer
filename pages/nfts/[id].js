import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share2, Clock, Tag, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LayerDrawer from "../../components/LayerDrawer";
import RelayerDrawer from "../../components/RelayerDrawer";

export default function NftDetail() {
  const [isLayerDrawerOpen, setIsLayerDrawerOpen] = useState(false);
  const [isRelayerDrawerOpen, setIsRelayerDrawerOpen] = useState(false);
  
  const nftData = {
    id: 1,
    name: "Abstract Dimension #312",
    image: "/nft5.png",
    description: "A unique piece exploring the intersection of digital art and blockchain technology. This NFT represents a new dimension of creativity in the digital space.",
    creator: {
      name: "mayur",
      avatar: "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
      verified: true
    },
    owner: {
      name: "alex",
      avatar: "/nft2.jpg",
      verified: true
    },
    price: "0.5 ETH",
    remaining: "9/10",
    collection: "Abstract Dimensions",
    properties: [
      { name: "Background", value: "Deep Space", rarity: "12%" },
      { name: "Base", value: "Quantum", rarity: "8%" },
      { name: "Eyes", value: "Cosmic", rarity: "15%" },
      { name: "Outfit", value: "Digital Armor", rarity: "5%" }
    ],
    details: [
      { label: "Contract Address", value: "0x1234...5678" },
      { label: "Token ID", value: "#312" },
      { label: "Token Standard", value: "ERC-1155" },
      { label: "Blockchain", value: "Ethereum" },
      { label: "Created", value: "Apr 15, 2024" }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/market" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="mr-2" size={20} />
          Back to marketplace
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg max-w-[500px] mx-auto">
            <img src={nftData.image} alt={nftData.name} className="object-cover w-full h-full" />
          </div>
        </motion.div>

        {/* Right Column - Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Title and Actions */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">{nftData.name}</h1>
              <p className="text-gray-600">From collection {nftData.collection}</p>
            </div>
            <div className="flex gap-3">
              <button className="p-3 rounded-full hover:bg-gray-100">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-3 rounded-full hover:bg-gray-100">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Creator */}
          <div className="flex items-center gap-4 p-4 border rounded-xl hover:border-black transition-colors">
            <img src={nftData.creator.avatar} alt={nftData.creator.name} 
                 className="w-12 h-12 rounded-full" />
            <div>
              <p className="text-sm text-gray-500">Creator</p>
              <p className="font-medium">{nftData.creator.name}</p>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="p-6 border rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500">Current Price</p>
                <p className="text-3xl font-bold">{nftData.price}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="text-xl font-semibold">{nftData.remaining}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsLayerDrawerOpen(true)}
              className="w-full text-sm text-gray-600 hover:text-black flex items-center gap-2 justify-center mb-4 border py-2 rounded-lg hover:border-black transition-all"
            >
              View layer hierarchy →
            </button>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsRelayerDrawerOpen(true)}
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex flex-col items-center"
              >
                <span>Relayer</span>
                <span className="text-sm text-gray-300">Show your creativity</span>
              </button>
              <button className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Buy Now
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-600">{nftData.description}</p>
          </div>

          {/* Details Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Details</h3>
            <div className="space-y-3">
              {nftData.details.map((detail) => (
                <div key={detail.label} className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">{detail.label}</span>
                  <span className="font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <LayerDrawer 
        isOpen={isLayerDrawerOpen} 
        onClose={() => setIsLayerDrawerOpen(false)} 
      />
      <RelayerDrawer 
        isOpen={isRelayerDrawerOpen} 
        onClose={() => setIsRelayerDrawerOpen(false)}
        initialImage={nftData.image}
      />
    </div>
  );
}
