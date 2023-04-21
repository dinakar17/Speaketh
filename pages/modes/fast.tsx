import dynamic from 'next/dynamic';

const PresentationMode = dynamic(() => import('../../components/PresentationMode'), { ssr: false });

const Fast = () => {
    return <PresentationMode/>
};

export default Fast;