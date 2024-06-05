//css
import './App.css';

//react
import { useCallback, useEffect, useState } from 'react'

//data 
import { wordsList } from './data/words';

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
]

const guessesQty = 3

function App() {

  //declaração de estados
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  //estados de letras adivinhadas
  const [guessedLetters, setGuessedLetters] = useState([]);

  //estado de letras erradas
  const [wrongLetters, setWrongLetters] = useState([]);
  //tentativas do usuário 
  const [guesses, setGuesses] = useState(guessesQty);
  //pontuacao usuário
  const [score, setScore] = useState(0);



  //--------------------------------------


  //função para escolher categoria ou palavra
  const pickWordAndCategory = useCallback(() => {
    //escolhendo aleatóriamente uma categoria
    const categories = Object.keys(words)
    //sorteando aleatoriamente uma categoria
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];


    //escolhendo de forma aleatória uma palavra
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category }
  },[words]);


  // stade de inicio do game
  const startGame = useCallback(() => {

    //resentando letras
    clearLetterStates();

    // escolher categoria e palavra aleatoriamente
    const { word, category } = pickWordAndCategory();

    //criando uma array de letras
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());


    console.log(wordLetters)

    //preenchendo os estados
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name)
  }, [pickWordAndCategory]);

  //processamento de letras

  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();

    // verifica se a letra já foi utilizada

    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    // incluir letras certas ou erradas

    if (letters.includes(normalizedLetter)) {

      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }

  };


  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);

  }


  useEffect(() => {

    if (guesses <= 0) {
      //resetar todos os states
      clearLetterStates();
      setGameStage(stages[2].name);

    }

  }, [guesses])

  //checar condição de vitoria

  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    //condição de vitória

    if (guessedLetters.length === uniqueLetters.length) {
      //adicionar score
      setScore((actualScore) => actualScore += 100)

      //resetar jogo para nova palavra
      startGame();

    }

  }, [guessedLetters, letters, startGame])

  //reiniciar jogo
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
