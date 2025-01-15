import { generateTeam } from "./generators";
import PositionedCharacter from "./PositionedCharacter"
import themes from "./themes";
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie)

    const playerTypes = [Bowman, Swordsman, Magician];
    const enemyTypes = [Vampire, Undead, Daemon];

    const playerTeam = generateTeam(playerTypes, 3, 4);
    const enemyTeam = generateTeam(enemyTypes, 3, 4);

    const playerPositions = this.generatePositions(0, 1, 8);
    const enemyPositions = this.generatePositions(6, 7, 8);

    this.positionedCharacters = [];

    playerTeam.getCharacters().forEach((character, index) => {
      this.positionedCharacters.push(new PositionedCharacter(character, playerPositions[index]));
    });

    enemyTeam.getCharacters().forEach((character, index) => {
      this.positionedCharacters.push(new PositionedCharacter(character, enemyPositions[index]));
    });

    this.gamePlay.redrawPositions(this.positionedCharacters);

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  generatePositions(col1, col2, rows) {
    const positions = []
    for (let row = 0; row < rows; row++) {
      positions.push(row * 8 + col1)
      positions.push(row * 8 + col2)
    }
    return positions
  }

  createTooltipInfo(character) {
    return `${'\u{1F396}'}${character.level} ${'\u{2694}'}${character.attack} ${'\u{1F6E1}'}${character.defence} ${'\u{2764}'}${character.health}`;
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const character = this.positionedCharacters.find(pc => pc.position === index)?.character;
    if (character) {
      const tooltipInfo = this.createTooltipInfo(character);
      this.gamePlay.showCellTooltip(tooltipInfo, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }
}
