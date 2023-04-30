import React from 'react';
import Link from 'next/link';

const modes = [
    { name: 'Presentation Mode', url: '/modes/presentation' },
    { name: 'Pitch an Idea Mode', url: '/modes/pitch-an-idea' },
    { name: 'Speak for 2 Min Mode', url: '/modes/speak-for-2-min' },
    // Add more modes here
  ];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Modes</h3>
            <ul>
            {modes.map((mode, index) => (
                <li key={index}>
                  <Link href={mode.url}
                    >{mode.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Community</h3>
            <ul>
              <li>
                <Link href="/community/chat">
                  Community Chat
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Support</h3>
            <ul>
              <li>
                <Link href="/support/faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support/contact">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Social</h3>
            <ul>
              <li>
                <Link href="https://www.facebook.com" target="_blank" rel="noreferrer">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="https://www.twitter.com" target="_blank" rel="noreferrer">
                  Twitter
                </Link>
              </li>
              {/* Add more social links here */}
            </ul>
          </div>
        </div>
        <hr className="my-6" />
        <div className="flex justify-between">
          <p>&copy; {(new Date()).getFullYear()} Be a Professional English Speaker and Writer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
