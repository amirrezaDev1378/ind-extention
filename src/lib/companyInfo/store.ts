// store.ts
import { writable } from "svelte/store";

export interface StoreState {
  isOpen: boolean;
  companyInfo?: {
    fullName: string;
    predictedName?: string;
    kvnID: string;
  };
}

export const CompanyInfoDialogStore = writable<StoreState>({
  isOpen: false,
  companyInfo: undefined,
});
