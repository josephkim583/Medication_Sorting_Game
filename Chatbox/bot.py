class botmessage(object):
    def __init__(self, sessId):
        self.sessID = sessId
        self.botOutput = sessId

    def botmes(self, userInput):
        if userInput == "Hello":
            #mess = botmessage(sessionID)
            botOutput = "Hi " + self.sessID
            return botOutput
        else:
            #messtwo = botmessage(sessionID)
            botOutput = "Bye " + self.sessID
            return botOutput