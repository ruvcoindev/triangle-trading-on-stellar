import { useState, useCallback } from 'react';
import type { Asset, TradeOpportunity, TradeStep, Network } from '../types';
import { CURATED_ASSETS, getOrderBook, executeArbitrageTransaction, mainnetServer, testnetServer } from '../services/stellarService';
import { Server } from 'stellar-sdk';

const SLIPPAGE_FACTOR = 0.999; // Assume 0.1% cost for fees/slippage in simulation

// Extracted calculation logic to be reusable for both finding and refreshing.
const calculatePathProfit = async (path: [Asset, Asset, Asset], amount: number, server: Server): Promise<TradeOpportunity | null> => {
    const [baseAsset, assetB, assetC] = path;

    const orderBook1 = await getOrderBook(baseAsset, assetB, server);
    if (!orderBook1 || orderBook1.asks.length === 0) return null;
    const price1 = parseFloat(orderBook1.asks[0].price);
    const amountB = (amount / price1);

    const orderBook2 = await getOrderBook(assetB, assetC, server);
    if (!orderBook2 || orderBook2.asks.length === 0) return null;
    const price2 = parseFloat(orderBook2.asks[0].price);
    const amountC = (amountB / price2);

    const orderBook3 = await getOrderBook(assetC, baseAsset, server);
    if (!orderBook3 || orderBook3.bids.length === 0) return null;
    const price3 = parseFloat(orderBook3.bids[0].price);
    const finalAmount = (amountC * price3) * SLIPPAGE_FACTOR;

    if (finalAmount > amount) {
        const profit = finalAmount - amount;
        const profitPercentage = (profit / amount) * 100;

        const steps: TradeStep[] = [
            { description: `Trade ${baseAsset.code} for ${assetB.code}`, fromAsset: baseAsset.code, toAsset: assetB.code, fromAmount: amount, toAmount: amountB },
            { description: `Trade ${assetB.code} for ${assetC.code}`, fromAsset: assetB.code, toAsset: assetC.code, fromAmount: amountB, toAmount: amountC },
            { description: `Trade ${assetC.code} for ${baseAsset.code}`, fromAsset: assetC.code, toAsset: baseAsset.code, fromAmount: amountC, toAmount: finalAmount },
        ];

        return { path, initialAmount: amount, finalAmount, profit, profitPercentage, steps };
    }
    return null;
};


export const useArbitrageFinder = () => {
    const [isFinding, setIsFinding] = useState(false);
    const [findError, setFindError] = useState<string | null>(null);
    
    const [isExecuting, setIsExecuting] = useState(false);
    const [executeError, setExecuteError] = useState<string | null>(null);
    const [executeSuccess, setExecuteSuccess] = useState<string | null>(null);

    const findOpportunities = useCallback(async (baseAsset: Asset, amount: number, network: Network): Promise<TradeOpportunity[]> => {
        setIsFinding(true);
        setFindError(null);
        const profitableOpportunities: TradeOpportunity[] = [];
        const server = network === 'mainnet' ? mainnetServer : testnetServer;

        try {
            const allAssets = CURATED_ASSETS;
            const otherAssets = allAssets.filter(a => a.code !== baseAsset.code);

            const pathPromises = [];

            for (const assetB of otherAssets) {
                for (const assetC of otherAssets) {
                    if (assetB.code === assetC.code) continue;
                    const path: [Asset, Asset, Asset] = [baseAsset, assetB, assetC];
                    pathPromises.push(calculatePathProfit(path, amount, server));
                }
            }

            const results = await Promise.all(pathPromises);
            results.forEach(res => {
                if (res) profitableOpportunities.push(res);
            });

        } catch (e) {
            setFindError('Failed to fetch market data. The Stellar network may be busy. Please try again.');
            console.error(e);
        } finally {
            setIsFinding(false);
        }

        return profitableOpportunities.sort((a, b) => b.profitPercentage - a.profitPercentage);
    }, []);
    
    const refreshOpportunities = useCallback(async (opportunities: TradeOpportunity[], network: Network): Promise<TradeOpportunity[]> => {
        const server = network === 'mainnet' ? mainnetServer : testnetServer;
        
        const refreshPromises = opportunities.map(op => 
            calculatePathProfit(op.path, op.initialAmount, server)
        );

        const results = await Promise.all(refreshPromises);
        return results.filter((op): op is TradeOpportunity => op !== null);
    }, []);

    const executeTrade = useCallback(async (opportunity: TradeOpportunity, publicKey: string, network: Network) => {
        setIsExecuting(true);
        setExecuteError(null);
        setExecuteSuccess(null);
        try {
            const txHash = await executeArbitrageTransaction(opportunity, publicKey, network);
            const explorerUrl = `https://stellar.expert/explorer/${network}/tx/${txHash}`;
            setExecuteSuccess(`Transaction submitted successfully! View on explorer: ${explorerUrl}`);
        } catch (e: any) {
            console.error(e);
            const errorMessage = e.response?.data?.extras?.result_codes?.operations?.join(', ') || e.message || 'An unknown error occurred.';
            setExecuteError(`Trade failed: ${errorMessage}`);
        } finally {
            setIsExecuting(false);
        }
    }, []);

    return { findOpportunities, refreshOpportunities, executeTrade, isFinding, isExecuting, findError, executeError, executeSuccess };
};