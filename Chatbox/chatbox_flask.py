import uuid
from flask import Flask, render_template, jsonify, request, session, redirect, url_for
# from bot import botmes
# from sessionManager import sessionManage, newSession, newSessionTwo

# from Chatbox.sessionManager import sessionManage, newSession

import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route("/message", methods=["GET", "POST"])
def message():
    if request.method == "POST":
        print(request.form["botm"])
        message = request.form["botm"]
        if "add_to_grid" in message:
            # session["actionList"] = [{"name":"pointAt", "args":"monday morning"}]
            actionList = [{"name":"pointAt","args":"monday morning"}, {"name":"sayText", "args":"put pill in monday morning"}]
            hint = "put pill in monday morning"
            print("do action")
        else:
            # session["actionList"] = []
            actionList = []
            hint = ""
        # session.modified = True
        # print(type(session.get("actionList")))
        # print(jsonify(session.get("actionList")))

        output = {"start": message, "actionList": actionList, "hint": hint}
        return jsonify(output)


@app.route('/', methods=['GET'])
def chatbox():
    # session.pop('user', None)
    # session['user'] = uuid.uuid4()

    events = [{"name": "exercise", "day": "mon", "time":"1"}, {"name":"appointment", "day":"thu", "time":"2"},
                {"name":"work", "day":"sat","time":"3"}]
    medications = [{"name":"ibuprofen", "color":"red", "number":"11"}, {"name":"aspirin", "color":"blue", "number":"15"},
    {"name":"albuterol", "color":"green", "number":"7"}]

    # create session, initialize and start the game
    return render_template('index.html', events=events, medications=medications)

#Session Manager
# @app.route('/processOne', methods=['GET', 'POST'])
# def processOne():
# # Session Manager
# # @app.route('/process', methods=['GET', 'POST'])
# # def process():
#     userm = request.form['botm']
#     botm = sessionManage(userm, session['user'])
#     state = botm['state']
#     hint = botm['hint']

#     return jsonify(botm)

# @app.route('/processTwo', methods=['GET', 'POST'])
# def processTwo():
#     print ("process two being called")
#     message = newSessionTwo(session['user'])
#     output = {'start': message}
#     print (message)
#     return jsonify(output)


# initializes the game at the beginning
@app.route('/startgame', methods=['GET', 'POST'])
def startgame():
    # message = newSession(session['user'])
    message = "new game"
    output = {'start': message}
    return jsonify(output)


if __name__ == "__main__":
    app.run(debug=True)
