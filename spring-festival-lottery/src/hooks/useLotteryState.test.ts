/**
 * 春晚庙会抽奖系统 - useLotteryState Hook 测试
 * 
 * 测试自定义 Hook 的功能和状态管理
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLotteryState } from './useLotteryState';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLotteryState Hook', () => {
  beforeEach(() => {
    // 清除 localStorage
    localStorageMock.clear();
  });

  describe('初始化', () => {
    it('应该使用空状态初始化', () => {
      const { result } = renderHook(() => useLotteryState());

      expect(result.current.state.prizes).toEqual([]);
      expect(result.current.state.currentResult).toBeUndefined();
      expect(result.current.state.isDrawing).toBe(false);
      expect(result.current.state.totalDrawn).toBe(0);
    });

    it('应该从 localStorage 加载保存的状态', () => {
      // 预先保存状态到 localStorage
      const savedState = {
        prizes: [
          {
            id: 'prize-1',
            name: '一等奖',
            totalCount: 1,
            remainingCount: 1,
          },
        ],
        isDrawing: false,
        totalDrawn: 0,
      };
      localStorageMock.setItem('lottery_state', JSON.stringify(savedState));

      const { result } = renderHook(() => useLotteryState());

      expect(result.current.state.prizes).toHaveLength(1);
      expect(result.current.state.prizes[0].name).toBe('一等奖');
    });
  });

  describe('addPrize', () => {
    it('应该成功添加奖品', () => {
      const { result } = renderHook(() => useLotteryState());

      act(() => {
        result.current.addPrize('一等奖', 1, 'iPhone 15 Pro');
      });

      expect(result.current.state.prizes).toHaveLength(1);
      expect(result.current.state.prizes[0].name).toBe('一等奖');
      expect(result.current.state.prizes[0].totalCount).toBe(1);
      expect(result.current.state.prizes[0].remainingCount).toBe(1);
      expect(result.current.state.prizes[0].description).toBe('iPhone 15 Pro');
    });

    it('应该添加多个奖品', () => {
      const { result } = renderHook(() => useLotteryState());

      act(() => {
        result.current.addPrize('一等奖', 1);
      });

      act(() => {
        result.current.addPrize('二等奖', 3);
      });

      act(() => {
        result.current.addPrize('三等奖', 5);
      });

      expect(result.current.state.prizes).toHaveLength(3);
      expect(result.current.state.prizes[0].name).toBe('一等奖');
      expect(result.current.state.prizes[1].name).toBe('二等奖');
      expect(result.current.state.prizes[2].name).toBe('三等奖');
    });

    it('应该在添加奖品后保存到 localStorage', () => {
      const { result } = renderHook(() => useLotteryState());

      act(() => {
        result.current.addPrize('一等奖', 1);
      });

      const savedState = JSON.parse(localStorageMock.getItem('lottery_state') || '{}');
      expect(savedState.prizes).toHaveLength(1);
      expect(savedState.prizes[0].name).toBe('一等奖');
    });

    it('应该拒绝空名称', () => {
      const { result } = renderHook(() => useLotteryState());

      expect(() => {
        act(() => {
          result.current.addPrize('', 1);
        });
      }).toThrow('Prize name must be a non-empty string');
    });

    it('应该拒绝非正整数数量', () => {
      const { result } = renderHook(() => useLotteryState());

      expect(() => {
        act(() => {
          result.current.addPrize('一等奖', 0);
        });
      }).toThrow('Prize count must be a positive integer');

      expect(() => {
        act(() => {
          result.current.addPrize('一等奖', -1);
        });
      }).toThrow('Prize count must be a positive integer');

      expect(() => {
        act(() => {
          result.current.addPrize('一等奖', 1.5);
        });
      }).toThrow('Prize count must be an integer');
    });
  });

  describe('updatePrize', () => {
    it('应该成功更新奖品数量', () => {
      const { result } = renderHook(() => useLotteryState());

      let prizeId: string;

      act(() => {
        const prize = result.current.addPrize('一等奖', 5);
        prizeId = prize.id;
      });

      act(() => {
        result.current.updatePrize(prizeId, 3);
      });

      expect(result.current.state.prizes[0].remainingCount).toBe(3);
    });

    it('应该在更新奖品后保存到 localStorage', () => {
      const { result } = renderHook(() => useLotteryState());

      let prizeId: string;

      act(() => {
        const prize = result.current.addPrize('一等奖', 5);
        prizeId = prize.id;
      });

      act(() => {
        result.current.updatePrize(prizeId, 3);
      });

      const savedState = JSON.parse(localStorageMock.getItem('lottery_state') || '{}');
      expect(savedState.prizes[0].remainingCount).toBe(3);
    });

    it('应该拒绝不存在的奖品 ID', () => {
      const { result } = renderHook(() => useLotteryState());

      expect(() => {
        act(() => {
          result.current.updatePrize('non-existent-id', 3);
        });
      }).toThrow('Prize with ID non-existent-id not found');
    });

    it('应该拒绝负数数量', () => {
      const { result } = renderHook(() => useLotteryState());

      let prizeId: string;

      act(() => {
        const prize = result.current.addPrize('一等奖', 5);
        prizeId = prize.id;
      });

      expect(() => {
        act(() => {
          result.current.updatePrize(prizeId, -1);
        });
      }).toThrow('Prize count must be non-negative');
    });
  });

  describe('removePrize', () => {
    it('应该成功删除奖品', () => {
      const { result } = renderHook(() => useLotteryState());

      let prizeId: string;

      act(() => {
        const prize = result.current.addPrize('一等奖', 1);
        prizeId = prize.id;
      });

      expect(result.current.state.prizes).toHaveLength(1);

      act(() => {
        result.current.removePrize(prizeId);
      });

      expect(result.current.state.prizes).toHaveLength(0);
    });

    it('应该在删除奖品后保存到 localStorage', () => {
      const { result } = renderHook(() => useLotteryState());

      let prizeId: string;

      act(() => {
        const prize = result.current.addPrize('一等奖', 1);
        prizeId = prize.id;
      });

      act(() => {
        result.current.removePrize(prizeId);
      });

      const savedState = JSON.parse(localStorageMock.getItem('lottery_state') || '{}');
      expect(savedState.prizes).toHaveLength(0);
    });

    it('应该在删除当前结果时清除 currentResult', () => {
      const { result } = renderHook(() => useLotteryState());

      let prizeId: string;

      act(() => {
        const prize = result.current.addPrize('一等奖', 1);
        prizeId = prize.id;
      });

      act(() => {
        result.current.draw();
      });

      expect(result.current.state.currentResult).toBeDefined();

      act(() => {
        result.current.removePrize(prizeId);
      });

      expect(result.current.state.currentResult).toBeUndefined();
    });

    it('应该拒绝不存在的奖品 ID', () => {
      const { result } = renderHook(() => useLotteryState());

      expect(() => {
        act(() => {
          result.current.removePrize('non-existent-id');
        });
      }).toThrow('Prize with ID non-existent-id not found');
    });
  });

  describe('draw', () => {
    it('应该成功抽取奖品', () => {
      const { result } = renderHook(() => useLotteryState());

      act(() => {
        result.current.addPrize('一等奖', 1);
      });

      let drawnPrize;

      act(() => {
        drawnPrize = result.current.draw();
      });

      expect(drawnPrize).toBeDefined();
      expect(drawnPrize?.name).toBe('一等奖');
      expect(result.current.state.currentResult).toBeDefined();
      expect(result.current.state.currentResult?.name).toBe('一等奖');
      expect(result.current.state.totalDrawn).toBe(1);
    });

    it('应该减少奖品的剩余数量', () => {
      const { result } = renderHook(() => useLotteryState());

      act(() => {
        result.current.addPrize('一等奖', 3);
      });

      expect(result.current.state.prizes[0].remainingCount).toBe(3);

      act(() => {
        result.current.draw();
      });

      expect(result.current.state.prizes[0].remainingCount).toBe(2);
    });

    it('应该在抽奖后保存到 localStorage', () => {
      const { result } = renderHook(() => useLotteryState());

      act(() => {
        result.current.addPrize('一等奖', 3);
      });

      act(() => {
        result.current.draw();
      });

      const savedState = JSON.parse(localStorageMock.getItem('lottery_state') || '{}');
      expect(savedState.prizes[0].remainingCount).toBe(2);
      expect(savedState.totalDrawn).toBe(1);
    });

    it('应该在没有可用奖品时返回 null', () => {
      const { result } = renderHook(() => useLotteryState());

      let drawnPrize;

      act(() => {
        drawnPrize = result.current.draw();
      });

      expect(drawnPrize).toBeNull();
    });

    it('应该在所有奖品抽完后返回 null', () => {
      const { result } = renderHook(() => useLotteryState());

      act(() => {
        result.current.addPrize('一等奖', 1);
      });

      act(() => {
        result.current.draw();
      });

      expect(result.current.state.prizes[0].remainingCount).toBe(0);

      let drawnPrize;

      act(() => {
        drawnPrize = result.current.draw();
      });

      expect(drawnPrize).toBeNull();
    });

    it('应该增加 totalDrawn 计数', () => {
      const { result } = renderHook(() => useLotteryState());

      act(() => {
        result.current.addPrize('一等奖', 3);
      });

      expect(result.current.state.totalDrawn).toBe(0);

      act(() => {
        result.current.draw();
      });

      expect(result.current.state.totalDrawn).toBe(1);

      act(() => {
        result.current.draw();
      });

      expect(result.current.state.totalDrawn).toBe(2);
    });
  });

  describe('reset', () => {
    it('应该清除所有奖品和状态', () => {
      const { result } = renderHook(() => useLotteryState());

      act(() => {
        result.current.addPrize('一等奖', 1);
      });

      act(() => {
        result.current.addPrize('二等奖', 3);
      });

      act(() => {
        result.current.draw();
      });

      expect(result.current.state.prizes).toHaveLength(2);
      expect(result.current.state.totalDrawn).toBe(1);

      act(() => {
        result.current.reset();
      });

      expect(result.current.state.prizes).toHaveLength(0);
      expect(result.current.state.currentResult).toBeUndefined();
      expect(result.current.state.isDrawing).toBe(false);
      expect(result.current.state.totalDrawn).toBe(0);
    });

    it('应该清除 localStorage', () => {
      const { result } = renderHook(() => useLotteryState());

      act(() => {
        result.current.addPrize('一等奖', 1);
      });

      expect(localStorageMock.getItem('lottery_state')).not.toBeNull();

      act(() => {
        result.current.reset();
      });

      expect(localStorageMock.getItem('lottery_state')).toBeNull();
    });
  });

  describe('持久化', () => {
    it('应该在每次操作后自动保存状态', () => {
      const { result } = renderHook(() => useLotteryState());

      // 添加奖品
      act(() => {
        result.current.addPrize('一等奖', 5);
      });

      let savedState = JSON.parse(localStorageMock.getItem('lottery_state') || '{}');
      expect(savedState.prizes).toHaveLength(1);

      // 抽奖
      act(() => {
        result.current.draw();
      });

      savedState = JSON.parse(localStorageMock.getItem('lottery_state') || '{}');
      expect(savedState.totalDrawn).toBe(1);
      expect(savedState.prizes[0].remainingCount).toBe(4);
    });

    it('应该在重新加载后恢复状态', () => {
      // 第一个 hook 实例
      const { result: result1 } = renderHook(() => useLotteryState());

      act(() => {
        result1.current.addPrize('一等奖', 1);
      });

      act(() => {
        result1.current.addPrize('二等奖', 3);
      });

      act(() => {
        result1.current.draw();
      });

      // 模拟页面刷新，创建新的 hook 实例
      const { result: result2 } = renderHook(() => useLotteryState());

      // 验证状态已恢复
      expect(result2.current.state.prizes).toHaveLength(2);
      expect(result2.current.state.totalDrawn).toBe(1);
      expect(result2.current.state.prizes[0].name).toBe('一等奖');
      expect(result2.current.state.prizes[1].name).toBe('二等奖');
    });
  });
});
