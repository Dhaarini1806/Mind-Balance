from flask import Flask, render_template, request, jsonify
import datetime
import os  # For working with file paths
import json  # For saving data in a simple format
from transformers import pipeline  # For chatbot functionality

# Initialize the sentiment-analysis pipeline
sentiment_pipeline = pipeline("sentiment-analysis")

app = Flask(__name__)

DIARY_FILE = "diary.json"  # Single file to store all entries

def load_entries():
    if not os.path.exists(DIARY_FILE):
        return []
    try:
        with open(DIARY_FILE, 'r') as f:
            data = json.load(f)
            return data if isinstance(data, list) else []  # Handle if the file isn't a list
    except (FileNotFoundError, json.JSONDecodeError):
        return []
    
def save_entries(entries):
    """Saves the journal entries to the JSON file."""
    with open(DIARY_FILE, 'w') as f:
        json.dump(entries, f, indent=4)

@app.route("/")
def index():
    """Displays the main page."""
    entries = load_entries()
    entries.sort(key=lambda x: x["timestamp"], reverse=True)
    return render_template("index.html", entries=entries) 

@app.route("/save_entry", methods=["POST"])
def save_entry():
    """Saves a new journal entry."""
    data = request.get_json()
    entry_text = data['text']
    timestamp = datetime.datetime.now().isoformat()

    new_entry = {
        "timestamp": timestamp,
        "text": entry_text
    }

    entries = load_entries()
    entries.append(new_entry)
    save_entries(entries)  # Call the helper function to save.

    return jsonify({"message": "Entry saved!"}), 201

if __name__ == "__main__":
    app.run(debug=True)