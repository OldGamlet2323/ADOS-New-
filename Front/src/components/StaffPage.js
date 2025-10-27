import KyivTime from './KyivTime';
import Navbar from "./Navbar";
// MiniSchedule removed from StaffPage per request (no schedules on duty officer page)
import { useEventTimer } from '../hooks/useEventTimer'; // Імпортуємо наш хук

// Коментарі до невикористовуваних імпортів можна видалити
// import Report from "./Report"; 
// import Instruction from './Instruction';

function StaffPage({ events }) {
    // Вся логіка таймера тепер інкапсульована в хуці
    const { timeLeft, currentEventIndex } = useEventTimer(events);

    // Функція calculateTimeLeft та громіздкий useEffect для таймера видалені

    return (
        <div className="container">
            <div className="left-section">
                <KyivTime /> {/* Display Kyiv time here */}
            </div>
            <div className="navbar-section">
                <Navbar
                    events={events}
                    currentEventIndex={currentEventIndex}
                    timeLeft={timeLeft}
                />
            </div>
            {/* schedule-section removed for duty officer page - no schedules displayed here */}

            {/* Закоментовані секції залишаються без змін */}
            {/* <div className="reports-section">
                <Report reportRef={reportRef} />
            </div>
            <div className="instructions-section">
                <Instruction />
            </div> */}
        </div>
    );
}

export default StaffPage;