import { characterGenerator, generateTeam } from '../generators';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Vampire from '../characters/Vampire';
import Undead from '../characters/Undead';
import Daemon from '../characters/Daemon';
import { beforeEach, describe, expect, test } from '@jest/globals';

describe('characterGenerator', () => {
    let generator;

    beforeEach(() => {
        const allowedTypes = [Bowman, Swordsman, Magician, Vampire, Undead, Daemon];
        generator = characterGenerator(allowedTypes, 3);
    });

    test('generates characters indefinitely', () => {
        for (let i = 0; i < 100; i++) {
            const character = generator.next().value;
            expect([Bowman, Swordsman, Magician, Vampire, Undead, Daemon]).toContainEqual(character.constructor);
        }
    });

    test('generates characters within the specified level range', () => {
        for (let i = 0; i < 100; i++) {
            const character = generator.next().value;
            expect(character.level).toBeGreaterThanOrEqual(1);
            expect(character.level).toBeLessThanOrEqual(3);
        }
    });
});

describe('generateTeam', () => {
    test('generates a team with the correct number of characters', () => {
        const allowedTypes = [Bowman, Swordsman, Magician, Vampire, Undead, Daemon];
        const team = generateTeam(allowedTypes, 3, 4);
        expect(team.getCharacters().length).toBe(4);
    });

    test('generates characters within the specified level range', () => {
        const allowedTypes = [Bowman, Swordsman, Magician, Vampire, Undead, Daemon];
        const team = generateTeam(allowedTypes, 3, 4);
        const characters = team.getCharacters();
        characters.forEach(character => {
            expect(character.level).toBeGreaterThanOrEqual(1);
            expect(character.level).toBeLessThanOrEqual(3);
        });
    });

    test('generates characters from the allowed types', () => {
        const allowedTypes = [Bowman, Swordsman, Magician, Vampire, Undead, Daemon];
        const team = generateTeam(allowedTypes, 3, 4);
        const characters = team.getCharacters();
        characters.forEach(character => {
            expect([Bowman, Swordsman, Magician, Vampire, Undead, Daemon]).toContainEqual(character.constructor);
        });
    });
});