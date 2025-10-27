import React, { useState, useEffect, useRef } from 'react';
import './MiniSchedule.css';

const MiniSchedule = ({
                          title,
                          items = [],
                          editable = false,
                          allowSubActions = false,
                          scheduleId = null,
                          backendUrl = 'http://localhost:5000',
                          useLocalStorage = true
                      }) => {
    const [list, setList] = useState(items || []);
    const [actionName, setActionName] = useState('');
    const [actionTime, setActionTime] = useState('');
    const [subActionName, setSubActionName] = useState('');
    const [editingIndex, setEditingIndex] = useState(-1);
    const [editingSubActionIndex, setEditingSubActionIndex] = useState(-1);
    const [selectedActionIndex, setSelectedActionIndex] = useState(-1);
    const [isAddingSubAction, setIsAddingSubAction] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [draggedSubItem, setDraggedSubItem] = useState(null);
    const dragItemNode = useRef(null);

    // Ініціалізація з props
    useEffect(() => {
        if (Array.isArray(items) && items.length > 0) setList(items);
    }, [items]);

    const localStorageKey = scheduleId ? `schedule:${scheduleId}` : null;

    // Завантаження з localStorage
    useEffect(() => {
        if (!scheduleId || !useLocalStorage) return;
        try {
            const raw = localStorage.getItem(localStorageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.items)) setList(parsed.items);
            }
        } catch (e) {
            console.warn('MiniSchedule: failed to read from localStorage', e.message);
        }
    }, [scheduleId, useLocalStorage, localStorageKey]);

    // Cross-tab синхронізація через storage event
    useEffect(() => {
        if (!scheduleId || !useLocalStorage) return;
        const handler = (e) => {
            if (e.key !== localStorageKey) return;
            try {
                if (e.newValue) {
                    const parsed = JSON.parse(e.newValue);
                    if (parsed && Array.isArray(parsed.items)) setList(parsed.items);
                } else {
                    setList([]);
                }
            } catch (err) {
                console.warn('MiniSchedule: failed to parse storage event', err);
            }
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [scheduleId, useLocalStorage, localStorageKey]);

    // Завантаження з backend (коли localStorage вимкнено)
    useEffect(() => {
        if (!scheduleId || useLocalStorage) return;
        const url = `${backendUrl}/api/schedules/${encodeURIComponent(scheduleId)}`;
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('failed to fetch schedule');
                return res.json();
            })
            .then(data => {
                if (data && Array.isArray(data.items)) setList(data.items);
            })
            .catch(err => console.warn('MiniSchedule: could not load schedule', scheduleId, err.message));
    }, [scheduleId, backendUrl, useLocalStorage]);

    // Polling для backend синхронізації
    useEffect(() => {
        if (!scheduleId || useLocalStorage) return;
        let mounted = true;
        const interval = setInterval(() => {
            const url = `${backendUrl}/api/schedules/${encodeURIComponent(scheduleId)}`;
            fetch(url)
                .then(res => res.ok ? res.json() : Promise.reject('fetch fail'))
                .then(data => {
                    if (!mounted) return;
                    if (data && Array.isArray(data.items)) {
                        try {
                            const local = JSON.stringify(list || []);
                            const remote = JSON.stringify(data.items || []);
                            if (local !== remote) setList(data.items);
                        } catch (e) {
                            setList(data.items);
                        }
                    }
                })
                .catch(() => {});
        }, 3000);
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [scheduleId, backendUrl, useLocalStorage, list]);

    // Синхронізація змін
    const syncSchedule = (newList) => {
        if (!scheduleId) return;
        if (useLocalStorage) {
            try {
                const payload = { items: newList, title };
                localStorage.setItem(localStorageKey, JSON.stringify(payload));
            } catch (e) {
                console.warn('MiniSchedule: failed to write to localStorage', e.message);
            }
            return;
        }
        const url = `${backendUrl}/api/schedules/${encodeURIComponent(scheduleId)}`;
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: newList, title }),
        }).catch(err => console.warn('MiniSchedule: failed to sync', err));
    };

    // Drag & Drop handlers
    const handleDragStart = (e, item, type, parentIndex = null) => {
        dragItemNode.current = e.target;
        if (type === 'action') {
            setDraggedItem({ index: item });
        } else {
            setDraggedSubItem({ parentIndex, index: item });
        }
        e.dataTransfer.effectAllowed = 'move';
        if (dragItemNode.current && dragItemNode.current.addEventListener) {
            dragItemNode.current.addEventListener('dragend', handleDragEnd);
        }
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDraggedSubItem(null);
        if (dragItemNode.current && dragItemNode.current.removeEventListener) {
            dragItemNode.current.removeEventListener('dragend', handleDragEnd);
        }
        dragItemNode.current = null;
    };

    const handleDragOver = (e, targetIndex, type, parentIndex = null) => {
        e.preventDefault();
        if (!draggedItem && !draggedSubItem) return;

        if (type === 'action' && draggedItem) {
            if (draggedItem.index !== targetIndex) {
                const newList = [...list];
                const item = newList[draggedItem.index];
                newList.splice(draggedItem.index, 1);
                newList.splice(targetIndex, 0, item);
                setList(newList);
                setDraggedItem({ index: targetIndex });
                syncSchedule(newList);
            }
        } else if (type === 'subAction' && draggedSubItem) {
            if (draggedSubItem.parentIndex === parentIndex && draggedSubItem.index !== targetIndex) {
                const newList = [...list];
                const parent = { ...newList[parentIndex] };
                parent.subActions = [...(parent.subActions || [])];
                const item = parent.subActions[draggedSubItem.index];
                parent.subActions.splice(draggedSubItem.index, 1);
                parent.subActions.splice(targetIndex, 0, item);
                newList[parentIndex] = parent;
                setList(newList);
                setDraggedSubItem({ parentIndex, index: targetIndex });
                syncSchedule(newList);
            }
        }
    };

    // Додавання/редагування action
    const handleAdd = () => {
        if (!actionName.trim()) return;
        if (!allowSubActions && !actionTime) return;

        if (editingIndex !== -1) {
            setList(prev => {
                const next = prev.map((item, idx) =>
                    idx === editingIndex
                        ? { ...item, eventName: actionName.trim(), eventTime: actionTime }
                        : item
                );
                syncSchedule(next);
                return next;
            });
            setEditingIndex(-1);
        } else {
            const newItem = {
                eventName: actionName.trim(),
                eventTime: actionTime,
                subActions: []
            };
            setList(prev => {
                const next = [...prev, newItem];
                syncSchedule(next);
                return next;
            });
        }
        setActionName('');
        setActionTime('');
    };

    // Додавання/редагування sub-action
    const handleAddSubAction = () => {
        if (!subActionName.trim() || selectedActionIndex === -1) return;

        if (editingSubActionIndex !== -1) {
            setList(prev => {
                const next = prev.map((item, idx) =>
                    idx === selectedActionIndex
                        ? {
                            ...item,
                            subActions: item.subActions.map((s, si) =>
                                si === editingSubActionIndex ? subActionName.trim() : s
                            )
                        }
                        : item
                );
                syncSchedule(next);
                return next;
            });
            setEditingSubActionIndex(-1);
        } else {
            setList(prev => {
                const next = prev.map((item, idx) =>
                    idx === selectedActionIndex
                        ? { ...item, subActions: [...(item.subActions || []), subActionName.trim()] }
                        : item
                );
                syncSchedule(next);
                return next;
            });
        }
        setSubActionName('');
        setIsAddingSubAction(false);
    };

    // Видалення sub-action
    const handleDeleteSubAction = (actionIndex, subActionIndex) => {
        setList(prev => {
            const next = prev.map((item, idx) =>
                idx === actionIndex
                    ? { ...item, subActions: item.subActions.filter((_, i) => i !== subActionIndex) }
                    : item
            );
            syncSchedule(next);
            return next;
        });
    };

    // Видалення action
    const handleDelete = (idx) => {
        setList(prev => {
            const next = prev.filter((_, i) => i !== idx);
            syncSchedule(next);
            return next;
        });
        if (editingIndex === idx) {
            setEditingIndex(-1);
            setActionName('');
            setActionTime('');
        }
        if (selectedActionIndex === idx) {
            setSelectedActionIndex(-1);
            setIsAddingSubAction(false);
        }
    };

    return (
        <div className="mini-schedule-box">
            <h3>{title}</h3>

            {editable && (
                <div className="mini-schedule-form">
                    <input
                        type="text"
                        placeholder="Назва дії"
                        value={actionName}
                        onChange={(e) => setActionName(e.target.value)}
                    />
                    <input
                        type="time"
                        value={actionTime}
                        onChange={(e) => setActionTime(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="add-action-btn"
                    >
                        {editingIndex !== -1 ? 'Зберегти' : 'Додати'}
                    </button>
                    {editingIndex !== -1 && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingIndex(-1);
                                setActionName('');
                                setActionTime('');
                            }}
                            className="cancel-edit-btn"
                        >
                            Скасувати
                        </button>
                    )}
                </div>
            )}

            <div className="small-task-list">
                {list.length === 0 ? (
                    <p>Немає подій</p>
                ) : (
                    list.map((task, idx) => (
                        <div
                            key={idx}
                            draggable={editable}
                            onDragStart={(e) => handleDragStart(e, idx, 'action')}
                            onDragOver={(e) => handleDragOver(e, idx, 'action')}
                            className={draggedItem?.index === idx ? 'dragging' : ''}
                        >
                            <div
                                className={`task-item small ${editingIndex === idx ? 'editing' : ''} ${selectedActionIndex === idx ? 'selected' : ''}`}
                                onClick={() => {
                                    if (!editable) return;
                                    if (editingIndex !== idx) {
                                        setActionName(task.eventName);
                                        setActionTime(task.eventTime);
                                        setEditingIndex(idx);
                                    }
                                    if (allowSubActions) {
                                        setSelectedActionIndex(selectedActionIndex === idx ? -1 : idx);
                                        setIsAddingSubAction(false);
                                    }
                                }}
                                style={{ cursor: editable ? 'pointer' : 'default' }}
                            >
                                <span className="time">{task.eventTime}</span>
                                <span className="name">{task.eventName}</span>
                                {editable && (
                                    <div className="action-buttons">
                                        {allowSubActions && (
                                            <button
                                                className="add-sub-action-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const isCurrentlySelected = selectedActionIndex === idx;
                                                    const isCurrentlyAddingToThis = isCurrentlySelected && isAddingSubAction;
                                                    setSelectedActionIndex(isCurrentlySelected ? -1 : idx);
                                                    setIsAddingSubAction(!isCurrentlyAddingToThis);
                                                    if (!isCurrentlyAddingToThis) {
                                                        setSubActionName('');
                                                        setEditingSubActionIndex(-1);
                                                    }
                                                }}
                                                title={selectedActionIndex === idx && isAddingSubAction ? "Скасувати додавання" : "Додати підзадачу"}
                                            >
                                                {selectedActionIndex === idx && isAddingSubAction ? '−' : '+'}
                                            </button>
                                        )}
                                        <button
                                            className="delete-action-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(idx);
                                            }}
                                            title="Видалити"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>

                            {allowSubActions && selectedActionIndex === idx && (
                                <div className="sub-actions-container">
                                    {isAddingSubAction && (
                                        <div className="sub-action-form">
                                            <input
                                                type="text"
                                                placeholder="Назва підзадачі"
                                                value={subActionName}
                                                onChange={(e) => setSubActionName(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddSubAction();
                                                }}
                                            >
                                                {editingSubActionIndex !== -1 ? 'Зберегти' : 'Додати'}
                                            </button>
                                        </div>
                                    )}
                                    {task.subActions && task.subActions.map((subAction, subIdx) => (
                                        <div
                                            key={subIdx}
                                            draggable={editable}
                                            onDragStart={(e) => handleDragStart(e, subIdx, 'subAction', idx)}
                                            onDragOver={(e) => handleDragOver(e, subIdx, 'subAction', idx)}
                                            className={`sub-task-item ${editingSubActionIndex === subIdx ? 'editing' : ''} ${draggedSubItem?.parentIndex === idx && draggedSubItem?.index === subIdx ? 'dragging' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (editable) {
                                                    setSubActionName(subAction);
                                                    setEditingSubActionIndex(subIdx);
                                                    setIsAddingSubAction(true);
                                                }
                                            }}
                                        >
                                            <span className="sub-action-name">{subAction}</span>
                                            {editable && (
                                                <button
                                                    className="delete-sub-action-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteSubAction(idx, subIdx);
                                                        if (editingSubActionIndex === subIdx) {
                                                            setEditingSubActionIndex(-1);
                                                            setSubActionName('');
                                                            setIsAddingSubAction(false);
                                                        }
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MiniSchedule;
