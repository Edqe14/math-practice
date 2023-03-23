import { Button } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import useQuestion from '@/store/question';
import Key from '@/components/Key';
import Navbar from '@/components/Navbar';
import useTimer from '@/store/timer';

export default function Index() {
  const number = useQuestion((s) => s.number);
  const [next, prev] = useQuestion((s) => [s.next, s.prev], shallow);
  const [startTimer, stopTimer, resetTime, started] = useTimer((s) => [s.start, s.stop, s.reset, s.started], shallow);
  const allTimes = useTimer((s) => s.all);

  useEffect(() => {
    next();
  }, []);

  const setTime = (num: number) => {
    const time = allTimes.get(num) ?? 0;
    useTimer.setState({ local: time });
  };

  const rollNext = () => {
    stopTimer();
    resetTime();

    const i = next();
    setTime(i);
  };

  const rollPrev =() => {
    stopTimer();
    resetTime();

    const i = prev();
    if (i !== -1) setTime(i);
  };

  const toggleTime = () => {
    if (started) return stopTimer();

    allTimes.delete(number);

    resetTime();
    startTimer(number);
  };

  useHotkeys([
    ['ArrowRight', rollNext],
    ['D', rollNext],

    ['ArrowLeft', rollPrev],
    ['A', rollPrev],

    ['Space', toggleTime],
    ['W', toggleTime]
  ]);

  return (
    <main className="font-inter w-screen h-screen flex flex-col text-zinc-700">
      <Navbar />

      <section className="flex-grow py-16 px-8 flex flex-col gap-8 items-center">
        <section>
          <img src={`/questions/${number}.png`} decoding="async" loading="lazy" alt="" className="select-none" draggable={false} />
        </section>

        <section className="flex gap-2">
          <Button leftIcon={<Key><ArrowLeft weight="bold" size={16} /></Key>} onClick={rollPrev}>Previous</Button>
          <Button
            leftIcon={
              <Key>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-space" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M4 10v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1 -1v-3" />
                </svg>
              </Key>
            }
            onClick={toggleTime}
            color="yellow"
          >
            Time
          </Button>
          <Button leftIcon={<Key><ArrowRight weight="bold" size={16} /></Key>} onClick={rollNext}>Next</Button>
        </section>
      </section>
    </main>
  );
}

