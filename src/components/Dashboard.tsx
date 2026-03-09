import { useState } from "react";
import { TrendingUp, TrendingDown, Search, Lock, X } from "lucide-react";

const CATEGORIES = ["All", "Crypto", "AI", "Politics", "Pop Culture"];

const TRENDING_MARKETS = [
    { q: "Will xAI release Grok 3 before August?", vol: "142.5 ETH", yes: 68, no: 32, category: "AI" },
    { q: "Will the SEC approve a Solana ETF in 2026?", vol: "89.2 ETH", yes: 45, no: 55, category: "Crypto" },
    { q: "Will TikTok be officially banned in the US?", vol: "215.8 ETH", yes: 22, no: 78, category: "Politics" },
    { q: "Will GTA VI be delayed to 2026?", vol: "310.4 ETH", yes: 55, no: 45, category: "Pop Culture" },
    { q: "Will Ethereum reach $5000 in 2024?", vol: "512.1 ETH", yes: 40, no: 60, category: "Crypto" },
    { q: "Will OpenAI release GPT-5 this year?", vol: "288.9 ETH", yes: 75, no: 25, category: "AI" },
    { q: "Will the US Federal Reserve cut rates in September?", vol: "410.2 ETH", yes: 60, no: 40, category: "Politics" },
    { q: "Will Taylor Swift win Album of the Year?", vol: "95.5 ETH", yes: 85, no: 15, category: "Pop Culture" },
];

export default function Dashboard({ question, betYes, betNo, poolStats, loading }: any) {
    const [betAmountY, setBetAmountY] = useState("");
    const [betAmountN, setBetAmountN] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showV2Modal, setShowV2Modal] = useState(false);

    const filteredMarkets = TRENDING_MARKETS.filter((market) => {
        const matchesCategory = selectedCategory === "All" || market.category === selectedCategory;
        const matchesSearch = market.q.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const totalPool = parseFloat(poolStats.yesPool) + parseFloat(poolStats.noPool);
    const yesPercentage = totalPool === 0 ? 50 : (parseFloat(poolStats.yesPool) / totalPool) * 100;
    const noPercentage = totalPool === 0 ? 50 : (parseFloat(poolStats.noPool) / totalPool) * 100;

    return (
        <div className="max-w-4xl mx-auto w-full pt-12 pb-24 px-4 flex flex-col gap-8">
            {/* Question Header */}
            <div className="flex flex-col gap-4 text-center">
                <div className="inline-flex items-center gap-2 mx-auto px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live Market
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    {question || "Loading question..."}
                </h1>
                <p className="text-white/60 text-lg">
                    Predict the outcome and earn rewards if you're right.
                </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Volume", value: `${totalPool.toFixed(2)} ETH` },
                    { label: "Yes Pool", value: `${parseFloat(poolStats.yesPool).toFixed(2)} ETH` },
                    { label: "No Pool", value: `${parseFloat(poolStats.noPool).toFixed(2)} ETH` },
                    { label: "Liquidity", value: "24.5 ETH" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1 backdrop-blur-sm">
                        <span className="text-white/50 text-sm">{stat.label}</span>
                        <span className="text-2xl font-semibold text-white">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Progress Bar Display */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex justify-between text-sm font-medium mb-3">
                    <span className="text-emerald-400">Yes <span className="text-white/40 ml-1">{yesPercentage.toFixed(1)}%</span></span>
                    <span className="text-blue-400"><span className="text-white/40 mr-1">{noPercentage.toFixed(1)}%</span> No</span>
                </div>
                <div className="h-4 w-full bg-blue-500/20 rounded-full overflow-hidden flex">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out"
                        style={{ width: `${yesPercentage}%` }}
                    />
                    <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 ease-out"
                        style={{ width: `${noPercentage}%` }}
                    />
                </div>
            </div>

            {/* Betting Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-4">
                {/* Yes Card */}
                <div className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden backdrop-blur-md transition-all hover:bg-white/[0.07] hover:border-emerald-500/30">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors" />
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-bold text-emerald-400">Yes</h2>
                            <span className="text-white/60 text-sm">Implied probability: {yesPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                value={betAmountY}
                                onChange={(e) => setBetAmountY(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-medium text-sm">ETH</span>
                        </div>

                        <button
                            onClick={async () => {
                                await betYes(betAmountY);
                                setBetAmountY("");
                            }}
                            disabled={loading || !betAmountY}
                            className="w-full py-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-semibold border border-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                        >
                            {loading ? "Transaction Pending..." : "Bet Yes"}
                        </button>
                    </div>
                </div>

                {/* No Card */}
                <div className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden backdrop-blur-md transition-all hover:bg-white/[0.07] hover:border-blue-500/30">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 group-hover:bg-blue-400 transition-colors" />
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-bold text-blue-400">No</h2>
                            <span className="text-white/60 text-sm">Implied probability: {noPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                value={betAmountN}
                                onChange={(e) => setBetAmountN(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-medium text-sm">ETH</span>
                        </div>

                        <button
                            onClick={async () => {
                                await betNo(betAmountN);
                                setBetAmountN("");
                            }}
                            disabled={loading || !betAmountN}
                            className="w-full py-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold border border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                        >
                            {loading ? "Transaction Pending..." : "Bet No"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Trending Markets */}
            <div className="flex flex-col gap-6 mt-8">
                <h2 className="text-2xl font-bold text-white">Trending on CT</h2>

                {/* Search and Filter Row */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search markets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${selectedCategory === cat
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMarkets.length > 0 ? (
                        filteredMarkets.map((market, i) => (
                            <div
                                key={i}
                                onClick={() => setShowV2Modal(true)}
                                className="group/card bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-white/[0.08] hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:-translate-y-1"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-white font-medium text-lg leading-snug">{market.q}</h3>
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 text-white/40 text-[10px] uppercase font-bold tracking-wider whitespace-nowrap border border-white/5">
                                        {market.category}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end mt-auto pt-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white/40 text-xs uppercase tracking-wider">Volume</span>
                                        <span className="text-white/80 text-sm font-medium">{market.vol}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 w-1/2">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-emerald-400">{market.yes}%</span>
                                            <span className="text-blue-400">{market.no}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-blue-500/20 rounded-full overflow-hidden flex">
                                            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${market.yes}%` }} />
                                            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${market.no}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 text-center flex flex-col items-center gap-3 bg-white/5 border border-white/10 rounded-2xl border-dashed">
                            <Search className="w-8 h-8 text-white/20" />
                            <p className="text-white/40 text-lg">No prediction markets found for "{searchQuery}"</p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("All");
                                }}
                                className="text-emerald-400 text-sm hover:underline mt-2"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* V2 Feature Lock Modal */}
            {showV2Modal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md w-full flex flex-col items-center text-center gap-5 shadow-2xl relative transform transition-all animate-in zoom-in-95">
                        <button
                            onClick={() => setShowV2Modal(false)}
                            className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-1">
                            <Lock className="w-7 h-7 text-blue-400" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-bold tracking-tight text-white">Market Locked</h3>
                            <p className="text-white/60 leading-relaxed text-sm">
                                Multi-market parallel resolution requires Rialo native Supermodularity. Coming in V2.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowV2Modal(false)}
                            className="mt-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
