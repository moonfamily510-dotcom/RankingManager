const supabaseClient = supabase.createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_KEY
);

const usuario=document.getElementById("usuario");
const puntos=document.getElementById("puntos");
const msg=document.getElementById("msg");
const btn=document.getElementById("guardarBtn");

async function cargarUsuarios(){
  const {data,error}=await supabaseClient
    .from("perfiles")
    .select("id,nombre")
    .eq("activo",true)
    .order("nombre");

  if(error){
    msg.textContent=error.message;
    return;
  }

  usuario.innerHTML="<option value=''>Seleccione...</option>";
  (data||[]).forEach(u=>{
    usuario.innerHTML+=`<option value="${u.id}">${u.nombre}</option>`;
  });
}

btn.addEventListener("click",guardarRegistro);

async function guardarRegistro(){

  msg.style.color="#dc2626";

  if(!usuario.value || puntos.value===""){
    msg.textContent="Complete todos los campos.";
    return;
  }

  const hoy=new Date().toISOString().split("T")[0];

  const {data:existe}=await supabaseClient
    .from("registros")
    .select("id")
    .eq("usuario_id",usuario.value)
    .eq("fecha",hoy)
    .maybeSingle();

  let error;

  if(existe){
    ({error}=await supabaseClient
      .from("registros")
      .update({
        puntos:Number(puntos.value),
        actualizado_en:new Date().toISOString()
      })
      .eq("id",existe.id));
  }else{
    ({error}=await supabaseClient
      .from("registros")
      .insert({
        usuario_id:usuario.value,
        fecha:hoy,
        puntos:Number(puntos.value)
      }));
  }

  if(error){
    msg.textContent=error.message;
    return;
  }

  msg.style.color="#16a34a";
  msg.textContent="Registro guardado correctamente.";
  puntos.value="";
}

cargarUsuarios();
