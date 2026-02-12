/**
 * 春晚庙会抽奖系统 - 存储服务
 * 
 * 负责与Firebase Firestore交互，实现数据持久化
 */

import { doc, setDoc } from "firebase/firestore";
import { db } from './firebase';
import type { LotteryState } from '../types';

export class StorageService {
  private readonly DOC_ID = 'lottery_state';

  async saveState(state: LotteryState): Promise<void> {
    await setDoc(doc(db, 'lottery', this.DOC_ID), state);
  }

  clearState(): void {
    const emptyState: LotteryState = {
      prizes: [],
      isDrawing: false,
      totalDrawn: 0,
      currentResult: null,
      history: [],
    };
    setDoc(doc(db, 'lottery', this.DOC_ID), emptyState).catch(error => {
      console.error('Failed to clear Firebase:', error);
    });
  }
}
