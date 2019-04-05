var my_hand = {"count": 0, "type": "none"};
var medicine_count = {"red": 10, "blue": 10};


function calender_click(clicked_id)
    {
        var calendar_val = Number(document.getElementById(clicked_id).innerHTML);
        var calendar_type = clicked_id.substr(-1);
        console.log(calendar_type);
        var hand_val = my_hand["count"];
        var hand_type = my_hand["type"];

        if (hand_val == 1){
            if (hand_type == calendar_type){
                document.getElementById(clicked_id).innerHTML = calendar_val + 1;
                document.getElementById("hand").innerHTML = Number(0);
                my_hand["count"] = 0;
                my_hand["type"] = "none"
            }
            else{
                alert("You are butting the pill in a wrong container!!");
            }
            
        }
        else if(hand_val == 0 && calendar_val > 0){
            document.getElementById(clicked_id).innerHTML = calendar_val - 1;
            document.getElementById("hand").innerHTML = hand_val + 1;
            my_hand["count"] = 1;
            my_hand["type"] = calendar_type;
        }
        else{
            alert("The hand is empty!");
        }
    }

function blue_medicine_click(){
    var hand_val = my_hand["count"];
    var hand_type = my_hand["type"];


    if (hand_val == 1 && hand_type == "r"){
        alert("You can't put a red pill inside a blue bottle!");
    }
    else if (hand_val == 1 && hand_type == "b"){
        medicine_count["blue"] += 1;
        var id = "blue" + String(medicine_count["blue"])
        document.getElementById(id).style.backgroundColor = "blue";
        document.getElementById("hand").innerHTML = hand_val - 1;
        my_hand["count"] = 0;
        my_hand["type"] = "none"
    }
    else if (hand_val == 0){
        if (medicine_count["blue"] > 0) {
            var id = "blue" + String(medicine_count["blue"])
            document.getElementById(id).style.backgroundColor = "white";
            document.getElementById("hand").innerHTML = hand_val + 1;
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
    
    
    if (hand_val == 1 && hand_type == "b"){
        alert("You can't put a blue pill inside a red bottle!");
    }
    else if (hand_val == 1 && hand_type == "r"){
        medicine_count["red"] += 1;
        var id = "red" + String(medicine_count["red"])
        document.getElementById(id).style.backgroundColor = "red";
        document.getElementById("hand").innerHTML = hand_val - 1;
        my_hand["count"] = 0;
        my_hand["type"] = "none"
    }
    else if (hand_val == 0){
        if (medicine_count["red"] > 0) {
            var id = "red" + String(medicine_count["red"])
            document.getElementById(id).style.backgroundColor = "white";
            document.getElementById("hand").innerHTML = hand_val + 1;
            medicine_count["red"] -= 1;
            my_hand["count"] = 1
            my_hand["type"] = "r"
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