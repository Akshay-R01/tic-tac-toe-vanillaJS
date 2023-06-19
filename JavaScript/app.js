import Store from "./store.js";
import View from "./view.js";

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "yellow",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "turquoise",
  },
];

function init() {
  const view = new View();
  const store = new Store("game-key", players);

  //When the current tab is updated
  store.addEventListener("stateChange", () => {
    view.render(store.game, store.stats);
  });

  //when a different tab is updated
  window.addEventListener("storage", () => {
    console.log("State changed from another tab");
    view.render(store.game, store.stats);
  });

  /**
   * ----------RENDERING THE FIRST TIME-------------
   * Closing the modal and the menu
   * Resetting the board
   * Setting the turn Indicator
   * Updating the Score-Board
   * Initialising the moves from the current state
   */
  view.render(store.game, store.stats);

  // WHEN A PLAYER MAKES A MOVE
  view.playerMoveEvent((square) => {
    //check if the square's been played
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );
    if (existingMove) {
      return;
    }
    // update the state
    store.playerMove(+square.id);
  });

  // RESET BOARD
  view.gameResetEvent((event) => {
    store.reset();
  });

  //NEW ROUND
  view.gameNewRoundEvent((event) => {
    store.newRound();
  });
}

window.addEventListener("load", init);
