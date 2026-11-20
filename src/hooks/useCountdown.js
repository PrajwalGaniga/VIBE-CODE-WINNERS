import { useState, useEffect, useRef } from 'react';

/**
 * Reusable React hook for precision deadline countdown.
 *
 * @param {string} targetDateISO - Unambiguous ISO timestamp (e.g. 2026-11-20T21:00:00+05:30)
 * @param {Function} [onDeadlineReached] - Callback invoked when the countdown reaches 0
 */
export function useCountdown(targetDateISO, onDeadlineReached) {
  const targetTime = new Date(targetDateISO).getTime();
  const callbackRef = useRef(onDeadlineReached);

  useEffect(() => {
    callbackRef.current = onDeadlineReached;
  }, [onDeadlineReached]);

  const calculateTime = () => {
    const diff = targetTime - Date.now();
    if (diff <= 0) {
      return {
        totalSeconds: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPastDeadline: true,
      };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      totalSeconds,
      hours,
      minutes,
      seconds,
      isPastDeadline: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTime);
  const reachedTriggeredRef = useRef(false);

  useEffect(() => {
    // Initial calculation check
    const initial = calculateTime();
    setTimeLeft(initial);

    if (initial.isPastDeadline) {
      if (!reachedTriggeredRef.current) {
        reachedTriggeredRef.current = true;
        if (callbackRef.current) callbackRef.current();
      }
      return;
    }

    const intervalId = setInterval(() => {
      const updated = calculateTime();
      setTimeLeft(updated);

      if (updated.isPastDeadline) {
        clearInterval(intervalId);
        if (!reachedTriggeredRef.current) {
          reachedTriggeredRef.current = true;
          if (callbackRef.current) callbackRef.current();
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetTime]);

  const pad = (n) => n.toString().padStart(2, '0');

  return {
    ...timeLeft,
    formattedHours: pad(timeLeft.hours),
    formattedMinutes: pad(timeLeft.minutes),
    formattedSeconds: pad(timeLeft.seconds),
  };
}
