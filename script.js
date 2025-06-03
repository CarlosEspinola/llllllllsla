const jugadores = {
  "Carlos Jiménez": { PJ: 0, PG: 0, PE: 0, PP: 0, GF: 0, GC: 0 },
  "Carlos Espinola": { PJ: 0, PG: 0, PE: 0, PP: 0, GF: 0, GC: 0 },
  "Oscar": { PJ: 0, PG: 0, PE: 0, PP: 0, GF: 0, GC: 0 },
  "Luciano": { PJ: 0, PG: 0, PE: 0, PP: 0, GF: 0, GC: 0 },
  "Alan": { PJ: 0, PG: 0, PE: 0, PP: 0, GF: 0, GC: 0 }
};

const historial = {};
let partidosRecientes = [];

function registrarPartido() {
  const j1 = document.getElementById("jugador1").value;
  const j2 = document.getElementById("jugador2").value;
  const goles1 = parseInt(document.getElementById("goles1").value);
  const goles2 = parseInt(document.getElementById("goles2").value);

  if (j1 === j2) {
    alert("Los jugadores deben ser distintos.");
    return;
  }

  if (isNaN(goles1) || isNaN(goles2)) {
    alert("Ingresá los goles correctamente.");
    return;
  }

  actualizarTabla(j1, j2, goles1, goles2);
  actualizarHistorial(j1, j2, goles1, goles2);

  partidosRecientes.unshift({ j1, j2, goles1, goles2 });
  if (partidosRecientes.length > 10) partidosRecientes.pop();

  renderPartidosRecientes();
  guardarDatos();
}

function actualizarTabla(j1, j2, goles1, goles2) {
  jugadores[j1].PJ++;
  jugadores[j2].PJ++;
  jugadores[j1].GF += goles1;
  jugadores[j1].GC += goles2;
  jugadores[j2].GF += goles2;
  jugadores[j2].GC += goles1;

  if (goles1 > goles2) {
    jugadores[j1].PG++;
    jugadores[j2].PP++;
  } else if (goles2 > goles1) {
    jugadores[j2].PG++;
    jugadores[j1].PP++;
  } else {
    jugadores[j1].PE++;
    jugadores[j2].PE++;
  }

  renderTablaGeneral();
}

function renderTablaGeneral() {
  const tabla = document.querySelector("#tablaGeneral tbody");
  tabla.innerHTML = "";

  const listaJugadores = Object.entries(jugadores).map(([nombre, j]) => {
    return {
      nombre,
      PJ: j.PJ,
      PG: j.PG,
      PE: j.PE,
      PP: j.PP,
      GF: j.GF,
      GC: j.GC,
      DG: j.GF - j.GC,
      puntos: j.PG * 3 + j.PE
    };
  });

  listaJugadores.sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos;
    return b.DG - a.DG;
  });

  for (const j of listaJugadores) {
    const fila = `
      <tr>
        <td>${j.nombre}</td>
        <td>${j.PJ}</td>
        <td>${j.PG}</td>
        <td>${j.PE}</td>
        <td>${j.PP}</td>
        <td>${j.GF}</td>
        <td>${j.GC}</td>
        <td>${j.DG}</td>
        <td>${j.puntos}</td>
      </tr>
    `;
    tabla.innerHTML += fila;
  }
}

function actualizarHistorial(j1, j2, goles1, goles2) {
  const key = [j1, j2].sort().join("-");
  if (!historial[key]) {
    historial[key] = {
      jugadores: [j1, j2],
      partidos: 0,
      victorias: { [j1]: 0, [j2]: 0 },
      empates: 0,
      maxVictoria: { ganador: "", diferencia: 0, resultado: "" }
    };
  }

  const h = historial[key];
  h.partidos++;

  if (goles1 > goles2) {
    h.victorias[j1]++;
    if ((goles1 - goles2) > h.maxVictoria.diferencia) {
      h.maxVictoria = { ganador: j1, diferencia: goles1 - goles2, resultado: `${goles1}-${goles2}` };
    }
  } else if (goles2 > goles1) {
    h.victorias[j2]++;
    if ((goles2 - goles1) > h.maxVictoria.diferencia) {
      h.maxVictoria = { ganador: j2, diferencia: goles2 - goles1, resultado: `${goles2}-${goles1}` };
    }
  } else {
    h.empates++;
  }

  renderHistorial();
}

function renderHistorial() {
  const div = document.getElementById("historialEntreJugadores");
  div.innerHTML = "";

  for (const key in historial) {
    const h = historial[key];
    const [j1, j2] = h.jugadores;
    div.innerHTML += `
      <p><strong>${j1} vs ${j2}</strong> —> Enfrentamientos: ${h.partidos} || 
      Victorias de ${j1}: ${h.victorias[j1]} || 
      Victorias de ${j2}: ${h.victorias[j2]} || 
      Empates: ${h.empates} ||
      Victoria más abultada: ${h.maxVictoria.ganador} (${h.maxVictoria.resultado}) ||</p>
    `;
  }
}

function renderPartidosRecientes() {
  const ul = document.getElementById("partidosRecientes");
  ul.innerHTML = "";

  partidosRecientes.forEach((p, index) => {
    const li = document.createElement("li");
    li.style.marginBottom = "8px";
    li.innerHTML = `
      <span>${p.j1} ${p.goles1} - ${p.goles2} ${p.j2}</span>
      <button onclick="eliminarPartido(${index})" style="margin-left: 10px; cursor: pointer;">🗑</button>
    `;
    ul.appendChild(li);
  });
}

function eliminarPartido(index) {
  const partido = partidosRecientes[index];
  if (!partido) return;

  const { j1, j2, goles1, goles2 } = partido;

  jugadores[j1].PJ--;
  jugadores[j2].PJ--;
  jugadores[j1].GF -= goles1;
  jugadores[j1].GC -= goles2;
  jugadores[j2].GF -= goles2;
  jugadores[j2].GC -= goles1;

  if (goles1 > goles2) {
    jugadores[j1].PG--;
    jugadores[j2].PP--;
  } else if (goles2 > goles1) {
    jugadores[j2].PG--;
    jugadores[j1].PP--;
  } else {
    jugadores[j1].PE--;
    jugadores[j2].PE--;
  }

  partidosRecientes.splice(index, 1);
  Object.keys(historial).forEach(k => delete historial[k]);
  partidosRecientes.forEach(p => {
    actualizarHistorial(p.j1, p.j2, p.goles1, p.goles2);
  });

  renderTablaGeneral();
  renderHistorial();
  renderPartidosRecientes();
  guardarDatos();
}

function guardarDatos() {
  localStorage.setItem("jugadores", JSON.stringify(jugadores));
  localStorage.setItem("historial", JSON.stringify(historial));
  localStorage.setItem("partidosRecientes", JSON.stringify(partidosRecientes));
}

function cargarDatos() {
  const datosJugadores = localStorage.getItem("jugadores");
  const datosHistorial = localStorage.getItem("historial");
  const datosPartidos = localStorage.getItem("partidosRecientes");

  if (datosJugadores) Object.assign(jugadores, JSON.parse(datosJugadores));
  if (datosHistorial) Object.assign(historial, JSON.parse(datosHistorial));
  if (datosPartidos) partidosRecientes = JSON.parse(datosPartidos);

  renderTablaGeneral();
  renderHistorial();
  renderPartidosRecientes();
}

cargarDatos();

