import { create } from "zustand";

interface WaitListI {
  waitlistIdCreated: string | null;
  setWaitlistIdCreated: (waitlistId: string) => void;
}

const useWaitlistStore = create<WaitListI>((set) => ({
  waitlistIdCreated: null,
  setWaitlistIdCreated: (waitlistId: string) => {
    set({ waitlistIdCreated: waitlistId });
  }
}));

export default useWaitlistStore;
