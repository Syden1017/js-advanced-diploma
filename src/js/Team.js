/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  // TODO: write your logic here
  constructor(characters) {
    this.characters = characters;
  }

  addCharacter(character) {
    this.characters.push(character);
  }

  removeCharacter(index) {
    if (index >= 0 && index < this.characters.length) {
      this.characters.splice(index, 1);
    } else {
      throw new Error('Invalid index');
    }
  }

  getCharacters() {
    return this.characters;
  }
}
