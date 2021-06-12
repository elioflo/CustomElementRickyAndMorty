const template = document.createElement('template')

template.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                font-family: 'Comic Neue', cursive;
            }
            .contenedor {
                width: 500px;
                height: 320px;
                border-radius: 5px;
                box-shadow: 0 4px 8px 0 rgba(0,0,0, 0.5), 0 6px 20px 0 rgba(0,0,0, 0.5);
                padding: 5px 15px;
                background-color: #2b2e4a;
            }
            .titulo {
                text-align: center;
                color: yellow;
                text-shadow: 5px 5px 5px black;
            }
            .main {
                width: 100%;
                display: flex;
                margin-top: 15px;
            }
            .left, .right {
                width: 50%;
            }
            .imagen {
                width: 100%;
                border-radius: 5px;
                box-shadow: 0 4px 8px 0 rgba(0,0,0, 0.5), 0 6px 20px 0 rgba(0,0,0, 0.5);
            }
            .info-personaje {
                margin-top: 10px;
                color: white;
                text-shadow: 1px 1px 1px black;
            }
            input {
                outline: none;
                padding: 5px;
                border-radius: 5px;
                border: 1px solid grey;
                width: 90%;
            }
            button{
                margin-top: 5px;
                padding:2px;
            }
        </style>
        <div class="contenedor">
            <h1 class="titulo">Personaje</h1>
            <div class="main">
                <div class="left">
                    <input placeholder="Ingrese id de un personaje..." /><button>Buscar</button>
                    <p class="info-personaje" ></p>
                </div>
                <div class="right">
                    <img class="imagen"/>
                </div>
            </div>
        </div>
`

class RickyAndMorty extends HTMLElement {
    constructor() {
        console.log('constructor')
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
        console.log('connectedCallback')
        this.descripcion = this.shadowRoot.querySelector('.info-personaje')
        this.imagen = this.shadowRoot.querySelector('.imagen')
        this.input = this.shadowRoot.querySelector('input')
        this.boton = this.shadowRoot.querySelector('button')
        this.boton.addEventListener('click', () => this.buscarPersonaje())
        this.start()
    }

    inputValido() {
        return this.input.value && this.input.value.length >= 0 && !isNaN(this.input.value)
    }

    buscarPersonaje() {
        if (this.inputValido()) {
            this.stop()
            this.reemplazarPersonaje(parseInt(this.input.value))
            this.start()
        }
    }

    desconnectedCallback() {
        console.log('desconnectedCallback')
    }

    attributeChangedCallback() {
        console.log('attributeChangedCallback')
    }

    start() {
        this.temporizadorId = window.setInterval(() => this.incrementarIdYReemplazarPersonaje(), 3000);
    }

    stop() {
        window.clearInterval(this.temporizadorId);
    }


    reemplazarPersonaje(idPersonaje) {
        this.idPersonaje = idPersonaje
        const description = (data) => `Nombre: ${data.name}
        <br />Estado: ${data.status}
        <br />Tipo: ${data.type}
        <br />Especie: ${data.species}
        <br />Genero: ${data.gender}
        <br />Origen: ${data.origin.name}`;
        const fillElement = (data) => {
            if (data.error) {
                this.descripcion.innerHTML = `Error: ${data.error} <br/> Vuelve al primero.`;
                this.imagen.src = "";
                this.idPersonaje = 0;
            } else {
                this.descripcion.innerHTML = description(data);
                this.imagen.src = data.image;
                this.badState = false;
            }
        }

        fetch(`https://rickandmortyapi.com/api/character/${this.idPersonaje}`)
            .then(response => response.json())
            .then(data => fillElement(data))
    }

    incrementarIdYReemplazarPersonaje() {
        this.reemplazarPersonaje(this.idPersonaje ? this.idPersonaje + 1 : 1)
    }
}

customElements.define('ricky-and-morty', RickyAndMorty)