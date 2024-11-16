import Link from 'next/link';

export default function NftCard({ 
  id,
  image = '/nft.jpg',
  creatorAvatar = 'https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg',
  creatorName = 'mayur',
  price = '0.5 ETH',
  remaining = '900/1000'
}) {
  return (
    <Link href={`/nfts/${id}`}>
      <div className="w-[300px] bg-white rounded-xl p-4 shadow hover:shadow-lg transition-shadow duration-200">
        {/* NFT Image */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
          <img
            src={image}
            alt="NFT"
            fill
            className="object-cover"
          />
        </div>

        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-7 h-7 rounded-full overflow-hidden">
            <img
              src={creatorAvatar}
              alt={creatorName}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-base font-medium text-gray-700">{creatorName}</span>
          <img 
            width="18" height="18" 
            className="ml-auto"
            src="https://img.icons8.com/material/48/verified-account--v1.png" 
            alt="verified-account--v1"
          />
        </div>

        {/* Price and Details */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="font-semibold">{price}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Remaining</p>
            <p className="font-semibold">{remaining}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
