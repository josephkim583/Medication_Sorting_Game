from flask import Flask, render_template, request, jsonify,json, session
# from flask_session import Session
import time

app = Flask(__name__)
# app.config["SESSION_TYPE"] = "filesystem"
# Session(app)

@app.route("/message", methods=["GET", "POST"])
def message():
    if request.method == "POST":
        message = request.get_json()["message"]
        print(message)
        
        return "OK", 200
@app.route("/action") # session?
def action():
    time = ["morning", "noon", "afternoon", "evening"]
    print(time[0])
    for t in time:
        print(t)
        action = [{"name":"pointAt", "args":"monday {}".format(t)}]

        return jsonify(action)

@app.route("/")
def index():
    events = [{"name": "exercise", "day": "mon", "time":"1"}, {"name":"appointment", "day":"thu", "time":"2"},
                {"name":"work", "day":"sat","time":"3"}]
    medications = [{"name":"ibuprofen", "color":"red", "number":"11"}, {"name":"aspirin", "color":"blue", "number":"15"},
    {"name":"albuterol", "color":"green", "number":"7"}]
    return render_template("index.html", events=events, medications=medications)

if __name__ == "__main__":
    app.run(debug=True)