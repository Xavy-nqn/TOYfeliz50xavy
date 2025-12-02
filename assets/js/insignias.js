// 🚀 TOY feliz 50 XAVY 👨‍🚀
//
//  Lógica de certificación digital de las insignias obtenidas en los concursos
//    :: insignias.js
//    :: versión 8.3
//    :: 22 11 25
//    :: Javier Prior


async function consultarFila() {
  const raw = document.getElementById('fila').value;
  const fila = parseInt(raw, 10);

  if (!raw || Number.isNaN(fila) || fila < 1) {
    document.getElementById('resultado').innerHTML = "<p>Ingresá un número de insignia válido.</p>";
    return;
  }

  const url = "assets/data/insignias.txt";

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    let texto = await resp.text();

    // eliminar BOM si existiera
    if (texto.charCodeAt(0) === 0xFEFF) texto = texto.slice(1);

    const lineas = texto.trim().split(/\r?\n/).filter(l => l.trim().length > 0);

    if (fila > lineas.length) {
      document.getElementById('resultado').innerHTML = "<p>No existe esa insignia.</p>";
      return;
    }

    const datosRaw = lineas[fila - 1].split("|");
    const datos = datosRaw.map(d => d ? d.trim() : "");

    // Según tu formato REAL:
    const id = datos[0];
    const insignia = datos[1];
    const categoria = datos[2];
    const distincion = datos[3];
    const criterio = datos[4];

    document.getElementById('resultado').innerHTML = `
      <h2>DISTINCIÓN ${id}</h2>
      <h1>${escapeHtml(insignia)}</h1>
      <h3>${escapeHtml(categoria)}</h3>
      <p>El benemérito jurado del COMANDO ESTELAR te otorga la insignia</p>
      <p>${escapeHtml(distincion)}.</p>
      <p>por ${escapeHtml(criterio)}.</p>
      <p>NEUQUÉN 2025 - AL INFINITO Y MÁS ALLÁ</p>
    `;
  } catch (err) {
    console.error("Error al cargar insignias:", err);
    document.getElementById('resultado').innerHTML = "<p>Error al cargar los datos.</p>";
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
