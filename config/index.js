// config/index.js

import { cookieStorage, createStorage, http } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { baseSepolia, polygonAmoy, defineChain, celoAlfajores, flowTestnet, bitkubTestnet, kinto } from '@reown/appkit/networks';

// Get projectId from https://cloud.reown.com
export const projectId = 'c13f4ce46cefc0c967f0c802c28b3eb9';
console.log(projectId)

// if (!projectId) {
//   throw new Error('Project ID is not defined');
// }

  const openCampusCodex = defineChain({
    id: 656476,
    name: 'Open Campus Codex',
    nativeCurrency: {
      decimals: 18,
      name: 'EDU',
      symbol: 'EDU',
    },
    rpcUrls: {
        default: {
          http: ['https://open-campus-codex-sepolia.drpc.org'],
        },
        public: {
          http: ['https://open-campus-codex-sepolia.drpc.org'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Open Campus Codex Explorer',
          url: 'https://opencampus-codex.blockscout.com',
        },
      },
      testnet: true
  })

export const networks = [ baseSepolia, celoAlfajores, flowTestnet, polygonAmoy, bitkubTestnet, kinto];


// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
});

export const config = wagmiAdapter.wagmiConfig;