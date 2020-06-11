import React, { useEffect, useReducer } from "react";
import produce from "immer";
import _ from "lodash";
import "./styles.css";

const initialState = {
  visibleCards: new Set(),
  currentTurn: new Set()
};

function startNewTurn(state, cards) {
  const turnCards = Array.from(state.currentTurn);
  if (turnCards.every(c => cards[c] === cards[turnCards[0]])) {
    state.visibleCards = new Set([...state.visibleCards, ...state.currentTurn]);
  }
  state.currentTurn = new Set();
}

const reducer = produce((state, { type, payload }) => {
  const { cards } = payload;
  if (state.currentTurn.size === 2) {
    startNewTurn(state, cards);
  }

  if (type === "click") {
    const { idx } = payload;
    if (!state.currentTurn.has(idx) && !state.visibleCards.has(idx)) {
      state.currentTurn.add(payload.idx);
    }
  }
});

function MemoryGame(props) {
  const { cards } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(
    function() {
      const timer = setTimeout(function() {
        dispatch({ type: "timeout", payload: { cards } });
      }, 2000);
      return function cancel() {
        clearTimeout(timer);
      };
    },
    [state.currentTurn]
  );

  function cardClasses(state, idx) {
    let res = "card";
    if (state.visibleCards.has(idx) || state.currentTurn.has(idx)) {
      res += " visible";
    }
    return res;
  }

  return (
    <div className="game">
      <ul>
        {cards.map((val, idx) => (
          <li
            className={cardClasses(state, idx)}
            onClick={() => dispatch({ type: "click", payload: { idx, cards } })}
          >
            {val}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const cards = _.shuffle([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
  return (
    <div className="App">
      <MemoryGame cards={cards} />
    </div>
  );
}
