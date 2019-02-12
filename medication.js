var my_hand = {"count": 0, "type": "none"};
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

function red_medicine_click(){
    var hand_val = my_hand["count"];
    var hand_type = my_hand["type"];
    var red_val = Number(document.getElementById("red_bottle").innerHTML);

    console.log("hand_val");

    if (hand_val == 1 && hand_type == "b"){
        alert("You can't put a blue pill inside a red bottle!");
    }
    else if (hand_val == 1 && hand_type == "r"){
        document.getElementById("red_bottle").innerHTML = red_val + 1;
        document.getElementById("hand").innerHTML = Number(0);
        my_hand["count"] = 0;
        my_hand["type"] = "none"
    }
    else if(hand_val == 0 && red_val > 0){
        document.getElementById("red_bottle").innerHTML = red_val - 1;
        document.getElementById("hand").innerHTML = hand_val + 1;
        my_hand["count"] = 1
        my_hand["type"] = "r"
    }
    else{
        alert("The hand is empty!");
    }
}


function blue_medicine_click(){
    var hand_val = my_hand["count"];
    var hand_type = my_hand["type"];
    var blue_val = Number(document.getElementById("blue_bottle").innerHTML);

    console.log("hand_val");

    if (hand_val == 1 && hand_type == "r"){
        alert("You can't put a red pill inside a blue bottle!");
    }
    else if (hand_val == 1 && hand_type == "b"){
        document.getElementById("blue_bottle").innerHTML = blue_val + 1;
        document.getElementById("hand").innerHTML = Number(0);
        my_hand["count"] = 0;
        my_hand["type"] = "none"
    }
    else if(hand_val == 0 && blue_val > 0){
        document.getElementById("blue_bottle").innerHTML = blue_val - 1;
        document.getElementById("hand").innerHTML = hand_val + 1;
        my_hand["count"] = 1
        my_hand["type"] = "b"
    }
    else{
        alert("The hand is empty!");
    }
}


var json = {"day" : { "Sun": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Mon": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Tues": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Wed": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Thurs": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Fri": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } , "Sat": { "1": { "red" : 0, "blue" : 0 } , "2": { "red" : 0, "blue" : 0 } , "3": { "red" : 0, "blue" : 0 } , "4": { "red" : 0, "blue" : 0 } } } }
// console.log(json["day"]["Sun"]["1"]["red"]);