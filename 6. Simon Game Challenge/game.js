var gamePattern = [];
var userClickPattern = [];
var buttonColours = ["red", "blue", "green", "yellow"];
var level = 0;
var started = false; 
var currentLevel = 0;


$(".btn").on("click", function (event) {
    var userChosenColour = event.target.id;
    userClickPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    checkAnswer(currentLevel);
})

$(document).on("keypress", function () {
    if (!started){
        nextSequence();
        started = true;
    }
});


function nextSequence() {
    var randomNumber = Math.floor(Math.random()*4);
    var randomChosenColour = buttonColours[randomNumber];
    playSound(randomChosenColour);
    $("#"+randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    gamePattern.push(randomChosenColour);
    level+=1;
    $("#level-title").text("Level "+ level);
}

function playSound(name) {
    var audio = new Audio("sounds/"+name+".mp3");
    audio.play();
}

function animatePress(currentColour) {
    $("."+currentColour).addClass("pressed");
    setTimeout(function () {
        $("."+currentColour).removeClass("pressed");        
    }, 100);
}

function checkAnswer(indexLastAnswer) {
    if (userClickPattern[indexLastAnswer] == gamePattern[indexLastAnswer]){
        if (userClickPattern.length == gamePattern.length){
            setTimeout(() => {
                nextSequence();
                currentLevel = 0;
                userClickPattern = [];
            }, 1000);
        }
        else{
            currentLevel+=1;
        }
    }
    else{
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(() => {
            $("body").removeClass("game-over");
        }, 200);
        $("#level-title").text("Game Over, Press Any Key to Restart");
        startOver();
    }
}

function startOver() {
    level = 0;
    gamePattern = [];
    userClickPattern = [];
    currentLevel = 0;
    started = false;
}