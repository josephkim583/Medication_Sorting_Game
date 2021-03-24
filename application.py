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

@app.route("/")
def index():
    events = [{"name": "exercise", "day": "Mon", "time":"M"}, {"name":"appointment", "day":"Thu", "time":"N"},
                {"name":"work", "day":"Sat","time":"A"}]
    return render_template("index.html", events=events)

if __name__ == "__main__":
    app.run(debug=True)