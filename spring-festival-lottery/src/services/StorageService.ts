/**
 * 春晚庙会抽奖系统 - 存储服务
 * 
 * 负责与Firebase Firestore和本地存储交互，实现数据持久化
 * 
 * 验证需求：4.1, 4.2, 4.3, 4.4
 */

import { doc, setDoc } from "firebase/firestore";
import { db } from './firebase';
import type { LotteryState } from '../types';

/**
 * 存储服务类
 * 
 * 提供保存、加载和清除抽奖状态的功能
 * 使用Firebase Firestore作为主存储，localStorage作为备份
 */
export class StorageService {
  private readonly STORAGE_KEY = 'lottery_state';
  private readonly DOC_ID = 'lottery_state';

  /**
   * 保存状态到Firebase和本地存储
   */
  async saveState(state: LotteryState): Promise<void> {
    // 保存到localStorage作为备份
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      }
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }

    // 保存到Firebase
    try {
      await setDoc(doc(db, 'lottery', this.DOC_ID), state);
      console.log('✅ Saved to Firebase successfully');
    } catch (error) {
      console.error('❌ Failed to save to Firebase:', error);
      throw error;
    }
  }

  /**
   * 从Firebase或本地存储加载状态
   */
  loadState(): LotteryState | null {
    // 先尝试从localStorage加载（同步，更快）
    try {
      if (this.isLocalStorageAvailable()) {
        const serializedState = localStorage.getItem(this.STORAGE_KEY);
        if (serializedState) {
          const state = JSON.parse(serializedState) as LotteryState;
          if (this.isValidState(state)) {
            return state;
          }
        }
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }

    return null;
  }

  /**
   * 清除所有存储的数据
   */
  clearState(): void {
    // 清除localStorage
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }

    // 清除Firebase
    const emptyState: LotteryState = {
      prizes: [],
      isDrawing: false,
      totalDrawn: 0,
      currentResult: undefined,
      history: [],
    };
    
    setDoc(doc(db, 'lottery', this.DOC_ID), emptyState).catch(error => {
      console.error('Failed to clear Firebase:', error);
    });
  }

  /**
   * 检查 localStorage 是否可用
   * 
   * 某些浏览器在隐私模式下或禁用存储时，localStorage 可能不可用
   * 
   * @returns 如果 localStorage 可用返回 true，否则返回 false
   * @private
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 验证加载的状态数据是否有效
   * 
   * 检查状态对象是否包含所有必需的字段，并且数据类型正确
   * 
   * @param state - 要验证的状态对象
   * @returns 如果状态有效返回 true，否则返回 false
   * @private
   */
  private isValidState(state: any): state is LotteryState {
    // 检查是否为对象
    if (typeof state !== 'object' || state === null) {
      return false;
    }

    // 检查必需字段是否存在
    if (!Array.isArray(state.prizes)) {
      return false;
    }

    if (typeof state.isDrawing !== 'boolean') {
      return false;
    }

    if (typeof state.totalDrawn !== 'number') {
      return false;
    }

    // 验证 prizes 数组中的每个奖品
    for (const prize of state.prizes) {
      if (!this.isValidPrize(prize)) {
        return false;
      }
    }

    // 验证 currentResult（如果存在）
    if (state.currentResult !== undefined && state.currentResult !== null) {
      if (!this.isValidPrize(state.currentResult)) {
        return false;
      }
    }

    return true;
  }

  /**
   * 验证奖品对象是否有效
   * 
   * @param prize - 要验证的奖品对象
   * @returns 如果奖品有效返回 true，否则返回 false
   * @private
   */
  private isValidPrize(prize: any): boolean {
    if (typeof prize !== 'object' || prize === null) {
      return false;
    }

    // 检查必需字段
    if (typeof prize.id !== 'string' || prize.id.length === 0) {
      return false;
    }

    if (typeof prize.name !== 'string' || prize.name.length === 0) {
      return false;
    }

    if (typeof prize.totalCount !== 'number' || prize.totalCount < 0) {
      return false;
    }

    if (typeof prize.remainingCount !== 'number' || prize.remainingCount < 0) {
      return false;
    }

    // description 是可选的，但如果存在必须是字符串
    if (prize.description !== undefined && typeof prize.description !== 'string') {
      return false;
    }

    return true;
  }
}
