import Character from '../Character';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Vampire from '../characters/Vampire';
import Undead from '../characters/Undead';
import Daemon from '../characters/Daemon';
import { describe, expect, test } from '@jest/globals';

describe('Character', () => {
    test('throws an error when instantiated directly', () => {
        expect(() => new Character(1)).toThrow('Cannot construct Character instances directly');
    });

    test('does not throw an error when instantiated through a subclass', () => {
        expect(() => new Bowman(1)).not.toThrow();
        expect(() => new Swordsman(1)).not.toThrow();
        expect(() => new Magician(1)).not.toThrow();
        expect(() => new Vampire(1)).not.toThrow();
        expect(() => new Undead(1)).not.toThrow();
        expect(() => new Daemon(1)).not.toThrow();
    });

    test('creates characters with correct attributes for level 1', () => {
        const bowman = new Bowman(1);
        expect(bowman.level).toBe(1);
        expect(bowman.attack).toBe(25);
        expect(bowman.defence).toBe(25);
        expect(bowman.health).toBe(50);
        expect(bowman.type).toBe('bowman');

        const swordsman = new Swordsman(1);
        expect(swordsman.level).toBe(1);
        expect(swordsman.attack).toBe(40);
        expect(swordsman.defence).toBe(10);
        expect(swordsman.health).toBe(50);
        expect(swordsman.type).toBe('swordsman');

        const magician = new Magician(1);
        expect(magician.level).toBe(1);
        expect(magician.attack).toBe(10);
        expect(magician.defence).toBe(40);
        expect(magician.health).toBe(50);
        expect(magician.type).toBe('magician');

        const vampire = new Vampire(1);
        expect(vampire.level).toBe(1);
        expect(vampire.attack).toBe(25);
        expect(vampire.defence).toBe(25);
        expect(vampire.health).toBe(50);
        expect(vampire.type).toBe('vampire');

        const undead = new Undead(1);
        expect(undead.level).toBe(1);
        expect(undead.attack).toBe(40);
        expect(undead.defence).toBe(10);
        expect(undead.health).toBe(50);
        expect(undead.type).toBe('undead');

        const daemon = new Daemon(1);
        expect(daemon.level).toBe(1);
        expect(daemon.attack).toBe(10);
        expect(daemon.defence).toBe(10);
        expect(daemon.health).toBe(50);
        expect(daemon.type).toBe('daemon');
    });
});