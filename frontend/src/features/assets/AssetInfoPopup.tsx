import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import AssetIcon from "./AssetIcon";
import { selectAbstractedAsset, selectAsset } from "./assetsSlice";
import { RootState } from "@/redux/store";
import assetDescriptionsRaw from "./assetDescriptions.json";
import { formatBalance } from "./utils";

const assetDescriptions: Record<string, string> = assetDescriptionsRaw;

const BottomSheet: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}> = ({ isOpen, onOpenChange, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => onOpenChange(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      />
      {/* Bottom Sheet */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1001,
          pointerEvents: 'none', // only the sheet is interactive
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            background: '#fff',
            borderRadius: '24px 24px 0 0',
            boxShadow: '0 -2px 16px rgba(0,0,0,0.12)',
            padding: '24px 20px 32px 20px',
            maxWidth: 420,
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
            minHeight: 200,
            marginLeft: 8,
            marginRight: 8,
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div
            style={{
              width: 40,
              height: 4,
              background: '#E0E0E0',
              borderRadius: 2,
              margin: '0 auto 16px auto',
            }}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: 24 }}>
            {children}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

interface AssetInfoPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  assetId: string;
}

const AssetInfoPopup: React.FC<AssetInfoPopupProps> = ({ isOpen, onOpenChange, assetId }) => {
  const asset = useSelector((state: RootState) => selectAbstractedAsset(state, assetId));
  const firstAssetId = asset.assetIds && asset.assetIds.length > 0 ? asset.assetIds[0] : null;
  const underlyingAsset = useSelector((state: RootState) => firstAssetId ? selectAsset(state, firstAssetId) : null);
  const price = underlyingAsset && underlyingAsset.exchangeRateUSD && underlyingAsset.exchangeRateUSD > 0
    ? formatBalance(underlyingAsset.exchangeRateUSD, "usd")
    : "No price available";

  if (!asset) return null;

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      {/* Top row: icon left, name/ticker right */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%', marginBottom: 16 }}>
        <div style={{ flex: '0 0 auto', marginRight: 16, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AssetIcon icon={asset.icon} width="56px" />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
          <div style={{ fontWeight: 600, fontSize: 20, color: '#222', lineHeight: 1, marginBottom: 4 }}>
            {asset.label} <span style={{ color: '#888', fontWeight: 400 }}>{asset.symbol}</span>
          </div>
          <div style={{ fontWeight: 500, fontSize: 20, color: '#111', marginTop: 4, textAlign: 'right' }}>{price}</div>
        </div>
      </div>
      {/* Description, left-aligned */}
      <div style={{ color: '#444', textAlign: 'left', fontSize: 16, lineHeight: 1.5 }}>
        {assetDescriptions[asset.symbol] || "No description available for this asset."}
      </div>
    </BottomSheet>
  );
};

export default AssetInfoPopup; 