import React from 'react';
import type { TradeStep, TradeOpportunity } from '../types';

interface TradePreviewProps {
    opportunity: TradeOpportunity;
    onExecute: () => void;
    isExecuting: boolean;
    isWalletConnected: boolean;
}

const TradePreview: React.FC<TradePreviewProps> = ({ opportunity, onExecute, isExecuting, isWalletConnected }) => {
    const { steps } = opportunity;
    
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Trade Preview</h2>
            <div className="space-y-4 font-mono text-sm">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-md">
                        <div className="flex-shrink-0 pt-1">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-gray-900 font-bold text-xs">
                                {index + 1}
                            </span>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-300">{step.description}</p>
                            <p className="text-gray-400">
                                Sell ~<span className="text-red-400">{step.fromAmount.toFixed(6)} {step.fromAsset}</span>,
                                Buy ~<span className="text-green-400">{step.toAmount.toFixed(6)} {step.toAsset}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">Expected Result</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                   <div className="bg-gray-700 p-3 rounded-lg">
                       <p className="text-xs text-gray-400">Initial Investment</p>
                       <p className="font-bold text-lg text-white">{opportunity.initialAmount.toFixed(6)} {opportunity.path[0].code}</p>
                   </div>
                   <div className="bg-gray-700 p-3 rounded-lg">
                       <p className="text-xs text-gray-400">Expected Final Amount</p>
                       <p className="font-bold text-lg text-green-400">{opportunity.finalAmount.toFixed(6)} {opportunity.path[0].code}</p>
                   </div>
                </div>
                 <div className="mt-4 bg-green-900/50 text-green-300 p-4 rounded-lg">
                    <p className="font-bold">Expected Profit: {opportunity.profit.toFixed(6)} {opportunity.path[0].code} (+{opportunity.profitPercentage.toFixed(4)}%)</p>
                    <p className="text-xs text-green-400">This is an estimate based on the current order book. Real-world results may vary due to slippage.</p>
                </div>
            </div>
            
            <div className="mt-6">
                <button
                    onClick={onExecute}
                    disabled={isExecuting || !isWalletConnected}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                    {isExecuting ? (
                         <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Executing...
                        </>
                    ) : 'Execute Trade'}
                </button>
                {!isWalletConnected && <p className="text-center text-xs text-yellow-400 mt-2">Please connect your Freighter wallet to execute trades.</p>}
            </div>
        </div>
    );
};

export default TradePreview;