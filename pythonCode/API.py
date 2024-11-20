from flask import app, Flask, jsonify, request
from flask_cors import CORS
import flask_cors, manager

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
    try:
        Users = manager.signup(Users,newUser)
        messages[newUser["username"]] = []
        return jsonify("ok")
    except KeyError as e:
        return e



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
    #print(data)
    login = data["login"]
    #print(login)
    message = data["message"]
    #print(message)
    #print(messages)
    error = checkForErrors(Users, login)
    print(data["namePerson"] in messages)
    if error:
        return jsonify(error)
    
    
    messages[data["namePerson"]].insert(0, message)
    
    return jsonify("message sent successfully!")


def checkForErrors(Users, login):
    islogedin = manager.checkForLogin(Users, login)
    if not islogedin:
        return "you are not signed up, please do so in /signup"

    isPasswordRight = manager.checkLoginPassword(Users, login)
    if not isPasswordRight:
        return "The password is wrong you hacker!"



if __name__ == "__main__":
    app.run(debug=True)
# @app.route("")