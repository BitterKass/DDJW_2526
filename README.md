Treball individual Arià Casellas Bosch
1. Introducció

Aquest projecte és una ampliació i refacció del joc de memòria desenvolupat a les classes teòriques. L'objectiu ha estat crear una aplicació web basada en HTML, CSS i JavaScript. S'hi han implementat múltiples modes de joc, una dificultat completament escalable, generació gràfica de recursos amb SVG i un sistema de guardat i rànquing usant l'emmagatzematge local del navegador.
2. Descripció del disseny del joc

L'estètica del joc s'ha dissenyat buscant una aparença neta i moderna utilitzant tècniques de glassmorphism (fons translúcids, degradats blaus i ombres suaus). Pel que fa a les mecàniques, el disseny es divideix en dos grans blocs principals:

    Mode Clàssic: Orientat a partides ràpides i configurables. El jugador pot accedir a la pantalla d'Opcions per triar el número de parelles base, la mida del grup (parelles, trios, quartets) i la dificultat (Baixa, Normal, Alta). Aquesta dificultat no només altera els temps d'espera i les penalitzacions de puntuació, sinó que també afecta la mida del grup.

    Mode Infinit (Supervivència): Un repte progressiu on l'objectiu és sobreviure tants nivells com sigui possible. S'inicia amb regles bàsiques, però en superar el nivell s'atorga una petita bonificació fixa de +100 punts de "vida" i s'autogenera un nou taulell augmentant dràsticament la penalització per fallada, reduint el temps de memorització, augmentant el nombre de cartes i elevant la mida del grup a cercar sense cap límit.

    Sistema de Rànquing: Lligat exclusivament al Mode Infinit. En iniciar el joc es demana un nom d'usuari i, en perdre tots els punts de vida, el sistema registra el nom, el nivell màxim assolit i la puntuació restant, classificant-los al menú principal.

    Art Programat: Les cartes s'han dissenyat programàticament utilitzant coordenades geomètriques amb SVG, eliminant qualsevol fitxer d'imatge extern per aconseguir una càrrega instantània i resolució infinita.

3. Descripció de les parts més rellevants de la implementació

La part tècnica d'aquest treball ha requerit modificar profundament la lògica original del fitxer memory.js i descentralitzar responsabilitats:

    Separació de modes i generació de nivells: La funció select() actua com a nucli del joc. Valida el sessionStorage per decidir si ha de carregar un guardat anterior, aplicar les variables configurades a options.js (per al Mode 1), o sobreescriure variables de dificultat (temps base, passes de temps, mida del grup, penalització) per autogenerar un nou nivell (Mode 2) repoblant el taulell mitjançant duplicació dinàmica d'elements.

    Sistema de Guardat Local: S'han eliminat les antigues crides fetch a rutes PHP. Ara, la funció save() crea un objecte JSON amb tot l'estat actual de la partida (incloent-hi l'array de cartes ja girades i les variables dinàmiques) i l'emmagatzema a localStorage. El menú principal pot llegir aquesta memòria, mostrar un historial cronològic de partides (amb data i hora) i permetre reprendre el joc i sobreescriure el guardat tantes vegades com calgui.

    Injecció d'SVG mitjançant Data URI: Per complir l'objectiu de no dependre de fitxers gràfics ni programes vectorials externs, s'han definit cadenes de text a JavaScript prefixades amb data:image/svg+xml;utf8, que contenen etiquetes HTML de dibuix (<rect>, <circle>, <polygon>). Això és interpretat directament per l'atribut src de l'etiqueta <img> generada al Canvas.

4. Conclusions i problemes trobats

Avançar des d'un joc tancat amb valors fixos cap a un sistema totalment dinàmic ha suposat un repte de disseny de programari.

    Problema de "Taulell Buit" al Mode Infinit: En implementar el pas de nivell del Mode 2, el joc refrescava la pantalla però intentava carregar una llista de cartes buida del sessionStorage en comptes de generar-ne de noves. Es va solucionar actualitzant la lògica de carrega per discriminar si s'està continuant una partida existent o generant l'escenari d'un nivell en blanc.

    Desbalanç de la Dificultat i Punts: Inicialment la puntuació guanyada al passar de nivell del Mode Infinit creixia de forma exponencial. Això permetia a l'usuari fallar desenes de vegades als nivells superiors, anul·lant la sensació de "Supervivència". La solució ha estat balancejar l'algorisme per fixar un premi de punts pla i un increment de penalització molt més abrupte.

    Caché agressiu del navegador: Al principi del projecte, els nous botons d'interfície no funcionaven perquè el navegador estava guardant en memòria cau la versió antiga del fitxer main.js. Ha calgut adoptar una metodologia constant de forçar recàrregues completes per validar els canvis i garantir que el DOM trobés els EventListeners correctes.
