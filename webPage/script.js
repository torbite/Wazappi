const text = document.getElementById("text");
const button = document.getElementById("butt");
var a = 0;

button.addEventListener("click", async function(){
    const data = await apiGet("http://127.0.0.1:5000");
    text.textContent = data;
    a += 1;
})

async function apiGet(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

