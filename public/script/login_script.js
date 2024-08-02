const form = document.querySelector("form");
const nam = document.querySelector("input");

form.addEventListener("submit", (e)=>{
    if(nam.value.trim() == ""){
        e.preventDefault();
    }  
})