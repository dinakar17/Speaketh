import React from 'react';

const HowItWorks = () => {
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
            How It Works
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-5xl font-bold">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

const steps = [
    {
      title: 'Choose a Mode',
      description: 'Select the mode that suits your learning needs and objectives.',
    },
    {
      title: 'Practice',
      description: 'Start practicing your English speaking and writing skills using our AI-powered platform.',
    },
    {
      title: 'Get Feedback',
      description: 'Receive personalized feedback from our AI to help you improve and refine your English skills.',
    },
    {
      title: 'Share and Grow Together',
      description: 'Engage in the community page, exchange resources, and learn from peers to boost your English skills.',
    },
  ];
  