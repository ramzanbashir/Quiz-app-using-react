import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./App.css";

function App() {
  const [quiz, setQuiz] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [time, setTime] = useState(60);

  useEffect(() => {
    getDataFromAPI();
  }, []);

  // Timer
  useEffect(() => {
    if (time > 0 && quiz.length) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (time === 0) {
      endQuiz();
    }
  }, [time, quiz]);

  function getDataFromAPI() {
    fetch("https://the-trivia-api.com/v2/questions")
      .then((data) => data.json())
      .then((value) => {
        const formatted = value.map((q) => {
          let options = shuffle([
            ...q.incorrectAnswers,
            q.correctAnswer,
          ]);
          return { ...q, options };
        });
        setQuiz(formatted);
      })
      .catch((err) => console.log(err));
  }

  function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  function handleAnswer() {
    if (!selected) return;

    if (selected === quiz[index].correctAnswer) {
      setScore(score + 1);
    }

    if (index < quiz.length - 1) {
      setIndex(index + 1);
      setSelected("");
    } else {
      endQuiz();
    }
  }

  function endQuiz() {
    Swal.fire({
      title: "Quiz Finished!",
      text: `Your score is ${score}/${quiz.length}`,
      icon: "success",
      confirmButtonText: "Restart",
    }).then(() => {
      restartQuiz();
    });
  }

  function restartQuiz() {
    setIndex(0);
    setScore(0);
    setSelected("");
    setTime(60);
    getDataFromAPI();
  }

  if (!quiz.length) {
    return (
      <img
        src="https://static.wixstatic.com/media/68315b_30dbad1140034a3da3c59278654e1655~mv2.gif"
        width="100%"
        alt="loading"
      />
    );
  }

  return (
    <div className="quiz-container">
      <h1>Quiz App</h1>
      <div className="timer">
     <span className="timer-icon">⏳</span>
      Time Left: {time}s
   </div>

<div className="progress-bar">
  <div
    className="progress-fill"
    style={{ width: `${((index + 1) / quiz.length) * 100}%` }}
  ></div>
</div>



      <h2>{quiz[index].question.text}</h2>

      <div className="options">
        {quiz[index].options.map((option, i) => (
          <label key={i} className="option">
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selected === option}
              onChange={(e) => setSelected(e.target.value)}
            />
            {option}
          </label>
        ))}
      </div>

      <button className="btn" onClick={handleAnswer}>
        {index === quiz.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
}

export default App;
