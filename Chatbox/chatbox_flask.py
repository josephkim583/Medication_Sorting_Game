import uuid
from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from flask_session import Session

import os

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# separate route to deal with tutorial
@app.route("/tutorial", methods=["GET", "POST"])
def tutorial():
    # tutorial action followed by a hint message
    actionList = [{"name":"pointAt", "args":"aspirin"}, {"name":"pointAt", "args":"monday noon"}]
    hintList = ["first click on an aspirin pill to grab", "now click on the highlighted position on a calendar to drop the pill"]

    if request.method == "POST":
        pos = int(request.form["position"])     # get current step in list of tutorial actions
        response = request.form["response"]
        proceed = False

        # only proceeds if user remove from container or add to grid
        # TODO: make it more dynamic
        if "remove_from_container aspirin" in response or "add_to_grid" in response:
            proceed = True

        # check if the current action is the last or not
        if pos < len(actionList):
            output = {"action": actionList[pos], "hint": hintList[pos], "proceed": proceed}
        else:
            output = None
        return jsonify(output)

# route for communicating back and forth between UI and server
@app.route("/message", methods=["GET", "POST"])
def message():
    if request.method == "POST":
        print(request.form["botm"])
        message = request.form["botm"]

        # data to send to UI (may be combined into 1 variable)
        action = {}
        hint = ""
        start = ""
        state = "speaking"
        time_mapping = ["none", "morning", "noon", "afternoon", "evening"]
        day_mapping = {"mon":"Monday", "tue":"Tuesday", "wed":"Wednesday", "thu":"Thursday", "fri":"Friday",
"sat":"Saturday", "sun":"Sunday"}

        # functions to check for invalid user action (may be moved to a separate route)
        # check if number of 1 type medication is too large for a time in a day
        def numCheck():
            print(session.get("calendar_count"))
            for position, medCount in session.get("calendar_count").items():
                for med, count in medCount.items():
                    if count > 2:
                        return (med, position, count)
            return None
        
        # check if ibuprofen and aspirin are in the same position (used together)
        def interactionCheck():
            for position, medCount in session.get("calendar_count").items():
                if "ibuprofen" in medCount and "aspirin" in medCount and medCount["ibuprofen"] > 0  and medCount["aspirin"] > 0:
                    return position
            return None
        
        # manually respond to user action/message
        if "hello" in message:
            start = "hello"
        elif "bye" in message or "goodbye" in message:
            state = "sleeping"
            start = "see ya later!"
        elif "thank you" in message:
            start = "you are welcome!"
        elif "no" in message and session.get("toUser")[-1]["state"] == "questioning":   # may include problem/question type?
            state = "speaking"
            hint = "here is an image to help"
            action = {"name":"showImage", "args":"static/pill_interaction.png"}
        elif "what" in message and session.get("toUser")[-1]["state"] == "questioning":
            state = "questioning"
            hint = "Do you remember the interaction for the blue pill?"
        elif "add_to_grid" in message:
            messageList = message[1:-1].split(" ")
            med = messageList[1]
            position = messageList[2][:3].lower() + str(time_mapping.index(messageList[-1]))

            # increase number of pill in calendar position
            if position not in session.get("calendar_count"):
                session.get("calendar_count")[position] = {med: 1}
            else:
                if med in session.get("calendar_count")[position]:
                    session.get("calendar_count")[position][med] += 1
                else:
                    session.get("calendar_count")[position][med] = 1

            # check if ibuprofen is used in the morning
            if med == "ibuprofen" and messageList[-1] == "morning":
                hint = "ibuprofen should not be used in the morning"
                action = {"name":"pointAt", "args": messageList[2] + " " + messageList[-1]}
            else:
                # check if there are no position with more than 2 pills of any type
                overdose = numCheck()
                if overdose != None:
                    day = day_mapping[overdose[1][:3]]
                    time = time_mapping[int(overdose[1][-1])]
                    hint = "too many " + overdose[0] + " on " + day + " " + time
                    action = {"name":"pointAt", "args":day + " " + time}
                # check for interaction conflict is there is any
                else:
                    incompatible = interactionCheck()
                    print(incompatible)
                    if incompatible != None:
                        day = day_mapping[incompatible[:3]]
                        time = time_mapping[int(incompatible[-1])]
                        state = "questioning"
                        hint = "huhhhhhh????"
                
        elif "remove_from_grid" in message:
            messageList = message[1:-1].split(" ")
            med = messageList[1]
            position = messageList[2][:3].lower() + str(time_mapping.index(messageList[-1]))
            # decrease number of pills of a type in a calendar positon 
            session.get("calendar_count")[position][med] -= 1
            if (session.get("calendar_count")[position][med] < 0):
                session.get("calendar_count")[position][med] = 0

        output = {"start": start, "action": action, "hint": hint, "state":state, "userInput":message}
        # keep track of past conversation between user and agent
        session.get("fromUser").append(message)
        session.get("toUser").append(output)
        return jsonify(output)

#################### PREVIOUS PROJECT CODE #######################
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
#############################################################

# initializes the game at the beginning
@app.route('/startgame', methods=['GET', 'POST'])
def startgame():
    # message = newSession(session['user'])
    session["calendar_count"] = {}
    session["fromUser"] = []
    session["toUser"] = []

    # configurations for med sorting game
    if "events" not in session:
        session["events"] = [{"name": "exercise", "day": "mon", "time":"1"}, {"name":"appointment", "day":"thu", "time":"2"},
                {"name":"work", "day":"sat","time":"3"}]
    
    if "medications" not in session:
        session["medications"] = [{"name":"ibuprofen", "color":"red", "number":"11"}, {"name":"aspirin", "color":"blue", "number":"15"},
    {"name":"albuterol", "color":"green", "number":"7"}]
    
    output = {"events": session.get("events"), "medications": session.get("medications"), "hint":"Game started! Do you want to see the tutorial?"}
    return jsonify(output)

@app.route('/', methods=['GET'])
def chatbox():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
