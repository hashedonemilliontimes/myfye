import CoinCardList from "../CoinCardList";
import btcCoinIcon from "@/assets/svgs/coins/btc-coin.svg";
import solCoinIcon from "@/assets/svgs/coins/sol-coin.svg";

const CryptoPanel = () => {
  const coins = [
    {
      title: "Bitcoin",
      currency: "btc",
      type: "btc",
      balance: 2301,
      img: btcCoinIcon,
    },
    {
      title: "Solana",
      currency: "sol",
      type: "sol",
      balance: 2301,
      img: solCoinIcon,
    },
  ];

  return (
    <div className="crypto-panel">
      <CoinCardList coins={coins} />
    </div>
  );
};

export default CryptoPanel;
