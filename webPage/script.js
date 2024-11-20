const url = "http://127.0.0.1:5000"
const usernameTextArea = document.getElementById("usernameLogin");
const passwordTextArea = document.getElementById("passwordLogin");
const loginButton = document.getElementById("loginButton");

const textArea = document.getElementById("text");
const sendButton = document.getElementById("sendButton");
const messageArea = document.getElementById("messageSpace");
const usernameToSendTextArea = document.getElementById("usernameSend");

const getMessagesButton = document.getElementById("getMessagesButton");


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
    console.log(response);
    if (response == "ok"){
        loginUsername = usern
        loginPassword = pass
        login = {"username" : loginUsername, "password" : loginPassword}
    }
})







sendButton.addEventListener("click", async function() {
    // console.log("olaaaa")
    if(loginUsername){
        const sendMessage = messageArea.value;
        const usernameToSend = usernameToSendTextArea.value;
        const data = {'message': sendMessage, "login" : login, "namePerson" : usernameToSend};
        const response = await apiPost(`${url}/send`, data);
        console.log(response);
        textArea.textContent = response;
    }
})



getMessagesButton.addEventListener("click", async function() {
    const sendData = {"login" : login};
    const response = await apiPost(`${url}/get`, sendData);
    console.log(response);
    const messages = response["messages"];
    const length = messages.length;
    for(let i = 0; i < length; i++){
        var message = messages[i];
        var id = `message${i}`
        var elm = document.getElementById(id)
        if(!elm){
            elm = document.createElement("h2");
            elm.id = id
        }
        
        elm.textContent = message;
        document.body.appendChild(elm);
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

        return data_received
    }
    catch (error){
        console.log("shit")
        return ("Something went wrong while making post request: ", error);
    }
}

