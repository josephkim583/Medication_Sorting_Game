function message(botm) {
    // if there's user input, add to chatbox
    var userInput = $('#user').val();
    if (userInput) {
        addUserInput(userInput);

        // Run tutorial if user ask for tutorial
        // TODO: move tutorial check to backend
        if (userInput.includes("how to play")) {
            tutorial();
        }

        // reset message box
        $("#user").parent().parent()[0].reset();
    }

    // Output user action to chatbox
    // else if (botm["userInput"]) {
    //     addUserInput(botm["userInput"])
    // }

    // create a row div
    var botRow = document.createElement("div");
    $(botRow).addClass("row");

    // create a newbotDiv div
    var newBotDiv = document.createElement("div");
    $(newBotDiv).addClass("newbotDiv");

    // set text to bot output
    $(newBotDiv).append(botm["start"]);

    if (botm["action"]) {
        doAction(botm["action"]);
    }

    if (botm['state']){
    //   $(newBotDiv).append(botm["state"] + "\n");
        animateAvatar(botm["state"]);
    }
    // if the agent has messages to the user, add to the chatSpace
    // represent sayText action
    $(newBotDiv).append(botm["hint"]);
    $(newBotDiv).append(botm["end"]);

    // add newbotDiv as child of row and add row to child of chatSpace (only if there is text inside)
    if ($(newBotDiv).text() != "") {
        $(botRow).append($(newBotDiv));
        $("#chatSpace").append($(botRow));
        $("#chatSpace").get(0).scrollIntoView({ behavior: 'smooth' });
    } 
    
    // TODO add debugging log
    // TODO add avatar status
}

function addUserInput(userInput) {
    // create a row div
    var userRow = document.createElement("div");
    $(userRow).addClass("row");

    // create a newuserDiv div and set text to user input
    var newUserDiv = document.createElement("div");
    $(newUserDiv).addClass("newuserDiv")
                 .html(userInput)
    // add newuserDiv as child of row, and add row as child of chatSpace
    $(userRow).append($(newUserDiv));
    $("#chatSpace").append($(userRow));
}

function updateScroll() {
    $("#chatSpace").scrollTop($("#chatSpace")[0].scrollHeight);
}

$(document).ready(function () {

    // first thing to do when page fully loads: process configurations received from backend
    $.post($SCRIPT_ROOT + "/startgame", {    },
        function (data) {
            console.log("start game")
            medInit(data);
            message(data);
            updateScroll();
    });    

    // TODO move this to an init file
    animateAvatar("sleeping");

    // TODO also put this in an init file
    $("#btnSleeping").click(function() {animateAvatar('sleeping')});
    $("#btnThinking").click(function() {animateAvatar('thinking')});
    $("#btnListening").click(function() {animateAvatar('listening')});
    $("#btnSpeaking").click(function() {animateAvatar('speaking')});
    $("#btnQuestioning").click(function() {animateAvatar('questioning')});

    // TODO also put this in an init file
    $(".toggleDebug").click(function() {
        $("#debug").toggle("slow", function(){});
        $(".toggleDebug").toggleClass("debugOn");
    });

    // this used to be a <form>
    $("#submitBtn").on('click', function (event) {
        $.post($SCRIPT_ROOT + "/message", {
            botm: $('#user').val()
        }, function (data) {
            message(data);
            updateScroll();
        });
        // if using <form>, this has something to do with not refreshing
        return false;
        // Joseph's code. Maybe this is the same as the above return false?
        // 	event.preventDefault();
    });

});
