// dashboard.js

const supabaseClient = supabase.createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_KEY
);

async function cargarDashboard(){

  // Usuarios activos
  const { count: usuarios } = await supabaseClient
    .from("perfiles")
    .select("*", { count: "exact", head: true })
    .eq("activo", true);

  document.getElementById("usuarios").textContent = usuarios ?? 0;

  // Total de puntos
  const { data: puntosData } = await supabaseClient
    .from("registros")
    .select("puntos");

  let total = 0;
  (puntosData || []).forEach(r => total += Number(r.puntos));

  document.getElementById("puntos").textContent = total.toLocaleString();

  // Top 1 (calculado en JS)
  const { data: registros } = await supabaseClient
    .from("registros")
    .select("usuario_id,puntos");

  const mapa = {};
  (registros || []).forEach(r=>{
    mapa[r.usuario_id]=(mapa[r.usuario_id]||0)+Number(r.puntos);
  });

  let topId="-";
  let max=-1;
  Object.entries(mapa).forEach(([id,pts])=>{
    if(pts>max){max=pts;topId=id;}
  });

  if(topId!=="-"){
    const { data: perfil } = await supabaseClient
      .from("perfiles")
      .select("nombre")
      .eq("id",topId)
      .single();

    document.getElementById("top1").textContent = perfil?.nombre ?? "-";
  }

  // Registros de hoy
  const hoy = new Date().toISOString().split("T")[0];

  const { count: hoyCount } = await supabaseClient
    .from("registros")
    .select("*",{count:"exact",head:true})
    .eq("fecha",hoy);

  document.getElementById("hoy").textContent = hoyCount ?? 0;

}

cargarDashboard();
