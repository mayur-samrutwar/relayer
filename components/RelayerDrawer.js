import { X, Loader2 } from "lucide-react";
import { motion, useDragControls, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useReadContract } from 'wagmi';
import relayerABI from '../contract/abi/relayer.json';

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
    const router = useRouter();
  const [leftCircleImage, setLeftCircleImage] = useState(
    initialImage ? { 
      id: 'initial', 
      image: initialImage,
      maxTokens: "1000"
    } : null
  );
  const [rightCircleImage, setRightCircleImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableImages, setAvailableImages] = useState([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(true);
  const [isRelayerMode, setIsRelayerMode] = useState(true);
  const [mintPrice, setMintPrice] = useState("");
  const [shouldReset, setShouldReset] = useState(false);
  const [tokenAvailability, setTokenAvailability] = useState({});

  // Get all NFTs from contract
  const { data: contractNfts } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BASE,
    abi: relayerABI,
    functionName: 'getAllNFTs',
    watch: true,
  });

  useEffect(() => {
    async function fetchNFTsMetadata() {
      if (!contractNfts) return;

      try {
        setIsLoadingNFTs(true);
        const [tokenIds, owners, tokenData] = contractNfts;
        
        // Create availability mapping with just max tokens
        const availability = {};
        tokenData.forEach((data, index) => {
          availability[tokenIds[index].toString()] = {
            max: data.maxTokens?.toString() || "1000" // Default to 1000 if not specified
          };
        });
        setTokenAvailability(availability);

        // Fetch metadata for each NFT
        const nftPromises = tokenIds.map(async (tokenId, index) => {
          const metadataId = tokenData[index].attestationId;
          const response = await fetch(`/api/get-metadata?metadataId=${metadataId}`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch metadata for token ${tokenId}`);
          }
          
          const metadata = await response.json();
          
          return {
            id: tokenId.toString(),
            image: metadata.image,
          };
        });

        const nfts = await Promise.all(nftPromises);
        setAvailableImages(nfts);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setIsLoadingNFTs(false);
      }
    }

    fetchNFTsMetadata();
  }, [contractNfts]);

  useEffect(() => {
    if (initialImage) {
      setTokenAvailability(prev => ({
        ...prev,
        initial: { max: "1000" }
      }));
    }
  }, [initialImage]);

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
    setShouldReset(false);
    if (!leftCircleImage || !rightCircleImage) {
      alert('Please select both images first');
      return;
    }

    setIsRelayerMode(false);
    setIsLoading(true);
    
    try {
      // Get base64 data for both images
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.url);
    } catch (error) {
      console.error('Error generating image:', error);
      alert(error.message || 'Failed to generate image. Please try again with supported image formats (PNG, JPEG, GIF, or WEBP).');
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
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Add logging to debug the blob type
      console.log('Blob type:', blob.type);

      // Expand supported types to include more variations
      const supportedTypes = [
        'image/png', 
        'image/jpeg', 
        'image/jpg',
        'image/gif', 
        'image/webp',
        'application/octet-stream' // Some images might come through as binary data
      ];

      // If blob type is empty or not recognized, try to infer from URL
      let effectiveType = blob.type;
      if (!effectiveType || !supportedTypes.includes(effectiveType)) {
        const extension = url.split('.').pop()?.toLowerCase();
        switch (extension) {
          case 'png':
            effectiveType = 'image/png';
            break;
          case 'jpg':
          case 'jpeg':
            effectiveType = 'image/jpeg';
            break;
          case 'gif':
            effectiveType = 'image/gif';
            break;
          case 'webp':
            effectiveType = 'image/webp';
            break;
        }
      }

      if (!supportedTypes.includes(effectiveType)) {
        console.error('Unsupported image type:', effectiveType, 'URL:', url);
        throw new Error('Unsupported image format. Please use PNG, JPEG, GIF, or WEBP.');
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            const base64String = reader.result.toString();
            const formattedBase64 = base64String.split(',')[1];
            if (!formattedBase64) {
              throw new Error('Failed to process image data');
            }
            resolve(formattedBase64);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image. Please try again with a supported format.');
    }
  };

  const handleTryAgain = () => {
    setShouldReset(true);
    setGeneratedImage(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setGeneratedImage(null);
      setIsLoading(false);
      setShouldReset(true);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        variants={overlayVariants}
        initial="closed"
        animate="open"
        exit="closed"
        onClick={handleClose}
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
          onClick={handleClose}
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
                    <div className="flex flex-col items-center space-y-2">
                      {leftCircleImage && (
                        <input
                          type="text"
                          placeholder="10"
                          className="w-28 px-3 py-2 text-center text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />
                      )}
                      {leftCircleImage && tokenAvailability[leftCircleImage.id] && (
                        <p className="text-sm text-gray-500">
                          Max {tokenAvailability[leftCircleImage.id].max} shares
                        </p>
                      )}
                    </div>
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
                    <div className="flex flex-col items-center space-y-2">
                      {rightCircleImage && (
                        <input
                          type="text"
                          placeholder="20"
                          className="w-28 px-3 py-2 text-center text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />
                      )}
                      {rightCircleImage && tokenAvailability[rightCircleImage.id] && (
                        <p className="text-sm text-gray-500">
                          Max {tokenAvailability[rightCircleImage.id].max} shares
                        </p>
                      )}
                    </div>
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
                      <button
                        onClick={handleTryAgain}
                        className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Try Again
                      </button>
                      
                      <button
                        onClick={() => {
                          router.push({
                            pathname: '/create',
                            query: { image: generatedImage }
                          });
                        }}
                        className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
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
          <div className="w-96 h-full border-l border-gray-200 p-6 flex flex-col overflow-visible">
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

            <div className="mt-8 overflow-y-auto flex-1 overflow-x-visible">
              {isLoadingNFTs ? (
                <div className="grid grid-cols-2 gap-4 auto-rows-max">
                  {[...Array(6)].map((_, index) => (
                    <div 
                      key={index}
                      className="aspect-square rounded-lg bg-gray-200 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 auto-rows-max">
                  {availableImages.map((nft) => (
                    <motion.div
                      key={nft.id}
                      drag
                      dragMomentum={false}
                      whileHover={{ scale: 1.05 }}
                      whileDrag={{ 
                        scale: 1.1, 
                        zIndex: 999
                      }}
                      onDragEnd={(_, info) => handleDragEnd(_, info, nft)}
                      className="relative w-full aspect-square rounded-lg overflow-hidden cursor-move touch-none"
                      style={{ touchAction: "none" }}
                    >
                      <img
                        src={nft.image}
                        alt={`NFT ${nft.id}`}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
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
