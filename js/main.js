addEventListener('load', function () {
    document.getElementById('options').addEventListener('click',
        function () {
            window.location.assign("./html/options.html");
        });

    function startPlay(mode) {
        let name = prompt("Entra el nom d'usuari:");
        if (!name) return;

        console.log("El teu nom és: " + name);
        alert("Comença la partida");

        sessionStorage.setItem('gameMode', mode);
        sessionStorage.removeItem('load');
        window.location.assign("./html/game.html");
    }

    document.getElementById('play1').addEventListener('click', () => startPlay(1));
    document.getElementById('play2').addEventListener('click', () => startPlay(2));

    document.getElementById('saves').addEventListener('click', function () {
        let saves = JSON.parse(localStorage.getItem('memory_saves')) || [];

        if (saves.length === 0) {
            alert("No hi ha cap partida guardada en aquest navegador.");
            return;
        }

        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('saves-menu').style.display = 'block';

        let savesList = document.getElementById('saves-list');
        savesList.innerHTML = '';

        saves.forEach((saveData, index) => {
            let btn = document.createElement('button');
            let modeText = saveData.gameMode === 1 ? "Clàssic" : `Infinit (Nivell ${saveData.level})`;

            btn.innerHTML = `<strong>Partida ${saves.length - index}</strong><br>
                             <small>${modeText} | Punts: ${saveData.score}</small><br>
                             <small style="font-size: 0.8rem; opacity: 0.8;">${saveData.date}</small>`;

            btn.style.height = 'auto';
            btn.style.padding = '10px';
            btn.style.background = 'linear-gradient(135deg, #9b59b6, #8e44ad)';

            btn.addEventListener('click', () => {
                sessionStorage.setItem('load', JSON.stringify(saveData)); // Passem TOT l'objecte seleccionat
                window.location.assign("./html/game.html");
            });

            savesList.appendChild(btn);
        });

        document.getElementById('back-to-menu').addEventListener('click', function () {
            document.getElementById('saves-menu').style.display = 'none';
            document.getElementById('main-menu').style.display = 'block';
        });
    });
})