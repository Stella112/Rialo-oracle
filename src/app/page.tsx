"use client";

import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import Portfolio from "@/components/Portfolio";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants/contracts";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [poolStats, setPoolStats] = useState({ yesPool: "0", noPool: "0" });
  const [question, setQuestion] = useState("");
  const [view, setView] = useState<'dashboard' | 'portfolio'>('dashboard');

  const BASE_SEPOLIA_CHAIN_ID = '0x14A34'; // 84532 in hex

  const checkAndSwitchNetwork = async (ethereum: any) => {
    try {
      const currentChainId = await ethereum.request({ method: 'eth_chainId' });
      if (currentChainId !== BASE_SEPOLIA_CHAIN_ID) {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
        });
      }
      return true;
    } catch (error: any) {
      console.error("Failed to switch network", error);
      if (error.code === 4902) {
        alert("Please add the Base Sepolia network to your MetaMask.");
      } else {
        alert("Please switch to Base Sepolia to continue.");
      }
      return false;
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const isCorrectNetwork = await checkAndSwitchNetwork(ethereum);
      if (!isCorrectNetwork) return;

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error: any) {
      if (error.code === 4001) {
        console.log("User rejected the request.");
      } else {
        console.error("Wallet connection error:", error);
      }
    }
  };

  const disconnectWallet = () => {
    setCurrentAccount(null);
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) return;

      const currentChainId = await ethereum.request({ method: 'eth_chainId' });
      if (currentChainId !== BASE_SEPOLIA_CHAIN_ID) return;

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0]);
      }
    } catch (error: any) {
      console.error("Check connection error:", error);
    }
  };

  const fetchPoolStats = async () => {
    try {
      // Connect to Base Sepolia directly for read-only actions
      const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const q = await contract.question();
      const yesPool = await contract.totalYesPool();
      const noPool = await contract.totalNoPool();

      setQuestion(q);
      setPoolStats({
        yesPool: ethers.formatEther(yesPool),
        noPool: ethers.formatEther(noPool)
      });
    } catch (error) {
      console.error("Error fetching pool stats", error);
    }
  };

  const betYes = async (amount: string) => {
    if (!currentAccount) {
      alert("Please connect wallet first");
      return;
    }
    try {
      setLoading(true);
      const { ethereum } = window as any;
      if (!ethereum) throw new Error("No ethereum wallet found");

      const isCorrectNetwork = await checkAndSwitchNetwork(ethereum);
      if (!isCorrectNetwork) {
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum, 84532);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.betYes({ value: ethers.parseEther(amount.toString()) });
      await tx.wait();
      console.log("Tx mined:", tx.hash);
      alert("Bet placed successfully!");
      fetchPoolStats();
    } catch (error: any) {
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        console.log("User rejected transaction.");
      } else {
        console.error("TX Error: ", error);
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const betNo = async (amount: string) => {
    if (!currentAccount) {
      alert("Please connect wallet first");
      return;
    }
    try {
      setLoading(true);
      const { ethereum } = window as any;
      if (!ethereum) throw new Error("No ethereum wallet found");

      const isCorrectNetwork = await checkAndSwitchNetwork(ethereum);
      if (!isCorrectNetwork) {
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum, 84532);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.betNo({ value: ethers.parseEther(amount.toString()) });
      await tx.wait();
      console.log("Tx mined:", tx.hash);
      alert("Bet placed successfully!");
      fetchPoolStats();
    } catch (error: any) {
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        console.log("User rejected transaction.");
      } else {
        console.error("TX Error: ", error);
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    fetchPoolStats();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 font-[family-name:var(--font-geist-sans)]">
        <Header
          currentAccount={currentAccount}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
          view={view}
          setView={setView}
        />
        <main>
          {view === 'dashboard' ? (
            <Dashboard
              question={question}
              betYes={betYes}
              betNo={betNo}
              poolStats={poolStats}
              loading={loading}
            />
          ) : (
            <Portfolio currentAccount={currentAccount} />
          )}
        </main>
      </div>
    </div>
  );
}
