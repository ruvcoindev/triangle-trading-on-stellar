import React from 'react';
import { requestAccess } from '@freighter/api';

interface HeaderProps {
    onConnect: () => void;
    publicKey: string;
}

const Header: React.FC<HeaderProps> = ({ onConnect, publicKey }) => {

    const handleConnect = async () => {
        try {
            await requestAccess();
            onConnect();
        } catch (error) {
            console.error(error);
        }
    };
    
    const truncateKey = (key: string) => `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;

    return (
        <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg border-b border-gray-700 sticky top-0 z-10">
            <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                     <svg xmlns="http://www.w.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h1 className="text-2xl font-bold text-white">Stellar Tri-Arbitrage Finder</h1>
                </div>
                <div>
                    {publicKey ? (
                        <div className="bg-gray-700 text-cyan-300 px-4 py-2 rounded-md font-mono text-sm">
                            {truncateKey(publicKey)}
                        </div>
                    ) : (
                         <button
                            onClick={handleConnect}
                            className="text-sm font-semibold py-2 px-4 rounded-md transition-colors duration-200 bg-cyan-600 hover:bg-cyan-500 text-white"
                        >
                           Connect Wallet
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;