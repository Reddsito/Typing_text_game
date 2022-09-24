const textP = document.querySelector(".wrapper__text p"),
inputText = document.querySelector(".wrapper__input"),
boxText = document.querySelector(".wrapper__text"),
mistakeTag = document.querySelector(".mistakes span"),
timerTag = document.querySelector(".timer span"),
wpmTag = document.querySelector(".wpm span"),
cpmTag = document.querySelector(".cpm span"),
accuracyTag = document.querySelector(".accuracy span"),
tryButton = document.querySelector(".wrapper__button"),
boxDetails = document.querySelector(".wrapper__details"),
line = document.querySelector(".wrapper__line")


let charIndex = mistakes = accuracy = countError = 0, isTyping = false
let timer, timeLeft = maxTime = 45


function randomText() {

    //Creamos un número random entre 0 y el tamaño del array -1.
    let randIndex = Math.floor(Math.random() * paragraphs.length)
    textP.innerHTML = ""
    


    //Creamos un array con cada caracter del texto separado.
    paragraphs[randIndex].split("").forEach( span => {
        //Recorremos cada caracter, la colocamos en un span, y lo añadimos a el textP.
        let spanChar = `<span>${span}</span>`
        textP.innerHTML += spanChar
    })

    //Focuseamos el input al escribir o hacer click a el texto.
    document.addEventListener("keydown", () => inputText.focus())
    textP.addEventListener("click", () => inputText.focus())


}

function typing() {
 
    let character = textP.querySelectorAll("span")
    let typedChar = inputText.value.split("")[charIndex]
    let coordsNext = character[charIndex+1].getBoundingClientRect();
    let coordsActual =  character[charIndex].getBoundingClientRect();

        if(charIndex < character.length - 1 && timeLeft > 0) {
            //desaparecer la caja de detalles
            boxDetails.style.opacity = 0;

            //Condición para no reiniciar el contador cada vez que clickeamos
        if(!isTyping) {
            timer = setInterval(initTimer, 1000)
            isTyping = true
        }
   
    
    //Algoritmo para mover la línea de texto al acabarla.
    if(coordsNext.top > coordsActual.top) {
        boxText.scrollBy(0, 35)
    }
    
 


    if(typedChar == null) {

        //En caso de que no escriba ningún carácter, o presione borrar, disminuimos el index y quitamos las clases de los span.
        charIndex--
       

        //En caso de que se elimine un caracter incorrecto, disminuye el contador de mistakes
        if(character[charIndex].classList.contains("incorrect")) {
            mistakes--
            countError++
        }
        character[charIndex].classList.remove("correct", "incorrect")

    } else {
        
         //En caso de que el caracter, coincida con el caracter escrito, se activará la clase correct, en caso contrario la incorrect

        if(character[charIndex].innerText === typedChar) {
            character[charIndex].classList.add("correct")
  
        } else {
            mistakes++
            countError++
            character[charIndex].classList.add("incorrect")
        }

        charIndex++ //Incrementamos el index si escribe (ya sea correcto o incorrecto)

    }
   

    
    //Quitamos la clase active a el span anterior.
    character.forEach( span => span.classList.remove("active"))

    //Añadimos la clase active a el caracter que está por escribirse para resaltarlo.
    character[charIndex].classList.add("active") 



    mistakeTag.innerText = mistakes
    cpmTag.innerText = charIndex - mistakes
    accuracy = ((charIndex - countError)/ charIndex) * 100
    accuracyTag.innerText = Math.round(accuracy) + "%"
    //Cálculo para saber el wpm, asumimos que cada palabra tiene en promedio 5 caracteres
    let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60) 
    //En caso que el wpm sea 0, esté vacío o esté infinito, le hacemos reset a 0.
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm

    wpmTag.innerText = wpm //No se cuentan los fallos
        } else {
            inputText.value = ""
            clearInterval(timer)
            boxDetails.style.opacity = 1;
           timerTag.style.filter = line.style.filter =  boxText.style.filter = "blur(2px)"
     
        }
    

    
}

function initTimer() {
    //En caso de que timeLeft sea mayor a 0 decrementa, en caso que no se limpia el timer.
    if(timeLeft > 0) {
        timeLeft--
        timerTag.innerText = timeLeft + "s"
    } else {
        clearInterval(timer)
    }
}
function resetGame() {
    randomText()
    timeLeft = maxTime
    charIndex = mistakes = 0
    isTyping = false
    timerTag.innerText = timeLeft
    mistakeTag.innerText = mistakes
    wpmTag.innerText = 0
    cpmTag.innerText = 0
    accuracyTag.innerText = 0
    inputText.value = ""
    clearInterval(timer)
    boxDetails.style.opacity = 1;
    timerTag.style.filter = line.style.filter = boxText.style.filter = "blur(0px)"
}


//Llamamos a la función para que al entrar a la página se genere el texto.
randomText() 

inputText.addEventListener("input", typing)
tryButton.addEventListener("click", resetGame)


