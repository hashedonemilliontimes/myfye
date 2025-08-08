import {
  animate,
  AnimatePresence,
  HTMLMotionProps,
  motion,
  MotionValue,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";

import { css } from "@emotion/react";
import Button from "@/shared/components/ui/button/Button";
import { X } from "@phosphor-icons/react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ReactNode, Ref, RefObject, useEffect, useState } from "react";
import Portal from "../portal/Portal";
import { useModal } from "./useModal";

// Wrap React Aria modal components so they support framer-motion values.
const MotionDialogBackdrop = motion(DialogBackdrop);
const MotionDialog = motion(Dialog);
const MotionDialogPanel = motion(DialogPanel);

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

export interface ModalProps extends HTMLMotionProps<"div"> {
  zIndex?: number;
  title?: string;
  height?: MotionValue<number> | number;
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
  children: ReactNode;
  onExit?: () => void;
  initialFocus?: RefObject<HTMLElement>;
  ref?: Ref<HTMLDivElement>;
}

const checkMotionValue = (val: any): val is MotionValue<number> =>
  val instanceof MotionValue;

const Modal = ({
  isOpen,
  onOpenChange,
  height = 400,
  title = "",
  zIndex = 1000,
  onExit,
  ref,
  initialFocus,
  children,
  ...restProps
}: ModalProps) => {
  const isMotionValue = checkMotionValue(height);
  const top = isMotionValue
    ? useTransform(height, (x) =>
        window.innerHeight - x > 0 ? window.innerHeight - x : 0
      )
    : window.innerHeight - height > 0
    ? window.innerHeight - height
    : 0;
  const h = isMotionValue
    ? useTransform(height, (x) => Math.min(window.innerHeight, x))
    : Math.min(window.innerHeight, height);
  const y = useMotionValue(checkMotionValue(h) ? h.get() : h);
  const bgOpacity = useTransform(
    y,
    [0, checkMotionValue(h) ? h.get() : h],
    [0.4, 0]
  );
  const bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

  const [initialY, setInitialY] = useState(checkMotionValue(h) ? h.get() : h);

  if (checkMotionValue(h) && checkMotionValue(height))
    useMotionValueEvent(height, "animationComplete", () => {
      if (h.get() === height.get()) setInitialY(h.get());
    });

  useModal({ isOpen, onOpenChange, ref, initialFocus });

  return (
    <>
      <Portal containerId="modals">
        <AnimatePresence onExitComplete={onExit}>
          {isOpen && (
            <motion.div
              role="region"
              css={css`
                isolation: isolate;
                position: fixed;
                inset: 0;
                z-index: ${zIndex};
              `}
            >
              <motion.div
                style={{ backgroundColor: bg }}
                css={css`
                  position: absolute;
                  width: 100%;
                  height: 100%;
                `}
              />
              <motion.div
                css={css`
                  display: grid;
                  font-family: var(--font-family);
                  grid-template-rows: auto 1fr;
                  position: absolute;
                  inset: 0;
                  top: auto;
                  margin-inline: auto;
                  max-width: var(--app-max-width);
                  width: 100%;
                  border-radius: var(--border-radius-medium);
                  border-bottom-left-radius: 0;
                  border-bottom-right-radius: 0;
                  box-shadow: var(--box-shadow-modal);
                  will-change: transform;
                  background-color: var(--clr-surface);
                  z-index: 1;
                `}
                initial={{ y: initialY }}
                animate={{ y: 0 }}
                exit={{ y: initialY }}
                transition={staticTransition}
                style={{
                  y: y,
                  top: top,
                  // Extra padding at the bottom to account for rubber band scrolling.
                  paddingBottom: window.screen.height,
                }}
                drag="y"
                dragConstraints={{ top: 0 }}
                onDragStart={(e) => {
                  e.stopImmediatePropagation();
                }}
                onDrag={(e) => {
                  e.stopImmediatePropagation();
                }}
                onDragEnd={(e, { offset, velocity }) => {
                  e.stopImmediatePropagation();
                  if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
                    onOpenChange(false);
                  } else {
                    animate(y, 0, { ...inertiaTransition, min: 0, max: 0 });
                  }
                }}
                {...restProps}
              >
                <motion.div
                  style={{
                    height: h,
                  }}
                  css={css`
                    display: grid;
                    grid-template-rows: auto 1fr;
                    gap: var(--size-200);
                  `}
                >
                  <div
                    data-drag-affordance
                    css={css`
                      margin-inline: auto;
                      width: var(--size-800);
                      height: var(--size-050);
                      background-color: var(--clr-neutral-300);
                      margin-block-start: var(--size-100);
                      border-radius: var(--border-radius-pill);
                    `}
                  />
                  <div
                    css={css`
                      display: grid;
                      grid-template-rows: auto 1fr;
                      gap: var(--size-300);
                    `}
                  >
                    <header
                      css={css`
                        position: relative;
                        padding-inline: var(--size-200);
                      `}
                    >
                      <h2
                        className="heading-small"
                        css={css`
                          text-align: center;
                        `}
                      >
                        {title}
                      </h2>
                      <Button
                        onPress={() => onOpenChange(false)}
                        iconOnly
                        variant="transparent"
                        icon={X}
                        css={css`
                          position: absolute;
                          inset: 0;
                          left: auto;
                          right: var(--size-100);
                          margin: auto;
                        `}
                      ></Button>
                    </header>
                    <main
                      css={css`
                        container: modal-content / size;
                      `}
                    >
                      {children}
                    </main>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};

export default Modal;
