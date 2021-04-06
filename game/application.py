from flask import Flask, render_template, request, jsonify,json, session, url_for, redirect
from flask_session import Session
import time

app = Flask(__name__)
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/message", methods=["GET", "POST"])
def message():
    # session["action"] = []
    # session.modified = True

    if request.method == "POST":
        session["message"] = request.get_json()["message"]
        session.modified = True
        print(session.get("message"))
        if "add_to_grid" in session.get("message"):
            session["actionList"] = [{"name":"pointAt", "args":"monday morning"}]
            session.modified = True
            print("do action")
        else:
            session["actionList"] = []
        print(type(session.get("actionList")))
        print(jsonify(session.get("actionList")))

        # return redirect(url_for("index", events=session.get("events"), medications=session.get("medications")))   #redirect to index with parameter action
        return jsonify(session.get("actionList"))
    
# @app.route("/action") # session?
# def action():
    # time = ["morning", "noon", "afternoon", "evening"]
    # print(time[0])
    # for t in time:
    #     print(t)
    #     action = [{"name":"pointAt", "args":"monday {}".format(t)}]

    # action = [{"name":"pointAt", "args":"monday morning"}]

    # return jsonify(action)

@app.route("/")
def index():
    # if "actionList" not in session:
    #     session["actionList"] = "[]"

    if "message" not in session:
        session["message"] = ''

    if "events" not in session:
        session["events"] = [{"name": "exercise", "day": "mon", "time":"1"}, {"name":"appointment", "day":"thu", "time":"2"},
                {"name":"work", "day":"sat","time":"3"}]

    if "medications" not in session:
        session["medications"] = [{"name":"ibuprofen", "color":"red", "number":"11"}, {"name":"aspirin", "color":"blue", "number":"15"},
    {"name":"albuterol", "color":"green", "number":"7"}]

    # print(type(session.get("actionList")))
    return render_template("index.html", events=session.get("events"), medications=session.get("medications"))

if __name__ == "__main__":
    app.run(debug=True)