/**
 * 类型定义测试
 * 
 * 验证 Prize 和 LotteryState 接口的基本使用
 */

import { describe, it, expect } from 'vitest';
import type { Prize, LotteryState } from './index';

describe('Type Definitions', () => {
  describe('Prize Interface', () => {
    it('should allow creating a valid Prize object with all required fields', () => {
      const prize: Prize = {
        id: 'prize-1',
        name: '一等奖',
        totalCount: 1,
        remainingCount: 1,
      };

      expect(prize.id).toBe('prize-1');
      expect(prize.name).toBe('一等奖');
      expect(prize.totalCount).toBe(1);
      expect(prize.remainingCount).toBe(1);
      expect(prize.description).toBeUndefined();
    });

    it('should allow creating a Prize object with optional description', () => {
      const prize: Prize = {
        id: 'prize-2',
        name: '二等奖',
        totalCount: 3,
        remainingCount: 2,
        description: 'iPhone 15 Pro',
      };

      expect(prize.description).toBe('iPhone 15 Pro');
    });

    it('should allow Prize with zero remaining count', () => {
      const prize: Prize = {
        id: 'prize-3',
        name: '三等奖',
        totalCount: 5,
        remainingCount: 0,
      };

      expect(prize.remainingCount).toBe(0);
    });
  });

  describe('LotteryState Interface', () => {
    it('should allow creating a valid LotteryState with empty prizes', () => {
      const state: LotteryState = {
        prizes: [],
        isDrawing: false,
        totalDrawn: 0,
      };

      expect(state.prizes).toEqual([]);
      expect(state.currentResult).toBeUndefined();
      expect(state.isDrawing).toBe(false);
      expect(state.totalDrawn).toBe(0);
    });

    it('should allow creating a LotteryState with prizes', () => {
      const prize: Prize = {
        id: 'prize-1',
        name: '一等奖',
        totalCount: 1,
        remainingCount: 1,
      };

      const state: LotteryState = {
        prizes: [prize],
        isDrawing: false,
        totalDrawn: 0,
      };

      expect(state.prizes).toHaveLength(1);
      expect(state.prizes[0]).toEqual(prize);
    });

    it('should allow creating a LotteryState with currentResult', () => {
      const prize: Prize = {
        id: 'prize-1',
        name: '一等奖',
        totalCount: 1,
        remainingCount: 0,
      };

      const state: LotteryState = {
        prizes: [prize],
        currentResult: prize,
        isDrawing: false,
        totalDrawn: 1,
      };

      expect(state.currentResult).toEqual(prize);
      expect(state.totalDrawn).toBe(1);
    });

    it('should allow creating a LotteryState with isDrawing true', () => {
      const state: LotteryState = {
        prizes: [],
        isDrawing: true,
        totalDrawn: 0,
      };

      expect(state.isDrawing).toBe(true);
    });

    it('should allow creating a LotteryState with multiple prizes', () => {
      const prizes: Prize[] = [
        {
          id: 'prize-1',
          name: '一等奖',
          totalCount: 1,
          remainingCount: 1,
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
        },
      ];

      const state: LotteryState = {
        prizes,
        isDrawing: false,
        totalDrawn: 0,
      };

      expect(state.prizes).toHaveLength(3);
      expect(state.prizes[0].name).toBe('一等奖');
      expect(state.prizes[1].name).toBe('二等奖');
      expect(state.prizes[2].name).toBe('三等奖');
    });
  });
});
