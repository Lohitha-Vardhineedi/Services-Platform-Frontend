import React from 'react';

interface TransactionTab {
  id: string;
  name: string;
  color: string;
  bgColor: string;
}

interface TransactionSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setCurrentStep: (step: string) => void;
  transactionTabs: TransactionTab[];
}

const TransactionSidebar: React.FC<TransactionSidebarProps> = ({
  activeTab,
  setActiveTab,
  setCurrentStep,
  transactionTabs,
}) => {
  return (
    <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <nav className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Transaction Status</h3>
        {transactionTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentStep('bookings');
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors hover:bg-gray-50 ${
              activeTab === tab.id ? `${tab.bgColor} border-l-4 border-current` : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  tab.id === 'upcoming'
                    ? 'bg-purple-500'
                    : tab.id === 'completed'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              ></div>
              <span
                className={`font-medium ${
                  activeTab === tab.id ? tab.color : 'text-gray-700'
                }`}
              >
                {tab.name}
              </span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TransactionSidebar;