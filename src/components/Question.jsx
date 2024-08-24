import React from "react"

export default function Question(props){

  //functions to get the colors for the buttons
    function buttonStyle(item) {
        let myStyle = {};
    
        if (item.isCheckedWrong) {//make it green
          myStyle = {
            backgroundColor: "#F8BCBC",
            border: "none",
          };
        } else if (item.isCheckedCorrect) {//make it red
          myStyle = {
            backgroundColor: "#94D7A2",
            border: "none",
          };
        } else if (item.isFaded) {//gray it out when selected
          myStyle = {
            opacity: 0.5,
          };
        } else {
          myStyle = {
            backgroundColor: item.isHeld ? "#D6DBF5" : "#f5f7fb",
          };
        }
        return myStyle;
      }
    
    //list all the answers
    const listAnswers = props.answers.map(item => (
        <button
            key={item.id}
            className="question-answers"
            onClick={() => props.holdAnswer(
                item.id, props.questionId
            )}
            //isHeld={props.isHeld}
            style={buttonStyle(item)}
        >{item.value}</button>
    ))

    return (
        <div>
            <h3 className="question">{props.question}</h3>               
            {listAnswers}
        </div>
    )
}