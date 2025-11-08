import type { Asset, TradeOpportunity, Network } from '../types';
import { signTransaction, isConnected } from '@freighter/api';
// Fix: Import required components from the 'stellar-sdk' package. This resolves the 'StellarSdk is not defined' error.
import { Server, Asset as StellarAsset, TransactionBuilder, Operation, Networks } from 'stellar-sdk';

// Define Horizon servers
const HORIZON_MAINNET = 'https://horizon.stellar.org';
const HORIZON_TESTNET = 'https://horizon-testnet.stellar.org';

export const mainnetServer = new Server(HORIZON_MAINNET);
export const testnetServer = new Server(HORIZON_TESTNET);

// A curated list of assets for discovery. Native XLM is a special case.
export const CURATED_ASSETS: Asset[] = [
    { code: 'XLM', issuer: 'native', name: 'Lumen' },
    { code: 'USDC', issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN', name: 'USD Coin' },
    { code: 'yXLM', issuer: 'GARDNV3Q7YGT4AKSDF25LT32YSCCW4EV22Y2TV3I2PU22MRDB28JCVMA', name: 'yXLM' },
    { code: 'BTC', issuer: 'GDPJALI4AZKUU2W426U5WKMAT6CN3AJRPIJMX55S43MXSICNEPXMMAOI', name: 'BTC' },
    { code: 'ETH', issuer: 'GBFX36K6YIPK42N6SBCM3T3D4G2T6N4B2QY4S2Y6M3A24O3S3M27T5F5', name: 'ETH' },
    { code: 'AQUA', issuer: 'GBNZILSTVQZ4R7IKQDPVEYD4BFCTPOZ6EFKZEV3V25BEGPONUO52OJMJ', name: 'Aquarius' },
    { code: 'yUSDC', issuer: 'GBCFCR2RO3SS2SP65Z32MTEBIYJPPYRO324T32YI3G4C22M3Y32K4TND', name: 'yUSDC' },
];

export const getOrderBook = async (selling: Asset, buying: Asset, server: any) => {
    const sellingAsset = selling.issuer === 'native' ? StellarAsset.native() : new StellarAsset(selling.code, selling.issuer);
    const buyingAsset = buying.issuer === 'native' ? StellarAsset.native() : new StellarAsset(buying.code, buying.issuer);
    try {
        const orderbook = await server.orderbook(sellingAsset, buyingAsset).call();
        return orderbook;
    } catch (error) {
        // console.error(`Failed to fetch order book for ${selling.code}-${buying.code}`, error);
        return null;
    }
};

export const executeArbitrageTransaction = async (
    opportunity: TradeOpportunity,
    publicKey: string,
    network: Network
): Promise<string> => {
    if (!(await isConnected())) {
        throw new Error('Freighter wallet is not connected.');
    }

    const server = network === 'mainnet' ? mainnetServer : testnetServer;
    // Fix: Use the imported 'Networks' object directly instead of referencing the non-existent 'StellarSdk' global.
    const networkPassphrase = network === 'mainnet' 
        ? Networks.PUBLIC 
        : Networks.TESTNET;

    const account = await server.loadAccount(publicKey);
    const fee = await server.fetchBaseFee();

    const txBuilder = new TransactionBuilder(account, { fee, networkPassphrase });

    const [assetA, assetB, assetC] = opportunity.path;
    const { steps } = opportunity;

    // Build assets
    const stellarAssetA = assetA.issuer === 'native' ? StellarAsset.native() : new StellarAsset(assetA.code, assetA.issuer);
    const stellarAssetB = new StellarAsset(assetB.code, assetB.issuer);
    const stellarAssetC = new StellarAsset(assetC.code, assetC.issuer);

    // Create a single transaction with 3 path payment operations for atomicity
    txBuilder
        // Step 1: A -> B
        .addOperation(Operation.pathPaymentStrictSend({
            sendAsset: stellarAssetA,
            sendAmount: opportunity.initialAmount.toFixed(7),
            destination: publicKey,
            destAsset: stellarAssetB,
            destMin: (steps[0].toAmount * 0.995).toFixed(7), // 0.5% slippage tolerance
            path: [], // Direct path
        }))
        // Step 2: B -> C
        .addOperation(Operation.pathPaymentStrictSend({
            sendAsset: stellarAssetB,
            sendAmount: steps[0].toAmount.toFixed(7),
            destination: publicKey,
            destAsset: stellarAssetC,
            destMin: (steps[1].toAmount * 0.995).toFixed(7),
            path: [],
        }))
        // Step 3: C -> A
        .addOperation(Operation.pathPaymentStrictSend({
            sendAsset: stellarAssetC,
            sendAmount: steps[1].toAmount.toFixed(7),
            destination: publicKey,
            destAsset: stellarAssetA,
            destMin: (steps[2].toAmount * 0.995).toFixed(7),
            path: [],
        }));

    const transaction = txBuilder.setTimeout(60).build();
    const xdr = transaction.toXDR();

    // Sign with Freighter
    const signedXdr = await signTransaction(xdr, { network: network.toUpperCase() });

    // Submit to the network
    const signedTransaction = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
    const result = await server.submitTransaction(signedTransaction);

    return result.hash;
};