from flask import Flask, render_template, request, jsonify,json

app = Flask(__name__)

# @app.route('/hello', methods=['GET', 'POST'])
# def hello():

#     # POST request
#     if request.method == 'POST':
#         print('Incoming..')
#         print(request.get_json())  # parse as JSON
#         return 'OK', 200

#     # GET request
#     else:
#         message = {'greeting':'Hello from Flask!'}
#         return jsonify(message)  # serialize and use JSON headers

@app.route("/message", methods=["GET", "POST"])
def message():
    if request.method == "POST":
        print(request.get_json()["message"])
        return "OK", 200

@app.route("/action")
def action():
    action = [{"name":"sayText", "args":["hello", "world"]}, {"name":"pointAt", "args":["wednesday morning", "red medicine"]}]
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