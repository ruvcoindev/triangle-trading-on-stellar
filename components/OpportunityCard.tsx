import React, { useState, useEffect, useRef } from 'react';
import type { TradeOpportunity } from '../types';

interface OpportunityCardProps {
    opportunity: TradeOpportunity;
    onSelect: (opportunity: TradeOpportunity) => void;
    isSelected: boolean;
    isWalletConnected: boolean;
}

const ArrowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

const AssetPill: React.FC<{ code: string }> = ({ code }) => (
    <span className="bg-gray-700 text-cyan-300 px-3 py-1 rounded-full font-mono text-sm font-semibold">{code}</span>
);

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onSelect, isSelected, isWalletConnected }) => {
    const { path, profit, profitPercentage } = opportunity;
    const [flash, setFlash] = useState(false);
    const prevProfitRef = useRef<number>();

    useEffect(() => {
        if (prevProfitRef.current !== undefined && prevProfitRef.current !== profitPercentage) {
            setFlash(true);
            const timer = setTimeout(() => setFlash(false), 800); // Animation duration
            return () => clearTimeout(timer);
        }
        prevProfitRef.current = profitPercentage;
    }, [profitPercentage]);
    
    return (
        <div className={`bg-gray-800 rounded-lg shadow-lg border ${isSelected ? 'border-cyan-500 ring-2 ring-cyan-500/50' : 'border-gray-700'} overflow-hidden transition-all duration-300`}>
            <div className="p-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Arbitrage Path</h3>
                        <div className="flex items-center space-x-2 flex-wrap">
                            <AssetPill code={path[0].code} />
                            <ArrowIcon />
                            <AssetPill code={path[1].code} />
                            <ArrowIcon />
                            <AssetPill code={path[2].code} />
                            <ArrowIcon />
                            <AssetPill code={path[0].code} />
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-left md:text-right">
                         <div className={`text-2xl font-bold text-green-400 transition-colors duration-200 ${flash ? 'flash-update' : ''}`}>
                           +{profitPercentage.toFixed(4)}%
                        </div>
                        <div className="text-sm text-gray-400">
                           Profit: {profit.toFixed(6)} {path[0].code}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 px-5 py-3">
                 <button 
                    onClick={() => onSelect(opportunity)}
                    disabled={!isWalletConnected}
                    className={`w-full md:w-auto text-sm font-semibold py-2 px-4 rounded-md transition-colors duration-200 ${
                        isSelected 
                            ? 'bg-cyan-700 text-white cursor-default' 
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                        } disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400`}
                    title={!isWalletConnected ? 'Connect your wallet to execute trades' : ''}
                >
                    {isSelected ? 'Viewing Preview' : 'Preview & Execute'}
                </button>
            </div>
        </div>
    );
};

export default OpportunityCard;