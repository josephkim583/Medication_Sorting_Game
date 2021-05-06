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
const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var tutorialPhase = false;
var tutorialStep = 0;

function tutorial() {
    tutorialPhase = true;
    $.post("/tutorial", {"position": tutorialStep, "response": ""}, function(data) {
        if (data) {
            message(data);
            updateScroll();
        } else {
            message({"hint":"Congratulations! You have finished the tutorial"})
            updateScroll();
            tutorialPhase = false;
            tutorialStep = 0;
        }
    })
}

function medInit(serverInput) {
    var events = serverInput["events"];
    var medications = serverInput["medications"];

    generate_layout();
    events.forEach(populate_events); 

    medications.forEach(function(medication) {
        var name = medication["name"];
        var color = medication["color"];
        var number = parseInt(medication["number"]);
        make_container(name, color, number);
    });
}

function generate_layout() {
    var title = document.createElement("h1");
    title.textContent = "Medication Sorting";
    title.style = "text-align: center";
    $("#interactionSpace").append(title);

    var gridContainer = document.createElement("div");
    gridContainer.id = "grid-container";
    $("#interactionSpace").append(gridContainer);

    for (let i = 0; i < time_mapping.length; i++) {
        var timeDiv = document.createElement("div");
        $(timeDiv).addClass("time");
        if (time_mapping[i] != "none") {
            var timeName = document.createElement("p");
            $(timeName).text(time_mapping[i]);
            $(timeDiv).append(timeName);
        }
        $(gridContainer).append(timeDiv);

        for (let j = 0; j < dayList.length; j++) {
            var dayDiv = document.createElement("div");
            if (time_mapping[i] == "none") {
                $(dayDiv).text(dayList[j]);
            } else {
                dayDiv.id = dayList[j].toLowerCase() + i;
                $(dayDiv).attr("onclick", "calendar_click(this.id);");

            }
            $(gridContainer).append(dayDiv);
        }
    }

    var br = document.createElement("br");
    $("#interactionSpace").append(br);

    var medAreaDiv = document.createElement("div");
    medAreaDiv.id = "med-area";
    $("#interactionSpace").append(medAreaDiv);

    var infoDiv = document.createElement("div");
    infoDiv.id = "info";
    $(medAreaDiv).append(infoDiv);

    var hand = document.createElement("p");
    $(hand).text("Hand");
    $(infoDiv).append(hand);

    var medDiv = document.createElement("div");
    medDiv.id = "med";
    $(infoDiv).append(medDiv);
}

function populate_events(event) {
    var div = document.getElementById(event.day + event.time);
    while (div.lastChild) {
        div.removeChild(div.lastChild);
    }
    var span = document.createElement("span");
    $(span).html(event.name);
    $(div).append(span);
}

function make_container(name, color, number) {
    medication_mapping[name] = color;
    color_mapping[color] = {"name":name, "number":number};
    // console.log(color_mapping);

    var container = document.createElement("div");
    container.id = color + "_container";
    $(container).addClass("med-container");
    $(container).attr("onclick", "container_click(this.id)");
    $(container).attr("style", "border: 2px solid " + color);
    $("#med-area").append(container);

    var span = document.createElement("span");
    $(container).append(span);
    $(span).html(name);
    
    var info = document.createElement("i");
    info.id = color + "_instruction";
    info.style.color = color;
    $(info).addClass("fa");
    $(info).addClass("fa-info-circle");
    $(info).attr("onclick", "instruction(this.id);");
    $(container).append(info);

    for (var i = 0; i < number; i++) {
        var med = document.createElement("div");
        med.id = "" + color + (i+1);
        $(med).addClass("med");
        $(med).attr("onclick", "med_click(this.id); event.stopPropagation();");
        med.style.backgroundColor = color;
        $(container).append(med);
    }
}

function receive_action() {
    fetch("/message")
    .then(response => response.json())
    .then(actionList => actionList.forEach(doAction))
}

function send_action(action) {
    if (tutorialPhase) {
        $.post("/tutorial", {
            "position": tutorialStep,
            "response": '(' + action + ')'
        }, function(data) {
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
            doAction(data["action"]);
            message(data);
            updateScroll();
            
        })
    }
}

function calendar_click(pos_id) {
    var hand_val = my_hand.count;
    var hand_color = my_hand.color;

    if (hand_val == 1) {
        // var id = clicked_id + calendar_count[clicked_id ]
        calendar_count[pos_id] += 1;

        $("#"+pos_id).append($("#med").children().first())

        my_hand.count = 0;
        // my_hand["type"] = "none";
        send_action('add_to_grid ' + color_mapping[hand_color].name + ' ' + day_mapping[pos_id.substring(0,3)] + ' ' + time_mapping[pos_id.slice(-1)]);
    }
    else {
        // Include previous action for backend to process (commented because backend cannot process 2 actions in sequence right now)
        // send_action("add_to_grid " + color_mapping[hand_color].name + " " + day_mapping[pos_id.substring(0,3)] + " " + time_mapping[pos_id.slice(-1)]);
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
        var med = $("#med").children().first();
        var medColor = med.attr("id").match(/[A-Za-z]+/g);
        if (medColor == containerColor) {
            $("#"+containerColor + "_container").append(med);
            my_hand.count = 0;
            color_mapping[containerColor].number += 1;
        }
    }
}

function doAction(action) {
    if (action.name == "pointAt") {
        pointAt(action.args);
    } else if (action.name == "showImage") {
        showImgPopup(action.args);
    }
}

function showImgPopup(imgSrc) {
    console.log("show popup");
    var imgPopup = document.createElement("div");
    imgPopup.id = "popup";
    

    var overlay = document.createElement("div");
    overlay.id = "overlay";
    $(overlay).append(imgPopup);
    $("body").append(overlay);

    var closeBtn = document.createElement("button");
    closeBtn.id = "close";
    $(closeBtn).text("X");
    $(imgPopup).append(closeBtn);
    
    // var imgSrc = "static/pill_interaction.png";
    var img = document.createElement("img");
    img.src = imgSrc;
    $(imgPopup).append(img);

    $(imgPopup).hide().fadeIn(100);

    $(closeBtn).click(function (e) { 
        e.preventDefault();
        e.stopPropagation();
        $(imgPopup).fadeOut(100)
        $(overlay).fadeOut(100);
    });
}

function pointAt(args) {
    var list = args.split(' ');
    if (list.length == 2) {
        var day = list[0].toLowerCase().slice(0, 3);
        var time = time_mapping.indexOf(list[1]);
        // $("#"+day+time).get(0).scrollIntoView({ behavior: 'smooth' });
        $("#"+day+time).addClass("highlight");
        
        setTimeout(function() {
            $("#"+day+time).removeClass('highlight');
        }, 5000);
    } else if (list.length == 1) {
        var color = medication_mapping[args];
        console.log($("#"+color+"_container").children().last().attr("id"))
        // $("#"+color+"_container").get(0).scrollIntoView({ behavior: 'smooth' });
        $("#"+color+"_container").children().last().addClass("blink");
        setTimeout(function() {
            $("#"+color+"_container").children().last().removeClass('blink');
        }, 3000);
    }
}