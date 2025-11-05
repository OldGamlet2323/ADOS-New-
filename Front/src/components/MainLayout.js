import { useState, useEffect } from "react";
import KyivTime from './KyivTime';
import Navbar from "./Navbar";
import Schedule from './Schedule';
import Report from "./Report";
import Instruction from './Instruction';
import DocumentsTable from "./Documents/DocumentsTable";
import { useEventTimer } from '../hooks/useEventTimer';
import Notification from "./Notification";

function MainLayout({ events }) {
    const { timeLeft, currentEventIndex } = useEventTimer(events);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [unreadDocumentsCount, setUnreadDocumentsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');
    const [documents, setDocuments] = useState([]);
    const [reportNotifications, setReportNotifications] = useState([]);
    const [eventNotification, setEventNotification] = useState(null);
    // ... інші ваші стани (useState)
    const [notificationShownForEvent, setNotificationShownForEvent] = useState(null);

    const toggleModal = () => setIsModalOpen(prev => !prev);

    const fetchDocuments = async () => {
        // ... ваша функція fetchDocuments без змін ...
        try {
            const response = await fetch(`http://localhost:8080/api/documents?sendTo=${role}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }

            const data = await response.json();
            const updatedDocuments = data.map(doc => {
                let updatedDoc = { ...doc };
                switch (updatedDoc.createBy) {
                    case 'CHIEF_OF_TROOPS_SERVICE':
                        updatedDoc.createBy = 'Начальник служби військ';
                        break;
                    default:
                        break;
                }
                switch (updatedDoc.typeOfDocument) {
                    case 'DAILY_ORDER':
                        updatedDoc.typeOfDocument = 'Добовий наказ';
                        break;
                    case 'PERSONNEL_EXPENDITURE':
                        updatedDoc.typeOfDocument = 'Розхід';
                        break;
                    default:
                        break;
                }
                return updatedDoc;
            });

            setDocuments(updatedDocuments);
            setUnreadDocumentsCount(data.filter(doc => !doc.read).length);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [role, token]);

    // --- ЗМІНИ ТУТ ---
    useEffect(() => {
        const nextEvent = events[currentEventIndex + 1];

        // Коли починається нова поточна подія, скидаємо наш запобіжник.
        // Це дозволить показати сповіщення для наступної події, коли прийде її час.
        if (notificationShownForEvent && events[currentEventIndex]?.id !== notificationShownForEvent) {
            setNotificationShownForEvent(null);
        }

        if (nextEvent) {
            const nextTimeString = nextEvent.eventTime;

            if (typeof nextTimeString === 'string' && nextTimeString.includes(':')) {
                const now = new Date();
                const today = new Date();
                const [nextHours, nextMinutes] = nextTimeString.split(':');
                const nextDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), nextHours, nextMinutes);

                if (nextDate > now) {
                    const differenceInMilliseconds = nextDate - now;
                    const secondsLeft = Math.floor(differenceInMilliseconds / 1000);

                    // --- КЛЮЧОВА УМОВА ---
                    // 1. Перевіряємо, чи залишилось 10 хвилин (600 секунд) або менше.
                    // 2. Перевіряємо, чи ми ВЖЕ показували сповіщення для цієї події.
                    if (secondsLeft <= 600 && notificationShownForEvent !== nextEvent.id) {

                        console.log(`ПОКАЗУЄМО СПОВІЩЕННЯ для події: ${nextEvent.name}`);

                        const message = `Увага! Через 10 хвилин: ${nextEvent.eventName}`; // Виправлено на .name

                        // Встановлюємо сповіщення
                        setEventNotification(message);

                        // І одразу "зводимо запобіжник", щоб більше не показувати для цієї події
                        setNotificationShownForEvent(nextEvent.id);
                    }
                }
            }
        }
    }, [timeLeft, currentEventIndex, events, notificationShownForEvent]); // Додаємо notificationShownForEvent до залежностей

    return (
        <div className="main-layout">
            {eventNotification && (
                <Notification
                    message={eventNotification}
                    onClose={() => setEventNotification(null)}
                />
            )}
            <div className="wrapper">
                {/* ... решта вашого JSX без змін ... */}
                <div className="left-section">
                    <KyivTime />
                </div>
                <div className="navbar-section">
                    <Navbar
                        events={events}
                        currentEventIndex={currentEventIndex}
                        timeLeft={timeLeft}
                    />
                </div>
                <div className="schedule-section">
                    <Schedule
                        events={events}
                        currentEventIndex={currentEventIndex}
                    />
                </div>
                <div className="reports-section">
                    <Report />
                </div>
                <div className="instructions-section">
                    <Instruction />
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={toggleModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={toggleModal}>
                            &times;
                        </button>
                        <DocumentsTable
                            setUnreadDocumentsCount={setUnreadDocumentsCount}
                            documents={documents}
                            setDocuments={setDocuments}
                            fetchDocuments={fetchDocuments}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
export default MainLayout;