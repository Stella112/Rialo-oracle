import { Wallet, ChevronDown } from "lucide-react";

export default function Header({
    currentAccount,
    connectWallet,
    disconnectWallet,
    view,
    setView
}: {
    currentAccount: string | null,
    connectWallet: () => void,
    disconnectWallet: () => void,
    view: 'dashboard' | 'portfolio',
    setView: (v: 'dashboard' | 'portfolio') => void
}) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">RO</span>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
                        Rialo Oracle
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    <button
                        onClick={() => setView('dashboard')}
                        className={`text-sm font-medium transition-all ${view === 'dashboard' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                    >
                        Markets
                    </button>
                    <button
                        onClick={() => setView('portfolio')}
                        className={`text-sm font-medium transition-all ${view === 'portfolio' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                    >
                        Portfolio
                    </button>
                </nav>

                <button
                    onClick={currentAccount ? disconnectWallet : connectWallet}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"
                >
                    {currentAccount ? (
                        <>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-medium text-white/90 group-hover:hidden">
                                {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                            </span>
                            <span className="text-sm font-medium text-red-400 hidden group-hover:block">
                                Disconnect
                            </span>
                            <ChevronDown className="w-4 h-4 text-white/50 group-hover:hidden" />
                        </>
                    ) : (
                        <>
                            <Wallet className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-white/90">Connect Wallet</span>
                        </>
                    )}
                </button>
            </div>
        </header>
    );
}
