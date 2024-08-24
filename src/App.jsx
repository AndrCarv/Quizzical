import React, { useEffect, useState } from "react"
import {nanoid} from "nanoid"
import he from "he";
import Game from "./components/Game"
//using he to help to decode special characters


export default function App (){

  //consts
  const [isPlaying, setIsPlaying] = useState(false)
  const [quizData, setQuizData] = useState([])
  const [score, setScore] = useState(0)
  const [checkChoice, setCheckChoice] = useState(false);


  //functions
  function startGame() {
    setIsPlaying(true)
  }

  console.log("QuizData:", quizData)

  //function to shuffle the data
  function shuffleData(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    //id and is held for the answers
    const formattedData = array.map(item => ({
      value: item,
      id: nanoid(5),
      isHeld: false
    }))

    return formattedData;
}

  /* 
  function to select the data to use
  only need id (gonna use nano), question, wrongAnswer, answer, score
  leaving a correctAnswer to check the right answer and also inserting answer together with the wrong ones
  to have a array, so i can render the 4 like the design in random order
  add he decode to fix the special characters
  */
  function quizDataFilter(dataArray){
    let dataFiltered = dataArray.map((data) => ({
      id: nanoid(),
      question: he.decode(data.question),
      correctAnswer: he.decode(data.correct_answer),
      /*wrongAnswers: data.incorrect_answers,
              answers: shuffleArray([
        ...data.incorrect_answers, 
        data.correct_answer
      ])mix wrong with answers so its less 1 line for no reason*/
      //find a way to shuffle the answers, use lodash, react shuffle or manual
      //gonna do manual for now
      answers: shuffleData([
        ...data.incorrect_answers.map(he.decode),
        he.decode(data.correct_answer)
      ]),
      score: 0
    }))
    return dataFiltered
  }

  //select to hold the answer
  function holdAnswer(answerId, questionId) {
    setQuizData((oldQuestions) =>
      oldQuestions.map((data) => {
        if (data.id === questionId) {
          /*const newArray = data.answers.map((answer) => {
            if (answer.id === answerId) {
              return {
                ...answer,
                isHeld: true,
              };
            } else {
              return {
                ...answer,
                isHeld: false,
              };
            }
          });*/
          const newArray = data.answers.map(answer => ({//line to test, if works switch with the above
            ...answer,
            isHeld: answer.id === answerId, // Simplified true/false assignment
          }))
          return {
            ...data,
            answers: newArray,
          };
        } else {
          return data;
        }
      })
    );
  }

  //function to check the questions, and will act depending what was the selected answers
  //the styles will be applied in the Question Component
  function checkQuestions() {
    setScore(0);
    setQuizData((prevData) =>
      prevData.map((data) => {
        let checkedAnswers = data.answers.map((answer) => {
          if (answer.isHeld && data.correctAnswer === answer.value) {//checked right answer, green and +1score
            setScore((prevScore) => prevScore + 1);
            return {
              ...answer,
              isCheckedCorrect: true,
            };
          } else if (answer.isHeld && data.correctAnswer !== answer.value) {//checked wrong answer
            return {
              ...answer,
              isCheckedWrong: true,
            };
          } else if (!answer.isHeld && data.correctAnswer === answer.value) {//to show the right answer
            return {
              ...answer,
              isCheckedCorrect: true,
            };
          } else {
            return {//display choice as faded
              ...answer,
              isFaded: true,
            };
          }
        });
        return {
          ...data,
          answers: checkedAnswers,
        };
      })
    );
    setCheckChoice(true);
  }

  //funciton to restart
  function restartGame() {
    setIsPlaying(false);
    setScore(0);
    setCheckChoice(false);
    setTimeout(() => startGame(), 0);
  }
  
  //useEffects
  //https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple

  //Hook to fetch the API info
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple")
      .then(res => res.json())
      .then(data => {
        console.log(data); // Log the entire data object
        //data recieved a prototype and a result, gotta use .result
        console.log("Number of questions received:", data.results.length); 
        //ok it returned the 5
        setQuizData(quizDataFilter(data.results))
      })
  }, [isPlaying])

//some classNames might be temporary, remenber to change after if needed
  return (
    <main>
      <img className="blob-top" src="./src/assets/blob-top.png"/>
      {!isPlaying ? (
        <div className="intro-container">
          <div className="intro-display">
            <h1 className="intro-title">Quizzical</h1>
            <p className="intro-text">Time to test your knowledge.<br /><br />
            Press the button to start the Quiz
            </p>
            <button
              className="intro-button"
              onClick={startGame}>
              Start Quiz
            </button>
          </div>
        </div>
        ) : (
          <Game 
            key = {nanoid()}
            quizData = {quizData}
            setQuizData = {setQuizData}
            holdAnswer = {holdAnswer}
            checkQuestions = {checkQuestions}
            //boolean to see if the choice has been selected
            checkChoice = {checkChoice}
            setCheckChoice = {setCheckChoice}
            //
            score = {score}
            setScore = {setScore}
            restartGame = {restartGame}            
          />
        )}
      <img className="blob-bottom" src="./src/assets/blob-bottom.png"/>
    </main>
  )
}

//move Game to a diff file, code getting too big