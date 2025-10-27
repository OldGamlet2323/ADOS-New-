import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const calculateTimeLeft = (eventTime) => {
    const now = new Date();
    const eventDate = new Date(`${now.toISOString().split("T")[0]}T${eventTime}`);
    const difference = eventDate - now;

    if (difference > 0) {
        return {
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            totalMilliseconds: difference,
        };
    }
    return { hours: 0, minutes: 0, seconds: 0, totalMilliseconds: 0 };
};

export const useEventTimer = (events) => {
    const location = useLocation();
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [alertTriggered, setAlertTriggered] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            if (events.length > 0 && location.pathname !== "/admin") {
                const currentEvent = events[currentEventIndex];
                const newTimeLeft = calculateTimeLeft(currentEvent.eventTime);
                setTimeLeft(newTimeLeft);

                if (newTimeLeft.totalMilliseconds <= 600000 && !alertTriggered) {
                    // Можна додати логіку сповіщень тут
                    // alert(`Провести перевірку події: ${currentEvent.eventName}`);
                    setAlertTriggered(true);
                }

                if (newTimeLeft.totalMilliseconds <= 0 && currentEventIndex < events.length - 1) {
                    setAlertTriggered(false);
                    setCurrentEventIndex((prevIndex) => prevIndex + 1);
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [events, currentEventIndex, alertTriggered, location.pathname]);

    return { timeLeft, currentEventIndex, alertTriggered, setAlertTriggered, setCurrentEventIndex, setTimeLeft };
};