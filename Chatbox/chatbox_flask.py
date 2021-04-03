import uuid
from flask import Flask, render_template, jsonify, request, session, redirect, url_for
# from bot import botmes
from Chatbox.sessionManager import sessionManage, newSession, newSessionTwo

# from Chatbox.sessionManager import sessionManage, newSession

import os

app = Flask(__name__)
app.secret_key = os.urandom(24)


@app.route('/', methods=['GET'])
def chatbox():
    session.pop('user', None)
    session['user'] = uuid.uuid4()

    # create session, initialize and start the game
    return render_template('index.html')

#Session Manager
@app.route('/processOne', methods=['GET', 'POST'])
def processOne():
# Session Manager
# @app.route('/process', methods=['GET', 'POST'])
# def process():
    userm = request.form['botm']
    botm = sessionManage(userm, session['user'])
    state = botm['state']
    hint = botm['hint']

    return jsonify(botm)

@app.route('/processTwo', methods=['GET', 'POST'])
def processTwo():
    print ("process two being called")
    message = newSessionTwo(session['user'])
    output = {'start': message}
    print (message)
    return jsonify(output)


# initializes the game at the beginning
@app.route('/startgame', methods=['GET', 'POST'])
def startgame():
    message = newSession(session['user'])
    output = {'start': message}
    return jsonify(output)


if __name__ == "__main__":
    app.run(debug=True)
