import { useState } from "react";
import { css } from "@emotion/react";
import { Bank, Copy, Wallet, Backspace } from "@phosphor-icons/react";
import ModalButton from "../ModalButton";
import Modal from "@/shared/components/ui/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectContactOverlayOpen,
  setWithdrawCryptoOverlayOpen,
} from "@/redux/overlayReducers";
import { RootState } from "@/redux/store";
import { setWithdrawModalOpen } from "@/redux/modalReducers";
import WithdrawCryptoOverlay from "./onChain/WithdrawCryptoOverlay";
import OffChainWithdrawOverlay from "./offChain/WithdrawFiatOverlay";

const WithdrawModal = () => {
  const [height, setHeight] = useState(320);
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.withdrawModal.isOpen);
  const [isCryptoOpen, setCryptoOpen] = useState(false);
  const [isFiatOpen, setFiatOpen] = useState(false);
  const [showCopiedAddress, setShowCopiedAddress] = useState(false);

  const resetModal = () => {
    setCryptoOpen(false);
    setFiatOpen(false);
    setHeight(320);
    setShowCopiedAddress(false);
  };

  const openCrypto = () => {
    setCryptoOpen(true);
    setHeight(680);
  };

  const openFiat = () => {
    setFiatOpen(true);
    setHeight(680);
  };

  const onOpenChange = (isOpen: boolean) => {
    dispatch(setWithdrawModalOpen(isOpen));
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Withdraw"
        height={height}
        onAnimationComplete={() => {
          isOpen && resetModal();
        }}
      >
        {!isCryptoOpen && !isFiatOpen ? (
          <menu
            css={css`
              display: flex;
              flex-direction: column;
              gap: var(--size-200);
              padding-inline: var(--size-200);
            `}
          >
            <li>
              <ModalButton
                icon={Wallet}
                title="To wallet"
                description="Send money on chain"
                onPress={openCrypto}
              />
            </li>
            <li>
              <ModalButton
                icon={Bank}
                title="To bank account"
                description="Send money to bank account"
                onPress={openFiat}
              />
            </li>
          </menu>
        ) : isCryptoOpen ? (
          <WithdrawCryptoOverlay
            isOpen={isCryptoOpen}
            onOpenChange={(open) => {
              setCryptoOpen(open);
              if (!open) {
                setHeight(360);
              }
            }}
          />
        ) : (
          <OffChainWithdrawOverlay
            isOpen={isFiatOpen}
            onOpenChange={(open) => {
              setFiatOpen(open);
              if (!open) {
                setHeight(360);
              }
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default WithdrawModal;
