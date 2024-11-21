const rectangles = [
    { x: 55, y: 49, day: 1, img: null},
    { x: 72, y: 83, day: 2, img: null },
    { x: 63, y: 19, day: 3, img: null },
    { x: 33, y: 48, day: 4, img: null },
    { x: 0, y: 78, day: 5, img: null },
    { x: 38, y: 62, day: 6, img: null },
    { x: 24, y: 68, day: 7, img: null },
    { x: 70, y: 45, day: 8, img: null },
    { x: 16, y: 80, day: 9, img: null },
    { x: 91, y: 78, day: 10, img: null },
    { x: 30, y: 20, day: 11, img: null },
    { x: 80, y: 48, day: 12, img: null },
    { x: 53, y: 78, day: 13, img: null },
    { x: 62, y: 33, day: 14, img: null },
    { x: 14, y: 59, day: 15, img: null },
    { x: 19, y: 35, day: 16, img: null },
    { x: 45, y: 21, day: 17, img: null },
    { x: 19, y: 45, day: 18, img: null },
    { x: 58, y: 66, day: 19, img: null },
    { x: 30, y: 81, day: 20, img: null },
    { x: 46, y: 40, day: 21, img: null },
    { x: 33, y: 31, day: 22, img: null },
    { x: 79, y: 60, day: 23, img: null },

];
const doorColor= ["#0022ff", "#e8c014", "#a89898", "#b71111"]
createDoors();
/*function adjustDivSize() {
    const aspectRatio = 1 / 2; // Define the aspect ratio
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    // Calculate width and height based on aspect ratio
    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
    }

    // Apply styles to the div
    const div = document.getElementById('responsiveDiv');
    div.style.width = `${width}px`;
    div.style.height = `${height}px`;

    const date = new Date(Date.now());
    const month = date.getMonth() + 1;
    const day = date.getDate();
    console.log(month, day)

}
// Adjust the div size on page load and resize
window.addEventListener('load', adjustDivSize);
window.addEventListener('resize', adjustDivSize);
*/
function createDoors() {
    const div = document.getElementById('responsiveDiv');
    const divWidth = div.clientWidth;
    const divHeight = div.clientHeight;
    const date = new Date(Date.now());
    const monthNow = date.getMonth() + 1;
    const dayNow = date.getDate();

    // Alte Kreise entfernen
    div.innerHTML = '';

    const star = document.createElement('div');
    star.classList.add('star');
    star.style.backgroundImage = `url("img/star.png")`
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
        if (monthNow === 11 && 24 <= dayNow){
            openImageModal(`img/24.png`);
        }
    });
    div.appendChild(star);

    // Kreise basierend auf der Liste hinzufügen
    rectangles.forEach(({ x, y, day, img }) => {
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
            if (monthNow === 11 && day <= dayNow){
                openImageModal(`img/${day}.png`);
            }
        });

        // Kreis hinzufügen
        div.appendChild(circle);
    });
}

// Funktion, um das Bild in voller Größe anzuzeigen
function openImageModal(imageSrc) {
    // Erstelle das Modal
    const modal = document.createElement('div');
    modal.classList.add('image-modal');

    // Erstelle das Bild
    const img = document.createElement('img');
    img.src = imageSrc;
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
    document.body.appendChild(modal);
}




window.addEventListener('load', createDoors);
window.addEventListener('resize', createDoors);
document.body.style.cursor = 'url("img/cursor.png"), auto';

setInterval(updateFlyingObjectPosition, 15000);
updateFlyingObjectPosition()
function updateFlyingObjectPosition() {
    const flyingObject = document.getElementById('flying-object');
    const randomNumber = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
    flyingObject.style.top = `${randomNumber}%`;
}
