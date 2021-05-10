# Medication_Sorting_Game
Web UI and backend for medication sorting game

## Layout
- Top half
  + Left: avatar space, a space for the avatar of the virtual agent to express different states or actions
  + Right: chatbox, where messages between user and agent appear
- Bottom half: interactive space for any tasks or game (currently medication sorting game but could be replaced with any javascript-generated web application)

## List of agent's state displayed in avatar space (could improve noticeability in the future)
- Sleeping: head tilted, eyes closed, continuously breathing
- Speaking: eyes open, high bounce twice
- Thinking: continuously low bouncing, eyes open
- Listening: eyes open, continuously breathing
- Questioning: eyes open, question marks on top of head, high bounce twice

## List of current agent's actions in the UI
- Talk to the user throught the chat box
- Give user a short step-by-step tutorial (currently hardcoded)
- Ask user questions (currently hardcoded)
- Point at an object inside UI (could improve noticeability in the future)
- Show user an image as a popup
- Warn the user if there is any problems through a combination of actions and messages (currently the problem-checking is hardcoded, includes checking for interaction conflict, overdosage, and incorrect time of dosage)

### To run the UI
Go to Chatbox folder and run this command in command line ``` python3 chatbox_flask.py ```
