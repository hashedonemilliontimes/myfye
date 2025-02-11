import CoinCardList from "../CoinCardList";

const CryptoPanel = () => {
  const coins = [
    { title: "Bitcoin", currency: "btc", type: "btc", balance: 2301 },
    { title: "Solana", currency: "sol", type: "sol", balance: 2301 },
  ];

  return (
    <div className="crypto-panel">
      <CoinCardList coins={coins} />
    </div>
  );
};

export default CryptoPanel;
