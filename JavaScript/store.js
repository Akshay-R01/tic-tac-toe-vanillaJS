const initialValue = {
  currentGameMoves: [],
  history: {
    currentRoundGames: [],
    allGames: [],
  },
};
export default class Store extends EventTarget {
  constructor(key, players) {
    super();
    this.storageKey = key;
    this.players = players;
  }

  //Getting Game Status
  get stats() {
    const state = this.#getState();
    return {
      playerWithStats: this.players.map((player) => {
        const wins = state.history.currentRoundGames.filter(
          (game) => game.status.winner?.id === player.id
        ).length;
        return {
          ...player,
          wins,
        };
      }),
      ties: state.history.currentRoundGames.filter(
        (game) => game.status.winner === null
      ).length,
    };
  }
  get game() {
    const state = this.#getState();
    const currentPlayer = this.players[state.currentGameMoves.length % 2];
    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];
    let winner = null;

    for (const player of this.players) {
      const selectedSquares = state.currentGameMoves
        .filter((move) => move.player.id === player.id)
        .map((move) => move.squareId);
      for (const pattern of winningPatterns) {
        if (pattern.every((v) => selectedSquares.includes(v))) {
          winner = player;
        }
      }
    }
    return {
      moves: state.currentGameMoves,
      currentPlayer,
      status: {
        isComplete: winner != null || state.currentGameMoves.length === 9,
        winner,
      },
    };
  }

  //update the state on player move
  playerMove(squareId) {
    const clonedState = structuredClone(this.#getState());
    clonedState.currentGameMoves.push({
      squareId,
      player: this.game.currentPlayer,
    });
    this.#saveState(clonedState);
  }

  //state updates on "reset" and "new roundI"
  reset() {
    const { status, moves } = this.game;
    const clonedState = structuredClone(this.#getState());

    if (status.isComplete) {
      clonedState.history.currentRoundGames.push({
        moves,
        status,
      });
    }
    clonedState.currentGameMoves = [];

    this.#saveState(clonedState);
  }
  newRound() {
    this.reset();
    const stateClone = structuredClone(this.#getState());
    stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
    stateClone.history.currentRoundGames = [];
    this.#saveState(stateClone);
  }
  //helper functions
  #getState() {
    const item = window.localStorage.getItem(this.storageKey);
    return item ? JSON.parse(item) : initialValue;
  }
  #saveState(stateOrFn) {
    const prevState = this.#getState();
    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invalid argument passed in saveState");
    }
    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
    this.dispatchEvent(new Event("stateChange"));
  }
}
