const supabaseClient = supabase.createClient(
    CONFIG.SUPABASE_URL,
    CONFIG.SUPABASE_KEY
);

const tabla=document.getElementById("tablaUsuarios");
const msg=document.getElementById("msg");
const btn=document.getElementById("crearBtn");

async function cargarUsuarios(){
    const {data,error}=await supabaseClient
        .from("perfiles")
        .select("nombre,rol,activo")
        .order("nombre");

    if(error){
        msg.textContent=error.message;
        return;
    }

    tabla.innerHTML="";

    (data||[]).forEach(u=>{
        tabla.innerHTML+=`
        <tr>
            <td style="padding:10px">${u.nombre}</td>
            <td>${u.rol}</td>
            <td>${u.activo?"Activo":"Inactivo"}</td>
        </tr>`;
    });
}

btn.addEventListener("click",()=>{
    alert("La creación de usuarios se implementará en el siguiente módulo usando Supabase Auth (Admin API).");
});

cargarUsuarios();
