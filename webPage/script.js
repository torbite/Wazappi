// securityles chrome: open -na "Google Chrome" --args --disable-web-security --user-data-dir="/tmp/chrome_dev"
// http://127.0.0.1:5000 and https://torbite.pythonanywhere.com
const url = "http://127.0.0.1:5000"

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
// const usernameToSendTextArea = document.getElementById("usernameSend");

const usernamesText = document.getElementById("usernamesText");

const messagesDiv = document.getElementById("MessagesDiv");
const getMessagesButton = document.getElementById("getMessagesButton");
// const seeMessagesTextArea = document.getElementById("usernameMessagesTextArea")
const userOptions = document.getElementById("userOptions");


let lastUser = "";

let usernames = [];
let divIds = {};

let loginUsername;
let loginPassword;
let login = {"username" : "None", "password" : "None"}

getUsers();

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
        const usernameToSend = lastUser;
        const data = {'message': sendMessage, "login" : login, "namePerson" : usernameToSend};
        const response = await apiPost(`${url}/send`, data);
        console.log(response);
        textArea.textContent = response;
    }
    // textArea.textContent = response;
})

setInterval(checkForMessages, 1000);
setInterval(getUsers, 10000);
setInterval(() => {
    if(userOptions.value != ""){
        lastUser = userOptions.value;
    }
    // console.log(lastUser);
}, 200);

getMessagesButton.addEventListener("click", async function() {
    await checkForMessages();
})



// -------- EXTRA FUNCIONTS -------- //

async function getUsers(){
    const response = await apiGet(`${url}/getAllUsers`);
    usernames = response["usernames"]
    console.log(usernames)
    text = " "
    userOptions.innerHTML = "";
    for(var i = 0; i < usernames.length; i ++){
        text += `\n${usernames[i]},`;
        const option = document.createElement("option");
        option.value = usernames[i];
        option.textContent = usernames[i];
        userOptions.appendChild(option);
    }
    //for(var i = 0)
    usernamesText.textContent = `Usernames: ${text}`
    
}

async function checkForMessages(){
    let userToSend = lastUser;
    
    const no = "There is no pesrson with that name";
    if(login["username"] != "None"  && userToSend != ""){

        const sendData = {"login" : login, 'userToReceiveChat' : userToSend};
        const response = await apiPost(`${url}/get`, sendData);
        if (response != no){
            // console.log(response);
            const messages = response["messages"];
            const length = messages.length;
            divId = `${userToSend}Div`;
            if (!(divId in divIds)){
                divIds[divId] = document.createElement("div");
                divIds[divId].id = divId;
                messagesDiv.appendChild(divIds[divId]);

            }
            // console.log(divIds.length)
            const divOfMsgs =  divIds[divId];
            // if(!divOfMsgs){
            //     divOfMsgs = document.createElement("div");
            //     divOfMsgs.id = `${userToSend}Div`;
            // }
            for(let i = 0; i < length && i < 13; i++){
                var message = messages[i]["message"];
                var user = messages[i]["username"];
                var id = `${userToSend}message${i}`;
                var elm = document.getElementById(id);

                if(!elm){
                    elm = document.createElement("h3");
                    elm.id = id;
                }
                
                elm.textContent = `${user} : ${message}`;
                elm.style.backgroundColor = "White";
                elm.style.borderWidth = 3;
                elm.style.borderColor = "black";
                // document.body.appendChild(elm);
                divOfMsgs.appendChild(elm);
            }

            Object.keys(divIds).forEach(key => {
                // console.log(key);
                // console.log(divId);
                if(key == divId){
                    divIds[key].style.display = "block";
                    // console.log("block");
                }
                else{
                    divIds[key].style.display = "none";
                    // console.log("none");
                }
            });
        }
    }
    return "done";
}


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


