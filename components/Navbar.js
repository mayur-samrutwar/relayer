import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import Image from 'next/image';
import logo from '../public/logo.png';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-4 sm:px-6 w-full border-b pb-4 border-gray-200">
      <div className="relative h-10 w-40">
        <Link href="/">
        <Image
          src={logo}
          alt="Logo"
          fill
          className="object-contain"
          priority
        />
        </Link>
      </div>
      <div className="flex-grow text-center">
        <Link href="/market" className="text-lg text-gray-700 hover:text-gray-900">
          Marketplace
        </Link>
      </div>
      <DynamicWidget />
    </nav>
  );
}