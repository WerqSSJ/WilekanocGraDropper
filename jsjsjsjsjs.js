const zajac = document.querySelector('.zajac');
const powietrze = document.querySelector('.powietrze');
const wynikElement = document.querySelector('.wynik');
const zyciaElement = document.querySelector('.zycia');
const trawaHeight = document.querySelector('.trawa').offsetHeight;
const powietrzeHeight = powietrze.offsetHeight;

//środek zająca na środku ekranu
let pozycja = window.innerWidth / 2;
let wynik = 0;
let zycia = 3;

//sprawdzanie czy klawisz jest trzymany czy nie
const keysPressed = {};

addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});
addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});

// Tablica przechowująca spadające jajka
let jajkaSpada = [];

function generujJajko() {
    const noweJajko = document.createElement('div');
    noweJajko.classList.add('jajko-padajace');
    const isPoison = Math.random() < 0.2; // 20% szans
    noweJajko.dataset.poison = isPoison ? '1' : '0';
    noweJajko.textContent = isPoison ? '☠️' : '🥚';
    
    const pozycjaX = Math.random() * (window.innerWidth - 40);
    noweJajko.style.left = pozycjaX + 'px';
    
    powietrze.appendChild(noweJajko);
    
    jajkaSpada.push({
        element: noweJajko,
        x: pozycjaX,
        y: 0,
        szybkosc: 2 + Math.random() * 2,
        poisoned: isPoison
    });
}

function sprawdzKolizje() {
    jajkaSpada.forEach((j, index) => {
        const zajacRect = zajac.getBoundingClientRect();
        const jRect = j.element.getBoundingClientRect();
        if (
            zajacRect.left < jRect.right &&
            zajacRect.right > jRect.left &&
            zajacRect.top < jRect.bottom &&
            zajacRect.bottom > jRect.top
        ) {
            // trafiłeś jajko
            j.element.remove();
            jajkaSpada.splice(index, 1);
            if (j.poisoned) {
                // po 3 sekundach tracisz wszystkie życia
                setTimeout(() => {
                    zycia = 0;
                    aktualizujZycia();
                    alert('Złapałeś zatrute jajko! Straciłeś wszystkie życia.');
                    if (zycia <= 0) {
                        alert('Koniec gry! Twój wynik: ' + wynik);
                        location.reload();
                    }
                }, 3000);
            } else {
                wynik++;
                wynikElement.textContent = 'Wynik: ' + wynik;
            }
        }
    });
}

function aktualizujZycia() {
    let zyciaTekst = '';
    for (let i = 0; i < zycia; i++) {
        zyciaTekst += '❤️ ';
    }
    zyciaElement.textContent = zyciaTekst.trim();
}

function animacja() {
    // szybkość poruszania zająca
    const szybkosc = 10;
    // przy wciśnięciu strzałek zmieniamy też kierunek zająca
    if (keysPressed['ArrowLeft']) {
        pozycja -= szybkosc;
        zajac.style.transform = 'scaleX(-1)';
    }
    if (keysPressed['ArrowRight']) {
        pozycja += szybkosc;
        zajac.style.transform = 'scaleX(1)';
    }

    //ograniczenie szerokości ekranu by zając nie wyjechał poza ekran
    if (pozycja < 20) pozycja = 20;
    if (pozycja > window.innerWidth - 20) pozycja = window.innerWidth - 20;
    
    zajac.style.left = pozycja + 'px';
    
    // Aktualizuj pozycje spadających jajek
    jajkaSpada.forEach((j, index) => {
        j.y += j.szybkosc;
        j.element.style.top = j.y + 'px';
        
        // Usuwaj jajka, które spadły na trawę
        if (j.y > powietrzeHeight) {
            j.element.remove();
            jajkaSpada.splice(index, 1);
            zycia--;
            aktualizujZycia();
            if (zycia <= 0) {
                alert('Koniec gry! Twój wynik: ' + wynik);
                location.reload();
            }
        }
    });
    
    sprawdzKolizje();
    
    // wywołanie funkcji animacja przy każdej klatce
    requestAnimationFrame(animacja);
}

// Generuj nowe jajka co sekundę
setInterval(generujJajko, 1000);

animacja();
