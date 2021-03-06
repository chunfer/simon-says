const celeste = document.getElementById('celeste')
const violeta = document.getElementById('violeta')
const naranja = document.getElementById('naranja')
const verde = document.getElementById('verde')
const level = document.getElementById('level')
const max_level = document.getElementById('max_level');
const audios = document.getElementsByClassName('sound');
const btnEmpezar = document.getElementById('btnEmpezar')

let highScore = 1;
max_level.innerHTML = String(highScore);

let ULTIMO_NIVEL = prompt('Ingrese cantidad de niveles (por defecto hay 10):');
if(ULTIMO_NIVEL){
    ULTIMO_NIVEL = Number(ULTIMO_NIVEL);
}else{
    ULTIMO_NIVEL = 10;
}



class Juego {
    constructor() {
        this.inicializar = this.inicializar.bind(this);
        this.inicializar();
        this.generarSecuencia();
        setTimeout(this.siguienteNivel, 500);
    }

    inicializar() {
        this.siguienteNivel = this.siguienteNivel.bind(this);
        this.elegirColor = this.elegirColor.bind(this);
        btnEmpezar.classList.toggle('hide')
        this.nivel = 1;
        level.innerHTML = String(this.nivel);
        this.colores = {
            celeste,
            violeta,
            naranja,
            verde
        };
    }

    generarSecuencia(){
        this.secuencia = new Array(ULTIMO_NIVEL).fill(0).map(() => Math.floor(Math.random() * 4));
    }

    siguienteNivel(){
        this.subnivel = 0;
        this.iluminarSecuencia();
        this.agregarEventosClick();
    }

    transformarNumeroAColor(numero){
        switch(numero){
            case 0:
                return 'celeste';

            case 1:
                return 'violeta';

            case 2:
                return 'naranja';

            case 3:
                return 'verde';
        }
    }

    transformarColorANumero(color){
        switch(color){
            case 'celeste':
                return 0;

            case 'violeta':
                return 1;

            case 'naranja':
                return 2;

            case 'verde':
                return 3;
        }
    }

    iluminarSecuencia(){
        for(let i = 0; i < this.nivel; i++){
            const color = this.transformarNumeroAColor(this.secuencia[i]);
            
            setTimeout(() => this.iluminarColor(color), 800 * i);
        }
    }

    iluminarColor(color, elegir = false){
        this.colores[color].classList.add('light');
        const numeroColor = this.transformarColorANumero(color);
        if (elegir){
            if(numeroColor === this.secuencia[this.subnivel]){
                if(this.subnivel === ULTIMO_NIVEL - 1){
                    audios[5].play();
                }else{
                    audios[numeroColor].play();
                }
            }else{
                audios[4].play();
            }
        }else{
            audios[numeroColor].play();
        }

        
        setTimeout(() => this.apagarColor(color), 550);
    }

    apagarColor(color){
        this.colores[color].classList.remove('light');
    }

    agregarEventosClick(){
        this.colores.celeste.addEventListener('click', this.elegirColor);
        this.colores.violeta.addEventListener('click', this.elegirColor);
        this.colores.naranja.addEventListener('click', this.elegirColor);
        this.colores.verde.addEventListener('click', this.elegirColor);
    }

    eliminarEventosClick(){
        this.colores.celeste.removeEventListener('click', this.elegirColor);
        this.colores.violeta.removeEventListener('click', this.elegirColor);
        this.colores.naranja.removeEventListener('click', this.elegirColor);
        this.colores.verde.removeEventListener('click', this.elegirColor);
    }

    elegirColor(evento){
        const nombreColor = evento.target.dataset.color;
        const numeroColor = this.transformarColorANumero(nombreColor);
        this.iluminarColor(nombreColor, true);

        if(numeroColor === this.secuencia[this.subnivel]){
            this.subnivel++;

            if (this.subnivel === this.nivel){
                this.nivel++;
                level.innerHTML = String(this.nivel);
                this.eliminarEventosClick();
                if(this.nivel === ULTIMO_NIVEL + 1){
                    //Ganó
                    this.ganoElJuego();
                }else{
                    setTimeout(this.siguienteNivel, 1500);
                    if(this.nivel > highScore){
                        highScore = this.nivel;
                        max_level.innerHTML = String(highScore);
                    }
                }
            }
        }else{
            this.perdioElJuago(); 
        }
    }

    ganoElJuego(){
        level.innerHTML = "";
        swal("HAS GANADO!", "Bien hecho :D", "success")
        .then(this.inicializar)
    }

    perdioElJuago(){
        swal("OOPS! Perdiste", "Presionaste el boton equivocado :(", "error")
        .then(() => {
            this.eliminarEventosClick()
            this.inicializar()
        })
    }
}

function empezarJuego() {
    window.juego = new Juego();
}