import React, { useEffect, useState } from 'react';
import Die from './Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import './App.css';

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [gameDuration, setGameDuration] = useState(JSON.parse(localStorage.getItem('gameDuration')) || [])

  useEffect(() => {
    localStorage.setItem('gameDuration', JSON.stringify(gameDuration))
  }, [gameDuration])

  useEffect(() => {
    if (seconds > 0 && timerActive) {
      setTimeout(setSeconds, 1000, seconds + 1);
    } else {
      setTimerActive(false);
    }
  }, [seconds, timerActive]);


  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      setTimerActive(false);
      setGameDuration(oldDurations => [...oldDurations, seconds+1])
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    return Array.from({ length: 10 }, () => generateNewDie())
  }

  function rollDice() {
    if (!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? die : generateNewDie()
      }))
    } else {
      setTenzies(false);
      setSeconds(0);
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?
        { ...die, isHeld: !die.isHeld } :
        die
    }))
    const holdArr = dice.filter(die => die.isHeld === true);
    if(holdArr.length === 1) {
            setTimerActive(!timerActive);
            setSeconds(1);
          }
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        {tenzies
          ? "Congratulations, You Have Won!"
          : `Roll until all dice are the same. 
          \nClick each die to freeze it at its current value between rolls.`
        }
      </p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button
        className="roll-dice"
        onClick={rollDice}
      >
        {tenzies ? "New Game" : "Roll"}
      </button>

      <p className="instructions">
        Game duration: <strong>{seconds}</strong> seconds
        <br/>
        <br/>
        Your best result: <strong>{gameDuration.length>0 ? Math.min(...gameDuration): 0}</strong> seconds
      </p>
    </main>
  )
}

