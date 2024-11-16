import "@/styles/globals.css";
import Layout from "@/components/Layout";
import ContextProvider from '@/context';

const App = ({ Component, pageProps: { ...pageProps } }) => (

  <ContextProvider>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </ContextProvider>
);

export default App;