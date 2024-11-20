const url = "http://127.0.0.1:5000"
const usernameTextArea = document.getElementById("usernameLogin");
const passwordTextArea = document.getElementById("passwordLogin");
const loginButton = document.getElementById("loginButton");
let loginUsername;
let loginPassword;
let login = {}

loginButton.addEventListener("click", async function(){
    const usern = usernameTextArea.value;
    const pass = passwordTextArea.value;
    const data = {
        "username" : usern,
        "password" : pass
    }
    const response = await apiPost(`${url}/signup`, data)
    if (response == "ok"){
        loginUsername = usern
        loginPassword = pass
        login = {"username" : loginUsername, "password" : loginPassword}
    }
})




const textArea = document.getElementById("text");
const sendButton = document.getElementById("sendButton");
const messageArea = document.getElementById("messageSpace");
const usernameToSendTextArea = document.getElementById("usernameSend")


sendButton.addEventListener("click", async function() {
    // console.log("olaaaa")
    if(loginUsername){
        const sendMessage = messageArea.value;
        const usernameToSend = usernameToSendTextArea.value;
        const data = {'message': sendMessage, "login" : login, "namePerson" : usernameToSend};
        const response = await apiPost(`${url}/send`, data);
        console.log(response)
        textArea.textContent = response;
    }
})



// -------- EXTRA FUNCIONTS -------- //

async function apiGet(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response;
        console.log(data)
        return data.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

async function apiPost(url, data) {
    try{
        const response = await fetch(url, {
            method : "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const data_received = await response.json();
        console.log("done")
        return data_received
    }
    catch (error){
        console.log("shit")
        return ("Something went wrong while making post request: ", error);
    }
}

