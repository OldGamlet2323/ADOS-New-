import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AlertsMapPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const alertsMapUrl = "https://alerts.in.ua/";

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleIframeLoad = () => setIsLoading(false);
    const handleBackClick = () => navigate(-1);

    const requestFullscreen = (element) => {
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();
    };

    const exitFullscreen = () => {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    };

    const toggleFullscreenMode = () => {
        const mapElement = document.getElementById('alerts-map-iframe-container');
        if (!document.fullscreenElement && mapElement) requestFullscreen(mapElement);
        else exitFullscreen();
    };

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    const formatTime = (date) => date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formatDate = (date) => date.toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' });

    const fullscreenStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        padding: 0,
        margin: 0,
        backgroundColor: 'black'
    };

    return (
        <div className={`wrapper ${isFullscreen ? '' : 'no-sidebar'}`} style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
            <div className={`container-fluid d-flex flex-column ${isFullscreen ? 'p-0' : 'p-3'}`}
                style={isFullscreen ? fullscreenStyles : { minHeight: 'calc(100vh - 40px - 4.3rem)' }}>
                {!isFullscreen && (
                    <header className="row mb-4">
                        <div className="col-4">
                            <button onClick={handleBackClick} className="btn btn-outline-light">
                                ← Назад
                            </button>
                        </div>
                        <div className="col-4 text-center">
                            <div className="bg-dark text-white p-2 rounded shadow-sm border border-secondary">
                                <div className="fs-4 fw-bold">{formatTime(currentTime)}</div>
                                <div className="small">{formatDate(currentTime)}</div>
                            </div>
                        </div>
                        <div className="col-4 text-end">
                            <button onClick={toggleFullscreenMode} className="btn btn-success">
                                {isFullscreen ? 'Вихід з повноекранного' : 'Повний екран'}
                            </button>
                        </div>
                    </header>
                )}

                {!isFullscreen && (
                    <div className="text-center mb-4">
                        <h1 className="display-4" style={{ color: "#e0ebeb" }}>Карта Повітряних Тривог</h1>
                        <p className="lead" style={{ color: "#cdd4d4" }}>Онлайн моніторинг по всій Україні</p>
                    </div>
                )}

                <div
                    id="alerts-map-iframe-container"
                    className={`row flex-grow-1 ${isFullscreen ? 'p-0 m-0' : 'mx-md-3 mb-3'}`}
                    style={isFullscreen ? fullscreenStyles : {}}
                >
                    <div className={`col-12 ${isFullscreen ? 'p-0' : 'p-0'}`}>
                        <div className={`card h-100 ${isFullscreen ? 'border-0 rounded-0' : 'shadow'}`} style={{ backgroundColor: isFullscreen ? 'black' : '#f8f9fa' }}>
                            {isLoading && !isFullscreen && (
                                <div className="position-absolute top-50 start-50 translate-middle text-center z-2">
                                    <div className="spinner-border text-primary mb-3" role="status">
                                        <span className="visually-hidden">Завантаження...</span>
                                    </div>
                                    <h5>Завантаження карти...</h5>
                                    <p className="text-muted small">Підключення до сервісу alerts.in.ua</p>
                                </div>
                            )}
                            <iframe
                                src={alertsMapUrl}
                                title="Карта повітряних тривог alerts.in.ua"
                                className={`w-100 h-100 ${isFullscreen ? '' : 'rounded'}`}
                                style={{ border: isFullscreen ? 'none' : '1px solid #dee2e6' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                onLoad={handleIframeLoad}
                            >
                                <div className="d-flex align-items-center justify-content-center h-100">
                                    <div className="text-center">
                                        <p className="lead mb-3">Ваш браузер не підтримує iframe</p>
                                        <a href={alertsMapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                                            Відкрити карту
                                        </a>
                                    </div>
                                </div>
                            </iframe>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default AlertsMapPage;