import { fetchCodes } from 'src/api/codeApi';
import { ICode } from 'src/types/code';
import { create } from 'zustand';

interface CodeState {
  codes: Record<string, ICode[]>;
  isLoading: boolean;
  fetchCodesByGroup: (code_group_id: string) => void;
}

export const useCodeStore = create<CodeState>((set, get) => ({
  codes: {},
  isLoading: false,
  fetchCodesByGroup: async (code_group_id: string) => {
    // 이미 존재하면 skip
    if (get().codes[code_group_id]) return;

    set({ isLoading: true });
    try {
      const codeList = await fetchCodes(code_group_id);
      set({ codes: { ...get().codes, [code_group_id]: codeList } });
    } catch (error) {
      console.error(`Error fetching codes By [${code_group_id}]:`, error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
