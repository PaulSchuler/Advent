// Definieren der Positionen und Tage für die Türen
const rectangles = [
    { x: 55, y: 49, day: 1 },
    { x: 72, y: 83, day: 2 },
    { x: 63, y: 19, day: 3 },
    { x: 33, y: 48, day: 4 },
    { x: 0, y: 78, day: 5 },
    { x: 38, y: 62, day: 6 },
    { x: 24, y: 68, day: 7 },
    { x: 70, y: 45, day: 8 },
    { x: 16, y: 80, day: 9 },
    { x: 91, y: 78, day: 10 },
    { x: 30, y: 20, day: 11 },
    { x: 80, y: 48, day: 12 },
    { x: 53, y: 78, day: 13 },
    { x: 62, y: 33, day: 14 },
    { x: 14, y: 59, day: 15 },
    { x: 19, y: 35, day: 16 },
    { x: 45, y: 21, day: 17 },
    { x: 19, y: 45, day: 18 },
    { x: 58, y: 66, day: 19 },
    { x: 30, y: 81, day: 20 },
    { x: 46, y: 40, day: 21 },
    { x: 33, y: 31, day: 22 },
    { x: 79, y: 60, day: 23 },
];

const doorColor = ["#0022ff", "#e8c014", "#a89898", "#b71111"];
let bilder = [];

// Asynchrone Funktion für die Passwortabfrage und Initialisierung
(async function askForPassword() {
    let accessGranted = await testAccess();
    if (accessGranted) {
        createDoors();
    } else {
        let attempts = 0;
        const maxAttempts = 3; // Optional: Maximale Anzahl von Versuchen
        while (!accessGranted && attempts < maxAttempts) {
            const userInputOrg = prompt('Bitte gib Liv`s zweiten Namen ein:');
            const userInput = userInputOrg.trim()
            if (userInput) {
                localStorage.setItem('password', userInput);
                accessGranted = await testAccess();
                if (accessGranted) {
                    createDoors();
                } else {
                    alert('Falsches Passwort. Bitte versuchen Sie es erneut.');
                    localStorage.removeItem('password');
                    attempts++;
                }
            } else {
                alert('Eingabe abgebrochen.');
                break;
            }
        }
        if (!accessGranted && attempts >= maxAttempts) {
            alert('Maximale Anzahl von Versuchen erreicht.');
        }
    }
})();


// Funktion zum Testen des Zugriffs (Passwortprüfung)
async function testAccess() {
    const test = await loadAndUnzip();
    return test;
}

// Funktion zum Erstellen der Türen
function createDoors() {
    document.getElementsByClassName('loading-image')[0].style.visibility = "hidden";
    const div = document.getElementById('responsiveDiv');
    const divWidth = div.clientWidth;
    const divHeight = div.clientHeight;
    const date = new Date();
    const monthNow = date.getMonth() + 1; // Monate sind 0-basiert
    const dayNow = date.getDate();

    // Alte Kreise entfernen
    div.innerHTML = '';

    // Stern für den 24. Dezember hinzufügen
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.backgroundImage = `url("img/star.png")`;
    // Größe relativ zur Div-Breite/-Höhe
    star.style.width = `${(15 / 100) * divWidth}px`;
    star.style.height = `${(15 / 100) * divWidth}px`;
    // Position relativ zur Div-Breite/-Höhe
    star.style.left = `${(42 / 100) * divWidth}px`;
    star.style.top = `${(-4 / 100) * divHeight}px`;
    // Text (Day) hinzufügen
    const dayText = document.createElement('span');
    dayText.textContent = "24";
    dayText.classList.add('day-text');
    star.appendChild(dayText);
    star.addEventListener('click', () => {
        if (monthNow === 11 && 24 <= dayNow) {
            openImageModal(24);
        } else {
            alert('Dieses Türchen ist noch nicht verfügbar!');
        }
    });
    div.appendChild(star);

    // Kreise basierend auf der Liste hinzufügen
    rectangles.forEach(({ x, y, day }) => {
        const circle = document.createElement('div');
        circle.classList.add('circle');

        // Größe relativ zur Div-Breite/-Höhe
        circle.style.width = `${(7 / 100) * divWidth}px`;
        circle.style.height = `${(7 / 100) * divWidth}px`;

        // Position relativ zur Div-Breite/-Höhe
        circle.style.left = `${(x / 100) * divWidth}px`;
        circle.style.top = `${(y / 100) * divHeight}px`;

        // Hintergrundfarbe zufällig auswählen
        circle.style.backgroundColor = doorColor[Math.floor(Math.random() * doorColor.length)];

        // Text (Day) hinzufügen
        const dayText = document.createElement('span');
        dayText.textContent = day;
        dayText.classList.add('day-text');
        circle.appendChild(dayText);

        // Klick-Event für den Kreis
        circle.addEventListener('click', () => {
            if (monthNow === 11 && day <= dayNow) {
                openImageModal(day);
            }
        });

        // Kreis hinzufügen
        div.appendChild(circle);
    });
}

// Funktion, um das Bild in voller Größe anzuzeigen
function openImageModal(day) {
    // Erstelle das Modal
    const modal = document.createElement('div');
    modal.classList.add('image-modal');

    // Erstelle das Bild
    const img = document.createElement('img');
    img.src = bilder[day - 1];
    img.classList.add('modal-image');
    img.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    // Schließen-Button
    const closeButton = document.createElement('span');
    closeButton.textContent = '×';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => {
        modal.remove(); // Entfernt das Modal
    });

    // Modal schließt auch bei Klick außerhalb des Bildes
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.remove(); // Entfernt das Modal
        }
    });

    // Modal zusammenbauen
    modal.appendChild(img);
    modal.appendChild(closeButton);
    document.getElementById("claus-container").appendChild(modal);
}

// Event-Listener für Fenstergröße
window.addEventListener('resize', createDoors);
document.body.style.cursor = 'url("img/cursor.png"), auto';

// Animation für fliegendes Objekt
setInterval(updateFlyingObjectPosition, 15000);
updateFlyingObjectPosition();
function updateFlyingObjectPosition() {
    const flyingObject = document.getElementById('flying-object');
    const randomNumber = Math.floor(Math.random() * (70 - 10 + 1)) + 10;
    console.log(randomNumber)
    flyingObject.style.top = `${randomNumber}%`;
}

// Funktion zum Laden und Entpacken der ZIP-Datei
async function loadAndUnzip() {
    try {
        // Laden der ZIP-Datei vom Server
        const response = await fetch('img/images.zip');
        if (!response.ok) {
            return false;
        }

        const blob = await response.blob();

        // Entpacken der ZIP-Datei mit Passwort
        const password = localStorage.getItem('password');
        const reader = new zip.ZipReader(new zip.BlobReader(blob), { password });
        const entries = await reader.getEntries();

        if (entries.length === 0) {
            await reader.close();
            return false;
        }

        // Einträge sortieren
        entries.sort((a, b) => {
            const aNumber = parseInt(a.filename.match(/(\d+)/)[0]);
            const bNumber = parseInt(b.filename.match(/(\d+)/)[0]);
            return aNumber - bNumber;
        });

        // Verarbeitung der Einträge
        const images = [];
        for (const entry of entries) {
            if (!entry.directory && entry.filename.match(/\.(png|jpe?g|gif)$/i)) {
                const imageBlob = await entry.getData(new zip.BlobWriter());
                const imageUrl = URL.createObjectURL(imageBlob);
                images.push(imageUrl);
            }
        }
        bilder = images;
        //console.log(bilder);

        await reader.close();
        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}
