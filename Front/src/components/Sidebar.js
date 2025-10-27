import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';

const Sidebar = ({ toggleModal, hasUnreadDocuments }) => {
    const navigate = useNavigate();
    const [showExitModal, setShowExitModal] = useState(false);

    const role = localStorage.getItem('role');

    const handleCloseExitModal = () => setShowExitModal(false);
    const handleShowExitModal = () => setShowExitModal(true);

    const handleExitApp = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
        navigate('/admin');
        handleCloseExitModal();
    };

    const handleAdminPanelEnter = () => {
        navigate('/adminPanel');
    }

    const handleAlertsMapEnter = () => {
        navigate('/alerts-map');
    };

    return (
        <>
            <aside className="sidebar">
                <div className="tools">
                    {/* Documents icon */}
                    {role === 'CHIEF_OF_TROOPS_SERVICE' ? (
                        <div className={`icon documents`} onClick={toggleModal} title="Відправка документів">
                            <img src={require('../img/file-transfer.png')} alt="Docs-menu" style={{ width: "30px" }} />
                        </div>
                    ) : (
                        <div className={`icon documents ${hasUnreadDocuments ? 'notification' : ''}`} onClick={toggleModal} title="Документи">
                            <img src={require('../img/docs.png')} alt="Docs-menu" style={{ width: "30px" }} />
                        </div>
                    )}

                    {/* Alerts Map icon (only for DUTY_OFFICER_OF_MILITARY_UNIT) */}
                    {role === 'DUTY_OFFICER_OF_MILITARY_UNIT' && (
                        <div className="icon alerts-map-icon" onClick={handleAlertsMapEnter} title="Карта повітряних тривог">
                            <img src={require('../img/siren.png')} alt="Alerts Map" style={{ width: "30px" }} />
                        </div>
                    )}

                    {/* Admin panel for CHIEF_OF_TROOPS_SERVICE */}
                    {role === 'CHIEF_OF_TROOPS_SERVICE' && (
                        <div className="chief-of-troops-container">
                            <div className="icon admin-panel" title="Вхід в адмін панель" onClick={handleAdminPanelEnter}>
                                <img src={require('../img/admin.png')} alt="admin" style={{ width: "30px", height: "30px" }} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="icon exit" title="Вихід">
                    <img
                        src={require('../img/exit.png')}
                        alt="Exit"
                        style={{ width: "30px" }}
                        onClick={handleShowExitModal}
                    />
                </div>
            </aside>

            <Modal show={showExitModal} onHide={handleCloseExitModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Підтвердження виходу</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Ви впевнені що хочете вийти?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseExitModal}>
                        Ні
                    </Button>
                    <Button variant="primary" onClick={handleExitApp}>
                        Так
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Sidebar;
