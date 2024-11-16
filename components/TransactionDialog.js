import { motion } from "framer-motion";
import { Check, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function TransactionDialog({ isOpen, hash, onClose }) {
  if (!isOpen || !hash) return null;

  const txUrl = `https://base-sepolia.blockscout.com/tx/${hash}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white rounded-2xl p-8"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-bold mb-2">NFT Created Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Your NFT has been minted and is now available on the marketplace.
            </p>

            <Link 
              href={txUrl}
              target="_blank"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-6"
            >
              View transaction
              <ExternalLink size={16} />
            </Link>

            <button
              onClick={onClose}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
