// store.ts
import { writable } from "svelte/store";

export interface StoreState {
  isOpen: boolean;
  companyInfo?: {
    fullName: string;
    kvnID: string;
  };
}

export const CompanyInfoDialogStore = writable<StoreState>({
  isOpen: false,
  companyInfo: undefined,
});
