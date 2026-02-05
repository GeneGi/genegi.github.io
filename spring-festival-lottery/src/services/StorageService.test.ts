/**
 * 春晚庙会抽奖系统 - 存储服务单元测试
 * 
 * 测试 StorageService 的核心功能和错误处理
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageService } from './StorageService';
import { LotteryState, Prize } from '../types';

describe('StorageService', () => {
  let storageService: StorageService;
  const STORAGE_KEY = 'lottery_state';

  // 创建测试用的奖品数据
  const createTestPrize = (id: string, name: string, count: number): Prize => ({
    id,
    name,
    totalCount: count,
    remainingCount: count,
    description: `${name} 描述`,
  });

  // 创建测试用的状态数据
  const createTestState = (): LotteryState => ({
    prizes: [
      createTestPrize('prize-1', '一等奖', 1),
      createTestPrize('prize-2', '二等奖', 3),
      createTestPrize('prize-3', '三等奖', 5),
    ],
    currentResult: undefined,
    isDrawing: false,
    totalDrawn: 0,
  });

  beforeEach(() => {
    storageService = new StorageService();
    // 清除 localStorage
    localStorage.clear();
  });

  afterEach(() => {
    // 清理
    localStorage.clear();
  });

  describe('saveState', () => {
    it('should save state to localStorage', () => {
      const state = createTestState();
      
      storageService.saveState(state);
      
      const savedData = localStorage.getItem(STORAGE_KEY);
      expect(savedData).not.toBeNull();
      
      const parsedData = JSON.parse(savedData!);
      expect(parsedData).toEqual(state);
    });

    it('should overwrite existing state', () => {
      const state1 = createTestState();
      const state2: LotteryState = {
        prizes: [createTestPrize('prize-4', '特等奖', 1)],
        currentResult: undefined,
        isDrawing: false,
        totalDrawn: 0,
      };
      
      storageService.saveState(state1);
      storageService.saveState(state2);
      
      const savedData = localStorage.getItem(STORAGE_KEY);
      const parsedData = JSON.parse(savedData!);
      expect(parsedData).toEqual(state2);
      expect(parsedData.prizes).toHaveLength(1);
    });

    it('should handle empty prizes array', () => {
      const emptyState: LotteryState = {
        prizes: [],
        currentResult: undefined,
        isDrawing: false,
        totalDrawn: 0,
      };
      
      storageService.saveState(emptyState);
      
      const savedData = localStorage.getItem(STORAGE_KEY);
      const parsedData = JSON.parse(savedData!);
      expect(parsedData.prizes).toEqual([]);
    });

    it('should save state with currentResult', () => {
      const state = createTestState();
      state.currentResult = state.prizes[0];
      
      storageService.saveState(state);
      
      const savedData = localStorage.getItem(STORAGE_KEY);
      const parsedData = JSON.parse(savedData!);
      expect(parsedData.currentResult).toEqual(state.prizes[0]);
    });
  });

  describe('loadState', () => {
    it('should load state from localStorage', () => {
      const state = createTestState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      
      const loadedState = storageService.loadState();
      
      expect(loadedState).not.toBeNull();
      expect(loadedState).toEqual(state);
    });

    it('should return null when localStorage is empty', () => {
      const loadedState = storageService.loadState();
      
      expect(loadedState).toBeNull();
    });

    it('should return null and clear corrupted data', () => {
      // 保存损坏的 JSON 数据
      localStorage.setItem(STORAGE_KEY, 'invalid json {');
      
      const loadedState = storageService.loadState();
      
      expect(loadedState).toBeNull();
      // 验证损坏的数据已被清除
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should return null for invalid state structure (missing prizes)', () => {
      const invalidState = {
        currentResult: undefined,
        isDrawing: false,
        totalDrawn: 0,
        // prizes 字段缺失
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidState));
      
      const loadedState = storageService.loadState();
      
      expect(loadedState).toBeNull();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should return null for invalid state structure (prizes not array)', () => {
      const invalidState = {
        prizes: 'not an array',
        currentResult: undefined,
        isDrawing: false,
        totalDrawn: 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidState));
      
      const loadedState = storageService.loadState();
      
      expect(loadedState).toBeNull();
    });

    it('should return null for invalid prize data (missing id)', () => {
      const invalidState = {
        prizes: [
          {
            // id 缺失
            name: '一等奖',
            totalCount: 1,
            remainingCount: 1,
          },
        ],
        currentResult: undefined,
        isDrawing: false,
        totalDrawn: 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidState));
      
      const loadedState = storageService.loadState();
      
      expect(loadedState).toBeNull();
    });

    it('should return null for invalid prize data (negative count)', () => {
      const invalidState = {
        prizes: [
          {
            id: 'prize-1',
            name: '一等奖',
            totalCount: -1, // 负数
            remainingCount: 1,
          },
        ],
        currentResult: undefined,
        isDrawing: false,
        totalDrawn: 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidState));
      
      const loadedState = storageService.loadState();
      
      expect(loadedState).toBeNull();
    });

    it('should load state with optional description field', () => {
      const state = createTestState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      
      const loadedState = storageService.loadState();
      
      expect(loadedState).not.toBeNull();
      expect(loadedState!.prizes[0].description).toBe('一等奖 描述');
    });

    it('should load state without description field', () => {
      const state: LotteryState = {
        prizes: [
          {
            id: 'prize-1',
            name: '一等奖',
            totalCount: 1,
            remainingCount: 1,
            // description 未定义
          },
        ],
        currentResult: undefined,
        isDrawing: false,
        totalDrawn: 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      
      const loadedState = storageService.loadState();
      
      expect(loadedState).not.toBeNull();
      expect(loadedState!.prizes[0].description).toBeUndefined();
    });
  });

  describe('clearState', () => {
    it('should clear state from localStorage', () => {
      const state = createTestState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      
      storageService.clearState();
      
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should not throw error when clearing empty storage', () => {
      expect(() => {
        storageService.clearState();
      }).not.toThrow();
      
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('round-trip consistency', () => {
    it('should maintain data integrity after save and load', () => {
      const originalState = createTestState();
      
      storageService.saveState(originalState);
      const loadedState = storageService.loadState();
      
      expect(loadedState).toEqual(originalState);
    });

    it('should handle state with currentResult in round-trip', () => {
      const originalState = createTestState();
      originalState.currentResult = originalState.prizes[1];
      originalState.totalDrawn = 5;
      
      storageService.saveState(originalState);
      const loadedState = storageService.loadState();
      
      expect(loadedState).toEqual(originalState);
      expect(loadedState!.currentResult).toEqual(originalState.prizes[1]);
    });

    it('should handle state with updated prize counts in round-trip', () => {
      const originalState = createTestState();
      originalState.prizes[0].remainingCount = 0;
      originalState.prizes[1].remainingCount = 1;
      originalState.totalDrawn = 3;
      
      storageService.saveState(originalState);
      const loadedState = storageService.loadState();
      
      expect(loadedState).toEqual(originalState);
      expect(loadedState!.prizes[0].remainingCount).toBe(0);
      expect(loadedState!.prizes[1].remainingCount).toBe(1);
    });
  });

  describe('error handling', () => {
    it('should handle localStorage unavailable during save', () => {
      // 模拟 localStorage 不可用
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      
      const state = createTestState();
      
      expect(() => {
        storageService.saveState(state);
      }).toThrow('Failed to save state');
      
      setItemSpy.mockRestore();
    });

    it('should handle localStorage unavailable during load', () => {
      // 模拟 localStorage 不可用
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('SecurityError');
      });
      
      const loadedState = storageService.loadState();
      
      expect(loadedState).toBeNull();
      
      getItemSpy.mockRestore();
    });

    it('should handle localStorage unavailable during clear', () => {
      // 模拟 localStorage 不可用
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
      removeItemSpy.mockImplementation(() => {
        throw new Error('SecurityError');
      });
      
      expect(() => {
        storageService.clearState();
      }).toThrow('Failed to clear state');
      
      removeItemSpy.mockRestore();
    });
  });
});
