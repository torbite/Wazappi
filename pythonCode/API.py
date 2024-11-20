from flask import app, Flask, jsonify, request
from flask_cors import CORS
import flask_cors

app = Flask(__name__)

flask_cors.CORS(app)

Users = {}
messages = {}
lastItem = 1
keys = {}

@app.route("/", methods=["GET"])
def hello():
    return jsonify("Hello there! This is an API made in flask")

@app.route("/signup", methods=["POST"])
def signup():
    global Users, keys, lastItem
    """sign up to new person: {'username': 'JAMES', 'password' : '1234APcb'}"""
    newUser = request.json
    username = newUser["username"]
    password = newUser["password"]
    if username in Users:
        return jsonify("the user already exists!")
    Users[username] = password
    keys[username] = lastItem
    lastItem = lastItem * 2
    # messages[newUser["username"]] = []
    return jsonify("ok")


@app.route("/login", methods=["POST"])
def login():
    global Users
    """log in to new person: {'username': 'JAMES', 'password' : '1234APcb'}"""
    newUser = request.json
    username = newUser["username"]
    password = newUser["password"]
    if username in Users:
        return jsonify("ok")
    return jsonify("login not found")



@app.route("/get", methods=["POST"])
def getMessages():
    global Users, messages, keys
    """Get all messages ever sent to you {'login' : {your login}, 'userToReceiveChat' : 'user'}"""
    
    data = request.json
    login = data["login"]
    error = checkForErrors(Users, login)
    if error:
        return jsonify(error)
    username = login['username']
    userToReceiveChat = data["userToReceiveChat"]
    if userToReceiveChat not in Users.keys():
        return jsonify("There is no pesrson with that name")
    key1 = keys[username]
    key2 = keys[userToReceiveChat]
    key = key1 + key2
    if key not in messages.keys():
        messages[key] = []
    send = messages[key]
    

    return jsonify({"messages" : send})




@app.route("/send", methods=["POST"])
def sendMessage():
    global Users, messages, keys
    """Send message to the api. Format: {'message' : 'hi, just a test', 'login' : {your login}, 'namePerson' : 'carlos'}"""

    data = request.json
    login = data["login"]
    message = data["message"]
    error = checkForErrors(Users, login)

    userSend = data["namePerson"]
    username = login["username"]

    print(userSend in messages)
    if error:
        return jsonify(error)
    
    send = {"username" : username, "message" : message}
    key1 = keys[username]
    key2 = keys[userSend]
    key = key1 + key2
    if key not in messages.keys():
        messages[key] = []
    messages[key].insert(0, send)
    
    return jsonify("message sent successfully!")


@app.route('/getAllUsers', methods=["GET"])
def getAllUsers():
    global Users, keys, messages
    usernames = list(Users.keys())
    return jsonify({'usernames' : usernames })


def checkForErrors(Users, login):
    username = login["username"]
    password = login["password"]
    islogedin = username in Users.keys()
    if not islogedin:
        return "you are not signed up, please do so in /signup"

    if username not in Users.keys():
        return "user is not signed in!"
    isPasswordRight = password == Users[username]
    if not isPasswordRight:
        return "The password is wrong you hacker!"



if __name__ == "__main__":
    app.run(debug=True)
# @app.route("")