import { useState } from "react";
import KyivTime from './KyivTime';
import Navbar from "./Navbar";
import DocumentForm from "./Documents/DocumentForm";
import MiniSchedule from './MiniSchedule';
import { useEventTimer } from '../hooks/useEventTimer';

function CommandantPage({ events }) {
    const { timeLeft, currentEventIndex } = useEventTimer(events);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(prev => !prev);

    return (
        <div className="main-layout">
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
                <div className="schedule-section">
                    <div className="mini-schedules">
                        {/* Simple split: first half of events -> institute, second half -> duty */}
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

                {isModalOpen && (
                    <div className="modal-overlay" onClick={toggleModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-btn" onClick={toggleModal}>&times;</button>
                            <DocumentForm />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommandantPage;
