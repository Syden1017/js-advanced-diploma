export default class GameState {
  constructor() {
    this.currentTurn = 'player';
    this.selectedCharacter = null;
  }

  switchTurn() {
    this.currentTurn = this.currentTurn === 'player' ? 'computer' : 'player';
  }

  isPlayerTurn() {
    return this.currentTurn === 'player';
  }

  static from(object) {
    // TODO: create object
    const gameState = new GameState();
    if (object) {
      gameState.currentTurn = object.currentTurn || "player";
      gameState.selectedCharacter = object.selectedCharacter || null;
    }
    return gameState;
  }
}
