import AssetCard from "./AssetCard";

import { css } from "@emotion/react";

import { AbstractedAsset } from "../types";
import AssetInfoPopup from "../AssetInfoPopup";
import { useState } from "react";

const AssetCardList = ({
  assets,
  showOptions = false,
  onAssetSelect,
  showBalance = true,
  showBalanceUSD = true,
  showCurrencySymbol = true,
}: {
  assets: AbstractedAsset[];
  showOptions?: boolean;
  onAssetSelect?: (asset: AbstractedAsset) => void;
  showBalance?: boolean;
  showBalanceUSD?: boolean;
  showCurrencySymbol?: boolean;
  radioGroup?: boolean;
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const handleAssetPress = (asset: AbstractedAsset) => {
    setSelectedAssetId(asset.id);
    setPopupOpen(true);
    if (onAssetSelect) onAssetSelect(asset);
  };

  return (
    <div className="asset-card-list-wrapper">
      <ul
        className="asset-card-list"
        css={css`
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: var(--size-150);
        `}
      >
        {assets.map((asset: any, i: number) => (
          <li
            key={`asset-card-${i}`}
            className="coin-card-wrapper"
            css={css`
              width: 100%;
            `}
          >
            <AssetCard
              id={asset.id}
              title={asset.label}
              symbol={asset.symbol}
              fiatCurrency={asset.fiatCurrency}
              balance={showBalanceUSD ? asset.balanceUSD : asset.balance}
              showCurrencySymbol={showCurrencySymbol}
              icon={asset.icon}
              groupId={asset.groupId}
              onPress={() => handleAssetPress(asset)}
              showBalance={showBalance}
              showOptions={showOptions}
            />
          </li>
        ))}
      </ul>
      {selectedAssetId && (
        <AssetInfoPopup
          isOpen={popupOpen}
          onOpenChange={setPopupOpen}
          assetId={selectedAssetId}
        />
      )}
    </div>
  );
};

export default AssetCardList;
