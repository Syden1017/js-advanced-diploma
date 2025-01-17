import GameController from '../GameController';
import Bowman from '../characters/Bowman';
import PositionedCharacter from '../PositionedCharacter';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import GamePlay from '../GamePlay';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';

describe('GameController', () => {
    let gameController;
    let gamePlayMock;

    beforeEach(() => {
        gamePlayMock = {
            bindToDOM: jest.fn(),
            drawUi: jest.fn(),
            redrawPositions: jest.fn(),
            addCellEnterListener: jest.fn(),
            addCellLeaveListener: jest.fn(),
            showCellTooltip: jest.fn(),
            hideCellTooltip: jest.fn(),
        };
        gameController = new GameController(gamePlayMock, {});
    });

    test('should create correct tooltip info', () => {
        const bowman = new Bowman(1);
        const tooltipInfo = gameController.createTooltipInfo(bowman);
        expect(tooltipInfo).toBe('🎖1 ⚔25 🛡25 ❤50');
    });

    test('should show tooltip on cell enter if character exists', () => {
        const bowman = new Bowman(1);
        gameController.positionedCharacters = [new PositionedCharacter(bowman, 0)];
        gameController.onCellEnter(0);
        expect(gamePlayMock.showCellTooltip).toHaveBeenCalledWith('🎖1 ⚔25 🛡25 ❤50', 0);
    });

    test('should not show tooltip on cell enter if character does not exist', () => {
        gameController.positionedCharacters = [];
        gameController.onCellEnter(0);
        expect(gamePlayMock.showCellTooltip).not.toHaveBeenCalled();
    });

    test('should hide tooltip on cell leave', () => {
        gameController.onCellLeave(0);
        expect(gamePlayMock.hideCellTooltip).toHaveBeenCalledWith(0);
    });
});

describe('GameController', () => {
    let gameController;
    let gamePlay;

    beforeEach(() => {
        gamePlay = new GamePlay();
        gameController = new GameController(gamePlay, {});
    });

    test('getMovementRange should return correct value for Swordsman', () => {
        const swordsman = new Swordsman();
        expect(gameController.getMovementRange(swordsman)).toBe(4);
    });

    test('getMovementRange should return correct value for Bowman', () => {
        const bowman = new Bowman();
        expect(gameController.getMovementRange(bowman)).toBe(2);
    });

    test('getMovementRange should return correct value for Magician', () => {
        const magician = new Magician();
        expect(gameController.getMovementRange(magician)).toBe(1);
    });

    test('getAttackRange should return correct value for Swordsman', () => {
        const swordsman = new Swordsman();
        expect(gameController.getAttackRange(swordsman)).toBe(1);
    });

    test('getAttackRange should return correct value for Bowman', () => {
        const bowman = new Bowman();
        expect(gameController.getAttackRange(bowman)).toBe(2);
    });

    test('getAttackRange should return correct value for Magician', () => {
        const magician = new Magician();
        expect(gameController.getAttackRange(magician)).toBe(4);
    });
});