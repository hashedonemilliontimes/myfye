import { Asset } from "@/features/assets/types";
import { FlagComponent } from "country-flag-icons/react/3x2";

export type CurrencyType = "brl" /*| "usd"*/ | "mxn";

export interface Currency {
  id: CurrencyType;
  label: string;
  value: CurrencyType;
  symbol: string;
  icon: FlagComponent;
}

interface Payin {
  currency: /*"usd"*/ "brl" | "mxn";
  achRoutingNumber: string | null;
  achAccountNumber: string | null;
  senderAmount: number | null;
  clabeAddress: string | null;
  pixAddress: string | null;
  beneficiary: {
    name: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
  };
}

export interface Transaction {
  id: string | null;
  amount: number | null;
  formattedAmount: string;
  fee: number;
  presetAmount: string | null;
}

export interface BankAccountTransaction extends Transaction {
  payin: Payin;
}

export type DepositOffChainOverlay =
  | "bankAccount"
  | "bankAccountInstructions"
  | "privy";

export type PresetAmountOption = "10" | "50" | "100" | "max" | null;
