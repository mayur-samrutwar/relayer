import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import Image from 'next/image';
import logo from '../public/logo.png';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-4 sm:px-6 w-full border-b pb-4 border-gray-200">
      <div className="relative h-10 w-40">
        <Image
          src={logo}
          alt="Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <DynamicWidget />
    </nav>
  );
}