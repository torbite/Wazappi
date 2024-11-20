import flask, flask_cors

app = flask.Flask(__name__)

flask_cors.CORS(app)

@app.route("/", methods=["GET"])
def hello():
    return flask.jsonify("Hello there! This is an API made in flask")

if __name__ == "__main__":
    app.run(debug=True)
# @app.route("")