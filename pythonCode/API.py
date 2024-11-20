from flask import app, Flask, jsonify, request
from flask_cors import CORS
import flask_cors

app = Flask(__name__)

flask_cors.CORS(app)

Users = {}
messages = {}


@app.route("/", methods=["GET"])
def hello():
    return jsonify("Hello there! This is an API made in flask")

@app.route("/signup", methods=["POST"])
def signup():
    global Users
    """sign up to new person: {'username': 'JAMES', 'password' : '1234APcb'}"""
    newUser = request.json
    username = newUser["username"]
    password = newUser["password"]
    if username in Users:
        return jsonify("the user already exists!")
    Users[username] = password
    messages[newUser["username"]] = []
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
    global Users, messages
    """Get all messages ever sent to you {'login' : {your login}"""
    data = request.json
    login = data["login"]
    error = checkForErrors(Users, login)
    if error:
        return jsonify(error)
    messagesToSend = messages[login["username"]]
    return jsonify({"messages" : messagesToSend})




@app.route("/send", methods=["POST"])
def sendMessage():
    global Users, messages
    """Send message to the api. Format: {'message' : 'hi, just a test', 'login' : {your login}, 'namePerson' : 'carlos'}"""

    data = request.json
    login = data["login"]
    message = data["message"]
    error = checkForErrors(Users, login)
    print(data["namePerson"] in messages)
    if error:
        return jsonify(error)
    
    
    messages[data["namePerson"]].insert(0, message)
    
    return jsonify("message sent successfully!")


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