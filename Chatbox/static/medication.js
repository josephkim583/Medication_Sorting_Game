var my_hand = {"count": 0, "color": "none", "name":"none"};

// map medication color to medication name and vice versa
var color_mapping = {};
var medication_mapping = {};
const time_mapping = ["none", "morning", "noon", "afternoon", "evening"];
const day_mapping = {"mon":"Monday", "tue":"Tuesday", "wed":"Wednesday", "thu":"Thursday", "fri":"Friday",
"sat":"Saturday", "sun":"Sunday"};
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// variable for tutorial part
var tutorialPhase = false;
var tutorialStep = 0;

// init game configurations
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

// generate calendar
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

        for (let j = 0; j < days.length; j++) {
            var dayDiv = document.createElement("div");
            if (time_mapping[i] == "none") {
                $(dayDiv).text(days[j]);
            } else {
                dayDiv.id = days[j].toLowerCase() + i;
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

// put events on calendar
function populate_events(event) {
    var span = document.createElement("span");
    $(span).html(event.name);
    $("#"+event.day + event.time).append(span);
}

// create medication container
function make_container(name, color, number) {
    medication_mapping[name] = color;
    color_mapping[color] = {"name":name, "number":number};

    var container = document.createElement("div");
    container.id = color + "_container";
    $(container).addClass("med-container");
    $(container).attr("onclick", "container_click(this.id)");
    $(container).attr("style", "border: 2px solid " + color);
    $("#med-area").append(container);

    // span for medication name
    var span = document.createElement("span");
    $(container).append(span);
    $(span).html(name);
    
    // for medication information/instruction
    var info = document.createElement("i");
    info.id = color + "_instruction";
    info.style.color = color;
    $(info).addClass("fa");
    $(info).addClass("fa-info-circle");
    $(info).attr("onclick", "instruction(this.id);");
    $(container).append(info);

    // generate pills
    for (var i = 0; i < number; i++) {
        var med = document.createElement("div");
        med.id = "" + color + (i+1);
        $(med).addClass("med");
        $(med).attr("onclick", "med_click(this.id); event.stopPropagation();");
        med.style.backgroundColor = color;
        $(container).append(med);
    }
}

// process tutorial actions from backend
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

// send action to backend and process data sent back from backend
function send_action(action) {
    // send action if user is doing tutorial
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
    // send normal action
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

// triggers when click on a position in calendar
function calendar_click(pos_id) {
    var hand_val = my_hand.count;
    var hand_color = my_hand.color;

    if (hand_val == 1) {
        // move pill from hand to position in calendar
        $("#"+pos_id).append($("#med").children().first())

        my_hand.count = 0;
        send_action('add_to_grid ' + color_mapping[hand_color].name + ' ' + day_mapping[pos_id.substring(0,3)] + ' ' + time_mapping[pos_id.slice(-1)]);
    }
    else {
        // Include previous action for backend to process (commented because backend cannot process 2 actions in sequence right now)
        // send_action("add_to_grid " + color_mapping[hand_color].name + " " + day_mapping[pos_id.substring(0,3)] + " " + time_mapping[pos_id.slice(-1)]);
        send_action("empty hand");
    }
    
}

// triggers when click on information button in container
function instruction(instruction_id){
    var color = instruction_id.split("_")[0];
    send_action("request-instructions " + color_mapping[color].name);
}

// triggers when click on a pill/medication
function med_click(med_id) {
    var hand_val = my_hand.count;
    var color = med_id.match(/[A-Za-z]+/g);
    var med = $("#"+med_id);
    console.log("clicked: " + med_id);

    if (hand_val == 1) {
        // includes action user trying to do
        if (med.parent().parent().attr("id") == "med-area") {
            send_action("remove_from_container " + color_mapping[color].name);
        } else if (med.parent().parent().attr("id") == "grid-container") {
            var calId = med.parent().attr("id");
            send_action("remove_from_grid " + color_mapping[color].name + " " + day_mapping[calId.substring(0,3)] + " " + time_mapping[calId.slice(-1)]);
        }
        send_action("hand is full");
    }
    else {
        // pill is inside container
        if (med.parent().parent().attr("id") == "med-area") {
            color_mapping[color].number -= 1;
            send_action("remove_from_container " + color_mapping[color].name);
        }
        // pill is inside calendar
        else if (med.parent().parent().attr("id") == "grid-container") {
            var calId = med.parent().attr("id");
            send_action("remove_from_grid " + color_mapping[color].name + " " + day_mapping[calId.substring(0,3)] + " " + time_mapping[calId.slice(-1)]);
        }
        
        // move pill to hand
        med.appendTo("#med");
        my_hand.count = 1;
        my_hand.color = color;
    }
}

// trigger when click inside a container
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
            // move pill from hand to container
            $("#"+containerColor + "_container").append(med);
            my_hand.count = 0;
            color_mapping[containerColor].number += 1;
        }
    }
}

// execute action from backend
function doAction(action) {
    if (action.name == "pointAt") {
        pointAt(action.args);
    } else if (action.name == "showImage") {
        showImgPopup(action.args);
    }
}

// show image as popup
function showImgPopup(imgSrc) {
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

// point at an object in interface
// TODO: maybe keep pointing until there is response from user
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
        console.log("point at " + $("#"+color+"_container").children().last().attr("id"))
        // $("#"+color+"_container").get(0).scrollIntoView({ behavior: 'smooth' });
        $("#"+color+"_container").children().last().addClass("blink");
        setTimeout(function() {
            $("#"+color+"_container").children().last().removeClass('blink');
        }, 3000);
    }
}