import { motion } from "framer-motion";
import NftCard from "./NftCard";

export default function NftSection({ title = "Hot NFTs This Week" }) {
  const defaultNfts = [
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
    }
  ];

  const trendingNfts = [
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

  const nfts = title === "Trending Collections" ? trendingNfts : defaultNfts;

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {title === "Trending Collections" 
              ? "Explore the most popular collections making waves in the NFT community."
              : "Discover the most sought-after digital collectibles making waves in the NFT space this week."}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {nfts.map((nft, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              whileHover={{ y: -5 }}
            >
              <NftCard {...nft} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
