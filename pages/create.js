import { motion } from "framer-motion";
import { Upload, Plus, X } from "lucide-react";
import { useState } from "react";

export default function CreateNFT() {
  const [image, setImage] = useState(null);
  const [properties, setProperties] = useState([{ trait: '', value: '' }]);

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

  const addProperty = () => {
    setProperties([...properties, { trait: '', value: '' }]);
  };

  const removeProperty = (index) => {
    setProperties(properties.filter((_, i) => i !== index));
  };

  const updateProperty = (index, field, value) => {
    const newProperties = [...properties];
    newProperties[index][field] = value;
    setProperties(newProperties);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-2">Create New NFT</h1>
        <p className="text-gray-600 mb-8">Create and mint your unique digital asset</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NFT Image
              </label>
              <div className={`border-2 border-dashed rounded-xl p-4 text-center
                ${image ? 'border-indigo-600' : 'border-gray-300'} 
                hover:border-indigo-600 transition-colors`}
              >
                {image ? (
                  <div className="relative aspect-square">
                    <img
                      src={image}
                      alt="Preview"
                      className="object-cover rounded-lg w-full h-full"
                    />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
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
                  </label>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - NFT Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
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
                Collection
              </label>
              <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="">Select collection</option>
                <option value="abstract">Abstract Dimensions</option>
                <option value="pixel">Pixel Art</option>
                <option value="photography">Photography</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Properties
                </label>
                <button
                  onClick={addProperty}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add property
                </button>
              </div>
              <div className="space-y-3">
                {properties.map((property, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Trait"
                      value={property.trait}
                      onChange={(e) => updateProperty(index, 'trait', e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={property.value}
                      onChange={(e) => updateProperty(index, 'value', e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {index > 0 && (
                      <button
                        onClick={() => removeProperty(index)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <button className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Create NFT
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
