addEventListener('load', function() {
    document.getElementById('options').addEventListener('click',
    function(){
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

    document.getElementById('saves').addEventListener('click', 
    function(){
        let to_load = localStorage.save;
        fetch('../php/load.php', {
            method: "POST",
            body: JSON.stringify({}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => to_load = (!json.error)?JSON.stringify(json.save): localStorage.save)
        .catch (err => {
            console.error(err);
            console.warn("La partida s'intentarà carregar de local");
        });

        if (!to_load) {
            alert("No hi ha cap partida a carregar");
            return;
        }
        sessionStorage.load = to_load;
        window.location.assign("./html/game.html");
    });

    document.getElementById('exit').addEventListener('click', 
    function(){
        console.warn("No es pot sortir!");
    });
});