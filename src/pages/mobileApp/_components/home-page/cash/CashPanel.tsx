import CoinCardList from "../CoinCardList";
import usDollarCoinIcon from "@/assets/svgs/coins/usd-coin.svg";
import euroCoinIcon from "@/assets/svgs/coins/eur-coin.svg";
import usdyCoinIcon from "@/assets/svgs/coins/usdy-coin.svg";

const CashPanel = () => {
  const coins = [
    {
      title: "US Dollar",
      currency: "usd",
      type: "usd",
      balance: 2301,
      img: usDollarCoinIcon,
    },
    {
      title: "Euro",
      currency: "eur",
      type: "eur",
      balance: 2301,
      img: euroCoinIcon,
    },
    {
      title: "US Treasury Bonds",
      currency: "usd",
      type: "usdy",
      balance: 3011,
      img: usdyCoinIcon,
    },
  ];

  return (
    <div className="cash-panel">
      <CoinCardList coins={coins} />
    </div>
  );
};

export default CashPanel;
