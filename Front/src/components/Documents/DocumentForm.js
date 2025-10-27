import React, { useState, useEffect } from 'react';

function DocumentForm() {
    const [file, setFile] = useState(null);
    const [roles, setRoles] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedDocType, setSelectedDocType] = useState('');
    const token = localStorage.getItem("authToken")

    // Завантажуємо ролі та типи документів (можна отримати із бекенду або через константи)
    useEffect(() => {
        setRoles([
            { value: 'DUTY_OFFICER_OF_MILITARY_UNIT', label: 'Черговий інституту' },
            { value: 'CHIEF_OF_STAFF', label: 'Начальник штабу' },
        ]);

        setDocumentTypes([
            { value: 'DAILY_ORDER', label: 'Добовий наказ' },
            { value: 'PERSONNEL_EXPENDITURE', label: 'Розход' },
        ]);
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Зберігаємо файл
    };

    const shareDocument = async () => {
        if (!file || !selectedDocType || !selectedRole) {
            alert('Будь ласка, заповніть всі поля.');
            return;
        }
        try {
            if (!file) {
                alert('Будь ласка, завантажте файл');
                return;
            }
            console.log(file);

            const formData = new FormData();
            formData.append('document', file); // Сам файл
            formData.append("typeOfDocument", selectedDocType); // Тип документа (з select)
            formData.append("createBy", localStorage.getItem("role")); // Роль того, хто створює
            formData.append("sendTo", selectedRole); // Кому надсилається (з select)
            // title буде взято з імені файлу на бекенді

            const fileUploadResponse = await fetch('http://localhost:8080/api/documents/upload', { // ТІЛЬКИ ЦЕЙ ЗАПИТ
                method: 'POST',
                headers: {
                    // 'Content-Type': 'multipart/form-data' встановлюється браузером автоматично для FormData
                    "Authorization": `Bearer ${token}`,
                },
                body: formData
            });

            if (!fileUploadResponse.ok) {
                const errorText = await fileUploadResponse.text();
                console.error('Помилка завантаження файлу:', errorText);
                throw new Error('Помилка завантаження файлу: ' + errorText);
            }

            const fileUploadResult = await fileUploadResponse.json();
            console.log('Документ успішно відправлено та збережено:', fileUploadResult);

            alert('Документ успішно відправлено!');
            // Тут можна додати логіку для оновлення списку документів у батьківському компоненті,
            // наприклад, викликати fetchDocuments(), якщо він переданий через props.
            // Або, якщо fileUploadResult містить повний DTO, можна додати його локально до списку.

        } catch (error) {
            console.error('Помилка при відправці документа:', error);
            alert('Не вдалося відправити документ: ' + error.message);
        }
    };

    return (
        <div className="accordion" id="documentAccordion">
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                    <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                    >
                        Відправка документів
                    </button>
                </h2>
                <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#documentAccordion"
                >
                    <div className="accordion-body">
                        <form className="p-4 border rounded shadow-lg">
                            <legend className="mb-4 text-center">Відправити документ</legend>

                            <div className="mb-3">
                                <label htmlFor="docType" className="form-label">
                                    Тип документа
                                </label>
                                <select
                                    id="docType"
                                    className="form-select"
                                    value={selectedDocType}
                                    onChange={(e) => setSelectedDocType(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Оберіть тип документа
                                    </option>
                                    {documentTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="receiverRole" className="form-label">
                                    Отримувач
                                </label>
                                <select
                                    id="receiverRole"
                                    className="form-select"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Оберіть отримувача
                                    </option>
                                    {roles.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="fileUpload" className="form-label">
                                    Завантажити документ
                                </label>
                                <input
                                    type="file"
                                    id="fileUpload"
                                    className="form-control"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={shareDocument}
                            >
                                Надіслати документ
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DocumentForm;
