import { describe, expect, test } from "@jest/globals";
import { calcTileType } from "../utils";

describe('calcTileType', () => {
    const size = 8;

    test('returns "top-left" for the top-left corner', () => {
        expect(calcTileType(0, size)).toBe('top-left');
    });

    test('returns "top-right" for the top-right corner', () => {
        expect(calcTileType(size - 1, size)).toBe('top-right');
    });

    test('returns "bottom-left" for the bottom-left corner', () => {
        expect(calcTileType(size * (size - 1), size)).toBe('bottom-left');
    });

    test('returns "bottom-right" for the bottom-right corner', () => {
        expect(calcTileType(size * size - 1, size)).toBe('bottom-right');
    });

    test('returns "top" for the top edge', () => {
        expect(calcTileType(1, size)).toBe('top');
        expect(calcTileType(size - 2, size)).toBe('top');
    });

    test('returns "bottom" for the bottom edge', () => {
        expect(calcTileType(size * (size - 1) + 1, size)).toBe('bottom');
        expect(calcTileType(size * size - 2, size)).toBe('bottom');
    });

    test('returns "left" for the left edge', () => {
        expect(calcTileType(size, size)).toBe('left');
        expect(calcTileType(size * 2, size)).toBe('left');
    });

    test('returns "right" for the right edge', () => {
        expect(calcTileType(size * 2 - 1, size)).toBe('right');
        expect(calcTileType(size * 3 - 1, size)).toBe('right');
    });

    test('returns "center" for the center cells', () => {
        expect(calcTileType(size + 1, size)).toBe('center');
        expect(calcTileType(size * 2 + 1, size)).toBe('center');
    });
});