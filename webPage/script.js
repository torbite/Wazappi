// securityles chrome: open -na "Google Chrome" --args --disable-web-security --user-data-dir="/tmp/chrome_dev"

const url = "https://torbite.pythonanywhere.com"
const usernameSignInTextArea = document.getElementById("usernameSignIn");
const passwordSignInTextArea = document.getElementById("passwordSignIn");
const SignInButton = document.getElementById("SignInButton");

const usernameLoginTextArea = document.getElementById("usernamelogin");
const passwordLoginTextArea = document.getElementById("passwordlogin");
const loginButton = document.getElementById("loginButton");

const userText = document.getElementById("userText");
const textArea = document.getElementById("text");
const sendButton = document.getElementById("sendButton");
const messageArea = document.getElementById("messageSpace");
const usernameToSendTextArea = document.getElementById("usernameSend");

const messagesDiv = document.getElementById("MessagesDiv");


const getMessagesButton = document.getElementById("getMessagesButton");


let loginUsername;
let loginPassword;
let login = {}

SignInButton.addEventListener("click", async function(){
    const usern = usernameSignInTextArea.value;
    const pass = passwordSignInTextArea.value;
    const data = {
        "username" : usern,
        "password" : pass
    }
    const response = await apiPost(`${url}/signup`, data)
    console.log(response);
    if (response == "ok"){
        loginUsername = usern;
        loginPassword = pass;
        login = {"username" : loginUsername, "password" : loginPassword};
        updateUserText(login["username"]);
        textArea.textContent = "logged on";
    }
    else{
        updateUserText("None");
        textArea.textContent = response;   
    }
})


loginButton.addEventListener("click", async function(){
    const usern = usernameLoginTextArea.value;
    const pass = passwordLoginTextArea.value;
    const data = {
        "username" : usern,
        "password" : pass
    }
    const response = await apiPost(`${url}/login`, data)
    console.log(response);
    if (response == "ok"){
        loginUsername = usern;
        loginPassword = pass;
        login = {"username" : loginUsername, "password" : loginPassword};
        textArea.textContent = "logged on";
        userText.textContent = login["username"];
        updateUserText(login["username"]);
    }
    else{
        updateUserText("None");
        textArea.textContent = response;
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
    // textArea.textContent = response;
})



getMessagesButton.addEventListener("click", async function() {
    const sendData = {"login" : login};
    const response = await apiPost(`${url}/get`, sendData);
    console.log(response);
    const messages = response["messages"];
    const length = messages.length;
    for(let i = 0; i < length && i < 13; i++){
        var message = messages[i]["message"];
        var user = messages[i]["username"];
        var id = `message${i}`
        var elm = document.getElementById(id)
        if(!elm){
            elm = document.createElement("h3");
            elm.id = id
        }
        
        elm.textContent = `${user} : ${message}`;
        elm.style.backgroundColor = "gray";
        elm.style.borderWidth = 3;
        elm.style.borderColor = "black";
        // document.body.appendChild(elm);
        messagesDiv.appendChild(elm)
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

function updateUserText(user){
    userText.textContent = `Username logged in: ${user}`
}
