let questionBank = []; //Creates an empty array to contain created questions.
let questionCount = 0; //Creates a variable and sets the value to 0 for the number of questions asked.
let correct = 0; //Creates a variable and sets the value to 0 for the number of questions answered correctly.
let questionRandom = []; //an array created to hold the questions already asked, so they are not repeated.
let score = 0; 
let highScore = 0;
let time;

// if there is a current high score, it will be displayed,.. otherwise it will not try.
if (localStorage.length > 0) { 
  let scoreLookup = JSON.parse( localStorage.getItem('highScore'))
  highScore = scoreLookup.score;
    $('#highScore').text(`${scoreLookup.name} has the highest score of ${scoreLookup.score}`)
}


//****************************//
//     Question Contructor      //
//____________________________//
class Question {
  constructor(question, choices, answer) {
    this.questionText = question,
      this.answers = choices,
      this.correctAnswer = answer,
      questionBank.push(this); //adds the new question to the questionBank array.
  }
  check(choice) { //method used to compare the selection to the correct answer.
    if (this.correctAnswer == choice) { //compares the correct answer to a variable set when clicking a choice button.
      correct++
      score += (100 - (100 - time)); //keeps track of score based on how much time has elapsed.
      $('<h2>That is Correct.</h2>').appendTo('#canvas');
      $('<h2>You earned ' + (100 - (100 - time))  +' points.</h2>').appendTo('#canvas');
    } else {
      $('<h2>That is incorrect.</h2>').appendTo('#canvas');
      $('<h2>The correct answer was ' + this.correctAnswer + '</h2>').appendTo('#canvas');
    }
    questionCount++;
    $('#currentScore').text(score);
    $('#timer').hide();
    if (questionCount !== questionBank.length) {
      setTimeout(quiz, 2000);//If all of the questions have not been asked, run the 'quiz' function again.
    } else {
      setTimeout(done, 2000); //otherwise, run the 'done' function.
    }
  }
}

// constructor for the user with the new high score
class HighestScore {
  constructor(name, score) {
    this.name = name,
    this.score = score;
    localStorage.setItem('highScore', JSON.stringify(this));
  }
}

//creates a timer to track how much time has elapsed since starting the question.
function timer() {
  time = 1000;
  setInterval(countdown, 50)
}
function countdown() {
  if (time > 0) {
  time = time - 1;
  $('h4').remove()
  $('<h4>' + time + '</h4>').appendTo('#timer')
  }
}

// starts the page with everything but the rules, the "begin button", and the "create question button" hidden
$('#scoreBox').hide();
$('#creator').hide();
$('#canvas').hide();
$('#timer').hide();

//***************************//
//      Main Quiz Function      //
//___________________________ //
$('#quiz').on('click', quiz);  //Event listener set to run the 'quiz' function when clicked.

function quiz() {
  $('#rules').remove(); //removes the rules completely upon clicking the "begin" button.
  $('#scoreBox').show();
  $('#timer').show();
  $('#canvas').show();
  timer();

  if (questionBank.length < 10) {
      let questionsNeeded = (10  - questionBank .length); //adds the appropriate amount of questions to the question bank, taking in consideration what may have been added with the create a question option.
      for (i = 0; i < questionsNeeded; i++)  {
        let picker = Math.floor(Math.random() * 7);
        if (picker === 0) {
          additionAdd();
        }
        if (picker === 1) {
          subtractionAdd();
        }
        if (picker === 2) {
          multiplicationAdd();
        }
        if (picker >= 3) { //disproportionately adds science questions to the question bank by making it more likely that a number equal to or greater than three is randomly generated.
          scienceAdd();
        }
      }
    }

  // generates a random number and checks it against other random numbers that have been previously generated to ensure the same number is not picked twice.
  // uses this random number to pull a question from the questionBank, to ensure they are asked in a random order.
  currentQ = Math.floor(Math.random() * questionBank.length);
  while (questionRandom.includes(currentQ)) {
    currentQ = Math.floor(Math.random() * questionBank.length);
  }
  questionRandom.push(currentQ);
  
  //Hides all of the selection panels before displaying the questions
  $('#quiz').hide();
  $('#custom').hide();
  $('h2').remove();
  $('#choices').remove();
  $('<div id="choices"></div>').appendTo('#canvas');

  $('<h2>' + questionBank[currentQ].questionText + '</h2>').prependTo('#canvas');//Displays the current question.

  //Randomizes the order that the choice buttons display to prvent the correct answer from being in the same place.
  let r1 = Math.floor(Math.random() * 4); //Sets a random number between 0 and 3.
  let r2 = Math.floor(Math.random() * 4);//Sets a random number between 0 and 3 and checks to make sure it is not already the first number, if it is it picks again.
  while (r2 === r1) {
    r2 = Math.floor(Math.random() * 4);
  }
  let r3 = Math.floor(Math.random() * 4);//Sets a random number between 0 and 3 and checks to make sure it is not already the first or second  number, if it is it picks again.
  while (r3 === r2 || r3 === r1) {
    r3 = Math.floor(Math.random() * 4);
  }
  let r4 = Math.floor(Math.random() * 4);//Sets a random number between 0 and 3 and checks to make sure it is not already the first, second or third number, if it is it picks again.
  while ((r4 === r3 || r4 === r2) || r4 === r1) {
    r4 = Math.floor(Math.random() * 4);
  }

  //Creates buttons for the choices and adds them to the browser and sets the id to be the same as the option it displays.
  $('<button class="choiceBtn mx-2" id="' + questionBank[currentQ].answers[r1] + '">' + questionBank[currentQ].answers[r1] + '</button>').appendTo('#choices');
  $('<button class="choiceBtn mx-2" id="' + questionBank[currentQ].answers[r2] + '">' + questionBank[currentQ].answers[r2] + '</button>').appendTo('#choices');
  $('<button class="choiceBtn mx-2" id="' + questionBank[currentQ].answers[r3] + '">' + questionBank[currentQ].answers[r3] + '</button>').appendTo('#choices');
  $('<button class="choiceBtn mx-2" id="' + questionBank[currentQ].answers[r4] + '">' + questionBank[currentQ].answers[r4] + '</button>').appendTo('#choices');

  //Adds an event listener to the buttons and sets a variable to the clicked buttons id.
  $('.choiceBtn').click((e) => {
    $('h2').remove();
    $('#choices').remove();
    choice = $(e.target).attr('id');
    questionBank[currentQ - 1].check(choice);
  });
  currentQ++;     //Increments the variable that determines which question to be asked so that on the next run the next question will be asked.
}

//****************************//
//         Random Addition        //   //This adds a random addition question to the questionBank.
//____________________________ //
function additionAdd() {  //Event listener that runs the following function.
  let num1 = Math.floor(Math.random() * 1000) + 1; //Creates a random number between 1 + 1000 and sets it to a variable
  let num2 = Math.floor(Math.random() * 1000) + 1; //Creates a random number between 1 + 1000 and sets it to a variable
  let question = "What is " + num1 + " + " + num2; //Uses the variables to concatenate a string that represents a question.
  let answer = num1 + num2; //Uses the variables to come up with the correct answer
  let choices = [answer + Math.floor((Math.random() * 20) + 1), answer - Math.floor((Math.random() * 20) + 1), answer + Math.floor((Math.random() * 20) + 1), answer]; //Creates random options that are close in value to the correct answer
  new Question(question, choices, answer); //Uses the constructor to create new questions.
}

//****************************//
//      Random Subtraction     //   This adds a random subtraction question to the questionBank.
//____________________________ //
function subtractionAdd() {  //Event listener that runs the following function.
  let num1 = Math.floor((Math.random() * 900) + 100) ; //Creates a random number between 1 + 899 and sets it to a variable
  let num2 = num1 - Math.floor(Math.random() * 100); //creates a random number between 1 + 99, subtracts it from the first variable,  and sets it to a variable
  let question = "What is " + num1 + " - " + num2; //Uses the variables to concatenate a string that represents a question.
  let answer = num1 - num2; //Uses the variables to come up with the correct answer
  let choices = [answer + Math.floor((Math.random() * 20) + 1), answer - Math.floor((Math.random() * 20) + 1), answer + Math.floor((Math.random() * 20) + 1), answer]; //Creates random options that are close in value to the correct answer
  new Question(question, choices, answer); //Uses the constructor to create new questions
}

//******************************//
//      Random Multiplication     //   This adds a random multiplication question to the questionBank.
//______________________________//
function multiplicationAdd() {  //Event listener that runs the following function.
  let num1 = Math.floor(Math.random() * 11) + 1; //Creates a random number between 1 + 12 and sets it to a variable
  let num2 = Math.floor(Math.random() * 11) + 1; //creates a random number between 1 + 12 and sets it to a variable
  let question = "What is " + num1 + " X " + num2; //Uses the variables to concatenate a string that represents a question.
  let answer = num1 * num2; //Uses the variables to come up with the correct answer
  let choices = [answer + Math.floor((Math.random() * 20 + 1)), answer - Math.floor((Math.random() * 5 + 1)), answer + Math.floor((Math.random() * 20 + 1)), answer]; //Creates random options that are close in value to the correct answer
  new Question(question, choices, answer); //Uses the constructor to create new questions
}

//****************************//
//        Science Questions      //
//____________________________ //
// bank of possible science questions to be  created with the question constructor
let scienceBank = [
  ['Who showed that tides were caused by gravitational pull of the moon?', [' Kepler', 'Brahe', 'Copernicus', 'Newton'], 'Newton'],
  ['Who is considered the "father of quantum theory"?', ['Einstein', 'Tesla', 'Bohr', 'Plank'], 'Plank'],
  ['Who did Tesla work for?', ['Einstein', 'Westinghouse', 'Bell', 'Edison'], 'Edison'],
  ['Who developed the theory of relativity?', ['Curie', 'Bohr', 'Edison', 'Einstein'], 'Einstein'],
  ['Who dicovered radium?', ['Newton', 'Copernicus', 'Einstein', 'Curie'], 'Curie'],
  ['Who discovered gravity?', ['Smith', 'Galileo', 'Copernicus', 'Newton'], 'Newton'],
  ['What is the study of plants called?', ['Pathology', 'Geology', 'Plantology', 'Botany'], 'Botany'],
  ['What is the study of animals called?', ['Animology', 'Pathology', 'Embryology', 'Zoology'], 'Zoology'],
  ['What is the oldest of the natural sciences?', ['Biology', 'Geology', 'Chemistry', 'Astronomy'], 'Astronomy'],
  ['What particle is negatively charged?', ['Proton', 'Quark', 'Neutron', 'Electron'], 'Electron'],
  ['What elements symbol is "Fe" ?', ['Fermium', 'Calcium', 'Fluorine', 'Iron'], 'Iron'],
  ['What era was the most recent?', ['Proterozoic', 'Paleozoic', 'Mesozoic', 'Cenozoic'], 'Cenozoic'],
  ['What is the planet closest to the sun?', ['Venus', 'Uranus', 'Neptune', 'Mercury'], 'Mercury'],
  ['What is the largest planet in the solar system?', ['Saturn', 'Uranus', 'Neptune', 'Jupiter'], 'Jupiter'],
  ['What is the leading source of air pollutants?', ['Nitrogen Oxide', 'Sulfur Dioxide', 'Methane', 'Carbon Monoxide'], 'Carbon Monoxide'],
  ['What world city has the least air pollution?', ['Tokyo', 'Toronto', 'Paris', 'Oslo'], 'Oslo'],
  ['What is the basic unit of a chemical compound?', ['Polymer', 'Element', 'Isotope', 'Molecule'], 'Molecule'],
  ['What is the basic unit of a chemical element?', ['Quark', 'Proton', 'Molecule', 'Atom'], 'Atom'],
  ['When was the microscope invented?', ['16th Century', '19th Century', '18th Century', '17th Century'], '17th Century'],
  ['When was hydrogen discovered?', ['1907', '1816', '1876', '1766'], '1766'],
  ['When was paper invented?', ['11th Century', '5th Century', '8th Century', '2nd Century'], '2nd Century'],
  ['When did the US go to the moon?', ['1977', '1972', '1956', '1969'], '1969']
];


let scienceCounter = 0;
// function that uses the question constructor to convert questions from the science bank into questions in the current question bank.
function scienceAdd() {
  new Question(scienceBank[scienceCounter][0], scienceBank[scienceCounter][1], scienceBank[scienceCounter][2]);
  scienceCounter++;
}

//***************************//
//        Question Creator        //  This allows the user to create their own question.
//___________________________ //
//Event listener that makes only the inputs for creating a question display
$('#createQuestion').on('click', () => {
  $('#rules').remove();
  $('#quiz').hide();
  $('#createQuestion').hide();
  $('#creator').show();
});

$('#create').on('click', create);  //Event listener set to run the 'create' function when clicked.

function create() {
  //Prevents an incomplete question from being created.
  if (($('#customQuestion').val() === "" || $('#customAnswer').val() === "") || ($('#customChoice1').val() === "" || $('#customChoice2').val() === "")) {
    $('#customQuestion').val("");
    $('#customAnswer').val("");
    $('#customChoice1').val("");
    $('#customChoice2').val("");
    $('#customChoice3').val("");
    $('#customChoice4').val("");
    $('#custom').hide();
    //Displays feedback to confirm a question was NOT added, and how to fix it.
    $('#canvas').show();
    $('<h2>Question NOT added<h2>').prependTo('#canvas');
    $('<h2>Please add a question, an answer, and at least two choices.</h2>').prependTo('#canvas');
    setTimeout(clear, 3000);
    return;
  }
  //Creates variables to represent what was entered into the input fields.
  let userQuestion = $('#customQuestion').val();
  let userAnswer = $('#customAnswer').val();
  let userChoice1 = $('#customChoice1').val();
  let userChoice2 = $('#customChoice2').val();
  let userChoice3 = $('#customChoice3').val();
  //Uses the constructor to create new questions.
  if (questionBank.length > 2) {
    questionBank.shift();
    $('<h2>Question was removed &</h2>').appendTo('#canvas');
  }
  new Question(userQuestion, [userChoice1, userChoice2, userChoice3, userAnswer], userAnswer);
  //Resets the value of the input fields to be blank.
  $('#customQuestion').val("");
  $('#customAnswer').val("");
  $('#customChoice1').val("");
  $('#customChoice2').val("");
  $('#customChoice3').val("");
  $('#customChoice4').val("");
  $('#custom').hide();
  
  //Displays feedback to confirm that a question was added.
  $('#canvas').show();
  $('<h2>Question was added</h2>').appendTo('#canvas');
  setTimeout(clear, 2000);
}

//***************************//
//         "Done" function        //
//___________________________ //
function done() {
  $('h2').remove();
  $('.choiceBtn').hide();
  $('#scoreBox').hide();

// checks score to display an appropriate message and the final score to the user.
  if (correct === questionCount) {
    $('<h2>' +  correct + ' out of ' + questionCount + ', you got them all right!!</h2>').appendTo('#canvas');
  }
  if (correct > 4 && correct < questionCount) {
    $('<h2>' + correct + ' out of ' + questionCount + ', not bad.</h2>').appendTo('#canvas');
  }
  if (correct < 5) {
    $('<h2>' + correct + ' out of ' + questionCount + ', keep trying, you can do better.</h2>').appendTo('#canvas');
  }
  $('<h2>You scored ' + score +  ' points</h2>').appendTo('#canvas');


//high score functionality simulated throught the use of local storage. 
  if (score >= highScore) {
    $('h2').remove
    $('#canvas').after('<div id="highScoreBox" class="box"></div>')
    $('#canvas').hide();
    $('<h2>New High Score !!</h2>').appendTo('#highScoreBox');
    $('<input id="highName" placeholder="Name">').appendTo('#highScoreBox');
    $('<button id="add">Enter</button>').appendTo('#highScoreBox');

    $('#add').click(() => {
       new HighestScore($('#highName').val(), score);
       scoreLookup = JSON.parse( localStorage.getItem('highScore'))
      $('#highScore').text(`${scoreLookup.name} has the highest score of ${scoreLookup.score}`)
      $('#highScoreBox').remove();
      $('#canvas').show();
    });
  }

// adds an event listener to the "start over" button.
  $('<button class="againBtn">Start Over</button>').appendTo('#canvas');
  const canvas = document.querySelector("#canvas");
  canvas.addEventListener("click", function (e) {
    if (e.target.classList.contains('againBtn')) {
      startOver();
    }
  });
}

//***************************//
//     "Start Over" function    //
//___________________________//
function startOver() {
  questionBank = [];
  questionRandom = [];
  score = 0;
  questionCount = 0;
  currentQ = 0;
  scienceCounter = 0;
  $('#questionsAdded').text(questionBank.length);
  $('#quiz').text('Begin Again')
  clear();
}
//***************************//
//         "Clear" function        //
//___________________________//
function clear() {
  $('h2').remove();
  $('#currentScore').text(score);
  $('#questionsAsked').text(questionCount);
  $('#custom').hide()
  $('#scoreBox').hide();
  $('#canvas').hide();
  $('#creator').hide();
  $('#timer').hide();
  $('#custom').show();
  $('#createQuestion').show();
  $('#quiz').show();
  $('.againBtn').remove();
}








