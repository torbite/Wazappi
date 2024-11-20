class User():
    def __init__(self, id, username, loginPassword):
        self.id = id
        self.username = username
        self.password = loginPassword

def checkLoginPassword(Users, login):
    username = login["username"]
    password = login["password"]
    if username not in Users.keys():
        raise KeyError("username is not already logged in")
    return password == Users[username]

def checkForLogin(Users, login):
    username = login["username"]
    return username in Users.keys()
        

def signup(Users, signup):
    username = signup["username"]
    password = signup["password"]

    if username in Users:
        raise KeyError("Username already exists")
    
    Users[username] = password
    return Users
    
def checkup(Users, login):
    islogedin = checkForLogin(Users, login)
    if not islogedin:
        return "you are not signed up, please do so in /signup"

    isPasswordRight = checkLoginPassword(Users, login)
    if not isPasswordRight:
        return "The password is wrong you hacker!"
