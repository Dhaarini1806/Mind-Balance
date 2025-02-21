from flask import Flask, render_template, request, jsonify
import datetime
import os
import json

app = Flask(__name__)

DIARY_FILE = "diary.json"


def load_entries():
    if not os.path.exists(DIARY_FILE):
        return []
    try:
        with open(DIARY_FILE, 'r') as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def save_entries(entries):
    with open(DIARY_FILE, 'w') as f:
        json.dump(entries, f, indent=4)


@app.route("/")
def index():
    entries = load_entries()
    entries.sort(key=lambda x: x["timestamp"], reverse=True)
    return render_template("index.html", entries=entries)


@app.route("/save_entry", methods=["POST"])
def save_entry():
    data = request.get_json()
    entry_text = data['text']
    theme = data['theme']
    font = data['font']
    timestamp = datetime.datetime.now().isoformat()

    new_entry = {
        "timestamp": timestamp,
        "text": entry_text,
        "theme": theme,
        "font": font
    }

    entries = load_entries()
    entries.append(new_entry)
    save_entries(entries)

    return jsonify({"message": "Entry saved!"}), 201

if __name__ == "__main__":
    app.run(debug=True)
