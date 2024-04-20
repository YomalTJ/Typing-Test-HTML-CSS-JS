const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// display random quote
const renderNewQuote = async() => {
    // fetch contents from url
    const response = await fetch(quoteApiUrl);

    // store response
    let data = await response.json();

    // access quote
    quote = data.content;

    // array of characters in the quote
    let arr = quote.split("").map(value => {
        // wrap the characters in a span tag
        return "<span class='quote-chars'>"+ value + "</span>";
    });

    // join array for displaying
    quoteSection.innerHTML += arr.join("");
}

// logic for comapring input words with quote
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    // create an array from recived span tags
    quoteChars = Array.from(quoteChars);

    // array of user input characters
    let userInputChars = userInput.value.split("");

    // loop through each character in quote
    quoteChars.forEach((char, index) => {
        // check if char(quote character) = userInputChars[index](input character)
        if(char.innerText == userInputChars[index]){
            char.classList.add("success");
        }
        // if user hasn't entered anything or backspaced
        else if(userInputChars[index] == null){
            // remove class if ane
            if(char.classList.contains("success")){
                char.classList.remove("success");
            }
            else{
                char.classList.remove("fail");
            }
        }
        // if user enter wrong character
        else{
            // checks if already have added fail class
            if(!char.classList.contains("fail")){
                // increment and siplay mistakes
                mistakes += 1;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }
        // returns true if all the characters are entered correctly
        let check = quoteChars.every(element => {
            return element.classList.contains("success");
        });
        // end test if all characters are correct
        if(check){
            displayResult();
        }
    });
});

// update timer on screen
function updateTimer(){
    if(time == 0){
        // end test if timer reaches 0
        displayResult();
    }
    else{
        document.getElementById("timer").innerText = --time + "s";
    }
}

// sets timer
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}

// end test
const displayResult = () => {
    // display result div
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timeTaken =  1;
    if(time != 0){
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.
        value.length / 5 / timeTaken).toFixed(2) + " wpm";
    document.getElementById("accuracy").innerText = Math.round(
        ((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
}

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}

// start test
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
}