var my_hand = {"count": 0, "type": "none"};
var medicine_count = {"red": 11, "blue": 11};
var calendar_count = {"Mon-M": 0, "Mon-N": 0, "Mon-A": 0, "Mon-E": 0, "Tue-M": 0, "Tue-N": 0, "Tue-A": 0, "Tue-E": 0,
"Wed-M": 0, "Wed-N": 0, "Wed-A": 0, "Wed-E": 0, "Thu-M": 0, "Thu-N": 0, "Thu-A": 0, "Thu-E": 0, 
"Fri-M": 0, "Fri-N": 0, "Fri-A": 0, "Fri-E": 0, "Sat-M": 0, "Sat-N": 0, "Sat-A": 0, "Sat-E": 0, 
"Sun-M": 0, "Sun-N": 0, "Sun-A": 0, "Sun-E": 0};
const time_mapping = {"M":"morning", "N":"noon", "A":"afternoon", "E":"evening"};

function populate_events(event) {
    var div = document.getElementById(event.day + "-" + event.time);
    while (div.lastChild) {
        div.removeChild(div.lastChild);
    }
    var span = document.createElement("span");
    span.innerHTML = event.name;
    div.appendChild(span);
}

// function create_pill(color) {
//     var pill = document.createElement("div");
//     pill.setAttribute("onClick", "pill_click()");
//     if (color == "r") {
//         pill.classList.add("red_pill");
//     } else {
//         pill.classList.add("blue_pill");
//     }
//     return pill;
// }

function send_action(action) {
    $.ajax({
        type: "POST",
        url: "/message",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify({"message": action}),
        dataType: "json"
    });
}

function calendar_click(clicked_id) {
        var hand_val = my_hand["count"];
        var hand_type = my_hand["type"];

        if (hand_val == 1) {
            // var id = clicked_id + calendar_count[clicked_id ]
            calendar_count[clicked_id ] += 1;

            var pill = document.getElementById("pill").firstChild;
            document.getElementById(clicked_id).appendChild(pill);
            // $("#pill:first-child").appendTo($("#"+clicked_id));
            // $("#"+clicked_id).append($("#pill:first-child"));

            my_hand["count"] = 0;
            // my_hand["type"] = "none";
            send_action("add pill " + hand_type + " " + clicked_id.substring(0,3) + " " + time_mapping[clicked_id.slice(-1)]);    // Change clicked id ??? seperate day and time
        }
        else {
            send_action("empty hand");
        }
        
    }

function red_instruction(){
    send_action("red-instruction");
}

function blue_instruction(){
    send_action("blue-instruction");
}

function pill_click(clicked_id) {
    var hand_val = my_hand["count"];
    var color = clicked_id.match(/[A-Za-z]+/g);
    var pill = $("#"+clicked_id);
    console.log(pill);

    if (hand_val == 1) {
        send_action("hand is full");
    }
    else {
        if (pill.parent().parent().attr("id") == "pill-area") {
            medicine_count[color] -= 1;
            send_action("grab " + color + " pill from bottle");
        }
        else if (pill.parent().parent().attr("id") == "grid-container") {
            var calId = pill.parent().attr("id");
            calendar_count[calId] -= 1;
            send_action("remove " + color + " pill from calendar");
        }
        pill.appendTo("#pill");
        my_hand["count"] = 1;
        my_hand["type"] = color;
    }
}

function blue_medicine_click() {
    var hand_val = my_hand["count"];
    if (medicine_count["blue"] == 0) {
        send_action("out of blue pill");
    }
    else if (hand_val == 1) {
    
        var pill = document.getElementById("pill").firstChild;
        var color = pill.id.match(/[A-Za-z]+/g);
        if (color == "blue") {
            document.getElementById("blue_bottle").appendChild(pill);
            my_hand["count"] = 0;
            send_action("return blue pill to bottle");
        }
        else {
            send_action("return blue pill to wrong bottle");
        }
    }
    else {
        send_action("no pill to return");
    }
}


function red_medicine_click(){
    var hand_val = my_hand["count"];
    if (medicine_count["red"] == 0) {
        send_action("out of red pill");
    }
    else if (hand_val == 1) {
    
        var pill = document.getElementById("pill").firstChild;
        var color = pill.id.match(/[A-Za-z]+/g);
        if (color == "red") {
            document.getElementById("red_bottle").appendChild(pill);
            my_hand["count"] = 0;
            send_action("return pill to bottle");
        }
        else {
            send_action("return to wrong bottle");
        }
    }
    else {
        send_action("no pill to return");
    }
    
}

var json = {"day" : { "Sun": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Mon": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Tues": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Wed": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Thurs": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Fri": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Sat": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } } }
// console.log(json["day"]["Sun"]["1"]["red"]);