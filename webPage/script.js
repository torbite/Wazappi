const text = document.getElementById("text");
const button = document.getElementById("butt");
var a = 0;

button.addEventListener("click",function(){
    text.textContent = a;
    a += 1;
})



