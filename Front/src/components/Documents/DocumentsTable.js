import React, { useState, useEffect } from 'react';

const DocumentsTable = ({ documents, setDocuments, fetchDocuments, loading, error }) => {


    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('role')



    if (loading) {
        return (
            <div className="d-flex justify-content-center p-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Завантаження...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-4" role="alert">
                Помилка: {error}
            </div>
        );
    }
    const markAsRead = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/documents/${id}/markAsRead`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                // Отримуємо оновлений документ з тіла відповіді
                const updatedDoc = await response.json();

                // Оновлюємо стан локально, не викликаючи fetchDocuments()
                setDocuments(prevDocuments =>
                    prevDocuments.map(doc =>
                        doc.id === id ? { ...doc, read: updatedDoc.read } : doc
                    )
                );
            } else {
                console.error("Помилка під час відзначення документа прочитаним");
            }
        } catch (error) {
            console.error("Помилка:", error);
        }
    };
    const handleDownload = async (filePath, fileId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/documents/download?filePath=${encodeURIComponent(filePath)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('File not found');
            }

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filePath.split('/').pop(); // Ім’я файлу
            link.click();

            await markAsRead(fileId);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Список документів</h3>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Назва</th>
                                <th scope="col">Тип документу</th>
                                <th scope="col">Дата відправлення</th>
                                <th scope="col">Створив</th>
                                <th scope="col">Статус</th>
                                <th scope="col">Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id}>
                                    <td>{doc.id}</td>
                                    <td>{doc.title}</td>
                                    <td>{doc.typeOfDocument}</td>

                                    <td>{doc.sendDate ? new Date(doc.sendDate).toLocaleString('uk-UA') : '-'}</td>
                                    <td>{doc.createBy}</td>
                                    <td>
                                        <span className={`badge ${doc.read ? 'bg-success' : 'bg-warning'}`}>
                                            {doc.read ? 'Прочитано' : 'Не прочитано'}
                                        </span>
                                    </td>
                                    <button
                                        className="btn btn-link p-0"
                                        onClick={() => handleDownload(doc.path, doc.id)}
                                        title="Завантажити документ"
                                    >
                                        <img src={require('../../img/docs-downoad.png')} alt="Docs" style={
                                            { width: "30px" }
                                        } />

                                    </button>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DocumentsTable;