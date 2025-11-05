import { useState, useEffect } from "react";
import KyivTime from './KyivTime';
import Navbar from "./Navbar";
import Report from "./Report";
import Instruction from './Instruction';
import MiniSchedule from './MiniSchedule';
import DocumentsTable from "./Documents/DocumentsTable";
import PersonnelTable from "./PersonnelTable";
import ToolsPanel from './ToolsPanel'; // ЗАЛИШАЄТЬСЯ
import { useEventTimer } from '../hooks/useEventTimer';
import Notification from "./Notification";

function DutyLayout({ events }) {
    const { timeLeft, currentEventIndex } = useEventTimer(events);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPersonnelTableOpen, setIsPersonnelTableOpen] = useState(false);

    // unreadDocumentsCount залишаємо, він потрібен для DocumentsTable
    const [unreadDocumentsCount, setUnreadDocumentsCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');
    const [documents, setDocuments] = useState([]);

    // reportNotifications видалено, він був тільки для Sidebar

    const [eventNotification, setEventNotification] = useState(null);
    const [notificationShownForEvent, setNotificationShownForEvent] = useState(null);

    const handleBCSClick = () => {
        window.open('/personnel-table', '_blank', 'noopener,noreferrer');
    };    const togglePersonnelTable = () => setIsPersonnelTableOpen(prev => !prev);

    const fetchDocuments = async () => {
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
            setUnreadDocumentsCount(data.filter(doc => !doc.read).length); // Залишаємо
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [role, token]);

    // ... (useEffect для eventNotification залишається без змін) ...
    useEffect(() => {
        const nextEvent = events[currentEventIndex + 1];

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

                    if (secondsLeft <= 600 && notificationShownForEvent !== nextEvent.id) {
                        const message = `Увага! Через 10 хвилин: ${nextEvent.eventName}`;
                        setEventNotification(message);
                        setNotificationShownForEvent(nextEvent.id);
                    }
                }
            }
        }
    }, [timeLeft, currentEventIndex, events, notificationShownForEvent]);


    return (
        <div className="main-layout">
            <ToolsPanel
                onDocumentsClick={handleBCSClick}
                onBCSClick={togglePersonnelTable}
            />

            {eventNotification && (
                <Notification
                    message={eventNotification}
                    onClose={() => setEventNotification(null)}
                />
            )}
            <div className="wrapper">
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

                {/* ТАБЛИЦЯ БЧС (PersonnelTable) тепер з'являється БЕЗ Sidebar */}
                {isPersonnelTableOpen && (
                    <div className="personnel-section">
                        <PersonnelTable />
                    </div>
                )}

                {/* Решта секцій залишається */}
                <div className="schedule-section">
                    <div className="mini-schedules">
                        <MiniSchedule
                            title="Графік інститут"
                            editable={true}
                            scheduleId={'institute'}
                        />
                        <MiniSchedule
                            title="Графік чергового"
                            editable={true}
                            allowSubActions={true}
                            scheduleId={'duty'}
                        />
                    </div>
                </div>
                <div className="reports-section">
                    <Report />
                </div>
                <div className="instructions-section">
                    <Instruction />
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={handleBCSClick}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={handleBCSClick}>
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

export default DutyLayout;