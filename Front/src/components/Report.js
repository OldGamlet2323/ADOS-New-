import React, { useState, useEffect } from "react";


const Report = ({ reportRef, }) => {
    const [selectedReport, setSelectedReport] = useState(null);
    const [reportDetails, setReportDetails] = useState(null);
    const [reports, setReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('authToken')
    const [reportCompleted, setReportCompleted] = useState(false); // Додано стан
    const fetchReports = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/reports", {
                credentials: 'include',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch reports");
            }
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports:", error);
            setError("Unable to fetch reports. Please try again later.");
        }
    };
    useEffect(() => {
        (async () => { await fetchReports(); setLoading(false); })();
    }, []);

    const handleReportClick = async (reportId) => {
        setSelectedReport(reportId);

        try {
            const response = await fetch(`http://localhost:8080/api/reports/${reportId}`, {
                credentials: 'include',
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch report details");
            }

            const data = await response.json();
            setReportDetails(data.description);
            setReportCompleted(data.done)
        } catch (error) {
            console.error("Error fetching report details:", error);
            setReportDetails("Помилка при завантаженні деталей доповіді");
        }
    };

    const handleReportCompleted = async () => {
        if (!selectedReport) return; // Якщо доповідь не вибрана, вийти

        try {
            const response = await fetch(`http://localhost:8080/api/reports/${selectedReport}/done`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to mark report as done');
            }

            setReportCompleted(true); // Оновити стан після успішного запиту
            // Оновити список доповідей, щоб відобразити зміни
            fetchReports();
        } catch (error) {
            console.error('Error marking report as done:', error);
            setError('Failed to mark report as done. Please try again.');
        }
    };

    const filteredReports = reports.filter((report) =>
        report.reportName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (loading) {
        return <div>Завантаження...</div>;
    }

    return (
        <div className="reports-wrapper">
            <div className="search-input-container">
                <input
                    type="text"
                    placeholder="Пошук доповіді..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <h2>Доповіді</h2>

            </div>

            <div className="reports-container">
                <div className="reports">
                    {error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <ul>
                            {filteredReports.map((report) => (
                                <li
                                    key={report.id}
                                    onClick={() => handleReportClick(report.id)}
                                    ref={report.id === 2 ? reportRef : null}
                                    className={selectedReport === report.id ? "selected" : ""}
                                >
                                    {report.reportName} - {report.toWhom}
                                </li>
                            ))}
                        </ul>

                    )}
                </div>

                <div className="reports-details">
                    {reportDetails ? (
                        <div>
                            <p>{reportDetails}</p>
                            <div className="report-completed">
                                {!reportCompleted && (
                                    <button
                                        onClick={handleReportCompleted}
                                        className="add-button" // Apply the "add-button" class here
                                    >
                                        Виконати
                                    </button>
                                )}
                                {reportCompleted && <p>Доповідь виконано!</p>}
                            </div>
                        </div>
                    ) : (
                        <p>Оберіть доповідь для перегляду деталей</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Report;