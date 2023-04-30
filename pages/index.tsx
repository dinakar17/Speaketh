import HeroSection from '@/components/HomePage/HeroSection '
import HowItWorks from '@/components/HomePage/HowItWorks ';
import { useEffect } from 'react';


export default function Home() {
  useEffect(() => {
    // Add the 'homePage' class to the html element
    document.documentElement.classList.add('homePage');

    return () => {
      // Remove the 'homePage' class when the component is unmounted
      document.documentElement.classList.remove('homePage');
    };
  }, []);
  return (
    <main className="">
      <HeroSection/>
      <HowItWorks/>
    </main>
  )
}
