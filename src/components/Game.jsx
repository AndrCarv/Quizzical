import React from "react"
import Question from "./Question"

export default function Game(props) {
    
    //create the element for the question
    let questionElements = props.quizData.map(data => (
        <div key= {data.id} className="quizz-container-question">
            <Question 
                questionId = {data.id}
                quizData = {props.quizData}
                setQuizData = {props.setQuizData}
                holdAnswer = {props.holdAnswer}
                question = {data.question}
                answer = {data.correctAnswer}
                answers = {data.answers}
                score = {props.score}
                setScore = {props.setScore}
            />
            <hr />
        </div>
    ))

    return (
        <div className="quizz-container">
            {questionElements}
            {/*Condition to check if the answers
            have been selected. add the container result here too so both buttons are leveled*/}
            {!props.checkChoice ? (
                <div className = "quizz-container-result">
                    <button
                        className = "quizz-button"
                        onClick = {() => props.checkQuestions()}
                    >Check Answers</button>
                </div>
            ) : (
                <div className = "quizz-container-result">
                    <h2>You scored {props.score}/5 correct answers</h2>
                    <button
                        className = "quizz-button"
                        onClick = {() => props.restartGame()}>
                        Play Again??
                    </button>
                </div>
            )}
        </div>
       
    )
}  