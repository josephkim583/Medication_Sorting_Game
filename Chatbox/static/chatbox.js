function message(botm) {
    // if there's user input
    var userInput = $('#user').val();
    if (userInput) {
        addUserInput(userInput);
        if (userInput == "how to play") {
            tutorial();
        }
        $("#user").parent().parent()[0].reset();
    }

    else if (botm["userInput"]) {
        addUserInput(botm["userInput"])
    }

    // addUserInput(botm);

    // create a row div
    var botRow = document.createElement("div");
    $(botRow).addClass("row");

    // create a newbotDiv div
    var newBotDiv = document.createElement("div");
    $(newBotDiv).addClass("newbotDiv");

    // set text to bot output
    $(newBotDiv).append(botm["start"]);

    if (botm["action"]) {
        // processActionList(botm["actionList"]);
        doAction(botm["action"]);
    }

    if (botm['state']){
    //   $(newBotDiv).append(botm["state"] + "\n");
        animateAvatar(botm["state"]);
    }
    $(newBotDiv).append(botm["hint"]);
    $(newBotDiv).append(botm["end"]);

    // add newbotDiv as child of row and add row to child of chatSpace
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
    console.log(userInput)
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

    $("#showImgPopup").click(showImgPopup);
});
