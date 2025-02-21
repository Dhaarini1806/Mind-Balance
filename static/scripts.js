document.addEventListener("DOMContentLoaded", function () {
    const textarea = document.getElementById("journal-entry");
    const themeSelect = document.getElementById("theme");
    const fontSelect = document.getElementById("font");
    const saveButton = document.getElementById("save-entry");
    const pastEntriesContainer = document.getElementById("past-entries");
    const textInputButton = document.getElementById("text-input");
    const voiceInputButton = document.getElementById("voice-input");

    const themes = {
        theme1: "/static/images/theme1.png",
        theme2: "/static/images/theme2.png",
        theme3: "/static/images/theme3.png",
        theme4: "/static/images/theme4.png",
        theme5: "/static/images/theme5.png",
    };
    // Function to load past entries
    function loadPastEntries() {
        fetch("/get_entries")
            .then(response => response.json())
            .then(entries => {
                entries.forEach(entry => {
                    const entryDiv = document.createElement("div");
                    entryDiv.classList.add("entry");
                    entryDiv.setAttribute("data-theme", entry.theme);
                    entryDiv.setAttribute("data-font", entry.font);
                    entryDiv.textContent = entry.text;
                    pastEntriesContainer.appendChild(entryDiv);
                });
            })
            .catch(error => console.error("Error loading entries:", error));
    }

    function selectTheme(themeId) {
    document.getElementById('journal-entry').dataset.theme = themeId;
    }
    themeSelect.addEventListener("change", function () {
        let selectedTheme = themeSelect.value;
        selectTheme(selectedTheme);
        if (themes[selectedTheme]) {
            textarea.style.backgroundImage = `url(${themes[selectedTheme]})`;
            textarea.style.backgroundSize = "cover";
            textarea.style.backgroundPosition = "center";
            adjustTextareaSize(selectedTheme);
        }
    });
    // Load past entries on page load
    loadPastEntries();
    // Function to adjust textarea size based on theme image
    function adjustTextareaSize(theme) {
        if (themes[theme]) {
            let img = new Image();
            img.src = themes[theme];
            img.onload = function () {
                textarea.style.height = img.height * 0.5 + "px"; // Adjust height based on image
            };
        }
    }

    // Change textarea style on theme selection
    themeSelect.addEventListener("change", function () {
        let selectedTheme = themeSelect.value;
        if (themes[selectedTheme]) {
            textarea.style.backgroundImage = `url(${themes[selectedTheme]})`;
            textarea.style.backgroundSize = "cover";
            textarea.style.backgroundPosition = "center";
            adjustTextareaSize(selectedTheme);
        }
    });

    fontSelect.addEventListener("change", function () {
        textarea.style.fontFamily = fontSelect.value;
    });

    saveButton.addEventListener("click", function () {
        const entryText = textarea.value.trim();
        const selectedTheme = themeSelect.value;
        const selectedFont = fontSelect.value;

        if (entryText === "") {
            alert("Please enter some text before saving.");
            return;
        }

        fetch("/save_entry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: entryText, theme: selectedTheme, font: selectedFont })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload(); 
        })
        .catch(error => console.error("Error:", error));
    });
    document.querySelectorAll('.container div').forEach(option => {
    option.addEventListener('click', function() {
        const theme = this.querySelector('img').id;
        document.querySelectorAll('.entry').forEach(entry => {
        if (entry.dataset.theme === theme) {
            entry.style.display = 'block';
        } else {
            entry.style.display = 'none';
        }
        });
    });

    });
    document.querySelectorAll(".entry").forEach(entry => {
        let theme = entry.getAttribute("data-theme");
        let font = entry.getAttribute("data-font");

        if (themes[theme]) {
            entry.style.backgroundImage = `url(${themes[theme]})`;
            entry.style.backgroundSize = "cover";
            entry.style.backgroundPosition = "center";
        }
        entry.style.fontFamily = font;
    });

    // Handle voice input (if implemented)
    if ('webkitSpeechRecognition' in window) {
        let recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        voiceInputButton.addEventListener("click", function () {
            recognition.start();
        });

        recognition.onresult = function (event) {
            textarea.value += event.results[0][0].transcript;
        };

        recognition.onerror = function (event) {
            console.error("Speech recognition error", event);
        };
    } else {
        voiceInputButton.style.display = "none"; // Hide button if not supported
    }
});
