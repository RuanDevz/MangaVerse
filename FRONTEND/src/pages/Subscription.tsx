import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Shield, Zap } from 'lucide-react';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: '$4.99',
    icon: Zap,
    features: [
      'Ad-free reading experience',
      'Access to all manga',
      'HD quality images',
      'Early access to new chapters',
      'Exclusive NSFW content',
      'Download chapters for offline reading',
    ],
    popular: false,
  },
  {
    id: 'annual',
    name: 'Annual Plan',
    price: '$49.99',
    icon: Shield,
    features: [
      'All Monthly Plan features',
      'Save 17% compared to monthly',
      'Exclusive manga content',
      'Priority customer support',
      'Ad-free reading on mobile',
      'Custom reading themes',
    ],
    popular: true,
  },
];

export function Subscription() {
  const { user, updateSubscription } = useAuthStore();

  const handleSubscribe = async (type: 'monthly' | 'annual') => {
    try {
      await updateSubscription(type);
      alert('Subscription updated successfully!');
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Premium Plan
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Unlock exclusive content, remove ads, and enjoy early access to new releases with our premium plans.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ${
              plan.popular ? 'ring-2 ring-indigo-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-indigo-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                Most Popular
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">{plan.name}</h2>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-indigo-600">{plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      {plan.id === 'monthly' ? '/month' : '/year'}
                    </span>
                  </div>
                </div>
                <plan.icon className="w-12 h-12 text-indigo-600" />
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id as 'monthly' | 'annual')}
                className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors ${
                  user?.subscription?.type === plan.id
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {user?.subscription?.type === plan.id ? 'Current Plan' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}