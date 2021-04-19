var my_hand = {"count": 0, "color": "none", "name":"none"};
var color_mapping = {};
var medication_mapping = {};
var calendar_count = {"mon1": 0, "mon2": 0, "mon3": 0, "mon4": 0, "tue1": 0, "tue2": 0, "tue3": 0, "tue4": 0,
"wed1": 0, "wed2": 0, "wed3": 0, "wed4": 0, "thu1": 0, "thu2": 0, "thu3": 0, "thu4": 0, 
"fri1": 0, "fri2": 0, "fri3": 0, "fri4": 0, "sat1": 0, "sat2": 0, "sat3": 0, "sat4": 0, 
"sun1": 0, "sun2": 0, "sun3": 0, "sun4": 0};
const time_mapping = ["none", "morning", "noon", "afternoon", "evening"];
const day_mapping = {"mon":"Monday", "tue":"Tuesday", "wed":"Wednesday", "thu":"Thursday", "fri":"Friday",
"sat":"Saturday", "sun":"Sunday"};

var tutorialPhase = false;
var tutorialStep = 0;

function tutorial() {
    tutorialPhase = true;
    $.post("/tutorial", {"position": tutorialStep, "response": ""}, function(data) {
        if (data) {
            message(data);
            updateScroll();
            // tutorial(position+1);
        } else {
            message({"hint":"Congratulations! You have finished the tutorial"})
            tutorialPhase = false;
        }
    })
}

// function make_calendar() {
//     var title = document.createElement("h1");
//     title.textContent = "Medication Sorting";
//     title.style = "text-align: center";

//     $("#interactionSpace")
// }

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
    medication_mapping[name] = color;
    color_mapping[color] = {"name":name, "number":number};
    // console.log(color_mapping);

    var container = document.createElement("div");
    container.id = color + "_container";
    container.classList.add("med-container");
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

function receive_action() {
    fetch("/message")
    .then(response => response.json())
    .then(actionList => actionList.forEach(doAction))
}

function send_action(action) {
    // fetch("/message", {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },

    //     body: {"botm": '(' + action + ')'}
    // })
    // .then(function(response) {
    //     message(action);
    //     updateScroll();
    //     return response.json();
    // })
    // .then(actionList => actionList.forEach(doAction))
    if (tutorialPhase) {
        $.post("/tutorial", {
            "position": tutorialStep,
            "response": '(' + action + ')'
        }, function(data) {
            // data["actionList"].forEach(doAction);
            // processActionList(data["actionList"]);
            if (data) {
                if (data["proceed"]) {
                    tutorialStep += 1;
                    tutorial();
                }
            }
            updateScroll();
        })
    } else {
        $.post("/message", {
            "botm": '(' + action + ')'
        }, function(data) {
            // data["actionList"].forEach(doAction);
            // processActionList(data["actionList"]);
            doAction(data["action"]);
            message(data);
            updateScroll();
            
        })
    }
    

    // $.ajax({
    //     url: $SCRIPT_ROOT + "/message",
    //         type: "POST",
    //         data: JSON.stringify({"botm": action}),
    //         contentType:"application/json; charset=utf-8",
    //         dataType:"json",
    //         success: function (data) {
    //             message(data);
    //             updateScroll();
    //             receive_action();
    //         }
    // })
}

function calendar_click(pos_id) {
    var hand_val = my_hand.count;
    var hand_color = my_hand.color;

    if (hand_val == 1) {
        // var id = clicked_id + calendar_count[clicked_id ]
        calendar_count[pos_id] += 1;

        var med = document.getElementById("med").firstChild;
        document.getElementById(pos_id).appendChild(med);
        // $("#pill:first-child").appendTo($("#"+clicked_id));
        // $("#"+clicked_id).append($("#pill:first-child"));

        my_hand.count = 0;
        // my_hand["type"] = "none";
        send_action('add_to_grid ' + color_mapping[hand_color].name + ' ' + day_mapping[pos_id.substring(0,3)] + ' ' + time_mapping[pos_id.slice(-1)]);
    }
    else {
        send_action("add_to_grid " + color_mapping[hand_color].name + " " + day_mapping[pos_id.substring(0,3)] + " " + time_mapping[pos_id.slice(-1)]);
        send_action("empty hand");
    }
    
}

function instruction(instruction_id){
    var color = instruction_id.split("_")[0];
    send_action("request-instructions " + color_mapping[color].name);
}

function med_click(med_id) {
    var hand_val = my_hand.count;
    var color = med_id.match(/[A-Za-z]+/g);
    var med = $("#"+med_id);
    console.log(med_id);

    if (hand_val == 1) {
        if (med.parent().parent().attr("id") == "med-area") {
            send_action("remove_from_container " + color_mapping[color].name);
        } else if (med.parent().parent().attr("id") == "grid-container") {
            var calId = med.parent().attr("id");
            send_action("remove_from_grid " + color_mapping[color].name + " " + day_mapping[calId.substring(0,3)] + " " + time_mapping[calId.slice(-1)]);
        }
        send_action("hand is full");
    }
    else {
        if (med.parent().parent().attr("id") == "med-area") {
            color_mapping[color].number -= 1;
            send_action("remove_from_container " + color_mapping[color].name);
        }
        else if (med.parent().parent().attr("id") == "grid-container") {
            var calId = med.parent().attr("id");
            calendar_count[calId] -= 1;
            send_action("remove_from_grid " + color_mapping[color].name + " " + day_mapping[calId.substring(0,3)] + " " + time_mapping[calId.slice(-1)]);
        }
        med.appendTo("#med");
        my_hand.count = 1;
        my_hand.color = color;
    }
}

function container_click(container_id) {
    var hand_val = my_hand.count;
    var containerColor = container_id.split("_")[0];
    if (color_mapping[containerColor].number == 0) {
        send_action("remove_from_container " + color_mapping[containerColor].name);
        send_action(color_mapping[containerColor].name + " container empty");
    } else if (hand_val == 1) {
        var med = document.getElementById("med").firstChild;
        var medColor = med.id.match(/[A-Za-z]+/g);
        if (medColor == containerColor) {
            document.getElementById(containerColor + "_container").appendChild(med);
            my_hand.count = 0;
            color_mapping[containerColor].number += 1;
        }
    }
}

function doAction(action) {
    if (action["name"] == "pointAt") {
        var list = action.args.split(' ');
        if (list.length == 2) {
            var day = list[0].toLowerCase().slice(0, 3);
            var time = time_mapping.indexOf(list[1]);
            $("#"+day+time).get(0).scrollIntoView({ behavior: 'smooth' });
            $("#"+day+time).addClass("highlight");
            
            setTimeout(function() {
                $("#"+day+time).removeClass('highlight');
            }, 5000);
        } else if (list.length == 1) {
            var color = medication_mapping[action.args];
            console.log($("#"+color+"_container").children().last().attr("id"))
            $("#"+color+"_container").get(0).scrollIntoView({ behavior: 'smooth' });
            $("#"+color+"_container").children().last().addClass("blink");
            setTimeout(function() {
                $("#"+color+"_container").children().last().removeClass('blink');
            }, 4000);
        }
    }
}

// async function processActionList(actionList) {
//     for (const action of actionList) {
//         await doAction(action);
//     }
// }

// function doAction(action) {
//     return new Promise((resolve, reject) => {
//         try {
//             if (action["name"] == "pointAt") {
//                 var list = action.args.split(' ');
//                 if (list.length == 2) {
//                     var day = list[0].toLowerCase().slice(0, 3);
//                     var time = time_mapping.indexOf(list[1]);
//                     $("#"+day+time).get(0).scrollIntoView({ behavior: 'smooth' });
//                     $("#"+day+time).addClass("highlight");
                    
//                     setTimeout(function() {
//                         $("#"+day+time).removeClass('highlight');
//                         resolve()
//                     }, 2000);
//                 } else if (list.length == 1) {
//                     var color = medication_mapping[action.args];
//                     console.log($("#"+color+"_container").children().last().attr("id"))
//                     $("#"+color+"_container").get(0).scrollIntoView({ behavior: 'smooth' });
//                     $("#"+color+"_container").children().last().addClass("blink");
//                     setTimeout(function() {
//                         $("#"+color+"_container").children().last().removeClass('blink');
//                         resolve()
//                     }, 2000);
//                 }
//             }
//         } catch(err) {
//             reject("error");
//         }
        
        
//     })
// }
// var json = {"day" : { "Sun": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Mon": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Tues": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Wed": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Thurs": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Fri": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Sat": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } } }
// console.log(json["day"]["Sun"]["1"]["red"]);