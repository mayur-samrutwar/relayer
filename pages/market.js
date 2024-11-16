import { motion } from "framer-motion";
import NftCard from "@/components/NftCard";
import { Search, Filter } from "lucide-react";
import { useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import contractABI from "@/contract/abi/relayer.json";

export default function Market() {
  const [allNfts, setAllNfts] = useState([]);
  
  // Read NFTs from contract
  const { data: contractNfts } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BASE,
    abi: contractABI,
    functionName: 'getAllNFTs',
    watch: true,
  });

  useEffect(() => {
    if (contractNfts) {
      const [tokenIds, owners, tokenData] = contractNfts;
      
      // Transform contract data into NFT objects
      const contractNftObjects = tokenIds.map((tokenId, index) => ({
        image: '/nft5.png', // Default image - you may want to fetch this from IPFS/elsewhere
        creatorName: owners[index].slice(0, 6) + '...' + owners[index].slice(-4),
        price: `${tokenData[index].price.toString()} ETH`,
        remaining: `${tokenData[index].sharesAvailable}/${1000}`, // Using INITIAL_SHARES constant
        tokenId: tokenId.toString(),
        layer: tokenData[index].layer.toString(),
        // Add any other relevant data from tokenData
      }));

      // Combine with existing hardcoded NFTs
      setAllNfts([...contractNftObjects, ...marketplaceNfts]);
    }
  }, [contractNfts]);

  const categories = [
    { name: 'Art', count: '1.2K', selected: true },
    { name: 'Gaming', count: '892' },
    { name: 'Photography', count: '438' },
    { name: 'Music', count: '672' },
    { name: 'Video', count: '329' }
  ];

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
      image: '/nft4.png',
      creatorName: 'john',
      price: '0.3 ETH',
      remaining: '5/8'
    },
    {
      image: '/nft5.png',
      creatorName: 'emma',
      price: '2.1 ETH',
      remaining: '2/7'
    },
    {
      image: '/nft6.png',
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
      {/* Category Tags */}
      <motion.div 
        className="flex flex-wrap gap-4 mt-8 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.name}
            className={`px-6 py-3 rounded-lg backdrop-blur-md border transition-all
                     flex items-center gap-2
                     ${category.selected 
                       ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-500/30' 
                       : 'bg-white/10 border-white/20 shadow-[0_8px_16px_rgb(0_0_0/0.08)] hover:bg-white/20'
                     }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <span className="font-medium">{category.name}</span>
            <span className={`text-sm ${category.selected ? 'text-white/70' : 'text-gray-500'}`}>
              ({category.count})
            </span>
          </motion.button>
        ))}
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
        {allNfts.map((nft, index) => (
          <motion.div
            key={nft.tokenId || `static-${index}`}
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