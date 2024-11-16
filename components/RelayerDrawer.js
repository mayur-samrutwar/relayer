import { X, Loader2 } from "lucide-react";
import { motion, useDragControls, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Add these variants for animations
const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 0.5 }
};

const drawerVariants = {
  closed: { x: "100%", opacity: 0 },
  open: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300,
      mass: 1
    }
  }
};

const generatedImageVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200
    }
  }
};

export default function RelayerDrawer({ isOpen, onClose, initialImage }) {
  const [leftCircleImage, setLeftCircleImage] = useState(
    initialImage ? { id: 'initial', image: initialImage } : null
  );
  const [rightCircleImage, setRightCircleImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableImages, setAvailableImages] = useState([
    { id: 1, image: '/nft.jpg' },
    { id: 2, image: '/nft2.jpg' },
    { id: 3, image: '/nft3.jpg' },
    { id: 4, image: '/nft4.png' },
    { id: 5, image: '/nft5.png' },
    { id: 6, image: '/nft6.png' }
  ]);
  const [isRelayerMode, setIsRelayerMode] = useState(true);
  const [mintPrice, setMintPrice] = useState("");

  const handleDragEnd = (event, info, image) => {
    const leftCircle = document.getElementById('left-circle').getBoundingClientRect();
    const rightCircle = document.getElementById('right-circle').getBoundingClientRect();
    
    const leftCircleCenter = {
      x: leftCircle.left + leftCircle.width / 2,
      y: leftCircle.top + leftCircle.height / 2
    };
    
    const rightCircleCenter = {
      x: rightCircle.left + rightCircle.width / 2,
      y: rightCircle.top + rightCircle.height / 2
    };

    const dragPoint = { x: info.point.x, y: info.point.y };
    const distanceToLeft = Math.hypot(dragPoint.x - leftCircleCenter.x, dragPoint.y - leftCircleCenter.y);
    const distanceToRight = Math.hypot(dragPoint.x - rightCircleCenter.x, dragPoint.y - rightCircleCenter.y);
    
    const dropThreshold = 100;

    if (distanceToLeft < dropThreshold && !leftCircleImage) {
      setLeftCircleImage(image);
      setAvailableImages(prev => prev.filter(img => img.id !== image.id));
    } else if (distanceToRight < dropThreshold && !rightCircleImage) {
      setRightCircleImage(image);
      setAvailableImages(prev => prev.filter(img => img.id !== image.id));
    }
  };

  const handleRemoveImage = (image, position) => {
    if (position === 'left') {
      setLeftCircleImage(null);
      setAvailableImages(prev => [...prev, image]);
    } else {
      setRightCircleImage(null);
      setAvailableImages(prev => [...prev, image]);
    }
  };

  const handleRelayerClick = async () => {
    if (!leftCircleImage || !rightCircleImage) {
      alert('Please select both images first');
      return;
    }

    setIsRelayerMode(false);
    setIsLoading(true);
    
    try {
      const [baseImageData, modificationImageData] = await Promise.all([
        getBase64FromUrl(leftCircleImage.image),
        getBase64FromUrl(rightCircleImage.image)
      ]);

      const response = await fetch('/api/generate-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseImage: baseImageData,
          modificationImage: modificationImageData,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setGeneratedImage(data.url);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMint = async () => {
    if (!mintPrice || !generatedImage) return;
    // Add minting logic here
    console.log("Minting with price:", mintPrice);
  };

  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        variants={overlayVariants}
        initial="closed"
        animate="open"
        exit="closed"
        onClick={onClose}
        className="fixed inset-0 bg-black z-40"
      />
      
      <motion.div
        variants={drawerVariants}
        initial="closed"
        animate="open"
        exit="closed"
        className="fixed inset-0 bg-white z-50 flex overflow-hidden"
      >
        {/* Close button - Always visible */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full z-50"
        >
          <X size={24} />
        </button>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center space-y-12">
            {!isLoading && !generatedImage ? (
              <>
                <div className="flex items-center space-x-8">
                  {/* Left Circle */}
                  <div className="flex flex-col items-center space-y-4">
                    <div id="left-circle" className="relative w-32 h-32 rounded-full bg-gray-200">
                      {leftCircleImage && (
                        <div className="relative w-full h-full">
                          <img
                            src={leftCircleImage.image}
                            alt="Left Circle"
                            className="w-full h-full rounded-full object-cover"
                          />
                          <button
                            onClick={() => handleRemoveImage(leftCircleImage, 'left')}
                            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                    {leftCircleImage && (
                      <input
                        type="text"
                        placeholder="0.0"
                        className="w-28 px-3 py-2 text-center text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      />
                    )}
                  </div>

                  <span className="text-7xl text-gray-200">+</span>

                  {/* Right Circle */}
                  <div className="flex flex-col items-center space-y-4">
                    <div id="right-circle" className="relative w-32 h-32 rounded-full bg-gray-200">
                      {rightCircleImage && (
                        <div className="relative w-full h-full">
                          <img
                            src={rightCircleImage.image}
                            alt="Right Circle"
                            className="w-full h-full rounded-full object-cover"
                          />
                          <button
                            onClick={() => handleRemoveImage(rightCircleImage, 'right')}
                            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                    {rightCircleImage && (
                      <input
                        type="text"
                        placeholder="0.0"
                        className="w-28 px-3 py-2 text-center text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      />
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleRelayerClick}
                  disabled={!leftCircleImage || !rightCircleImage || isLoading}
                  className="px-6 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Relayer
                </button>
              </>
            ) : (
              <motion.div
                initial="initial"
                animate="animate"
                variants={generatedImageVariants}
                className="space-y-8 w-full max-w-md"
              >
                {isLoading ? (
                  <>
                    <div className="relative w-96 h-96 rounded-2xl overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" 
                        style={{
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 1.5s infinite linear'
                        }}
                      />
                    </div>
                    <p className="text-gray-500 text-center animate-pulse">
                      Cooking something great for you...
                    </p>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="relative w-96 h-96">
                      <img 
                        src={generatedImage} 
                        alt="Generated NFT" 
                        className="w-full h-full object-cover rounded-2xl shadow-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                    </div>
                    
                    <div className="w-full space-y-4">
                      <div className="relative">
                        <input
                          type="number"
                          value={mintPrice}
                          onChange={(e) => setMintPrice(e.target.value)}
                          placeholder="Enter price in ETH"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                          ETH
                        </span>
                      </div>
                      
                      <button
                        onClick={handleMint}
                        disabled={!mintPrice}
                        className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Mint NFT
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Only show in initial state */}
        {!isLoading && !generatedImage && (
          <div className="w-96 h-full border-l border-gray-200 p-6">
            <div className="space-y-4 mt-12">
              <input
                type="text"
                placeholder="Search relayer..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Import
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {availableImages.map((nft) => (
                <motion.div
                  key={nft.id}
                  drag
                  dragMomentum={false}
                  whileHover={{ scale: 1.05 }}
                  whileDrag={{ scale: 1.1, zIndex: 50 }}
                  onDragEnd={(_, info) => handleDragEnd(_, info, nft)}
                  className="relative w-full aspect-square rounded-lg overflow-hidden cursor-move touch-none"
                >
                  <img
                    src={nft.image}
                    alt={`NFT ${nft.id}`}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

// Add this to your CSS
const shimmerAnimation = `
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;
