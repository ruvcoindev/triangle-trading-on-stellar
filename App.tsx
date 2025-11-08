import React, { useState, useCallback, useEffect } from 'react';
import type { TradeOpportunity, TradeStep, Network } from './types';
import { useArbitrageFinder } from './hooks/useArbitrageFinder';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import OpportunityCard from './components/OpportunityCard';
import TradePreview from './components/TradePreview';
import { CURATED_ASSETS } from './services/stellarService';
import { isConnected, getPublicKey } from '@freighter/api';

const REFRESH_INTERVAL = 15000; // 15 seconds

const App: React.FC = () => {
    const [opportunities, setOpportunities] = useState<TradeOpportunity[]>([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState<TradeOpportunity | null>(null);
    const [network, setNetwork] = useState<Network>('testnet');
    
    // Wallet State
    const [publicKey, setPublicKey] = useState<string>('');
    const [walletConnected, setWalletConnected] = useState<boolean>(false);

    const { 
        findOpportunities, 
        executeTrade, 
        refreshOpportunities,
        isFinding, 
        isExecuting,
        findError,
        executeError,
        executeSuccess
    } = useArbitrageFinder();

    const checkWalletConnection = useCallback(async () => {
        const connected = await isConnected();
        if (connected) {
            const key = await getPublicKey();
            setPublicKey(key);
            setWalletConnected(true);
        } else {
            setPublicKey('');
            setWalletConnected(false);
        }
    }, []);

    useEffect(() => {
        checkWalletConnection();
    }, [checkWalletConnection]);

    // Effect for periodic data refresh
    useEffect(() => {
        if (isFinding || opportunities.length === 0) {
            return;
        }

        const intervalId = setInterval(async () => {
            const refreshedOps = await refreshOpportunities(opportunities, network);
            // Sort and update state, preserving the selected opportunity if it still exists
            const sortedRefreshedOps = refreshedOps.sort((a, b) => b.profitPercentage - a.profitPercentage);
            setOpportunities(sortedRefreshedOps);
            if(selectedOpportunity) {
                const updatedSelected = sortedRefreshedOps.find(op => 
                    op.path.map(p => p.code).join(',') === selectedOpportunity.path.map(p => p.code).join(',')
                );
                if (updatedSelected) {
                    setSelectedOpportunity(updatedSelected);
                } else {
                    setSelectedOpportunity(null); // It's no longer profitable/valid
                }
            }
        }, REFRESH_INTERVAL);

        return () => clearInterval(intervalId);
    }, [isFinding, opportunities, network, refreshOpportunities, selectedOpportunity]);


    const handleFindOpportunities = useCallback(async (baseAssetCode: string, amount: number) => {
        setOpportunities([]);
        setSelectedOpportunity(null);
        const baseAsset = CURATED_ASSETS.find(a => a.code === baseAssetCode);
        if (baseAsset && amount > 0) {
            const found = await findOpportunities(baseAsset, amount, network);
            setOpportunities(found);
        }
    }, [findOpportunities, network]);

    const handleSelectOpportunity = useCallback((opportunity: TradeOpportunity) => {
        setSelectedOpportunity(opportunity);
    }, []);
    
    const handleExecuteTrade = useCallback(async () => {
        if (!selectedOpportunity || !publicKey) {
            alert("No opportunity selected or wallet not connected.");
            return;
        }
        
        const confirmed = window.confirm(
`Please confirm this trade in your wallet:
Path: ${selectedOpportunity.path.map(p => p.code).join(' → ')} → ${selectedOpportunity.path[0].code}
Initial: ${selectedOpportunity.initialAmount} ${selectedOpportunity.path[0].code}
Expected Profit: ~${selectedOpportunity.profit.toFixed(6)} ${selectedOpportunity.path[0].code}

This is a real transaction on the Stellar ${network}. Proceed?`
        );

        if (confirmed) {
            await executeTrade(selectedOpportunity, publicKey, network);
        }
    }, [selectedOpportunity, publicKey, network, executeTrade]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Header onConnect={checkWalletConnection} publicKey={publicKey} />
            <main className="container mx-auto p-4 md:p-8">
                 {executeSuccess && <div className="mb-4 text-green-300 bg-green-900/50 p-3 rounded-lg"><strong>Success!</strong> {executeSuccess}</div>}
                 {executeError && <div className="mb-4 text-red-400 bg-red-900/50 p-3 rounded-lg"><strong>Execution Error:</strong> {executeError}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <ControlPanel onFind={handleFindOpportunities} isLoading={isFinding} network={network} setNetwork={setNetwork} />
                        {findError && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{findError}</div>}
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Trading Opportunities</h2>
                            {isFinding ? (
                                <div className="flex justify-center items-center h-48 bg-gray-800 rounded-lg">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                                </div>
                            ) : opportunities.length > 0 ? (
                                <div className="space-y-4">
                                    {opportunities.map((op, index) => (
                                        <OpportunityCard 
                                            key={index} 
                                            opportunity={op} 
                                            onSelect={handleSelectOpportunity}
                                            isSelected={selectedOpportunity?.path.map(p => p.code).join('') === op.path.map(p => p.code).join('')}
                                            isWalletConnected={walletConnected}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 px-6 bg-gray-800 rounded-lg">
                                    <p className="text-gray-400">No profitable opportunities found. Adjust parameters and try again.</p>
                                </div>
                            )}
                        </div>
                        {selectedOpportunity && (
                            <TradePreview 
                                opportunity={selectedOpportunity}
                                onExecute={handleExecuteTrade}
                                isExecuting={isExecuting}
                                isWalletConnected={walletConnected}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;