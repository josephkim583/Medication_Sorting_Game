var my_hand = {"count": 0, "color": "none", "name":"none"};
var color_mapping = {};
var calendar_count = {"mon1": 0, "mon2": 0, "mon3": 0, "mon4": 0, "tue1": 0, "tue2": 0, "tue3": 0, "tue4": 0,
"wed1": 0, "wed2": 0, "wed3": 0, "wed4": 0, "thu1": 0, "thu2": 0, "thu3": 0, "thu4": 0, 
"fri1": 0, "fri2": 0, "fri3": 0, "fri4": 0, "sat1": 0, "sat2": 0, "sat3": 0, "sat4": 0, 
"sun1": 0, "sun2": 0, "sun3": 0, "sun4": 0};
const time_mapping = {"1":"morning", "2":"noon", "3":"afternoon", "4":"evening"};
const day_mapping = {"mon":"Monday", "tue":"Tuesday", "wed":"Wednesday", "thu":"Thursday", "fri":"Friday",
"sat":"Saturday", "sun":"Sunday"};

function populate_events(event) {
    var div = document.getElementById(event.day + event.time);
    while (div.lastChild) {
        div.removeChild(div.lastChild);
    }
    var span = document.createElement("span");
    span.innerHTML = event.name;
    div.appendChild(span);
}

function make_container(name, color, number) {
    color_mapping[color] = {"name":name, "number":number};
    console.log(color_mapping);

    var container = document.createElement("div");
    container.id = color + "_container";
    container.classList.add("container");
    container.setAttribute("onclick", "container_click(this.id);");
    container.style.border = "2px solid " + color;
    document.getElementById("med-area").appendChild(container);

    var span = document.createElement("span");
    container.appendChild(span);
    span.innerHTML = name;
    
    var info = document.createElement("i");
    info.id = color + "_instruction";
    info.style.color = color;
    info.classList.add("fa");
    info.classList.add("fa-info-circle");
    info.setAttribute("onclick", "instruction(this.id);");
    container.appendChild(info);

    for (var i = 0; i < number; i++) {
        var med = document.createElement("div");
        med.id = "" + color + (i+1);
        med.classList.add("med");
        med.setAttribute("onclick", "med_click(this.id); event.stopPropagation();");
        med.style.backgroundColor = color;
        container.appendChild(med);
    }
}

function send_action(action) {
    $.ajax({
        type: "POST",
        url: "/message",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify({"message": action}),
        dataType: "json"
    });
}

function calendar_click(pos_id) {
        var hand_val = my_hand["count"];
        var hand_color = my_hand["color"];

        if (hand_val == 1) {
            // var id = clicked_id + calendar_count[clicked_id ]
            calendar_count[pos_id] += 1;

            var med = document.getElementById("med").firstChild;
            document.getElementById(pos_id).appendChild(med);
            // $("#pill:first-child").appendTo($("#"+clicked_id));
            // $("#"+clicked_id).append($("#pill:first-child"));

            my_hand["count"] = 0;
            // my_hand["type"] = "none";
            send_action("(add_to_grid " + color_mapping[hand_color]["name"] + " " + day_mapping[pos_id.substring(0,3)] + " " + time_mapping[pos_id.slice(-1)]) + ")";
        }
        else {
            send_action("(add_to_grid " + color_mapping[hand_color]["name"] + " " + day_mapping[pos_id.substring(0,3)] + " " + time_mapping[pos_id.slice(-1)]) + ")";
            send_action("empty hand");
        }
        
    }

function instruction(instruction_id){
    var color = instruction_id.split("_")[0];
    send_action("(request-instructions " + color_mapping[color]["name"] + ")");
}

function med_click(med_id) {
    var hand_val = my_hand["count"];
    var color = med_id.match(/[A-Za-z]+/g);
    var med = $("#"+med_id);
    console.log(med_id);

    if (hand_val == 1) {
        if (med.parent().parent().attr("id") == "med-area") {
            send_action("(remove_from_container " + color_mapping[color]["name"] + " )");
        } else if (med.parent().parent().attr("id") == "grid-container") {
            var calId = med.parent().attr("id");
            send_action("(remove_from_grid " + color_mapping[color]["name"] + " " + day_mapping[calId.substring(0,3)] + " " + time_mapping[calId.slice(-1)]) + ")";
        }
        send_action("hand is full");
    }
    else {
        if (med.parent().parent().attr("id") == "med-area") {
            color_mapping[color]["number"] -= 1;
            console.log(color_mapping[color]["number"]);
            send_action("(remove_from_container " + color_mapping[color]["name"] + ")");
        }
        else if (med.parent().parent().attr("id") == "grid-container") {
            var calId = med.parent().attr("id");
            calendar_count[calId] -= 1;
            send_action("(remove_from_grid " + color_mapping[color]["name"] + " " + day_mapping[calId.substring(0,3)] + " " + time_mapping[calId.slice(-1)]) + ")";
        }
        med.appendTo("#med");
        my_hand["count"] = 1;
        my_hand["color"] = color;
    }
}

function container_click(container_id) {
    var hand_val = my_hand["count"];
    var containerColor = container_id.split("_")[0];
    if (medicine_count[containerColor] == 0) {
        send_action("(remove_from_container " + color_mapping[containerColor]["name"] + ")");
        send_action(color_mapping[containerColor]["name"] + " container empty");
    } else if (hand_val == 1) {
        var med = document.getElementById("med").firstChild;
        var medColor = med.id.match(/[A-Za-z]+/g);
        if (medColor == containerColor) {
            document.getElementById(containerColor + "_container").appendChild(med);
            my_hand["count"] = 0;
            color_mapping[containerColor]["number"] += 1;
        }
    }
}

// function doAction(action) {
//     if (action["name"] == "sayText") {
//         action["args"].forEach(function(arg) {
//             alert(arg);
//         })
//     }
// }

fetch("/action")
    .then(function(response) {
        return response.json();
    })
    // do something with json
    .then(function(actionList) {
        console.log(actionList);
        // actionList.forEach(doAction);
    });

// var json = {"day" : { "Sun": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Mon": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Tues": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Wed": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Thurs": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Fri": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Sat": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } } }
// console.log(json["day"]["Sun"]["1"]["red"]);