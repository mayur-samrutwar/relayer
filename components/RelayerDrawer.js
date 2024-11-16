import { X } from "lucide-react";
import { motion, useDragControls } from "framer-motion";
import { useState } from "react";

export default function RelayerDrawer({ isOpen, onClose, initialImage }) {
  const [leftCircleImage, setLeftCircleImage] = useState(
    initialImage ? { id: 'initial', image: initialImage } : null
  );
  const [rightCircleImage, setRightCircleImage] = useState(null);
  const [availableImages, setAvailableImages] = useState([
    { id: 1, image: '/nft.jpg' },
    { id: 2, image: '/nft2.jpg' },
    { id: 3, image: '/nft3.jpg' },
    { id: 4, image: '/nft4.png' },
    { id: 5, image: '/nft5.png' },
    { id: 6, image: '/nft6.png' }
  ]);

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
      
      {/* Main Content */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed inset-0 bg-white z-50 flex overflow-hidden"
      >
        {/* Left Section with Circles */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-12">
            <div className="flex items-center space-x-8">
              {/* Left Circle with Input */}
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
                  <div className="flex flex-col items-center space-y-4">
                    <input
                      type="text"
                      placeholder="0.0"
                      className="w-28 px-3 py-2 text-center text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                    <span className="text-sm text-gray-500">Available - 2,000</span>
                  </div>
                )}
              </div>

              <button className="w-12 h-12 flex items-center justify-center">
                <span className="text-7xl text-gray-200">+</span>
              </button>

              {/* Right Circle with Input */}
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
                  <div className="flex flex-col items-center space-y-4">
                    <input
                      type="text"
                      placeholder="0.0"
                      className="w-28 px-3 py-2 text-center text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                    <span className="text-sm text-gray-500">Available - 2,000</span>
                  </div>
                )}
              </div>
            </div>

            {/* Relayer Button */}
            <button className="px-6 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Relayer
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 h-full border-l border-gray-200 p-6">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>

          {/* Search and Import Section */}
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

          {/* NFT Images Grid */}
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
      </motion.div>
    </>
  );
}
