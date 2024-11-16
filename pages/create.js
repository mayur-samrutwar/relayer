import { motion } from "framer-motion";
import { Upload, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SignProtocolClient, SpMode, OffChainSignType } from "@ethsign/sp-sdk";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import relayerABI from '../contract/abi/relayer.json';
import TransactionDialog from '../components/TransactionDialog';

export default function CreateNFT() {
  const router = useRouter();
  const { image: initialImage } = router.query;
  const [image, setImage] = useState(initialImage || null);
  const [price, setPrice] = useState("");
  const [hasAttestation, setHasAttestation] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uri, setUri] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BASE;
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  const { address } = useAccount();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAttestation = async () => {
    try {
      const client = new SignProtocolClient(SpMode.OffChain, {
        signType: OffChainSignType.EvmEip712
      });

      const id = await client.createAttestation({
        schemaId: 'SPS_wonUJkm4O1OqeLATm28Lx',
        data: { parents: ['parent1', 'parent2'] },
        indexingValue: "4"
      });

      console.log('Attestation ID:', id.attestationId);
      setHasAttestation(true);
    } catch (error) {
      console.error('Error creating attestation:', error);
    }
  };

  const isFromRelayer = Boolean(initialImage);

  const handleCreateNFT = async () => {
    if (!image || !price || !name) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const metadataResponse = await fetch('/api/save-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          image: "https://img.freepik.com/free-photo/chinese-new-year-celebration-with-rabbit_23-2149895561.jpg",
          creator: address || "0x0000000000000000000000000000000000000000"
        }),
      });

      if (!metadataResponse.ok) {
        throw new Error('Failed to save metadata');
      }

      const { id } = await metadataResponse.json();
      const attestationId = "placeholder-attestation-id";
      const priceInEth = parseFloat(price);

      console.log("Minting started with tokenUri:", id);
      
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BASE,
        abi: relayerABI,
        functionName: 'mintNFT',
        args: [id, attestationId, priceInEth]
      });

    } catch (error) {
      console.error('Error creating NFT:', error);
      alert('Failed to create NFT. Please try again.');
    }
  };

  // Watch for transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      setShowSuccessDialog(true);
    }
  }, [isConfirmed, hash]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold mb-3">Create New NFT</h1>
        <p className="text-xl text-gray-600 mb-12">Create and mint your unique digital asset</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left Column - Image Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                NFT Image
              </label>
              {image ? (
                <div className="relative aspect-square">
                  <img
                    src={image}
                    alt="NFT Preview"
                    className="object-cover rounded-lg w-full h-full"
                  />
                  {!isFromRelayer && (
                    <button
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-xl p-4 text-center border-gray-300 hover:border-indigo-600 transition-colors">
                    <div className="flex flex-col items-center justify-center py-8">
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600">
                        Drop your image here, or{" "}
                        <span className="text-indigo-600">browse</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Supports JPG, PNG and GIF. Max 10MB.
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </div>
                </label>
              )}
            </div>
          </motion.div>

          {/* Right Column - NFT Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter NFT name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="4"
                    placeholder="Describe your NFT"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (ETH)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price in ETH"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {isFromRelayer && !hasAttestation && (
                <button 
                  onClick={generateAttestation}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  Generate Attestation
                </button>
              )}
              
              <button 
                onClick={handleCreateNFT}
                disabled={isFromRelayer && !hasAttestation || isConfirming}
                className={`w-full bg-black text-white py-4 rounded-xl font-medium transition-colors
                  ${(isFromRelayer && !hasAttestation) || isConfirming
                    ? 'opacity-50 cursor-not-allowed hover:bg-black' 
                    : 'hover:bg-gray-800'}`}
              >
                {isConfirming ? 'Creating NFT...' : 'Create NFT'}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <TransactionDialog 
        isOpen={showSuccessDialog} 
        hash={hash}
        onClose={() => setShowSuccessDialog(false)}
      />
    </div>
  );
}
