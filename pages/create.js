import { motion } from "framer-motion";
import { Upload, Plus, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { SignProtocolClient, SpMode, OffChainSignType } from "@ethsign/sp-sdk";

export default function CreateNFT() {
  const router = useRouter();
  const { image: initialImage } = router.query;
  const [image, setImage] = useState(initialImage || null);
  const [price, setPrice] = useState("");
  const [hasAttestation, setHasAttestation] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={generateAttestation}
        className="mb-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
      >
        Test Attestation
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-2">Create New NFT</h1>
        <p className="text-gray-600 mb-8">Create and mint your unique digital asset</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Image Upload/Display */}
          <motion.div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
          <motion.div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter NFT name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div className="mt-12 space-y-4">
          {isFromRelayer && !hasAttestation && (
            <button 
              onClick={generateAttestation}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Generate Attestation
            </button>
          )}
          
          <button 
            className={`w-full bg-black text-white py-4 rounded-lg font-medium transition-colors
              ${isFromRelayer && !hasAttestation 
                ? 'opacity-50 cursor-not-allowed hover:bg-black' 
                : 'hover:bg-gray-800'}`}
            disabled={isFromRelayer && !hasAttestation}
          >
            Create NFT
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
