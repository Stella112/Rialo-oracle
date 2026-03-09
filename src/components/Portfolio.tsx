import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { TrendingUp, PieChart, Activity, ExternalLink, ArrowRight } from "lucide-react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants/contracts";

export default function Portfolio({ currentAccount }: { currentAccount: string | null }) {
    const [stats, setStats] = useState({
        yes: "0.00",
        no: "0.00",
        impliedYes: "0.00",
        impliedNo: "0.00",
        totalValue: "0.00"
    });
    const [loading, setLoading] = useState(true);

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const fetchUserStats = async () => {
        if (!currentAccount) {
            setLoading(false);
            return;
        }

        try {
            const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

            const [rawYesBets, rawNoBets, rawTotalYes, rawTotalNo] = await Promise.all([
                contract.yesBets(currentAccount),
                contract.noBets(currentAccount),
                contract.totalYesPool(),
                contract.totalNoPool()
            ]);

            const yesBets = BigInt(rawYesBets.toString());
            const noBets = BigInt(rawNoBets.toString());
            const totalYesPool = BigInt(rawTotalYes.toString());
            const totalNoPool = BigInt(rawTotalNo.toString());

            const totalPool: bigint = totalYesPool + totalNoPool;
            let impliedYes: bigint = 0n;
            let impliedNo: bigint = 0n;

            if (yesBets > 0n && totalYesPool > 0n) {
                impliedYes = (yesBets * totalPool) / totalYesPool;
            }
            if (noBets > 0n && totalNoPool > 0n) {
                impliedNo = (noBets * totalPool) / totalNoPool;
            }

            const totalValue = impliedYes + impliedNo;

            setStats({
                yes: ethers.formatEther(yesBets),
                no: ethers.formatEther(noBets),
                impliedYes: ethers.formatEther(impliedYes),
                impliedNo: ethers.formatEther(impliedNo),
                totalValue: ethers.formatEther(totalValue)
            });
        } catch (error) {
            console.error("Failed to fetch user positions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserStats();
    }, [currentAccount]);

    if (!currentAccount) {
        return (
            <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
                    <PieChart className="w-10 h-10 text-white/20" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Connect Wallet to View Portfolio</h1>
                <p className="text-white/40 max-w-md">Connect your decentralized wallet to securely view your active market positions, history, and real-time PnL.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-6 mb-12">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 p-1 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <div className="w-full h-full bg-black rounded-full border-4 border-black overflow-hidden relative">
                        {/* Generic visual blockie pattern via css */}
                        <div className="absolute inset-0 bg-white/10 blur-sm" />
                        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent" />
                        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent" />
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight">
                        {formatAddress(currentAccount)}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-white/40">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm font-medium">Pro Trader</span>
                        <span className="mx-2 text-white/20">•</span>
                        <a href={`https://sepolia.basescan.org/address/${currentAccount}`} target="_blank" rel="noreferrer" className="text-sm text-emerald-400/80 hover:text-emerald-400 flex items-center gap-1 transition-colors">
                            View on Basescan <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { label: "Portfolio Value", value: `${parseFloat(stats.totalValue).toFixed(4)} ETH`, sub: "Implied Payout", color: "text-white" },
                    { label: "Overall Win Rate", value: "0%", sub: "New Account", color: "text-emerald-400" },
                    { label: "Net PnL", value: "0.00 ETH", sub: "All-time", color: "text-white" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />
                        <span className="text-white/40 text-sm uppercase tracking-wider font-medium">{stat.label}</span>
                        <div className={`text-4xl font-bold mt-4 mb-1 tracking-tight ${stat.color}`}>{stat.value}</div>
                        <span className="text-white/40 text-sm">{stat.sub}</span>
                    </div>
                ))}
            </div>

            {/* Active Positions */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
                <div className="p-6 border-b border-white/10 bg-white/[0.02]">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                        Active Postions
                    </h2>
                </div>

                <div className="w-full min-w-max">
                    <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-white/40 uppercase tracking-wider border-b border-white/5 text-left">
                        <div className="col-span-6 pl-4">Market</div>
                        <div className="col-span-2">Outcome</div>
                        <div className="col-span-2 text-right">Size</div>
                        <div className="col-span-2 text-right pr-4">Implied Value</div>
                    </div>

                    <div className="flex flex-col">
                        {loading ? (
                            <div className="p-12 text-center text-white/40 animate-pulse">Loading positions...</div>
                        ) : parseFloat(stats.yes) === 0 && parseFloat(stats.no) === 0 ? (
                            <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                                    <Activity className="w-8 h-8 text-white/20" />
                                </div>
                                <h3 className="text-white font-medium text-lg">No active positions</h3>
                                <p className="text-white/40 text-sm max-w-sm">You haven't placed any bets yet. Head over to the Markets tab to start trading!</p>
                            </div>
                        ) : (
                            <>
                                {/* Real Contract Data - Yes Bet */}
                                {parseFloat(stats.yes) > 0 && (
                                    <div className="grid grid-cols-12 gap-4 p-4 items-center bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-b border-white/5 group">
                                        <div className="col-span-6 pl-4 flex flex-col">
                                            <span className="text-white font-medium">Will Rialo launch its mainnet in 2026?</span>
                                            <span className="text-white/30 text-xs mt-1">Base Sepolia Oracle</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">Yes</span>
                                        </div>
                                        <div className="col-span-2 text-right font-medium text-white">{parseFloat(stats.yes).toFixed(4)} ETH</div>
                                        <div className="col-span-2 text-right pr-4 text-emerald-400/80 flex items-center justify-end gap-2">
                                            ~{parseFloat(stats.impliedYes).toFixed(4)} ETH <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                )}

                                {/* Real Contract Data - No Bet */}
                                {parseFloat(stats.no) > 0 && (
                                    <div className="grid grid-cols-12 gap-4 p-4 items-center bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-b border-white/5 group">
                                        <div className="col-span-6 pl-4 flex flex-col">
                                            <span className="text-white font-medium">Will Rialo launch its mainnet in 2026?</span>
                                            <span className="text-white/30 text-xs mt-1">Base Sepolia Oracle</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase">No</span>
                                        </div>
                                        <div className="col-span-2 text-right font-medium text-white">{parseFloat(stats.no).toFixed(4)} ETH</div>
                                        <div className="col-span-2 text-right pr-4 text-blue-400/80 flex items-center justify-end gap-2">
                                            ~{parseFloat(stats.impliedNo).toFixed(4)} ETH <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
