import { shallow } from 'zustand/shallow';
import { ArrowCounterClockwise, List } from '@phosphor-icons/react';
import { useState } from 'react';
import { Drawer, Tooltip } from '@mantine/core';
import useQuestion from '@/store/question';
import useTimer, { saveToStorage } from '@/store/timer';
import formatMS from '@/lib/formatMS';

const getColorByTime = (time: number): [string, string, string] => {
  if (time <= 90 * 1000) return ['text-green-600', 'bg-green-100', 'border-green-600']; // 1 min 30s
  if (time <= 60 * 2 * 1000 + 45_000) return ['text-yellow-600', 'bg-yellow-100', 'border-yellow-600']; // 2 min 45s

  return ['text-red-600', 'bg-red-100', 'border-red-600']; // 3 min or above
};

const Navbar = () => {
  const number = useQuestion((s) => s.number);
  const [totalNumbers] = useQuestion((s) => [s.total], shallow);
  const [local, total, all, resetTimer, stop] = useTimer((s) => [s.local, s.total, s.all, s.reset, s.stop], shallow);

  const [openSide, setOpenSide] = useState(false);

  return (
    <nav className="bg-red-500 text-white py-4 px-8 flex justify-between items-center">
      <h1 className="font-semibold text-lg">Question {number}</h1>

      <section className="text-center">
        <Tooltip label="Current time" withArrow offset={5} color="orange">
          <h2 className="text-2xl font-semibold">{formatMS(local)}</h2>
        </Tooltip>

        <Tooltip label="Total time" withArrow offset={5} color="orange">
          <p className="font-sm">{formatMS(total)}</p>
        </Tooltip>
      </section>

      <section>
        <span className="cursor-pointer transition-colors z-50 flex gap-3">
          <Tooltip label="Reset timer" withArrow offset={10} color="orange">
            <ArrowCounterClockwise
              weight="bold"
              size={24}
              onDoubleClick={() => {
                all.clear();
                resetTimer();

                saveToStorage();
              }}
              onClick={() => {
                all.delete(number);
                resetTimer();

                saveToStorage();
              }}
            />
          </Tooltip>
          <List onClick={() => setOpenSide(!openSide)} weight="bold" size={24} />
        </span>

        <Drawer size="xl" position="right" opened={openSide} onClose={() => setOpenSide(false)} title="Questions" classNames={{ title: 'text-2xl font-semibold', drawer: 'overflow-y-auto text-zinc-700 font-inter', header: 'p-8 sticky bg-white top-0 mb-0 z-10' }}>
          <section className="p-8 pt-0 flex flex-col gap-2">
            {Array(totalNumbers).fill(0).map((_, i) => {
              const [text, bg, border] = getColorByTime(all.get(i + 1) ?? 0);

              return (
                <section
                  key={i}
                  className="grid grid-cols-[1fr_4fr] cursor-pointer"
                  onClick={() => {
                    stop();
                    setOpenSide(false);

                    useQuestion.setState({ number: i + 1 });
                    useTimer.setState((s) => ({
                      local: s.all.get(i + 1) ?? 0,
                    }));
                  }}
                >
                  <p>No. {i + 1}</p>

                  <section className="flex items-center">
                    {!all.has(i + 1) && <p className="text-sm px-[5px] border rounded border-zinc-700 bg-zinc-200 opacity-50">Not attempted</p>}

                    {all.has(i + 1) && (
                      <span className={`text-sm px-[5px] border rounded ${text} ${bg} ${border}`}>
                        {formatMS(all.get(i + 1) as number)}
                      </span>
                    )}
                  </section>
                </section>
              );
            })}
          </section>

          <h3 className="p-8 pt-0">Total <span className="font-bold">{formatMS(total)}</span></h3>
        </Drawer>
      </section>
    </nav>
  );
};

export default Navbar;