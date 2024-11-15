import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col mx-8 my-4">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
