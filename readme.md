# MindBalance

MindBalance is a web application that allows users to maintain a journal, select themes and fonts for their entries, and analyze the sentiment of their journal entries using a sentiment analysis pipeline.

## Features

- **Journal Entries**: Write and save journal entries.
- **Theme Selection**: Choose different themes for entries.
- **Font Selection**: Select different fonts for entries.
- **Sentiment Analysis**: Analyze the sentiment of both new and old journal entries.

 **Install the dependencies**:
    ```sh
    pip install -r requirements.txt
    ```

 **Run the application**:
    ```sh
    python main.py
    ```

## Usage

**Add a journal entry**:
    - Write your journal entry in the text area.
    - Select a theme and font.
    - Click the "Save" button to save your entry.

**View past entries**:
    - Past entries are displayed below the text area.
    - The sentiment of each entry is analyzed and displayed.

## File Structure

- `index.html`: The main HTML file for the web application.
- `main.py`: The main Python file that contains the Flask application and sentiment analysis logic.
- `style.css`: The CSS file for styling the web application.
- `diary.json`: The JSON file where journal entries are stored.