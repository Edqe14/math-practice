import { create } from 'zustand';
import { combine } from 'zustand/middleware';

const useQuestion = create(
  combine({
    number: 0,
    total: 40,
    picked: new Set(),

    randomize: false,
  }, (set, get) => ({
    next: () => {
      const { total, picked, randomize, number } = get();

      const all = new Array(total).fill(0).map((_, i) => i + 1);

      if (picked.size === total) {
        picked.clear();
      }

      const pickable = all.filter((n) => !picked.has(n));
      const pick = randomize ? pickable[Math.floor(Math.random() * pickable.length)] : Math.max(Math.min(number + 1, total), 1);
      picked.add(pick);

      set({ number: pick });

      return pick;
    },
    prev: () => {
      const { number, randomize, total, picked } = get();
      const next = randomize ? [...picked.values()][picked.size - 2] as number | undefined : Math.max(Math.min(number - 1, total), 1);

      if (next === undefined) return -1;

      set({ number: next });

      return next;
    }
  }))
);

export default useQuestion;