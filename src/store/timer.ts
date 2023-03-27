import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import useQuestion from './question';

const INTERVAL = 100;

const useTimer = create(
  combine({
    all: new Map<number, number>(),
    total: 0,
    local: 0,
    activeNumber: -1,
    started: false,

    continuous: false,

    timer: null as NodeJS.Timer | null
  }, (set, get) => ({
    start: (number: number) => {
      const { timer } = get();

      if (timer) return;

      set({
        activeNumber: number,
        started: true,
        timer: setInterval(() => {
          set((s) => ({ local: s.local + INTERVAL, total: s.total + INTERVAL }));
        }, INTERVAL)
      });
    },
    stop: () => {
      const { timer, activeNumber, local } = get();

      if (!timer) return;

      clearInterval(timer);

      set({
        timer: null,
        started: false,
        all: new Map([...get().all, [activeNumber, local]])
      });
    },
    saveLocal: () => {
      const { activeNumber, local } = get();

      set((s) => ({ all: new Map([...s.all, [activeNumber, local]]) }));
    },
    reset: () => set((s) => ({ local: 0, total: [...s.all.values()].reduce((acc, i) => acc + i, 0) }))
  }))
);

export const saveToStorage = () => {
  const { all } = useTimer.getState();

  const json = [...all.entries()];

  localStorage.setItem('all', JSON.stringify(json));
};

export const loadFromStorage = () => {
  const json = localStorage.getItem('all');
  const continuous = localStorage.getItem('continuous');

  useTimer.setState({ continuous: continuous === 'true' });

  if (!json) return;

  // validation
  try {
    const data = JSON.parse(json);
    // eslint-disable-next-line no-restricted-globals
    if (!Array.isArray(data) || data.some((item) => !Array.isArray(item) && isNaN(item[0]) && isNaN(item[1]))) throw new Error('Invalid storage data');

    const current = useQuestion.getState().number;
    const all = new Map(data as [number, number][]);

    useTimer.setState({
      all,
      local: all.get(current) ?? 0,
      total: [...all.values()].reduce((acc, i) => acc + i, 0)
    });
  } catch {
    // eslint-disable-next-line no-console
    console.error('Invalid storage data');
  }
};

export default useTimer;