import { AbstractedAsset, FiatCurrency } from "../assets/types";
import { Contact } from "../contacts/contacts.types";
import { User } from "../users/users.types";

export type PayTransactionStatus = "idle" | "success" | "fail" | "signed";

export type PayTransactionType = "send" | "request";

export type PresetAmountOption = "10" | "50" | "100" | "max" | null;

export interface PayTransaction {
  id: string | null;
  status: PayTransactionStatus;
  type: PayTransactionType;
  abstractedAssetId: AbstractedAsset["id"] | null;
  amount: number | null;
  formattedAmount: string;
  fiatCurrency: FiatCurrency;
  fee: number | null;
  user: User | null;
  presetAmount: PresetAmountOption;
}
