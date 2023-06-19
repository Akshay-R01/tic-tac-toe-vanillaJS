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
  const store = new Store(players);

  // WHEN A PLAYER MAKES A MOVE
  view.playerMoveEvent((square) => {
    //check if the square's been played
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );
    if (existingMove) {
      return;
    }
    // set the icon for the player in the current square
    view.handlePlayerMove(square, store.game.currentPlayer);

    // update the state
    store.playerMove(+square.id);

    //check if the game is complete
    if (store.game.status.isComplete) {
      view.openModal(
        store.game.status.winner
          ? `${store.game.status.winner.name} Wins!`
          : "Tie!"
      );
      return;
    }

    // update the turn indicator for the next player
    view.setTurnIndicator(store.game.currentPlayer);
  });

  // RESET BOARD
  view.gameResetEvent((event) => {
    view.closeAll();
    store.reset();
    view.resetBoard();
    view.setTurnIndicator(players[0]);
    view.updateScoreboard(
      store.stats.playerWithStats[0].wins,
      store.stats.playerWithStats[1].wins,
      store.stats.ties
    );
  });

  //NEW ROUND
  view.gameNewRoundEvent((event) => {
    store.newRound();
    view.closeAll();
    view.resetBoard();
    view.setTurnIndicator(players[0]);
    view.updateScoreboard(
      store.stats.playerWithStats[0].wins,
      store.stats.playerWithStats[1].wins,
      store.stats.ties
    );
  });
}

window.addEventListener("load", init);
