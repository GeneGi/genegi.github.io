/**
 * 春晚庙会抽奖系统 - useLotteryState Hook
 * 
 * 自定义 React Hook，用于管理抽奖系统的状态
 * 集成 StorageService 实现自动保存和加载
 * 
 * 验证需求：1.1, 1.4, 2.1, 4.1, 4.2, 5.3
 */

import { useState, useCallback, useEffect } from 'react';
import type { LotteryState, Prize } from '../types';
import { StorageService } from '../services/StorageService';
import { LotteryEngine } from '../services/LotteryEngine';
import { subscribeToLotteryState } from '../services/firebase';

/**
 * 默认奖品列表
 */
const DEFAULT_PRIZES: Omit<Prize, 'id'>[] = [
  { name: 'Smile - 帆布袋', totalCount: 300, remainingCount: 300 },
  { name: 'Smile - 精美故宫文创', totalCount: 5, remainingCount: 5 },
  { name: 'Smile - 帽子', totalCount: 20, remainingCount: 20 },
  { name: 'Smile - 文创', totalCount: 30, remainingCount: 30 },
  { name: 'Smile - 扇子', totalCount: 26, remainingCount: 26 },
  { name: 'Smile - 火锅筷', totalCount: 7, remainingCount: 7 },
  { name: '课代表立正 - Hoodie', totalCount: 50, remainingCount: 50 },
  { name: '大统华 - T&T Gift Card', totalCount: 46, remainingCount: 46 },
  { name: '大统华 - 新年冰箱贴', totalCount: 15, remainingCount: 15 },
  { name: '大统华 - 新年贴纸', totalCount: 5, remainingCount: 5 },
  { name: '大统华 - 钥匙串', totalCount: 5, remainingCount: 5 },
  { name: 'RC医美 - 美妆礼品袋', totalCount: 30, remainingCount: 30 },
  { name: '佳遇十番 - 小马挂件', totalCount: 50, remainingCount: 50 },
];

/**
 * 初始状态
 * 
 * 当没有保存的状态时使用的默认状态
 */
const INITIAL_STATE: LotteryState = {
  prizes: DEFAULT_PRIZES.map(p => ({ ...p, id: generateUniqueId() })),
  currentResult: undefined,
  isDrawing: false,
  totalDrawn: 0,
  history: [],
};

/**
 * 生成唯一 ID
 * 
 * 使用时间戳和随机数生成唯一标识符
 * 格式：prize-{timestamp}-{random}
 * 
 * @returns 唯一的奖品 ID
 */
function generateUniqueId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `prize-${timestamp}-${random}`;
}

/**
 * useLotteryState Hook
 * 
 * 提供抽奖系统的状态管理和操作方法
 * 
 * 功能：
 * - 使用 useState 管理 LotteryState
 * - 集成 StorageService 实现自动保存
 * - 在组件挂载时从 localStorage 加载状态
 * - 提供操作方法：addPrize, updatePrize, removePrize, draw, reset
 * 
 * @returns 状态和操作方法
 */
export function useLotteryState() {
  // 创建服务实例（使用 useState 确保实例在组件生命周期内保持不变）
  const [storageService] = useState(() => new StorageService());
  
  // 状态管理
  const [state, setState] = useState<LotteryState>(() => {
    // 在初始化时从 localStorage 加载状态
    const savedState = storageService.loadState();
    if (savedState) {
      // 确保 history 字段存在
      return {
        ...savedState,
        history: savedState.history || [],
      };
    }
    return INITIAL_STATE;
  });

  // Subscribe to Firebase real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToLotteryState((newState) => {
      setState({
        ...newState,
        history: newState.history || [],
      });
      // Also update localStorage
      if (storageService.isLocalStorageAvailable()) {
        localStorage.setItem('lottery_state', JSON.stringify(newState));
      }
    });
    
    return () => unsubscribe();
  }, [storageService]);

  /**
   * 保存状态到 localStorage
   * 
   * 每次状态更新时自动调用
   */
  const saveState = useCallback(async (newState: LotteryState) => {
    try {
      await storageService.saveState(newState);
    } catch (error) {
      console.error('Failed to save state:', error);
      // 即使保存失败，也不影响应用的正常运行
    }
  }, [storageService]);

  /**
   * 更新状态并保存
   * 
   * 统一的状态更新方法，确保每次更新都会保存到 localStorage
   */
  const updateState = useCallback((newState: LotteryState) => {
    setState(newState);
    saveState(newState);
  }, [saveState]);

  /**
   * 添加奖品
   * 
   * 创建新奖品并添加到奖品列表
   * 
   * @param name - 奖品名称
   * @param count - 奖品数量
   * @param description - 奖品描述（可选）
   * @throws Error 当输入无效时
   * 
   * 验证需求：1.1, 1.2, 4.1
   */
  const addPrize = useCallback((name: string, count: number, description?: string) => {
    try {
      // 验证奖品名称
      if (typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('Prize name must be a non-empty string');
      }

      if (name.trim().length > 50) {
        throw new Error('Prize name must not exceed 50 characters');
      }

      // 验证奖品数量
      if (typeof count !== 'number') {
        throw new Error('Prize count must be a number');
      }

      if (!Number.isInteger(count)) {
        throw new Error('Prize count must be an integer');
      }

      if (count <= 0) {
        throw new Error('Prize count must be a positive integer');
      }

      if (count > 10000) {
        throw new Error('Prize count must not exceed 10000');
      }

      // 验证描述（如果提供）
      if (description !== undefined && typeof description !== 'string') {
        throw new Error('Prize description must be a string');
      }

      // 生成唯一 ID
      const id = generateUniqueId();

      // 创建新奖品对象
      const newPrize: Prize = {
        id,
        name: name.trim(),
        totalCount: count,
        remainingCount: count,
        description: description?.trim(),
      };
      
      // 更新状态
      const newState: LotteryState = {
        ...state,
        prizes: [...state.prizes, newPrize],
      };
      
      updateState(newState);
      
      return newPrize;
    } catch (error) {
      // 重新抛出错误，让调用者处理
      throw error;
    }
  }, [state, updateState]);

  /**
   * 更新奖品数量
   * 
   * 修改指定奖品的剩余数量
   * 
   * @param prizeId - 奖品 ID
   * @param newCount - 新的数量
   * @throws Error 当奖品不存在或数量无效时
   * 
   * 验证需求：1.4, 4.2
   */
  const updatePrize = useCallback((prizeId: string, newCount: number) => {
    try {
      // 验证奖品 ID
      if (typeof prizeId !== 'string' || prizeId.trim().length === 0) {
        throw new Error('Prize ID must be a non-empty string');
      }

      // 查找奖品
      const prize = state.prizes.find(p => p.id === prizeId);
      if (!prize) {
        throw new Error(`Prize with ID ${prizeId} not found`);
      }

      // 验证新数量
      if (typeof newCount !== 'number') {
        throw new Error('Prize count must be a number');
      }

      if (!Number.isInteger(newCount)) {
        throw new Error('Prize count must be an integer');
      }

      if (newCount < 0) {
        throw new Error('Prize count must be non-negative');
      }

      if (newCount > 10000) {
        throw new Error('Prize count must not exceed 10000');
      }

      // 更新奖品数量
      const updatedPrizes = state.prizes.map(p =>
        p.id === prizeId ? { ...p, remainingCount: newCount } : p
      );
      
      // 更新状态
      const newState: LotteryState = {
        ...state,
        prizes: updatedPrizes,
      };
      
      updateState(newState);
    } catch (error) {
      // 重新抛出错误，让调用者处理
      throw error;
    }
  }, [state, updateState]);

  /**
   * 删除奖品
   * 
   * 从奖品列表中删除指定的奖品
   * 
   * @param prizeId - 奖品 ID
   * @throws Error 当奖品不存在时
   * 
   * 验证需求：1.1, 4.2
   */
  const removePrize = useCallback((prizeId: string) => {
    try {
      // 验证奖品 ID
      if (typeof prizeId !== 'string' || prizeId.trim().length === 0) {
        throw new Error('Prize ID must be a non-empty string');
      }

      // 查找奖品索引
      const index = state.prizes.findIndex(p => p.id === prizeId);
      if (index === -1) {
        throw new Error(`Prize with ID ${prizeId} not found`);
      }

      // 删除奖品
      const updatedPrizes = state.prizes.filter(p => p.id !== prizeId);
      
      // 更新状态
      const newState: LotteryState = {
        ...state,
        prizes: updatedPrizes,
        // 如果删除的是当前结果，清除当前结果
        currentResult: state.currentResult?.id === prizeId ? undefined : state.currentResult,
      };
      
      updateState(newState);
    } catch (error) {
      // 重新抛出错误，让调用者处理
      throw error;
    }
  }, [state, updateState]);

  /**
   * 执行抽奖
   * 
   * 从可用奖品池中随机选择一个奖品
   * 
   * @returns 选中的奖品，如果没有可用奖品则返回 null
   * 
   * 验证需求：2.1, 4.2
   */
  const draw = useCallback((): Prize | null => {
    try {
      // 创建 LotteryEngine 实例并执行抽奖
      const lotteryEngine = new LotteryEngine(state.prizes);
      
      // 检查是否有可用奖品
      if (!lotteryEngine.hasAvailablePrizes()) {
        return null;
      }
      
      // 设置抽奖中状态
      setState(prevState => ({
        ...prevState,
        isDrawing: true,
      }));
      
      // 使用 LotteryEngine 执行抽奖
      const selectedPrize = lotteryEngine.draw();
      
      if (selectedPrize === null) {
        // 如果没有选中奖品，恢复状态
        setState(prevState => ({
          ...prevState,
          isDrawing: false,
        }));
        return null;
      }
      
      // 获取更新后的奖品列表
      const updatedPrizes = lotteryEngine.getAllPrizes();
      
      // 创建库存快照
      const remainingInventory: { [prizeName: string]: number } = {};
      updatedPrizes.forEach(prize => {
        remainingInventory[prize.name] = prize.remainingCount;
      });
      
      // 创建历史记录
      const historyEntry = {
        timestamp: Date.now(),
        prizeName: selectedPrize.name,
        remainingInventory,
      };
      
      // 更新状态
      const newState: LotteryState = {
        prizes: updatedPrizes,
        currentResult: selectedPrize,
        isDrawing: false,
        totalDrawn: state.totalDrawn + 1,
        history: [...(state.history || []), historyEntry],
      };
      
      updateState(newState);
      
      return selectedPrize;
    } catch (error) {
      // 发生错误时恢复状态
      setState(prevState => ({
        ...prevState,
        isDrawing: false,
      }));
      
      console.error('Failed to draw prize:', error);
      throw error;
    }
  }, [state, updateState]);

  /**
   * 重置系统
   * 
   * 清除所有奖品配置和抽奖记录，返回到初始状态
   * 
   * 验证需求：5.3, 5.4, 5.5
   */
  const reset = useCallback(() => {
    try {
      // 重置为初始状态（恢复原始库存数量）
      const newState: LotteryState = {
        prizes: DEFAULT_PRIZES.map(p => ({ ...p, id: generateUniqueId() })),
        currentResult: undefined,
        isDrawing: false,
        totalDrawn: 0,
        history: [],
      };
      
      updateState(newState);
    } catch (error) {
      console.error('Failed to reset state:', error);
      throw error;
    }
  }, [updateState]);

  /**
   * 返回状态和操作方法
   */
  return {
    // 状态
    state,
    
    // 操作方法
    addPrize,
    updatePrize,
    removePrize,
    draw,
    reset,
  };
}
