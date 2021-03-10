var my_hand = {"count": 0, "type": "none"};
var medicine_count = {"red": 10, "blue": 10};
var calendar_count = {"Mon1r": 0, "Mon2r": 0, "Mon3r": 0, "Mon4r": 0, "Mon1b": 0, "Mon2b": 0, "Mon3b": 0, "Mon4b": 0, "Tues1r": 0, "Tues2r": 0, "Tues3r": 0, "Tues4r": 0, "Tues1b": 0, "Tues2b": 0, "Tues3b": 0, "Tues4b": 0, "Wed1r": 0, "Wed2r": 0, "Wed3r": 0, "Wed4r": 0, "Wed1b": 0, "Wed2b": 0, "Wed3b": 0, "Wed4b": 0, "Thurs1r": 0, "Thurs2r": 0, "Thurs3r": 0, "Thurs4r": 0, "Thurs1b": 0, "Thurs2b": 0, "Thurs3b": 0, "Thurs4b": 0, "Fri1r": 0, "Fri2r": 0, "Fri3r": 0, "Fri4r": 0, "Fri1b": 0, "Fri2b": 0, "Fri3b": 0, "Fri4b": 0, "Sat1r": 0, "Sat2r": 0, "Sat3r": 0, "Sat4r": 0, "Sat1b": 0, "Sat2b": 0, "Sat3b": 0, "Sat4b": 0, "Sun1r": 0, "Sun2r": 0, "Sun3r": 0, "Sun4r": 0, "Sun1b": 0, "Sun2b": 0, "Sun3b": 0, "Sun4b": 0}
var activities = [{"name": "exercise", "day": "Mon", "time":"1"}, {"name":"appointment", "day":"Thurs", "time":"2"},
                {"name":"work", "day":"Sat","time":"3"}];

function populate_activity(activity) {
    var div = document.getElementById(activity.day + activity.time);
    while (div.lastChild) {
        div.removeChild(div.lastChild);
    }
    div.innerHTML = activity.name;
}
activities.forEach(populate_activity);

function create_pill(color) {
    console.log("start");
    var img = document.createElement("img");
    if (color == "r") {
        img.src = "/static/img/redpill.jpg";
    } else {
        img.src = "/static/img/bluepill.jpg";
    }
    console.log(img.src);
    return img;
}

function calender_click(clicked_id)
    {
        var calendar_val = Number(document.getElementById(clicked_id).innerHTML);
        var calendar_type = clicked_id.substr(-1);
        var hand_val = my_hand["count"];
        var hand_type = my_hand["type"];

        if (hand_val == 1){
            if (hand_type == calendar_type && calendar_type == 'r'){
                var id = clicked_id + calendar_count[clicked_id ]
                calendar_count[clicked_id ] += 1;

                var img = create_pill("r");
                img.id = id;
                img.setAttribute("height" , 30);
                document.getElementById(clicked_id).appendChild(img);
                document.getElementById("pill").firstChild.remove();
                // document.getElementById("hand").innerHTML = "none";

                my_hand["count"] = 0;
                my_hand["type"] = "none";
            }
            else if (hand_type == "b" && hand_type == calendar_type){
                var id = clicked_id + calendar_count[clicked_id ] 
                calendar_count[clicked_id ] += 1;

                var img = create_pill("b");
                img.id = id;
                img.setAttribute("height" , 30);
                document.getElementById(clicked_id).appendChild(img);
                document.getElementById("pill").firstChild.remove();
                // document.getElementById("hand").innerHTML = "none";
                my_hand["count"] = 0;
                my_hand["type"] = "none"
            }
            else{
                alert("You are butting the pill in a wrong container!!");
            }
            
        }
        else if(hand_val == 0){
            if (calendar_count[clicked_id] > 0){
                var id = clicked_id + String(calendar_count[clicked_id] - 1);
                document.getElementById(id).remove();
                calendar_count[clicked_id] -= 1;

                var img = create_pill(calendar_type);
                img.setAttribute("height", 42);
                document.getElementById("pill").appendChild(img);
                // document.getElementById("hand").innerHTML = calendar_type;
                my_hand["count"] = 1;
                my_hand["type"] = calendar_type;
            }
            else{
                alert("The hand is empty!");
            }           
        }
        
    }

function red_instruction(){
    alert("Red pill instructions!");
}

function blue_instruction(){
    alert("Blue pill instructions!");
}

function blue_medicine_click(){
    var hand_val = my_hand["count"];
    var hand_type = my_hand["type"];

    if (hand_val == 1 && hand_type == "r"){
        alert("You can't put a red pill inside a blue bottle!");
    }
    else if (hand_val == 1 && hand_type == "b"){
        medicine_count["blue"] += 1;
        var id = "blue" + String(medicine_count["blue"]);

        var img = create_pill("b");
        img.id = id;
        img.setAttribute("height", "42");
        // img.setAttribute("width", "42");

        document.getElementById("blue_bottle").appendChild(img);
        document.getElementById("pill").firstChild.remove();
        // document.getElementById(id).style.backgroundColor = "blue";
        // document.getElementById("hand").innerHTML = "none";
        my_hand["count"] = 0;
        my_hand["type"] = "none"
    }
    else if (hand_val == 0){
        if (medicine_count["blue"] > 0) {
            var id = "blue" + String(medicine_count["blue"]);
            
            var img = create_pill("b");
            img.id = id;
            img.setAttribute("height", "42");
            document.getElementById(id).remove();
            document.getElementById("pill").appendChild(img);
            // document.getElementById("hand").innerHTML = hand_val + 1;
            // document.getElementById("hand").innerHTML = "b";
            medicine_count["blue"] -= 1;
            my_hand["count"] = 1
            my_hand["type"] = "b"
        }
        else{
            alert("Red medicine bottle is empty");
        } 
    }
    else{
        alert("Wrong operation!");
    }
}


function red_medicine_click(){
    var hand_val = my_hand["count"];
    var hand_type = my_hand["type"];

    // document.body.style.cursor = "url(redpill.jpg), auto";
    
    if (hand_val == 1 && hand_type == "b"){
        alert("You can't put a blue pill inside a red bottle!");
    }
    else if (hand_val == 1 && hand_type == "r"){
        medicine_count["red"] += 1;
        var id = "red" + String(medicine_count["red"]);

        var img = create_pill("r");
        img.id = id;
        img.setAttribute("height" , 42);

        document.getElementById("red_bottle").appendChild(img);
        document.getElementById("pill").firstChild.remove();
        // document.getElementById("hand").innerHTML = hand_val - 1;
        // document.getElementById("hand").innerHTML = "none";
        my_hand["count"] = 0;
        my_hand["type"] = "none";
    }
    else if (hand_val == 0){
        if (medicine_count["red"] > 0) {
            var id = "red" + String(medicine_count["red"]);
            
            var img = create_pill("r");
            img.id = id;
            img.setAttribute("height" , 42);
            document.getElementById(id).remove();
            document.getElementById("pill").appendChild(img);
            // document.getElementById("hand").innerHTML = "r";
            medicine_count["red"] -= 1;
            my_hand["count"] = 1;
            my_hand["type"] = "r";
        }
        else{
            alert("Red medicine bottle is empty");
        } 
    }
    else{
        alert("Wrong operation!");
    }
    
}

var json = {"day" : { "Sun": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Mon": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Tues": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Wed": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Thurs": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Fri": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Sat": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } } }
// console.log(json["day"]["Sun"]["1"]["red"]);