import { motion } from "framer-motion";
import NftCard from "@/components/NftCard";
import { Search, Filter } from "lucide-react";

export default function Market() {
  const marketplaceNfts = [
    {
      image: '/nft.jpg',
      creatorName: 'mayur',
      price: '0.5 ETH',
      remaining: '9/10'
    },
    {
      image: '/nft2.jpg',
      creatorName: 'alex',
      price: '0.8 ETH',
      remaining: '3/5'
    },
    {
      image: '/nft3.jpg',
      creatorName: 'sarah',
      price: '1.2 ETH',
      remaining: '2/3'
    },
    {
      image: '/nft.jpg',
      creatorName: 'john',
      price: '0.3 ETH',
      remaining: '5/8'
    },
    {
      image: '/nft2.jpg',
      creatorName: 'emma',
      price: '2.1 ETH',
      remaining: '2/7'
    },
    {
      image: '/nft3.jpg',
      creatorName: 'lucas',
      price: '1.7 ETH',
      remaining: '4/6'
    },
    {
      image: '/nft.jpg',
      creatorName: 'sophia',
      price: '0.9 ETH',
      remaining: '6/10'
    },
    {
      image: '/nft2.jpg',
      creatorName: 'oliver',
      price: '1.5 ETH',
      remaining: '3/5'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header Section */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-black mb-4">Marketplace</h1>
        <p className="text-xl text-gray-600">Discover, collect, and sell extraordinary NFTs</p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div 
        className="flex flex-wrap gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search NFTs..." 
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </motion.div>

      {/* NFT Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {marketplaceNfts.map((nft, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <NftCard {...nft} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}