// global store for our active users
// VERY VERY IMP

import { create } from "zustand";

interface ActiveListStore {
    members: string[];
    add: (id: string) => void;
    remove: (id: string) => void;
    set: (id: string[]) => void;
};

// very IMP : () => ({}) means it return immediate obj unlike () => {}
// its just the function or hook. compare with zustand usage in my airbnb clone if confusion
const useActiveList = create<ActiveListStore>((set) => ({
    
    // active members
    members: [],
    
    // adding user one by one  in members when we open
    add: (id) => set((state) => ({ members: [...state.members, id] })),

    // removin a single user from memebers
    remove: (id) => set((state) => ({ members: state.members.filter((memberId) => memberId !== id) })),

    // for initial load of all active members
    set: (ids) => set({ members: ids })

  }));



export default useActiveList;