import Link from 'next/link';
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat min-h-screen text-white flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url('/images/heroimage.png')`,
      }}
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Be a Professional{' '}
        <span
          className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
        >
          English Speaker
        </span>{' '}
        and{' '}
        <span
          className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
        >
          Writer
        </span>
      </h1>
      <p className="text-xl md:text-2xl mb-6">
        Master the art of communication with our unique and engaging modes
      </p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <Link href="/modes">
        Get Started
        </Link>
      </button>
    </div>
  );
};

export default HeroSection;
