import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function LayerDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black z-40"
      />
      
      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30 }}
        className="fixed right-0 top-0 h-full w-full bg-white z-50 p-6"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mt-4">Layer Information</h2>
      </motion.div>
    </>
  );
}
