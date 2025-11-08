import React, { useState } from 'react';
import { CURATED_ASSETS } from '../services/stellarService';
import { Network } from '../types';

interface ControlPanelProps {
    onFind: (baseAssetCode: string, amount: number) => void;
    isLoading: boolean;
    network: Network;
    setNetwork: (network: Network) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onFind, isLoading, network, setNetwork }) => {
    const [baseAssetCode, setBaseAssetCode] = useState<string>('XLM');
    const [amount, setAmount] = useState<string>('100');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFind(baseAssetCode, parseFloat(amount));
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-cyan-400">Trade Configuration</h2>
            
            <div className="mb-6 bg-gray-900/50 p-3 rounded-lg border border-gray-600">
                 <label className="block text-sm font-medium text-gray-300 mb-2">Network</label>
                 <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
                    <button 
                        onClick={() => setNetwork('testnet')}
                        className={`w-1/2 rounded-md py-2 text-sm font-semibold transition-colors ${network === 'testnet' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                    >Testnet</button>
                    <button 
                        onClick={() => setNetwork('mainnet')}
                        className={`w-1/2 rounded-md py-2 text-sm font-semibold transition-colors ${network === 'mainnet' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                    >Mainnet</button>
                 </div>
            </div>

            {network === 'mainnet' && (
                <div className="mb-6 p-3 rounded-lg bg-red-900/50 text-red-300 border border-red-700 text-sm">
                    <strong>Warning:</strong> You are on the Mainnet. All transactions are real and involve real assets. Proceed with caution.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="baseAsset" className="block text-sm font-medium text-gray-300 mb-2">
                        Starting Asset
                    </label>
                    <select
                        id="baseAsset"
                        value={baseAssetCode}
                        onChange={(e) => setBaseAssetCode(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    >
                        {CURATED_ASSETS.map(asset => (
                            <option key={asset.code} value={asset.code}>{asset.name} ({asset.code})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                        Investment Amount
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0"
                        step="any"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                        placeholder="e.g., 100"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !amount || parseFloat(amount) <= 0}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Scanning Markets...
                        </>
                    ) : (
                        'Find Opportunities'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ControlPanel;