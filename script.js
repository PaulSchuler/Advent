import * as zip from 'https://deno.land/x/zipjs/index.js';

// --- Konstanten ---
const MAX_PASSWORD_ATTEMPTS = 3;
const FLYING_ANIMATION_INTERVAL = 15000; // 15 Sekunden
const DOOR_COLORS = ["#0022ff", "#e8c014", "#a89898", "#b71111"];
const DEBUG_DATE = true; // Auf 'false' setzen für Live-Betrieb

// Definition der Türen (Tag 1-23)
const rectangles = [
    { x: 55, y: 49, day: 1 }, { x: 72, y: 83, day: 2 }, { x: 63, y: 19, day: 3 },
    { x: 33, y: 48, day: 4 }, { x: 0, y: 78, day: 5 }, { x: 38, y: 62, day: 6 },
    { x: 24, y: 68, day: 7 }, { x: 70, y: 45, day: 8 }, { x: 16, y: 80, day: 9 },
    { x: 91, y: 78, day: 10 }, { x: 30, y: 20, day: 11 }, { x: 80, y: 48, day: 12 },
    { x: 53, y: 78, day: 13 }, { x: 62, y: 33, day: 14 }, { x: 14, y: 59, day: 15 },
    { x: 19, y: 35, day: 16 }, { x: 45, y: 21, day: 17 }, { x: 19, y: 45, day: 18 },
    { x: 58, y: 66, day: 19 }, { x: 30, y: 81, day: 20 }, { x: 46, y: 40, day: 21 },
    { x: 33, y: 31, day: 22 }, { x: 79, y: 60, day: 23 },
];
// Definition für Tag 24 (Stern)
const starData = { x: 42, y: -4, day: 24, size: 15 };

// --- Globale Variablen ---
let bilder = [];
let monthNow = new Date().getMonth() + 1; // Monate sind 0-basiert
let dayNow = new Date().getDate();

// --- DOM-Elemente ---
const clausContainer = document.getElementById('claus-container');
const responsiveDiv = document.getElementById('responsiveDiv');
const loadingImage = document.querySelector('.loading-image');
const flyingObject = document.getElementById('flying-object');

// --- Initialisierung (Passwortabfrage) ---
(async function askForPassword() {
    let accessGranted = await tryLoadImages();
    if (accessGranted) {
        initApp();
    } else {
        let attempts = 0;
        while (!accessGranted && attempts < MAX_PASSWORD_ATTEMPTS) {
            const userInputOrg = prompt('Bitte gib Liv`s zweiten Namen ein:');
            if (userInputOrg === null) {
                alert('Eingabe abgebrochen.');
                break;
            }

            const userInput = userInputOrg.trim();
            if (userInput) {
                localStorage.setItem('password', userInput);
                accessGranted = await tryLoadImages();
                if (accessGranted) {
                    initApp();
                } else {
                    alert('Falsches Passwort. Bitte versuche es erneut.');
                    localStorage.removeItem('password');
                    attempts++;
                }
            }
        }
        if (!accessGranted && attempts >= MAX_PASSWORD_ATTEMPTS) {
            alert('Maximale Anzahl von Versuchen erreicht.');
        }
    }
})();

// --- Hauptfunktionen ---

/**
 * Initialisiert die Anwendung nach erfolgreicher Passwortprüfung.
 */
function initApp() {
    loadingImage.style.visibility = "hidden";

    // DEBUG-Modus für das Datum
    if (DEBUG_DATE) {
        monthNow = 12;
        dayNow = 25;
        console.warn("DEBUG-MODUS: Datum ist auf 25.12. gesetzt.");
    }

    createDoors();
    initAnimation();

    window.addEventListener('resize', createDoors);
    document.body.style.cursor = 'url("img/cursor.png"), auto';
}

/**
 * Erstellt alle Türen (Kreise und Stern) und fügt sie dem DOM hinzu.
 */
function createDoors() {
    // Alte Türen entfernen
    responsiveDiv.innerHTML = '';

    const divWidth = responsiveDiv.clientWidth;
    const divHeight = responsiveDiv.clientHeight;

    // Stern für den 24. Dezember hinzufügen
    createDoorElement(starData, divWidth, divHeight, true);

    // Kreise (Tage 1-23) hinzufügen
    rectangles.forEach(({ x, y, day }) => {
        createDoorElement({ x, y, day, size: 7 }, divWidth, divHeight, false);
    });
}

/**
 * Hilfsfunktion zum Erstellen eines einzelnen Türelements (Kreis oder Stern).
 * @param {object} data - { x, y, day, size }
 * @param {number} divWidth - Aktuelle Breite des responsiveDiv
 * @param {number} divHeight - Aktuelle Höhe des responsiveDiv
 * @param {boolean} isStar - Ob es sich um den Stern handelt
 */
function createDoorElement(data, divWidth, divHeight, isStar) {
    const { x, y, day, size } = data;

    const door = document.createElement('div');
    door.classList.add(isStar ? 'star' : 'circle');

    // Größe und Position
    const elementSize = (size / 100) * divWidth;
    door.style.width = `${elementSize}px`;
    door.style.height = `${elementSize}px`;
    door.style.left = `${(x / 100) * divWidth}px`;
    door.style.top = `${(y / 100) * divHeight}px`;

    // Spezifische Styles
    if (isStar) {
        door.style.backgroundImage = `url("img/star.png")`;
    } else {
        door.style.backgroundColor = DOOR_COLORS[Math.floor(Math.random() * DOOR_COLORS.length)];
    }

    // Text (Tag)
    const dayText = document.createElement('span');
    dayText.textContent = day;
    dayText.classList.add('day-text');
    door.appendChild(dayText);

    // Klick-Event
    door.addEventListener('click', () => {
        if (monthNow === 12 && day <= dayNow) {
            openImageModal(day);
        }
    });

    responsiveDiv.appendChild(door);
}

/**
 * Öffnet das Modal-Fenster mit dem Bild des Tages.
 * @param {number} day - Der Tag, für den das Bild angezeigt wird.
 */
function openImageModal(day) {
    const modal = document.createElement('div');
    modal.classList.add('image-modal');

    const img = document.createElement('img');
    img.src = bilder[day - 1]; // Array ist 0-basiert
    img.classList.add('modal-image');
    img.addEventListener('contextmenu', (event) => event.preventDefault());

    const closeButton = document.createElement('span');
    closeButton.textContent = '×';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    });

    modal.appendChild(img);
    modal.appendChild(closeButton);
    clausContainer.appendChild(modal);
}

// --- ZIP- & Ladefunktionen ---

/**
 * Versucht, die ZIP-Datei mit dem gespeicherten Passwort zu laden und zu entpacken.
 * @returns {boolean} - True bei Erfolg, false bei Misserfolg.
 */
async function tryLoadImages() {
    try {
        const response = await fetch('img/images.zip');
        if (!response.ok) return false;

        const blob = await response.blob();
        const password = localStorage.getItem('password');
        if (!password) return false;

        const reader = new zip.ZipReader(new zip.BlobReader(blob), { password });
        const entries = await reader.getEntries();

        if (entries.length === 0) {
            await reader.close();
            return false;
        }

        // Einträge nach der Zahl im Dateinamen sortieren
        entries.sort(sortEntriesByNumber);

        const images = [];
        for (const entry of entries) {
            if (!entry.directory && entry.filename.match(/\.(png|jpe?g|gif)$/i)) {
                const imageBlob = await entry.getData(new zip.BlobWriter());
                const imageUrl = URL.createObjectURL(imageBlob);
                images.push(imageUrl);
            }
        }

        bilder = images;
        await reader.close();
        return true;

    } catch (error) {
        console.error("Fehler beim Laden oder Entpacken der Bilder:", error);
        return false;
    }
}

/**
 * Hilfsfunktion zum Sortieren der ZIP-Einträge anhand der Zahl im Dateinamen.
 */
function sortEntriesByNumber(a, b) {
    const aNumberMatch = a.filename.match(/(\d+)/);
    const bNumberMatch = b.filename.match(/(\d+)/);

    if (aNumberMatch && bNumberMatch) {
        const aNumber = parseInt(aNumberMatch[0]);
        const bNumber = parseInt(bNumberMatch[0]);
        return aNumber - bNumber;
    }
    return 0; // Fallback, falls keine Zahl gefunden wird
}

// --- Animation ---

/**
 * Startet die Intervall-Animation für das fliegende Objekt.
 */
function initAnimation() {
    setInterval(updateFlyingObjectPosition, FLYING_ANIMATION_INTERVAL);
    updateFlyingObjectPosition(); // Einmal sofort ausführen
}

/**
 * Aktualisiert die vertikale Position des fliegenden Objekts zufällig.
 */
function updateFlyingObjectPosition() {
    const randomNumber = Math.floor(Math.random() * (70 - 10 + 1)) + 10;
    flyingObject.style.top = `${randomNumber}%`;
}