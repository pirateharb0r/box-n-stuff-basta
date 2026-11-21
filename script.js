
// ===================================
// GAME ELEMENTS
// ===================================

const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const target = document.getElementById("target");
const gameArea = document.getElementById("gameArea");
const startButton = document.getElementById("startButton");
const gameMessage = document.getElementById("gameMessage");


// ===================================
// GAME VARIABLES
// ===================================

let score = 0;
let timeLeft = 30;
let gameRunning = false;
let countdown;


// ===================================
// MOVE THE RED BOX
// ===================================

function moveTarget() {
    const maxX = gameArea.clientWidth - target.offsetWidth;
    const maxY = gameArea.clientHeight - target.offsetHeight;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    target.style.left = randomX + "px";
    target.style.top = randomY + "px";
}


// ===================================
// START OR RESTART THE GAME
// ===================================

function startGame() {
    clearInterval(countdown);

    score = 0;
    timeLeft = 30;
    gameRunning = true;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    gameMessage.textContent = "Click the red box!";
    startButton.textContent = "Restart Game";

    target.style.display = "block";

    moveTarget();

    countdown = setInterval(function() {
        timeLeft--;

        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}


// ===================================
// WHEN THE RED BOX IS CLICKED
// ===================================

target.addEventListener("click", function() {
    if (!gameRunning) return;

    score++;

    scoreDisplay.textContent = score;

    moveTarget();
});


// ===================================
// END THE GAME
// ===================================

function endGame() {
    gameRunning = false;

    clearInterval(countdown);

    target.style.display = "none";

    gameMessage.textContent =
        "Game over! Your final score is " + score + "!";

    startButton.textContent = "Play Again";
}


// ===================================
// START BUTTON
// ===================================

startButton.addEventListener("click", startGame);


// ===================================
// EMAIL FEEDBACK SYSTEM
// ===================================

const feedbackForm = document.getElementById("feedbackForm");
const feedbackResponse = document.getElementById("feedbackResponse");
const submitFeedback = document.getElementById("submitFeedback");

feedbackForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const type = document.getElementById("feedbackType").value;
    const message = document.getElementById("feedbackMessage").value.trim();

    if (!message) {
        feedbackResponse.textContent = "Please enter a message.";
        return;
    }

    // Prevent repeated clicks while sending
    submitFeedback.disabled = true;
    submitFeedback.textContent = "Sending...";

    feedbackResponse.textContent = "Sending your feedback...";

    try {
        const result = await fetch(
            "https://formsubmit.co/ajax/pelarejaedward@gmail.com",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify({
                    _subject: "New Red Box Clicker Feedback",
                    _template: "table",
                    feedback_type: type,
                    message: message,
                    current_game_score: score,
                    game: "Red Box Clicker"
                })
            }
        );

        const data = await result.json();

        if (result.ok && data.success) {
            feedbackResponse.textContent =
                "Thank you! Your feedback was sent successfully.";

            feedbackForm.reset();

        } else {
            feedbackResponse.textContent =
                "Your feedback could not be sent. Please try again.";

            console.error("FormSubmit response:", data);
        }

    } catch (error) {
        feedbackResponse.textContent =
            "Something went wrong. Check your internet connection and try again.";

        console.error("Feedback error:", error);

    } finally {
        submitFeedback.disabled = false;
        submitFeedback.textContent = "Submit Feedback";
    }
});
