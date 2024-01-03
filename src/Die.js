import React from "react"

export default function Die({ isHeld, value, holdDice }) {
const style = {
backgroundColor: isHeld ? "#59E391" : "white",
backgroundImage: `url(images/${value}.png)`,
};
  return (
    <div
      className="die-face"
      style={style}
      onClick={holdDice}
    >
    </div>
  )
}