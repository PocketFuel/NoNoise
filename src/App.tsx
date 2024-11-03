import { CryptoChart } from "./components/crypto-chart"

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Crypto Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CryptoChart symbol="BTC" name="Bitcoin" />
        <CryptoChart symbol="ETH" name="Ethereum" />
        <CryptoChart symbol="SOL" name="Solana" />
      </div>
    </div>
  )
}

export default App