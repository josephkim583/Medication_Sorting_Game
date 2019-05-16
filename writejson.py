import json

def writetoJSON():
    data = {}
    days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
    colors = ['r', 'b']

    filepath = './days.json'

    with open('days.txt', 'w') as outfile:
        for day in days:
            for color in colors:
                for i in range(1 , 5):
                    data[day + str(i) + color] = 0
        json.dump(data, outfile)
writetoJSON()
