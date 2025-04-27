import { useState } from 'react';
import { BsDot } from 'react-icons/bs';

const SubscriptionPlans = () => {
  const [billingCycle, setBillingCycle] = useState<
    'Monthly' | 'Quarterly' | 'Annually'
  >('Monthly');

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
    <div className="bg-[#F5F5F5] min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold text-gray-800 mb-2">
            Subscription Plans
          </h1>
          <p className="text-sm sm:text-base text-gray-700">
            Choose from flexible subscription plans to suit your needs.
          </p>
        </div>

        <div className="flex justify-center bg-white rounded-full mb-8 sm:mb-12 border border-[#DEE0E3] max-w-md mx-auto">
          {(['Monthly', 'Quarterly', 'Annually'] as const).map((cycle) => (
            <button
              key={cycle}
              className={`px-4 sm:px-6 py-2 text-sm sm:text-base transition-colors ${
                billingCycle === cycle
                  ? 'bg-green-800 text-white rounded-full'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setBillingCycle(cycle)}
            >
              {cycle}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 sm:p-8 flex flex-col"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-green-800 mb-1">
                  {plan.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-700">{plan.tagline}</p>
              </div>

              <div className="mb-6 sm:mb-8 text-center">
                <h3 className="text-2xl sm:text-3xl font-semibold text-gray-700">
                  {plan.price}
                </h3>
                {plan.isBestDeal && (
                  <span className="inline-block text-xs bg-[#EFAE734D] px-3 py-1 rounded-full text-[#24292E] mt-2">
                    Best deal
                  </span>
                )}
              </div>

              <button className="bg-[#A5EA91] hover:bg-green-500 text-[#24292E] font-semibold py-2.5 px-6 rounded-full mb-6 sm:mb-8 w-full transition-colors">
                Select
              </button>

              <ul className="space-y-3 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <BsDot className="h-5 w-5 text-gray-700 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
