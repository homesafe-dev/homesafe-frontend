import { useState } from 'react';
import { BsDot } from "react-icons/bs";

const SubscriptionPlans = () => {
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Quarterly' | 'Annually'>('Monthly');

  const plans = [
    {
      name: 'Ruby',
      tagline: 'Top-notch services.',
      price: '₦ 25,000',
      features: [
        'Free offer with access to services',
        'Free offer with access to services',
        'Free offer with access to services',
        'Free offer with access to services',
        'Free offer with access to services',
      ],
      isBestDeal: false,
    },
    {
      name: 'Gold',
      tagline: 'Top-notch services.',
      price: '₦ 25,000',
      features: [
        'Free offer with access to services',
        'Free offer with access to services',
        'Free offer with access to services',
        'Free offer with access to services',
        'Free offer with access to services',
        'Free offer with access to services',
      ],
      isBestDeal: true,
    },
    {
      name: 'Premium',
      tagline: 'Top-notch services.',
      price: '₦ 25,000',
      features: [
        'Free offer with access to services',
        'Free offer with access to services',
        'Free offer with access to services',
        'Free offer with access to services',
        'Free offer with access to services',
        'Free offer with access to services',
      ],
      isBestDeal: false,
    },
  ];

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col items-center p-6">
      {/* Header */}
      {/* <div className="w-full max-w-6xl mb-8">
        <button className="flex items-center text-gray-700">
          <IoArrowBack className="mr-2" />
        </button>
      </div> */}

      <div className="w-full max-w-6xl text-center mb-2 mt-[2rem]">
        <h1 className="text-[32px] font-semibold text-gray-800">Subscription Plans</h1>
        <p className="text-gray-700 text-sm mt-1">Choose from flexible subscription plans to suit your needs.</p>
      </div>

      <div className="flex bg-white rounded-full mb-12 border border-[#DEE0E3]">
        {(['Monthly', 'Quarterly', 'Annually'] as const).map((cycle) => (
          <button
            key={cycle}
            className={`px-6 py-2 text-sm ${
              billingCycle === cycle
                ? 'bg-green-800 text-white rounded-full'
                : 'text-gray-700'
            }`}
            onClick={() => setBillingCycle(cycle)}
          >
            {cycle}
          </button>
        ))}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white rounded-lg shadow-md flex flex-col items-center p-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-[20px] font-semibold text-green-800">{plan.name}</h2>
              <p className="text-sm text-gray-700">{plan.tagline}</p>
            </div>

            <div className="mb-8 text-center">
              <h3 className="text-3xl font-semibold text-gray-700">{plan.price}</h3>
              {plan.isBestDeal && (
                <span className="text-xs bg-[#EFAE734D] w-[68px] h-[27px] flex justify-center items-center rounded-full text-[#24292E] mt-1 mx-auto">
                  Best deal
                </span>
              )}
            </div>

            <button className="bg-[#A5EA91] hover:bg-green-300 text-[#24292E] font-semibold py-2 px-10 rounded-full mb-8 w-full">
              Select
            </button>

            <ul className="space-y-3 w-full">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <BsDot className="h-5 w-5 text-gray-700 mr-2 flex-shrink-0 mt-0.5" />
                  <span className='text-[16px]'>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SubscriptionPlans;