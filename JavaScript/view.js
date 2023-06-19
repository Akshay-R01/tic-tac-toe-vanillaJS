export default class View {
  $ = {};
  $$ = {};
  constructor() {
    this.$.menu = this.#qs('[data-id="menu"]');
    this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
    this.$.menuItems = this.#qs('[data-id="menu-items"]');
    this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
    this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
    this.$.modal = this.#qs('[data-id="modal"]');
    this.$.modalTxt = this.#qs('[data-id="modal-text"]');
    this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
    this.$.turn = this.#qs('[data-id="turn"]');
    this.$.p1Wins = this.#qs('[data-id = "p1-wins"]');
    this.$.p2Wins = this.#qs('[data-id = "p2-wins"]');
    this.$.ties = this.#qs('[data-id = "ties"]');

    this.$$.squares = this.#qsAll('[data-id="square"]');

    //UI-Only Event Listeners
    this.$.menuBtn.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }
  /**
   * Register all event listeners
   */
  gameResetEvent(handler) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.modalBtn.addEventListener("click", handler);
  }
  gameNewRoundEvent(handler) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }
  playerMoveEvent(handler) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", () => handler(square));
    });
  }

  render(game, stats) {
    const { playerWithStats, ties } = stats;
    const {
      moves,
      currentPlayer,
      status: { isComplete, winner },
    } = game;

    this.#closeAll();
    this.#resetBoard();
    this.#updateScoreboard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
    this.#initMoves(moves);
    if (isComplete) {
      this.#openModal(winner);
      return;
    }
    this.#setTurnIndicator(currentPlayer);
  }
  /**
   * DOM Helper Functions
   */
  #handlePlayerMove(squareEl, player) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    squareEl.replaceChildren(icon);
  }
  #setTurnIndicator(player) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", player.iconClass, player.colorClass);

    const label = document.createElement("p");
    label.classList.add(player.colorClass);
    label.innerText = `${player.name}, You're Up!`;

    this.$.turn.replaceChildren(icon, label);
  }
  #updateScoreboard(p1Wins, p2Wins, ties) {
    this.$.p1Wins.innerText = `${p1Wins} Wins`;
    this.$.p2Wins.innerText = `${p2Wins} Wins`;
    this.$.ties.innerText = `${ties} Ties`;
  }
  #openModal(winner) {
    this.$.modal.classList.remove("hidden");
    this.$.modalTxt.innerText = winner ? `${winner.name} Wins!` : "It's a Tie!";
  }
  #closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }
  #resetBoard() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }
  #initMoves(moves) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);
      if (existingMove) {
        this.#handlePlayerMove(square, existingMove.player);
      }
    });
  }

  #closeModal() {
    this.$.modal.classList.add("hidden");
  }
  #closeMenu() {
    this.$.menuItems.classList.add("hidden");
    this.$.menuBtn.classList.remove("border");

    //to make the arrow rotate when the menu is clicked
    const icon = this.$.menuBtn.querySelector("i");
    icon.classList.remove("fa-chevron-up");
    icon.classList.add("fa-chevron-down");
  }
  #toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
    this.$.menuBtn.classList.toggle("border");

    //to make the arrow rotate when the menu is clicked
    const icon = this.$.menuBtn.querySelector("i");
    icon.classList.toggle("fa-chevron-up");
    icon.classList.toggle("fa-chevron-down");
  }

  /**
   * Helper Functions for querySelectors
   */
  #qs(selector, parent) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);
    if (!el) throw new Error("could not find element");
    return el;
  }
  #qsAll(selector) {
    const elList = document.querySelectorAll(selector);
    if (!elList) throw new Error("Could not find elements");
    return elList;
  }
}
