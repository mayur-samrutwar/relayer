import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const App = ({ Component, pageProps }) => (
  <DynamicContextProvider
    settings={{
      environmentId: '67dad32b-4c1c-4ac6-b429-957e30418be8',
      walletConnectors: [EthereumWalletConnectors],
    }}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </DynamicContextProvider>
);

export default App;