import sys, os
cur = os.path.dirname(os.path.realpath(__file__)) + "/"
sys.path.insert(0, cur + "../")

from Chatbox.bot import botmessage
import planners.pyhop.pyhop
import game.game
from model.maze import operators
from model.maze import methods
import csv

sessionDictionary = {}

def newSession(sessionID):
    ph = planners.pyhop.pyhop.Pyhop('hoppity')
    #if (trial == 0):
    session = game.game.GenericPyhopGame('model/lightbulb/game.config', ph)
    sessionDictionary[sessionID] = session
    output = session.start_game(sessionID)


    return output

def newSessionTwo(sessionID):
    ph = planners.pyhop.pyhop.Pyhop('hoppity')
    session = game.game.GenericPyhopGame('model/maze/game.config', ph)
    sessionDictionary[sessionID] = session
    output = session.start_game(sessionID)

    return output

def sessionManage(userInput, sessionID):
    if sessionID in sessionDictionary:
        session = sessionDictionary[sessionID]
        output = session.handle_user_input(userInput)
    else:
        output = "No game initialized"
    return output
