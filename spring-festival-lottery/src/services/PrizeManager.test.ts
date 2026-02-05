/**
 * 春晚庙会抽奖系统 - 奖品管理器单元测试
 * 
 * 测试 PrizeManager 类的各项功能
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PrizeManager } from './PrizeManager';
import { Prize } from '../types';

describe('PrizeManager', () => {
  let manager: PrizeManager;

  beforeEach(() => {
    manager = new PrizeManager();
  });

  describe('addPrize', () => {
    it('should add a valid prize with all fields', () => {
      const prize = manager.addPrize('一等奖', 5, 'iPhone 15 Pro');

      expect(prize).toBeDefined();
      expect(prize.id).toBeDefined();
      expect(prize.id).toMatch(/^prize-\d+-\d+$/);
      expect(prize.name).toBe('一等奖');
      expect(prize.totalCount).toBe(5);
      expect(prize.remainingCount).toBe(5);
      expect(prize.description).toBe('iPhone 15 Pro');
    });

    it('should add a valid prize without description', () => {
      const prize = manager.addPrize('二等奖', 10);

      expect(prize).toBeDefined();
      expect(prize.name).toBe('二等奖');
      expect(prize.totalCount).toBe(10);
      expect(prize.remainingCount).toBe(10);
      expect(prize.description).toBeUndefined();
    });

    it('should trim whitespace from name and description', () => {
      const prize = manager.addPrize('  三等奖  ', 15, '  小米手环  ');

      expect(prize.name).toBe('三等奖');
      expect(prize.description).toBe('小米手环');
    });

    it('should generate unique IDs for different prizes', () => {
      const prize1 = manager.addPrize('奖品1', 1);
      const prize2 = manager.addPrize('奖品2', 1);

      expect(prize1.id).not.toBe(prize2.id);
    });

    it('should throw error for empty name', () => {
      expect(() => manager.addPrize('', 5)).toThrow('Prize name must be a non-empty string');
    });

    it('should throw error for whitespace-only name', () => {
      expect(() => manager.addPrize('   ', 5)).toThrow('Prize name must be a non-empty string');
    });

    it('should throw error for name exceeding 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(() => manager.addPrize(longName, 5)).toThrow('Prize name must not exceed 50 characters');
    });

    it('should throw error for non-string name', () => {
      expect(() => manager.addPrize(123 as any, 5)).toThrow('Prize name must be a non-empty string');
    });

    it('should throw error for zero count', () => {
      expect(() => manager.addPrize('奖品', 0)).toThrow('Prize count must be a positive integer');
    });

    it('should throw error for negative count', () => {
      expect(() => manager.addPrize('奖品', -5)).toThrow('Prize count must be a positive integer');
    });

    it('should throw error for non-integer count', () => {
      expect(() => manager.addPrize('奖品', 5.5)).toThrow('Prize count must be an integer');
    });

    it('should throw error for non-number count', () => {
      expect(() => manager.addPrize('奖品', '5' as any)).toThrow('Prize count must be a number');
    });

    it('should throw error for count exceeding 10000', () => {
      expect(() => manager.addPrize('奖品', 10001)).toThrow('Prize count must not exceed 10000');
    });

    it('should throw error for non-string description', () => {
      expect(() => manager.addPrize('奖品', 5, 123 as any)).toThrow('Prize description must be a string');
    });

    it('should accept count at boundary (1)', () => {
      const prize = manager.addPrize('奖品', 1);
      expect(prize.totalCount).toBe(1);
    });

    it('should accept count at boundary (10000)', () => {
      const prize = manager.addPrize('奖品', 10000);
      expect(prize.totalCount).toBe(10000);
    });
  });

  describe('updatePrizeCount', () => {
    it('should update prize count successfully', () => {
      const prize = manager.addPrize('一等奖', 10);
      manager.updatePrizeCount(prize.id, 5);

      const prizes = manager.getAllPrizes();
      expect(prizes[0].remainingCount).toBe(5);
    });

    it('should allow updating count to zero', () => {
      const prize = manager.addPrize('一等奖', 10);
      manager.updatePrizeCount(prize.id, 0);

      const prizes = manager.getAllPrizes();
      expect(prizes[0].remainingCount).toBe(0);
    });

    it('should throw error for non-existent prize ID', () => {
      expect(() => manager.updatePrizeCount('non-existent-id', 5)).toThrow('Prize with ID non-existent-id not found');
    });

    it('should throw error for empty prize ID', () => {
      expect(() => manager.updatePrizeCount('', 5)).toThrow('Prize ID must be a non-empty string');
    });

    it('should throw error for negative count', () => {
      const prize = manager.addPrize('一等奖', 10);
      expect(() => manager.updatePrizeCount(prize.id, -1)).toThrow('Prize count must be non-negative');
    });

    it('should throw error for non-integer count', () => {
      const prize = manager.addPrize('一等奖', 10);
      expect(() => manager.updatePrizeCount(prize.id, 5.5)).toThrow('Prize count must be an integer');
    });

    it('should throw error for non-number count', () => {
      const prize = manager.addPrize('一等奖', 10);
      expect(() => manager.updatePrizeCount(prize.id, '5' as any)).toThrow('Prize count must be a number');
    });

    it('should throw error for count exceeding 10000', () => {
      const prize = manager.addPrize('一等奖', 10);
      expect(() => manager.updatePrizeCount(prize.id, 10001)).toThrow('Prize count must not exceed 10000');
    });

    it('should accept count at boundary (0)', () => {
      const prize = manager.addPrize('一等奖', 10);
      manager.updatePrizeCount(prize.id, 0);
      expect(manager.getAllPrizes()[0].remainingCount).toBe(0);
    });

    it('should accept count at boundary (10000)', () => {
      const prize = manager.addPrize('一等奖', 10);
      manager.updatePrizeCount(prize.id, 10000);
      expect(manager.getAllPrizes()[0].remainingCount).toBe(10000);
    });
  });

  describe('removePrize', () => {
    it('should remove prize successfully', () => {
      const prize = manager.addPrize('一等奖', 5);
      manager.removePrize(prize.id);

      const prizes = manager.getAllPrizes();
      expect(prizes).toHaveLength(0);
    });

    it('should remove correct prize when multiple prizes exist', () => {
      const prize1 = manager.addPrize('一等奖', 5);
      const prize2 = manager.addPrize('二等奖', 10);
      const prize3 = manager.addPrize('三等奖', 15);

      manager.removePrize(prize2.id);

      const prizes = manager.getAllPrizes();
      expect(prizes).toHaveLength(2);
      expect(prizes.find(p => p.id === prize1.id)).toBeDefined();
      expect(prizes.find(p => p.id === prize2.id)).toBeUndefined();
      expect(prizes.find(p => p.id === prize3.id)).toBeDefined();
    });

    it('should throw error for non-existent prize ID', () => {
      expect(() => manager.removePrize('non-existent-id')).toThrow('Prize with ID non-existent-id not found');
    });

    it('should throw error for empty prize ID', () => {
      expect(() => manager.removePrize('')).toThrow('Prize ID must be a non-empty string');
    });
  });

  describe('getAllPrizes', () => {
    it('should return empty array when no prizes exist', () => {
      const prizes = manager.getAllPrizes();
      expect(prizes).toEqual([]);
    });

    it('should return all prizes', () => {
      manager.addPrize('一等奖', 5);
      manager.addPrize('二等奖', 10);
      manager.addPrize('三等奖', 15);

      const prizes = manager.getAllPrizes();
      expect(prizes).toHaveLength(3);
    });

    it('should return prizes with zero remaining count', () => {
      const prize = manager.addPrize('一等奖', 5);
      manager.updatePrizeCount(prize.id, 0);

      const prizes = manager.getAllPrizes();
      expect(prizes).toHaveLength(1);
      expect(prizes[0].remainingCount).toBe(0);
    });

    it('should return a copy of the prizes array', () => {
      manager.addPrize('一等奖', 5);
      const prizes1 = manager.getAllPrizes();
      const prizes2 = manager.getAllPrizes();

      expect(prizes1).not.toBe(prizes2);
      expect(prizes1).toEqual(prizes2);
    });

    it('should not allow external modification of internal state', () => {
      manager.addPrize('一等奖', 5);
      const prizes = manager.getAllPrizes();
      
      // Try to modify the returned array
      prizes.push({
        id: 'fake-id',
        name: '假奖品',
        totalCount: 100,
        remainingCount: 100,
      });

      // Internal state should not be affected
      const actualPrizes = manager.getAllPrizes();
      expect(actualPrizes).toHaveLength(1);
    });
  });

  describe('getAvailablePrizes', () => {
    it('should return empty array when no prizes exist', () => {
      const prizes = manager.getAvailablePrizes();
      expect(prizes).toEqual([]);
    });

    it('should return only prizes with remaining count > 0', () => {
      const prize1 = manager.addPrize('一等奖', 5);
      const prize2 = manager.addPrize('二等奖', 10);
      const prize3 = manager.addPrize('三等奖', 15);

      manager.updatePrizeCount(prize2.id, 0);

      const availablePrizes = manager.getAvailablePrizes();
      expect(availablePrizes).toHaveLength(2);
      expect(availablePrizes.find(p => p.id === prize1.id)).toBeDefined();
      expect(availablePrizes.find(p => p.id === prize2.id)).toBeUndefined();
      expect(availablePrizes.find(p => p.id === prize3.id)).toBeDefined();
    });

    it('should return empty array when all prizes have zero count', () => {
      const prize1 = manager.addPrize('一等奖', 5);
      const prize2 = manager.addPrize('二等奖', 10);

      manager.updatePrizeCount(prize1.id, 0);
      manager.updatePrizeCount(prize2.id, 0);

      const availablePrizes = manager.getAvailablePrizes();
      expect(availablePrizes).toEqual([]);
    });

    it('should return all prizes when all have remaining count > 0', () => {
      manager.addPrize('一等奖', 5);
      manager.addPrize('二等奖', 10);
      manager.addPrize('三等奖', 15);

      const availablePrizes = manager.getAvailablePrizes();
      expect(availablePrizes).toHaveLength(3);
    });
  });

  describe('constructor with initial prizes', () => {
    it('should initialize with provided prizes', () => {
      const initialPrizes: Prize[] = [
        {
          id: 'prize-1',
          name: '一等奖',
          totalCount: 5,
          remainingCount: 3,
          description: 'iPhone',
        },
        {
          id: 'prize-2',
          name: '二等奖',
          totalCount: 10,
          remainingCount: 8,
        },
      ];

      const managerWithPrizes = new PrizeManager(initialPrizes);
      const prizes = managerWithPrizes.getAllPrizes();

      expect(prizes).toHaveLength(2);
      expect(prizes[0].name).toBe('一等奖');
      expect(prizes[1].name).toBe('二等奖');
    });

    it('should work with empty initial array', () => {
      const managerWithEmpty = new PrizeManager([]);
      const prizes = managerWithEmpty.getAllPrizes();

      expect(prizes).toEqual([]);
    });
  });
});
