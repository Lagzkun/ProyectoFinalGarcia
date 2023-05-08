//Introducción al Juego
let bienvenida = document.getElementById('bienvenida');
bienvenida.innerHTML='<h1>¡Juega y Descubre que tanto Sabes!</h1>'

let intro = document.getElementById('intro');
intro.innerHTML='<p>Selecciona la respuesta que creas correcta y espera 3 segundos para la siguiente pregunta.</p>'

const mostrar = document.getElementById('show')
const ocultar = document.getElementById('hide');

hide.style.display = "none";
mostrar.addEventListener('click', () => {
    if (hide.style.display === 'none') {
      hide.style.display = '';
    }else {
      hide.style.display = 'none';
    }
  });

const reset = document.getElementById('reset');

reset.addEventListener('click', function() {
  window.location.reload();
});

let preguntas_aleatorias = true;
let mostrar_pantalla_juego_terminado = true;
let reiniciar_puntos_al_reiniciar_el_juego = true;

window.onload = function () {
  base_preguntas = readText("objects.json");
  interprete_bp = JSON.parse(base_preguntas);
  escogerPreguntasAleatoria();
};

let pregunta;
let posibles_respuestas;

btn_correspondiente = [
  select_id("btn1"),
  select_id("btn2"),
  select_id("btn3"),
  select_id("btn4")
];

let preguntas = [];
let preguntas_hechas = 0;
let preguntas_correctas = 0;

function escogerPreguntasAleatoria() {
  let n;
  if (preguntas_aleatorias) {
    n = Math.floor(Math.random() * interprete_bp.length);
  } else {
    n = 0;
  }
  while (preguntas.includes(n)) {
    n++;
    if (n >= interprete_bp.length) {
      n = 0;
    }
    if (preguntas.length == interprete_bp.length) {
      if (juego_terminado) {
        swal.fire({
          title: "juego finalizado",
          text: "puntuación: " + preguntas_correctas + "/" + (preguntas_hechas - 1),
          icon: "success"
        })
      }
      if (reiniciar_juego) {
        preguntas_correctas = 0
        preguntas_hechas = 0
      }
      preguntas = [];
    }
  }
  preguntas.push(n);
  preguntas_hechas++;

  escogerPregunta(n);
}

function escogerPregunta(n) {
  pregunta = interprete_bp[n];
  select_id("categoria").innerHTML = pregunta.categoria;
  select_id("pregunta").innerHTML = pregunta.pregunta;
  select_id("numero").innerHTML = n;
  let pc = preguntas_correctas;
  if (preguntas_hechas > 1) {
    select_id("puntaje").innerHTML = pc + "/" + (preguntas_hechas - 1);
  } else {
    select_id("puntaje").innerHTML = "";
  }

  style("imagen").objectFit = pregunta.objectFit;
  desordenarRespuesta(pregunta);
  if (pregunta.imagen) {
    select_id("imagen").setAttribute("src", pregunta.imagen); 
      style("imagen").height = "200px";
      style("imagen").width = "100px";
    } else {
      style("imagen").height = "0px"
      style("imagen").width = "0";
      setTimeout(() => {
        select_id("imagen").setAttribute("src", "");
      }, 500);
    }
  }

function desordenarRespuesta(pregunta) {
  posibles_respuestas = [
    pregunta.respuesta,
    pregunta.incorrecta1,
    pregunta.incorrecta2,
    pregunta.incorrecta3,
  ];
  posibles_respuestas.sort(() => Math.random() - 0.5);
  select_id("btn1").innerHTML = posibles_respuestas[0];
  select_id("btn2").innerHTML = posibles_respuestas[1];
  select_id("btn3").innerHTML = posibles_respuestas[2];
  select_id("btn4").innerHTML = posibles_respuestas[3];
}

let suspender_botones = false;

function oprimir_btn(i) {
  if (suspender_botones) {
    return;
  }
  suspender_botones = true;
  if (posibles_respuestas[i] == pregunta.respuesta) {
    preguntas_correctas++;
    btn_correspondiente[i].style.background = "lightgreen";
  } else {
    btn_correspondiente[i].style.background = "pink";
  }
  for (let j = 0; j < 4; j++) {
    if (posibles_respuestas[j] == pregunta.respuesta) {
      btn_correspondiente[j].style.background = "lightgreen";
      break;
    }
  }
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
  }, 3000);
}

function reiniciar() {
  for (const btn of btn_correspondiente) {
    btn.style.background = "white";
  }
  escogerPreguntasAleatoria();
}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}

function readText(ruta_local) {
  var texto = null;
  var xmlhttp = new XMLHttpRequest ();
  xmlhttp.open("GET", ruta_local, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    texto = xmlhttp.responseText;
  }
  return texto;
}

// function thanks(){
//     let messageThanks = "Gracias por jugar "
//     alert(messageThanks + namePlayer);
// }

// ejecutar la funcion
// thanks();