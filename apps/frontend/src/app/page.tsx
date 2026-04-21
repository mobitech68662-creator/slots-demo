'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get('http://localhost:3001/users/me');
      setUser(res.data);
    } catch (error) {
      localStorage.removeItem('token');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <main className="min-h-screen p-8">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">🎰 Slots Demo</h1>
        <div className="flex items-center gap-4">
          <div className="bg-green-600 px-4 py-2 rounded-lg">
            <span className="text-white">Balance: ৳{user.balance}</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
            className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GameCard
          id="super_ace"
          name="Super Ace"
          icon="🃏"
          description="Classic card slots with Aces and Kings"
          user={user}
          onUpdateBalance={loadUser}
        />
        <GameCard
          id="fortune_gems"
          name="Fortune Gems"
          icon="💎"
          description="Match the precious gems to win big"
          user={user}
          onUpdateBalance={loadUser}
        />
        <GameCard
          id="lucky_777"
          name="Lucky 777"
          icon="🎰"
          description="Traditional 777 slot machine"
          user={user}
          onUpdateBalance={loadUser}
        />
      </div>

      {/* Recent Wins */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">🏆 Recent Activity</h2>
        <RecentGames userId={user.id} />
      </div>
    </main>
  );
}

function GameCard({ id, name, icon, description, user, onUpdateBalance }: any) {
  const [betAmount, setBetAmount] = useState(100);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const spin = async () => {
    if (betAmount > user.balance) {
      toast.error('Insufficient balance!');
      return;
    }

    setSpinning(true);
    try {
      const res = await axios.post('http://localhost:3001/slots/spin', {
        game: id,
        betAmount,
      });
      setResult(res.data);
      
      if (res.data.is_win) {
        toast.success(`🎉 You won ৳${res.data.win_amount}!`);
      } else {
        toast.error(`Try again! Lost ৳${betAmount}`);
      }
      onUpdateBalance();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Spin failed');
    }
    setSpinning(false);
  };

  return (
    <div className={`bg-slate-800 rounded-xl p-6 ${result?.is_win ? 'win-glow' : ''}`}>
      <div className="text-6xl text-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-center mb-2">{name}</h3>
      <p className="text-gray-400 text-center mb-4">{description}</p>

      {result && (
        <div className="bg-slate-900 rounded-lg p-4 mb-4">
          <div className="flex justify-center gap-4 text-4xl mb-2">
            {result.reels?.map((symbol: string, i: number) => (
              <span key={i} className="animate-bounce-in">{symbol}</span>
            ))}
          </div>
          <div className="text-center">
            {result.is_win ? (
              <p className="text-green-400 font-bold">Won: ৳{result.win_amount}</p>
            ) : (
              <p className="text-red-400">Try again!</p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm">Bet:</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="flex-1 bg-slate-900 rounded px-3 py-2 text-white"
          min="10"
          step="10"
        />
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-black font-bold py-3 rounded-lg transition"
      >
        {spinning ? 'Spinning...' : 'SPIN'}
      </button>
    </div>
  );
}

function RecentGames({ userId }: any) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/slots/history', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setGames(res.data));
  }, [userId]);

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="pb-2">Game</th>
            <th className="pb-2">Bet</th>
            <th className="pb-2">Win</th>
            <th className="pb-2">Result</th>
            <th className="pb-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game: any) => (
            <tr key={game.id} className="border-b border-gray-700">
              <td className="py-2 capitalize">{game.game.replace('_', ' ')}</td>
              <td className="py-2">৳{game.bet_amount}</td>
              <td className={`py-2 ${game.is_win ? 'text-green-400' : 'text-red-400'}`}>
                ৳{game.win_amount}
              </td>
              <td className="py-2">{game.is_win ? '✅ WIN' : '❌ LOSS'}</td>
              <td className="py-2 text-gray-400">
                {new Date(game.created_at).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {games.length === 0 && (
        <p className="text-gray-400 text-center py-4">No games played yet</p>
      )}
    </div>
  );
}
