/**
 * 春晚庙会抽奖系统 - 抽奖引擎单元测试
 * 
 * 测试 LotteryEngine 类的核心功能
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LotteryEngine } from './LotteryEngine';
import { Prize } from '../types';

describe('LotteryEngine', () => {
  let engine: LotteryEngine;
  let samplePrizes: Prize[];

  beforeEach(() => {
    // 创建示例奖品
    samplePrizes = [
      {
        id: 'prize-1',
        name: '一等奖',
        totalCount: 1,
        remainingCount: 1,
        description: 'iPhone 15 Pro',
      },
      {
        id: 'prize-2',
        name: '二等奖',
        totalCount: 3,
        remainingCount: 3,
        description: '小米手环',
      },
      {
        id: 'prize-3',
        name: '三等奖',
        totalCount: 5,
        remainingCount: 5,
        description: '红包',
      },
    ];

    engine = new LotteryEngine(samplePrizes);
  });

  describe('draw()', () => {
    it('should return a prize from available prizes', () => {
      const result = engine.draw();
      
      expect(result).not.toBeNull();
      expect(samplePrizes.some(p => p.id === result!.id)).toBe(true);
    });

    it('should decrease the remaining count of the drawn prize', () => {
      const initialCounts = samplePrizes.map(p => p.remainingCount);
      const result = engine.draw();
      
      expect(result).not.toBeNull();
      
      // 找到被抽中的奖品
      const drawnPrize = samplePrizes.find(p => p.id === result!.id);
      expect(drawnPrize).toBeDefined();
      
      // 验证剩余数量减少了 1
      const initialCount = initialCounts[samplePrizes.indexOf(drawnPrize!)];
      expect(drawnPrize!.remainingCount).toBe(initialCount - 1);
    });

    it('should return null when no prizes are available', () => {
      // 将所有奖品的剩余数量设为 0
      samplePrizes.forEach(prize => {
        prize.remainingCount = 0;
      });

      const result = engine.draw();
      expect(result).toBeNull();
    });

    it('should draw the last remaining prize', () => {
      // 将所有奖品的剩余数量设为 0，只留一个
      samplePrizes[0].remainingCount = 0;
      samplePrizes[1].remainingCount = 0;
      samplePrizes[2].remainingCount = 1;

      const result = engine.draw();
      
      expect(result).not.toBeNull();
      expect(result!.id).toBe('prize-3');
      expect(samplePrizes[2].remainingCount).toBe(0);
    });

    it('should handle single prize correctly', () => {
      const singlePrize: Prize = {
        id: 'prize-single',
        name: '唯一奖品',
        totalCount: 1,
        remainingCount: 1,
      };

      const singleEngine = new LotteryEngine([singlePrize]);
      const result = singleEngine.draw();

      expect(result).not.toBeNull();
      expect(result!.id).toBe('prize-single');
      expect(singlePrize.remainingCount).toBe(0);
    });

    it('should use weighted random selection based on remaining count', () => {
      // 创建一个奖品数量差异很大的场景
      const weightedPrizes: Prize[] = [
        {
          id: 'rare',
          name: '稀有奖品',
          totalCount: 1,
          remainingCount: 1,
        },
        {
          id: 'common',
          name: '普通奖品',
          totalCount: 99,
          remainingCount: 99,
        },
      ];

      const weightedEngine = new LotteryEngine(weightedPrizes);
      
      // 进行多次抽奖，统计结果
      const results: { [key: string]: number } = { rare: 0, common: 0 };
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        // 重置奖品数量
        weightedPrizes[0].remainingCount = 1;
        weightedPrizes[1].remainingCount = 99;
        
        const result = weightedEngine.draw();
        if (result) {
          results[result.id]++;
        }
      }

      // 普通奖品应该被抽中更多次（由于权重更高）
      // 理论上，common 应该被抽中约 99% 的次数
      // 我们使用一个宽松的阈值来避免测试不稳定
      expect(results.common).toBeGreaterThan(results.rare);
      expect(results.common).toBeGreaterThan(80); // 至少 80%
    });
  });

  describe('hasAvailablePrizes()', () => {
    it('should return true when prizes are available', () => {
      expect(engine.hasAvailablePrizes()).toBe(true);
    });

    it('should return false when no prizes are available', () => {
      // 将所有奖品的剩余数量设为 0
      samplePrizes.forEach(prize => {
        prize.remainingCount = 0;
      });

      expect(engine.hasAvailablePrizes()).toBe(false);
    });

    it('should return true when at least one prize is available', () => {
      // 将大部分奖品的剩余数量设为 0，只留一个
      samplePrizes[0].remainingCount = 0;
      samplePrizes[1].remainingCount = 0;
      samplePrizes[2].remainingCount = 1;

      expect(engine.hasAvailablePrizes()).toBe(true);
    });

    it('should return false for empty prize list', () => {
      const emptyEngine = new LotteryEngine([]);
      expect(emptyEngine.hasAvailablePrizes()).toBe(false);
    });
  });

  describe('decrementPrize()', () => {
    it('should decrease the remaining count of specified prize', () => {
      const initialCount = samplePrizes[0].remainingCount;
      
      engine.decrementPrize('prize-1');
      
      expect(samplePrizes[0].remainingCount).toBe(initialCount - 1);
    });

    it('should throw error when prize ID is invalid', () => {
      expect(() => engine.decrementPrize('')).toThrow('Prize ID must be a non-empty string');
      expect(() => engine.decrementPrize('   ')).toThrow('Prize ID must be a non-empty string');
    });

    it('should throw error when prize does not exist', () => {
      expect(() => engine.decrementPrize('non-existent-id')).toThrow('Prize with ID non-existent-id not found');
    });

    it('should throw error when remaining count is already zero', () => {
      // 将奖品的剩余数量设为 0
      samplePrizes[0].remainingCount = 0;

      expect(() => engine.decrementPrize('prize-1')).toThrow('Prize 一等奖 has no remaining count');
    });

    it('should allow multiple decrements until count reaches zero', () => {
      const prizeId = 'prize-2';
      const initialCount = samplePrizes[1].remainingCount;

      // 减少多次
      for (let i = 0; i < initialCount; i++) {
        engine.decrementPrize(prizeId);
      }

      expect(samplePrizes[1].remainingCount).toBe(0);
      
      // 再次尝试减少应该抛出错误
      expect(() => engine.decrementPrize(prizeId)).toThrow('has no remaining count');
    });
  });

  describe('reset()', () => {
    it('should reset all prizes to their initial total count', () => {
      // 先进行一些抽奖，改变剩余数量
      engine.draw();
      engine.draw();
      engine.draw();

      // 验证剩余数量已改变
      const hasChanged = samplePrizes.some(p => p.remainingCount < p.totalCount);
      expect(hasChanged).toBe(true);

      // 重置
      engine.reset();

      // 验证所有奖品的剩余数量都恢复为初始值
      samplePrizes.forEach(prize => {
        expect(prize.remainingCount).toBe(prize.totalCount);
      });
    });

    it('should reset prizes that have been fully drawn', () => {
      // 抽完一个奖品
      samplePrizes[0].remainingCount = 0;

      engine.reset();

      expect(samplePrizes[0].remainingCount).toBe(samplePrizes[0].totalCount);
    });

    it('should work with empty prize list', () => {
      const emptyEngine = new LotteryEngine([]);
      
      // 不应该抛出错误
      expect(() => emptyEngine.reset()).not.toThrow();
    });

    it('should allow drawing after reset', () => {
      // 抽完所有奖品
      while (engine.hasAvailablePrizes()) {
        engine.draw();
      }

      expect(engine.hasAvailablePrizes()).toBe(false);

      // 重置
      engine.reset();

      // 应该可以再次抽奖
      expect(engine.hasAvailablePrizes()).toBe(true);
      const result = engine.draw();
      expect(result).not.toBeNull();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete lottery cycle', () => {
      // 1. 初始状态：所有奖品可用
      expect(engine.hasAvailablePrizes()).toBe(true);

      // 2. 进行多次抽奖
      const results: Prize[] = [];
      const totalPrizes = samplePrizes.reduce((sum, p) => sum + p.totalCount, 0);

      for (let i = 0; i < totalPrizes; i++) {
        const result = engine.draw();
        expect(result).not.toBeNull();
        results.push(result!);
      }

      // 3. 所有奖品应该已抽完
      expect(engine.hasAvailablePrizes()).toBe(false);
      expect(engine.draw()).toBeNull();

      // 4. 验证抽奖结果数量正确
      expect(results.length).toBe(totalPrizes);

      // 5. 重置系统
      engine.reset();

      // 6. 应该可以再次抽奖
      expect(engine.hasAvailablePrizes()).toBe(true);
      const newResult = engine.draw();
      expect(newResult).not.toBeNull();
    });

    it('should maintain prize integrity across operations', () => {
      const initialState = samplePrizes.map(p => ({
        id: p.id,
        name: p.name,
        totalCount: p.totalCount,
        remainingCount: p.remainingCount,
      }));

      // 进行一些操作
      engine.draw();
      engine.decrementPrize('prize-2');
      engine.reset();

      // 验证奖品的基本属性没有改变
      samplePrizes.forEach((prize, index) => {
        expect(prize.id).toBe(initialState[index].id);
        expect(prize.name).toBe(initialState[index].name);
        expect(prize.totalCount).toBe(initialState[index].totalCount);
        expect(prize.remainingCount).toBe(initialState[index].totalCount); // 重置后应该等于 totalCount
      });
    });
  });
});
