export interface Asset {
    code: string;
    issuer: string;
    name: string;
}

export interface OrderBook {
    bids: { price: string; amount: string }[];
    asks: { price: string; amount: string }[];
}

export interface TradeStep {
    description: string;
    fromAmount: number;
    fromAsset: string;
    toAmount: number;
    toAsset: string;
}

export interface TradeOpportunity {
    path: [Asset, Asset, Asset];
    initialAmount: number;
    finalAmount: number;
    profit: number;
    profitPercentage: number;
    steps: TradeStep[];
}

export type Network = 'mainnet' | 'testnet';
