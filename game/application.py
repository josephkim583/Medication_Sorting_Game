from flask import Flask, render_template, request, jsonify,json, session
from flask_session import Session
import time

app = Flask(__name__)
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/message", methods=["GET", "POST"])
def message():
    if request.method == "POST":
        print(request.get_json()["message"])
        message = request.get_json()["message"]
        if "add_to_grid" in message:
            print("here")
            session["action"] = {"name":"pointAt", "args":"monday morning"}
            print(session.get("action"))
            # session.get("action").append({"name":"pointAt", "args":"monday morning"})
            # action.append({"name":"pointAt", "args":"monday morning"})
        
        return "OK", 200
    else:
        print("GET")
        print(session.get("action"))
        return jsonify(session.get('action'))
@app.route("/action") # session?
def action():
    # action = [{"name":"pointAt", "args":["aspirin", "monday morning"]}]
    # print(action)
    print("fetch action")
    print(session.get("action"))
    return jsonify(session.get("action"))
    # return jsonify(action)

@app.route("/")
def index():
    if "action" not in session:
        session["action"] = {}
    events = [{"name": "exercise", "day": "mon", "time":"1"}, {"name":"appointment", "day":"thu", "time":"2"},
                {"name":"work", "day":"sat","time":"3"}]
    medications = [{"name":"ibuprofen", "color":"red", "number":"11"}, {"name":"aspirin", "color":"blue", "number":"15"},
    {"name":"albuterol", "color":"green", "number":"7"}]
    return render_template("index.html", events=events, medications=medications)

if __name__ == "__main__":
    app.run(debug=True)