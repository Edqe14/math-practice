import { Button } from '@mantine/core';
import { useHotkeys, useViewportSize } from '@mantine/hooks';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { openModal } from '@mantine/modals';
import ReactConfetti from 'react-confetti';
import useQuestion from '@/store/question';
import Key from '@/components/Key';
import Navbar from '@/components/Navbar';
import useTimer, { loadFromStorage, saveToStorage } from '@/store/timer';

const AnswerModal = ({ number }: { number: number }) => (
  <section>
    <img src={`/answers/${number}.webp`} />
  </section>
);

export default function Index() {
  const number = useQuestion((s) => s.number);
  const [next, prev, total] = useQuestion((s) => [s.next, s.prev, s.total], shallow);
  const [startTimer, stopTimer, resetTime, started, continuous, saveLocal] = useTimer((s) => [s.start, s.stop, s.reset, s.started, s.continuous, s.saveLocal], shallow);
  const allTimes = useTimer((s) => s.all);
  const { width, height } = useViewportSize();

  const setTime = (num: number) => {
    const time = allTimes.get(num) ?? 0;
    useTimer.setState({ local: time });
  };

  const preloadImage = (i: number) => {
    const url = `/questions/${i}.webp`;
    const img = new Image();
    img.src = url;

    return img;
  };

  const rollNext = () => {
    if (started) {
      if (!continuous) stopTimer();
      else saveLocal();
    }

    resetTime();

    const i = next();
    if (!continuous && started || !started) setTime(i);
    else useTimer.setState({ activeNumber: i });

    if (i + 1 < total) preloadImage(i + 1);
  };

  const rollPrev =() => {
    if (started) {
      if (!continuous) stopTimer();
      else saveLocal();
    }

    resetTime();

    const i = prev();
    if (i !== -1) {
      if (!continuous && started || !started) setTime(i);
      else useTimer.setState({ activeNumber: i });

      if (i > 1) preloadImage(i - 1);
    }
  };

  const toggleTime = () => {
    if (started) {
      stopTimer();
      saveToStorage();

      return;
    }

    allTimes.delete(number);
    startTimer(number);
  };

  const showAnswer = () => {
    openModal({
      title: `Answer for question ${number}`,
      classNames: {
        title: 'text-xl font-semibold',
      },
      size: 'xl',
      centered: true,
      children: <AnswerModal number={number} />,
    });
  };

  useEffect(() => {
    rollNext();
    loadFromStorage();

    openModal({
      title: 'It\'s done!! 🎉',
      children: 'Exam is over but feel free to use this app for practice.',
      classNames: {
        title: 'text-xl font-semibold',
      },
      centered: true,
    });
  }, []);

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

      <ReactConfetti
        width={width}
        height={height}
        numberOfPieces={300}
        recycle={false}
        className="z-[100000]"
      />

      <section className="flex-grow py-16 px-8 flex flex-col gap-8 items-center">
        <section>
          <img src={`/questions/${number}.webp`} decoding="async" loading="lazy" alt="" className="select-none" draggable={false} />
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

        <section>
          <p onClick={showAnswer} className="text-red-300 cursor-pointer transition-colors duration-200 ease-in-out hover:text-red-500 hover:underline hover:underline-offset-4">Reveal answer</p>
        </section>
      </section>
    </main>
  );
}

