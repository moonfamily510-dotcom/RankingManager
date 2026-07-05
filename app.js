// Ranking Manager Pro - app.js

const supabaseClient = supabase.createClient(
    CONFIG.SUPABASE_URL,
    CONFIG.SUPABASE_KEY
);

const btn = document.getElementById("loginBtn");
const msg = document.getElementById("msg");

btn.addEventListener("click", login);

async function login(){

    msg.style.color="#dc2626";
    msg.textContent="";

    const email=document.getElementById("email").value.trim();
    const password=document.getElementById("password").value;

    if(!email || !password){
        msg.textContent="Complete todos los campos.";
        return;
    }

    btn.disabled=true;
    btn.textContent="Ingresando...";

    const {data,error}=await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    btn.disabled=false;
    btn.textContent="Iniciar sesión";

    if(error){
        msg.textContent=error.message;
        return;
    }

    msg.style.color="#16a34a";
    msg.textContent="Inicio de sesión correcto.";

    // Temporal
    setTimeout(()=>{
        alert("Login correcto. En el siguiente módulo construiremos el Dashboard.");
        // window.location="dashboard.html";
    },700);

}
