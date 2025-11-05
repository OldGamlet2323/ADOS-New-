import { useState, useEffect, useCallback } from 'react';

import './PersonnelTable.css';


// --- ДАНІ ДЛЯ НОВОЇ ФОНМИ ---


// 1. Mock-дані для typeahead

const mockPersonnel = [

    'Петренко В.І.',

    'Сидоренко О.П.',

    'Іваненко Д.С.',

];


// 2. Mock-дані для типів постів

const mockPostTypes = [

    { id: 'CHI', name: 'ЧІ' },

    { id: 'PCHI', name: 'ПЧІ' },

    { id: 'OPER', name: 'ПЧІ з БП' },

    { id: 'KPP1', name: 'Черговий КПП 1' },

    { id: 'DAILY_KKP1', name: 'Помічники КПП1'},

    { id: 'KPP2', name: 'Черговий КПП 2' },

    { id: 'DAILY_KKP2', name: 'Помічники КПП2'},

    { id: 'DUTY_UNIT_OLD', name: 'Старший чергового підрозділу' },

    { id: 'DUTY_UNIT', name: 'Черговий підрозділу' },

    { id: 'DUTY_UNIT_FIRE', name: 'Пожежна команда' },

    { id: 'DUTY_UNIT_HEADQUARTERS', name: 'Посильні штабу' },

    { id: 'DUTY_UNIT_BUILDING1', name: 'Черговий навчального корпусу №1' },

    { id: 'DUTY_UNIT_DAILY_BUILDING1', name: 'Днювальний навчального корпусу №1' },

    { id: 'DUTY_UNIT_BUILDING2', name: 'Черговий навчального корпусу №2' },

    { id: 'DUTY_UNIT_DAILY_BUILDING2', name: 'Днювальний навчального корпусу №2' },

    { id: 'DUTY_UNIT_DORMITORY', name: 'Черговий гуртожитку'},

    { id: 'DUTY_UNIT_DAILY_DORMITORY', name: 'Днювальний гуртожитку'},

    { id: 'PARK', name: 'Черговий парку' },

    { id: 'DAILY_PARK', name: 'Днювальні парку'},

    { id: 'CANTEEN', name: ' Їдальня' },

    { id: 'STOYR', name: 'СТОХР' },

    { id: 'ITV', name: 'ІТВ'},

    { id: 'BZNP_CAR', name: 'Чергові водії'},

    { id: 'BZNP_TRAC', name: 'Тракторист'},

    { id: 'BZNP_СRAN', name: 'Крановщик'},

    { id: 'BZNP_MAIN', name: 'БЗНП'},

    { id: 'DORMITORY_32', name: 'Гуртожиток(32 курс)'}

];



// Категорії

const personnelCategories = [

    { value: 'officersPermanent', label: 'Офіцер (пост. склад)' },

    { value: 'officersVariable', label: 'Офіцер (змін. склад)' },

    { value: 'cadets', label: 'Курсант' },

    { value: 'contractPersonnel', label: 'В/сл. за контр.' },

    { value: 'militaryWorkers', label: 'Прац. ЗСУ' }

];


// Карта зв'язків між Підрозділами та Постами

const unitPostMap = {

    '1': ['CHI', 'PCHI', 'OPER'],

    '2': ['KPP1', 'DAILY_KKP1'],

    '3': ['KPP2', 'DAILY_KKP2'],

    '4': [

        'DUTY_UNIT_OLD', 'DUTY_UNIT', 'DUTY_UNIT_FIRE', 'DUTY_UNIT_HEADQUARTERS',

        'DUTY_UNIT_BUILDING1', 'DUTY_UNIT_DAILY_BUILDING1',

        'DUTY_UNIT_BUILDING2', 'DUTY_UNIT_DAILY_BUILDING2',

        'DUTY_UNIT_DORMITORY', 'DUTY_UNIT_DAILY_DORMITORY'

    ],

    '5': ['PARK', 'DAILY_PARK'],

    '6': ['CANTEEN'],

    '7': ['STOYR'],

    '8': [],

    '9': ['ITV'],

    '10': ['BZNP_CAR', 'BZNP_TRAC', 'BZNP_СRAN', 'BZNP_MAIN'],

    '11': ['DORMITORY_32']

};



// ✅ ВИПРАВЛЕНО: функція НЕ async

function PersonnelTable() {

    const [personnelData, setPersonnelData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    const [editedData, setEditedData] = useState([]);

    const [currentDate, setCurrentDate] = useState('');

    const [newAssignment, setNewAssignment] = useState({

        unitId: '',

        post: '',

        category: '',

        name: ''

    });

    const [suggestions, setSuggestions] = useState([]);

    const [availablePosts, setAvailablePosts] = useState([]);


    const initialUnits = [

        {id: 1, name: 'Приміщення ЧІ', code: 'CHI'},

        {id: 2, name: 'КПП 1', code: 'KPP1'},

        {id: 3, name: 'КПП 2', code: 'KPP2'},

        {id: 4, name: 'Черг. підрозділ', code: 'DUTY_UNIT'},

        {id: 5, name: 'Парк', code: 'PARK'},

        {id: 6, name: 'Їдальня', code: 'CANTEEN'},

        {id: 7, name: 'СТОЙР', code: 'STOYR'},

        {id: 8, name: 'Лазарет', code: 'INFIRMARY'},

        {id: 9, name: 'ПТВ', code: 'PTV'},

        {id: 10, name: 'БЗНГ', code: 'BZNG'},

        {id: 11, name: 'Гуртожиток (32 курс)', code: 'DORMITORY_32'}

    ];


    const getCurrentDate = () => {

        const today = new Date();

        const tomorrow = new Date(today);

        tomorrow.setDate(tomorrow.getDate() + 1);

        const formatDate = (date) => {

            return date.toLocaleDateString('uk-UA', {day: '2-digit', month: '2-digit', year: 'numeric'});

        };

        return `вночі з ${formatDate(today)} на ${formatDate(tomorrow)}`;

    };


// Обгортаємо функцію в useCallback, щоб уникнути проблем із залежностями useEffect

    const fetchPersonnelData = useCallback(async () => {

        setLoading(true);

        setError(null);


        try {

            const today = new Date().toISOString().split('T')[0]; // "2025-01-15"

            setCurrentDate(today);


            const response = await fetch(`${API_BASE_URL}/personnel/get?date=${today}`);


            if (!response.ok) {

                throw new Error(`HTTP error! status: ${response.status}`);

            }


            const dataFromBackend = await response.json();


            if (dataFromBackend && dataFromBackend.length > 0) {

                const mappedData = initialUnits.map(unit => {

                    const backendUnit = dataFromBackend.find(d => d.unitId === unit.id);


                    if (backendUnit) {

                        return {

                            unitId: unit.id,

                            unitName: unit.name,

                            unitCode: unit.code,

                            officersPermanent: backendUnit.officersPermanent || 0,

                            officersVariable: backendUnit.officersVariable || 0,

                            cadets: backendUnit.cadets || 0,

                            contractPersonnel: backendUnit.contractPersonnel || 0,

                            militaryWorkers: backendUnit.militaryWorkers || 0,

                            total: backendUnit.total || 0,

                            personnelList: backendUnit.personnelList || ''

                        };

                    } else {

                        return {

                            unitId: unit.id,

                            unitName: unit.name,

                            unitCode: unit.code,

                            officersPermanent: 0,

                            officersVariable: 0,

                            cadets: 0,

                            contractPersonnel: 0,

                            militaryWorkers: 0,

                            total: 0,

                            personnelList: ''

                        };

                    }

                });


                setPersonnelData(mappedData);

                setEditedData(JSON.parse(JSON.stringify(mappedData)));

            } else {

// Якщо Backend повернув порожній масив - створюємо порожні дані

                const emptyData = initialUnits.map(unit => ({

                    unitId: unit.id,

                    unitName: unit.name,

                    unitCode: unit.code,

                    officersPermanent: 0,

                    officersVariable: 0,

                    cadets: 0,

                    contractPersonnel: 0,

                    militaryWorkers: 0,

                    total: 0,

                    personnelList: ''

                }));


                setPersonnelData(emptyData);

                setEditedData(JSON.parse(JSON.stringify(emptyData)));

            }


        } catch (err) {

            console.error('❌ Помилка завантаження даних:', err);

            setError(`Не вдалося завантажити дані: ${err.message}`);


// В разі помилки показуємо порожні дані

            const emptyData = initialUnits.map(unit => ({

                unitId: unit.id,

                unitName: unit.name,

                unitCode: unit.code,

                officersPermanent: 0,

                officersVariable: 0,

                cadets: 0,

                contractPersonnel: 0,

                militaryWorkers: 0,

                total: 0,

                personnelList: ''

            }));


            setPersonnelData(emptyData);

            setEditedData(JSON.parse(JSON.stringify(emptyData)));

        } finally {

            setLoading(false);

        }

    }, [initialUnits, setLoading, setError, setCurrentDate, setPersonnelData, setEditedData]); // Додали залежності


    useEffect(() => {

        fetchPersonnelData();

    }, [fetchPersonnelData]); // ВИПРАВЛЕНО: Додали функцію як залежність


    const handleFieldChange = (unitId, field, value) => {

        const newData = editedData.map(unit => {

            if (unit.unitId === unitId) {

                const updatedUnit = {...unit, [field]: value};

                if (field !== 'personnelList' && field !== 'total') {

                    updatedUnit.total =

                        (parseInt(updatedUnit.officersPermanent) || 0) +

                        (parseInt(updatedUnit.officersVariable) || 0) +

                        (parseInt(updatedUnit.cadets) || 0) +

                        (parseInt(updatedUnit.contractPersonnel) || 0) +

                        (parseInt(updatedUnit.militaryWorkers) || 0);

                }

                return updatedUnit;

            }

            return unit;

        });

        setEditedData(newData);

    };


    const handleAssignmentChange = (e) => {

        const {name, value} = e.target;


        if (name === 'unitId') {

            let filteredPosts = [];

            if (value) {

                const allowedPostIds = unitPostMap[value] || [];

                filteredPosts = mockPostTypes.filter(post =>

                    allowedPostIds.includes(post.id)

                );

            }


            setAvailablePosts(filteredPosts);

            setNewAssignment(prev => ({

                ...prev,

                unitId: value,

                post: '',

                category: '',

                name: ''

            }));

        } else {

            setNewAssignment(prev => ({...prev, [name]: value}));

        }

    };


    const handleNameChange = (e) => {

        const value = e.target.value;

        setNewAssignment(prev => ({...prev, name: value}));


        if (value.length > 0) {

            const filtered = mockPersonnel.filter(p =>

                p.toLowerCase().includes(value.toLowerCase())

            );

            setSuggestions(filtered);

        } else {

            setSuggestions([]);

        }

    };


    const handleSuggestionClick = (name) => {

        setNewAssignment(prev => ({...prev, name: name}));

        setSuggestions([]);

    };


    const handleAddAssignment = () => {

        const {unitId, post, category, name} = newAssignment;


        if (!unitId || !post || !category || !name) {

            alert('Будь ласка, заповніть всі поля для додавання.');

            return;

        }


        const postName = mockPostTypes.find(p => p.id === post)?.name || post;


        setEditedData(prevData => {

            const newData = prevData.map(unit => {

                if (unit.unitId.toString() === unitId) {

                    const updatedUnit = {...unit};

                    updatedUnit[category] = (parseInt(updatedUnit[category]) || 0) + 1;


                    const assignmentText = `${postName}: ${name}`;


                    updatedUnit.personnelList = updatedUnit.personnelList

                        ? `${updatedUnit.personnelList}\n${assignmentText}`

                        : assignmentText;


                    updatedUnit.total =

                        (parseInt(updatedUnit.officersPermanent) || 0) +

                        (parseInt(updatedUnit.officersVariable) || 0) +

                        (parseInt(updatedUnit.cadets) || 0) +

                        (parseInt(updatedUnit.contractPersonnel) || 0) +

                        (parseInt(updatedUnit.militaryWorkers) || 0);


                    return updatedUnit;

                }

                return unit;

            });

            return newData;

        });


        setNewAssignment({unitId: unitId, post: '', category: '', name: ''});

        setSuggestions([]);

    };


    const handleSave = async () => {

        try {

            setLoading(true);


// Формуємо дані для відправки

            const dataToSave = {

                date: currentDate,

                units: editedData.map(unit => ({

                    unitId: unit.unitId,

                    unitName: unit.unitName,

                    officersPermanent: parseInt(unit.officersPermanent) || 0,

                    officersVariable: parseInt(unit.officersVariable) || 0,

                    cadets: parseInt(unit.cadets) || 0,

                    contractPersonnel: parseInt(unit.contractPersonnel) || 0,

                    militaryWorkers: parseInt(unit.militaryWorkers) || 0,

                    total: parseInt(unit.total) || 0,

                    personnelList: unit.personnelList || ''

                }))

            };


            const response = await fetch(`${API_BASE_URL}/personnel/save`, {

                method: 'POST',

                headers: {

                    'Content-Type': 'application/json',

                },

                body: JSON.stringify(dataToSave),

            });


            if (!response.ok) {

            }


            try {

                const contentType = response.headers.get("content-type");

                let result = { message: "✅ Дані успішно збережено в базі даних!" }; // Значення за замовчуванням


                if (contentType && contentType.indexOf("application/json") !== -1) {

                    result = await response.json();

                } else {

                    const textResponse = await response.text();

                    if (textResponse.trim()) {

                        result = { message: textResponse };

                    }

                }

                setPersonnelData(JSON.parse(JSON.stringify(editedData)));

                setIsEditing(false);


                alert('✅ ' + result.message);

                console.log(result.message);

            } catch (error) {

                console.error("Сталася помилка:", error);

            }




        } catch (err) {

            console.error('❌ Помилка збереження:', err);

            alert(`❌ Помилка збереження: ${err.message}`);

        } finally {

            setLoading(false);

        }

    };




    const handleCancel = () => {

        setEditedData(JSON.parse(JSON.stringify(personnelData)));

        setIsEditing(false);

    };


    const calculateColumnTotal = (field) => {

        return editedData.reduce((sum, unit) => sum + (parseInt(unit[field]) || 0), 0);

    };

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
    const handleGenerateReport = async () => {

        if (isEditing) {

            alert('⚠️ Спочатку збережіть дані (кнопка "Зберегти"), потім генеруйте звіт!');

            return;

        }


        try {

            setLoading(true);


            const response = await fetch(`${API_BASE_URL}/report/personnel-word`, {

                method: 'POST',

                headers: {

                    'Content-Type': 'application/json',

                },

                body: JSON.stringify({

                    date: currentDate, // ✅ Тепер Backend знає яку дату брати

                    title: `РОЗРАХУНОК особового складу... (${getCurrentDate()})`,

                }),

            });


            if (!response.ok) {

                const errorText = await response.text();

                throw new Error(`Помилка генерації: ${response.status} - ${errorText}`);

            }


            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');

            a.href = url;

            a.download = `Personnel_Report_${currentDate}.docx`;

            document.body.appendChild(a);

            a.click();

            window.URL.revokeObjectURL(url);

            a.remove();


            alert('✅ Word звіт успішно згенеровано!');


        } catch (err) {

            console.error('❌ Помилка генерації:', err);

            alert(`❌ Помилка: ${err.message}`);

        } finally {

            setLoading(false);

        }

    };



    return (

        <div className="personnel-table-container">

            <div className="personnel-header">

                <h2>РОЗРАХУНОК особового складу... ({getCurrentDate()})...</h2>

                <div className="personnel-actions">

                    {!isEditing ? (

                        <button className="btn-edit" onClick={() => setIsEditing(true)}>

                            Редагувати

                        </button>

                    ) : (

                        <>

                            <button className="btn-save" onClick={handleSave}>

                                Зберегти

                            </button>

                            <button className="btn-cancel" onClick={handleCancel}>

                                Скасувати

                            </button>

                        </>

                    )}

                </div>

            </div>


            {isEditing && (

                <div className="personnel-entry-form">

                    <h3 className="form-title">Додати особовий склад на пост</h3>

                    <div className="form-row">

                        <select

                            name="unitId"

                            value={newAssignment.unitId}

                            onChange={handleAssignmentChange}

                            className="form-select"

                        >

                            <option value="">1. Оберіть підрозділ...</option>

                            {initialUnits.map(unit => (

                                <option key={unit.id} value={unit.id}>{unit.name}</option>

                            ))}

                        </select>


                        <select

                            name="post"

                            value={newAssignment.post}

                            onChange={handleAssignmentChange}

                            className="form-select"

                            disabled={!newAssignment.unitId}

                        >

                            <option value="">

                                {newAssignment.unitId ? '2. Оберіть пост...' : 'Спочатку оберіть підрозділ'}

                            </option>

                            {availablePosts.map(post => (

                                <option key={post.id} value={post.id}>{post.name}</option>

                            ))}

                        </select>


                        <select

                            name="category"

                            value={newAssignment.category}

                            onChange={handleAssignmentChange}

                            className="form-select"

                            disabled={!newAssignment.post}

                        >

                            <option value="">

                                {newAssignment.post ? '3. Оберіть категорію...' : '...'}

                            </option>

                            {personnelCategories.map(cat => (

                                <option key={cat.value} value={cat.value}>{cat.label}</option>

                            ))}

                        </select>

                    </div>


                    <div className="form-row">

                        <div className="typeahead-container">

                            <input

                                type="text"

                                name="name"

                                placeholder={newAssignment.category ? '4. Введіть прізвище...' : '...'}

                                value={newAssignment.name}

                                onChange={handleNameChange}

                                autoComplete="off"

                                className="form-input"

                                disabled={!newAssignment.category}

                            />

                            {suggestions.length > 0 && (

                                <ul className="suggestions-list">

                                    {suggestions.map((s, i) => (

                                        <li key={i} onClick={() => handleSuggestionClick(s)}>

                                            {s}

                                        </li>

                                    ))}

                                </ul>

                            )}

                        </div>


                        <button className="btn-add-person" onClick={handleAddAssignment}>

                            Додати

                        </button>

                    </div>

                </div>

            )}


            <div className="personnel-table-wrapper">

                <table className="personnel-table">

                    <thead>

                    <tr>

                        <th rowSpan="2">Назва підрозділу</th>

                        <th colSpan="2">Офіцерів</th>

                        <th rowSpan="2">Курсантів</th>

                        <th rowSpan="2">В/сл. за контр.</th>

                        <th rowSpan="2">Прац. ЗСУ</th>

                        <th rowSpan="2">Всього</th>

                        <th rowSpan="2">Прізвища</th>

                    </tr>

                    <tr>

                        <th>постійно у складі</th>

                        <th>змінного складу</th>

                    </tr>

                    </thead>

                    <tbody>

                    {editedData.map((unit) => (
                        <tr key={unit.unitId}>
                            <td className="unit-name">{unit.unitName}</td>
                            <td>
                                {isEditing ? (
                                    <input type="number" min="0" value={unit.officersPermanent ||''}
                                           onChange={(e) => handleFieldChange(unit.unitId, 'officersPermanent', e.target.value)}
                                           className="personnel-input"/>
                                ) : (
                                    personnelData.find(p => p.unitId === unit.unitId)?.officersPermanent || '-'
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input type="number" min="0" value={unit.officersVariable || ''}
                                           onChange={(e) => handleFieldChange(unit.unitId, 'officersVariable', e.target.value)}
                                           className="personnel-input"/>
                                ) : (
                                    personnelData.find(p => p.unitId === unit.unitId)?.officersVariable || '-'
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input type="number" min="0" value={unit.cadets !== undefined ? unit.cadets : ''}
                                           onChange={(e) => handleFieldChange(unit.unitId, 'cadets', e.target.value)}
                                           className="personnel-input"/>
                                ) : (
                                    personnelData.find(p => p.unitId === unit.unitId)?.cadets || '-'
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input type="number" min="0" value={unit.contractPersonnel || ''}
                                           onChange={(e) => handleFieldChange(unit.unitId, 'contractPersonnel', e.target.value)}
                                           className="personnel-input"/>

                                ) : (
                                    personnelData.find(p => p.unitId === unit.unitId)?.contractPersonnel || '-'
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input type="number" min="0" value={unit.militaryWorkers || ''}
                                           onChange={(e) => handleFieldChange(unit.unitId, 'militaryWorkers', e.target.value)}
                                           className="personnel-input"/>
                                ) : (
                                    personnelData.find(p => p.unitId === unit.unitId)?.militaryWorkers || '-'
                                )}
                            </td>
                            <td className="total-cell">
                                <strong>{unit.total || 0}</strong>
                            </td>
                            <td className="personnel-list">
                                {isEditing ? (
                                    <textarea
                                        value={unit.personnelList || ''}
                                        onChange={(e) => handleFieldChange(unit.unitId, 'personnelList', e.target.value)}
                                        className="personnel-textarea"
                                        placeholder="ПІБ..."
                                        readOnly
                                        title="Список формується автоматично через форму вище"
                                    />
                                ) : (
                                    <div className="personnel-names" style={{whiteSpace: 'pre-line'}}>
                                        {personnelData.find(p => p.unitId === unit.unitId)?.personnelList || '-'}
                                    </div>
                                )}
                            </td>
                        </tr>

                    ))}

                    </tbody>

                    <tfoot>

                    <tr className="totals-row">

                        <td><strong>Всього:</strong></td>

                        <td><strong>{calculateColumnTotal('officersPermanent')}</strong></td>

                        <td><strong>{calculateColumnTotal('officersVariable')}</strong></td>

                        <td><strong>{calculateColumnTotal('cadets')}</strong></td>

                        <td><strong>{calculateColumnTotal('contractPersonnel')}</strong></td>

                        <td><strong>{calculateColumnTotal('militaryWorkers')}</strong></td>

                        <td><strong>{calculateColumnTotal('total')}</strong></td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>

            <div className="report-generation-section">
                <button
                    className="btn-generate-report"
                    onClick={handleGenerateReport}
                >
                    Згенерувати звіт (Word)
                </button>
            </div>
            {error && (
                <div className="personnel-error">
                    <p>⚠️ {error}</p>
                </div>
            )}
        </div>
    );
}

export default PersonnelTable; 