import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import QrReader from "./QRReader";
import Button from "@/components/ui/button/Button";
import { Scan as ScanIcon, X as XIcon } from "@phosphor-icons/react";

// Wrap React Aria modal components so they support motion values.
const MotionModal = motion(Modal);
const MotionModalOverlay = motion(ModalOverlay);

const inertiaTransition = {
  type: "inertia" as const,
  bounceStiffness: 300,
  bounceDamping: 40,
  timeConstant: 300,
};

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const QRCodeDialog = () => {
  let [isOpen, setOpen] = useState(false);
  let h = window.innerHeight;
  let y = useMotionValue(h);
  let bgOpacity = useTransform(y, [0, h], [0.4, 0]);
  let bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

  return (
    <>
      <Button
        iconOnly
        icon={ScanIcon}
        onPress={() => setOpen(true)}
        color="transparent"
        data-size="large"
      ></Button>
      <AnimatePresence>
        {isOpen && (
          <MotionModalOverlay
            isOpen
            onOpenChange={setOpen}
            css={css`
              position: fixed;
              inset: 0;
              z-index: var(--z-index-modal);
              max-width: 480px;
              margin-inline: auto;
            `}
            style={{ backgroundColor: bg as any }}
          >
            <MotionModal
              css={css`
                background-color: var(--clr-black);
                position: absolute;
                bottom: 0;
                width: 100%;
                border-radius: var(--border-radius-medium);
                box-shadow: var(--box-shadow-modal);
                will-change: transform;
                height: ${window.screen.height}px;
              `}
              initial={{ y: h }}
              animate={{ y: 0 }}
              exit={{ y: h }}
              transition={staticTransition}
              style={{
                y,
                top: 0,
                // Extra padding at the bottom to account for rubber band scrolling.
                paddingBottom: window.screen.height,
              }}
            >
              <Dialog
                css={css`
                  display: grid;
                  grid-template-rows: 4rem 1fr;
                  height: ${window.screen.height}px;
                `}
              >
                <div
                  css={css`
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    height: 4rem;
                    padding: 0 var(--size-100);
                  `}
                >
                  <Button
                    iconOnly
                    icon={XIcon}
                    color="transparent-invert"
                    size="large"
                    onPress={() => setOpen(false)}
                  ></Button>
                </div>
                <div
                  className="content"
                  css={css`
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 var(--size-250);
                    padding-bottom: var(--size-250);
                  `}
                >
                  <p
                    slot="title"
                    className="heading-large"
                    css={css`
                      color: var(--clr-text-on-accent);
                      text-align: center;
                    `}
                  >
                    Send Tokens
                  </p>
                  <p
                    css={css`
                      color: var(--clr-text-on-accent);
                      text-align: center;
                      margin-block-start: var(--size-200);
                      margin-block-end: var(--size-500);
                    `}
                  >
                    Scan a QR Code to send tokens to another wallet or exchange.
                  </p>
                  <QrReader />
                  <div
                    css={css`
                      display: flex;
                      flex-direction: column;
                      justify-content: space-between;
                      align-items: center;
                      margin-block-start: var(--size-500);
                      flex: 1;
                      width: 100%;
                    `}
                  >
                    <p
                      css={css`
                        color: var(--clr-neutral-300);
                        text-align: center;
                      `}
                    >
                      Only send money to a wallet you trust
                    </p>
                    <Button expand size="large" color="invert">
                      View QR Code
                    </Button>
                  </div>
                </div>
              </Dialog>
            </MotionModal>
          </MotionModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default QRCodeDialog;
