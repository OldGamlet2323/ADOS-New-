from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = os.path.join(os.path.dirname(__file__), 'schedules.json')

# Default schedules
DEFAULT = {
    "institute": {
        "id": "institute",
        "title": "Графік інститут",
        "items": [
            {"eventName": "Ранкова перевірка", "eventTime": "08:00", "subActions": []},
            {"eventName": "Перерва", "eventTime": "10:00", "subActions": []}
        ]
    },
    "duty": {
        "id": "duty",
        "title": "Графік чергового",
        "items": [
            {"eventName": "Початок зміни", "eventTime": "07:00", "subActions": ["Прийняти наряд"]},
            {"eventName": "Огляд приміщень", "eventTime": "09:00", "subActions": []}
        ]
    }
}


def load_data():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return DEFAULT.copy()


def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


@app.route('/api/schedules', methods=['GET'])
def get_schedules():
    data = load_data()
    return jsonify(list(data.values()))


@app.route('/api/schedules/<schedule_id>', methods=['GET', 'POST'])
def schedule_detail(schedule_id):
    data = load_data()
    if request.method == 'GET':
        sched = data.get(schedule_id)
        if not sched:
            return jsonify({"error": "not found"}), 404
        return jsonify(sched)

    # POST: replace items
    body = request.get_json() or {}
    items = body.get('items')
    if items is None:
        return jsonify({"error": "items required"}), 400

    if schedule_id not in data:
        data[schedule_id] = {"id": schedule_id, "title": body.get('title', schedule_id), 'items': items}
    else:
        data[schedule_id]['items'] = items

    save_data(data)
    return jsonify(data[schedule_id])


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})


if __name__ == '__main__':
    # Ensure directory exists
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    # Initialize file if missing
    if not os.path.exists(DATA_FILE):
        save_data(DEFAULT)
    app.run(host='0.0.0.0', port=5000, debug=True)
