addEventListener('load', function() {
    document.getElementById('play').addEventListener('click', 
    function(){
        let name = prompt("Entra el nom d'usuari:");

        console.log("El teun nom és: " + name);
        alert("Comença la partida");
    });

    document.getElementById('options').addEventListener('click', 
    function(){
        console.error("Opció no implementada");
    });

    document.getElementById('saves').addEventListener('click', 
    function(){
        console.error("Opció no implementada");
    });

    document.getElementById('exit').addEventListener('click', 
    function(){
        console.warn("No es pot sortir!");
    });
});