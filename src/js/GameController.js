import { generateTeam } from "./generators";
import cursors from "./cursors";
import PositionedCharacter from "./PositionedCharacter";
import themes from "./themes";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";
import Daemon from "./characters/Daemon";
import GameState from "./GameState";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.characters = [Bowman, Swordsman, Magician];
    this.positionedCharacters = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    const playerTypes = [Bowman, Swordsman, Magician];
    const enemyTypes = [Vampire, Undead, Daemon];
    const playerTeam = generateTeam(playerTypes, 3, 4);
    const enemyTeam = generateTeam(enemyTypes, 3, 4);
    const playerPositions = this.generatePositions(0, 1, 8);
    const enemyPositions = this.generatePositions(6, 7, 8);

    playerTeam.getCharacters().forEach((character, index) => {
      this.positionedCharacters.push(
        new PositionedCharacter(character, playerPositions[index])
      );
    });
    enemyTeam.getCharacters().forEach((character, index) => {
      this.positionedCharacters.push(
        new PositionedCharacter(character, enemyPositions[index])
      );
    });

    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  generatePositions(col1, col2, rows) {
    const positions = [];
    for (let row = 0; row < rows; row++) {
      positions.push(row * 8 + col1);
      positions.push(row * 8 + col2);
    }
    return positions;
  }

  createTooltipInfo(character) {
    return `${"\u{1F396}"}${character.level} ${"\u{2694}"}${character.attack
      } ${"\u{1F6E1}"}${character.defence} ${"\u{2764}"}${character.health}`;
  }

  onCellClick(index) {
    if (!this.gameState.isPlayerTurn()) {
      this.gamePlay.showError("Сейчас не ваш ход!");
      return;
    }

    if (this.gameState.selectedCharacter === null) {
      this.selectCharacter(index);
      return;
    }

    const selectedCharacter = this.positionedCharacters.find(pc => pc.position === this.gameState.selectedCharacter).character;
    const possibleMoves = this.getPossibleMoves(selectedCharacter, this.gameState.selectedCharacter);
    const possibleAttacks = this.getPossibleAttacks(selectedCharacter, this.gameState.selectedCharacter);

    if (possibleMoves.includes(index)) {
      this.moveCharacter(this.gameState.selectedCharacter, index);
      this.gameState.switchTurn();
    } else if (possibleAttacks.includes(index)) {
      this.attackCharacter(this.gameState.selectedCharacter, index);
      this.gameState.switchTurn();
    }

    this.gamePlay.deselectCell(this.gameState.selectedCharacter);
    this.gameState.selectedCharacter = null;
  }

  selectCharacter(index) {
    const character = this.positionedCharacters.find(pc => pc.position === index)?.character;

    if (!character || !this.characters.includes(character.constructor)) {
      if (typeof this.gamePlay.showError === "function") {
        this.gamePlay.showError("Неверный персонаж или пустая ячейка!");
      } else {
        console.error("showError is not a function");
      }
      return;
    }

    if (this.gameState.selectedCharacter !== null && this.gameState.selectedCharacter !== index) {
      this.gamePlay.deselectCell(this.gameState.selectedCharacter);
    }

    if (this.gameState.selectedCharacter !== index) {
      this.gamePlay.selectCell(index);
      this.gameState.selectedCharacter = index;
    } else {
      this.gamePlay.deselectCell(index);
      this.gameState.selectedCharacter = null;
    }
  }

  moveCharacter(fromIndex, toIndex) {
    const characterToMove = this.positionedCharacters.find(pc => pc.position === fromIndex);
    characterToMove.position = toIndex;
    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  attackCharacter(fromIndex, toIndex) {
    const attacker = this.positionedCharacters.find(pc => pc.position === fromIndex).character;
    const target = this.positionedCharacters.find(pc => pc.position === toIndex).character;

    target.health -= attacker.attack;

    if (target.health <= 0) {
      this.positionedCharacters = this.positionedCharacters.filter(pc => pc.position !== toIndex);
    }

    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  onCellEnter(index) {
    const character = this.positionedCharacters.find(pc => pc.position === index)?.character;
    if (character) {
      const tooltipInfo = this.createTooltipInfo(character);
      this.gamePlay.showCellTooltip(tooltipInfo, index);
    }

    if (this.gameState.selectedCharacter !== null) {
      const selectedCharacter = this.positionedCharacters.find(pc => pc.position === this.gameState.selectedCharacter).character;
      const possibleMoves = this.getPossibleMoves(selectedCharacter, this.gameState.selectedCharacter);
      const possibleAttacks = this.getPossibleAttacks(selectedCharacter, this.gameState.selectedCharacter);

      if (index === this.gameState.selectedCharacter) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.clearCellHighlight(index);
      }

      if (possibleMoves.includes(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.highlightCell(index, "green");
      } else if (possibleAttacks.includes(index)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.highlightCell(index, "red");
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
    this.gamePlay.clearCellHighlight(index);
  }

  getPossibleMoves(character, position) {
    const moves = [];
    const range = this.getMovementRange(character);
    const x = position % 8;
    const y = Math.floor(position / 8);

    for (let dx = -range; dx <= range; dx++) {
      for (let dy = -range; dy <= range; dy++) {
        if (Math.abs(dx) + Math.abs(dy) <= range && (dx !== 0 || dy !== 0)) {
          const newX = x + dx;
          const newY = y + dy;
          if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
            const newPosition = newY * 8 + newX;
            if (!this.positionedCharacters.some(pc => pc.position === newPosition)) {
              moves.push(newPosition);
            }
          }
        }
      }
    }
    return moves;
  }

  getPossibleAttacks(character, position) {
    const attacks = [];
    const range = this.getAttackRange(character);
    const x = position % 8;
    const y = Math.floor(position / 8);

    for (let dx = -range; dx <= range; dx++) {
      for (let dy = -range; dy <= range; dy++) {
        if ((Math.abs(dx) + Math.abs(dy) <= range || (Math.abs(dx) === range && Math.abs(dy) === range)) && (dx !== 0 || dy !== 0)) {
          const newX = x + dx;
          const newY = y + dy;
          if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
            const newPosition = newY * 8 + newX;
            const target = this.positionedCharacters.find(pc => pc.position === newPosition);
            if (target && !this.characters.includes(target.character.constructor)) {
              attacks.push(newPosition);
            }
          }
        }
      }
    }
    return attacks;
  }

  getMovementRange(character) {
    if (character instanceof Swordsman || character instanceof Undead) {
      return 4;
    } else if (character instanceof Bowman || character instanceof Vampire) {
      return 2;
    } else if (character instanceof Magician || character instanceof Daemon) {
      return 1;
    }
    return 0;
  }

  getAttackRange(character) {
    if (character instanceof Swordsman || character instanceof Undead) {
      return 1;
    } else if (character instanceof Bowman || character instanceof Vampire) {
      return 2;
    } else if (character instanceof Magician || character instanceof Daemon) {
      return 4;
    }
    return 0;
  }
}