import { css } from "@emotion/react";
import { motion } from "motion/react";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import bbva from "@/assets/icons/bankIcons/bbva.png";
import banamex from "@/assets/icons/bankIcons/banamex.png";
import santander from "@/assets/icons/bankIcons/santander.png";
import hsbc from "@/assets/icons/bankIcons/hsbc.png";
import banorte from "@/assets/icons/bankIcons/banorte.jpg";

interface BankPickerOverlayProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onBankSelect: (bankInfo: BankInfo) => void;
}

interface BankInfo {
  code: string;
  name: string;
  icon: string;
}

const BankPickerOverlay = ({ isOpen, onOpenChange, onBankSelect }: BankPickerOverlayProps) => {
  const banks: BankInfo[] = [
    {
      code: "40002",
      name: "Banamex",
      icon: banamex,
    },
    {
      code: "40012",
      name: "BBVA México",
      icon: bbva,
    },
    {
      code: "40014",
      name: "Santander México",
      icon: santander,
    },
    {
      code: "40021",
      name: "HSBC México",
      icon: hsbc,
    },
    {
      code: "40072",
      name: "Banorte",
      icon: banorte,
    },
  ];

  const handleBankClick = (bank: BankInfo) => {
    console.log("Bank selected:", bank);
    onBankSelect(bank);
    onOpenChange(false);
  };

  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Select Bank"
    >
      <div
        css={css`
          padding: var(--size-200);
          height: 100%;
          display: flex;
          flex-direction: column;
        `}
      >
        <div
          css={css`
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--size-150);
            flex: 1;
            align-content: start;
          `}
        >
          {banks.map((bank) => (
            <motion.div
              key={bank.code}
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: var(--size-200);
                border-radius: var(--border-radius-medium);
                background-color: white;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 2px solid transparent;
                &:hover {
                  background-color: white;
                  border-color: var(--clr-primary);
                }
              `}
              onClick={() => handleBankClick(bank)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={bank.icon}
                alt={bank.name}
                css={css`
                  width: 60px;
                  height: 60px;
                  object-fit: cover;
                  border-radius: var(--border-radius-small);
                  margin-bottom: var(--size-150);
                `}
              />
              <p
                css={css`
                  font-weight: var(--fw-semibold);
                  color: var(--clr-text);
                  text-align: center;
                  margin: 0;
                  font-size: var(--text-sm);
                  line-height: 1.3;
                `}
              >
                {bank.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Overlay>
  );
};

export default BankPickerOverlay; 