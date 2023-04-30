import React from "react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex items-center justify-center">
        <div className="absolute left-6">
          <div className="text-left">
            <Link href="/" className="text-xl font-bold text-gray-800">
              <Image src="/images/logo.png" alt="Logo" width={80} height={20} />
            </Link>
          </div>
        </div>
        <div className="text-center  text-sm space-x-8">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          <Link href="/modes" className="text-gray-600 hover:text-gray-800">
            Modes
          </Link>
          <Link href="/community" className="text-gray-600 hover:text-gray-800">
            Community
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
