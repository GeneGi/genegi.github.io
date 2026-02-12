/**
 * 春晚庙会抽奖系统 - 主应用组件
 */

import { useState, useEffect } from 'react';
import { useLotteryState } from './hooks/useLotteryState';
import { PrizeConfigForm } from './components/PrizeConfigForm';
import bgMusic from './assets/祖海 - 好运来.mp3';
import './App.css';

interface SlotItem {
  id: number;
  text: string;
}

function App() {
  const { state, addPrize, updatePrize, removePrize, draw, reset } = useLotteryState();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [slotItems, setSlotItems] = useState<SlotItem[]>([]);
  const [slotOffset, setSlotOffset] = useState<number>(0);
  const [finalPrize, setFinalPrize] = useState<string>('');
  const [isMuted, setIsMuted] = useState(true);
  const [audioRef] = useState(() => {
    const audio = new Audio(bgMusic);
    audio.loop = true;
    audio.volume = 0.3;
    return audio;
  });

  useEffect(() => {
    return () => { audioRef.pause(); };
  }, [audioRef]);

  const toggleMute = () => {
    if (isMuted) {
      audioRef.play().catch(err => console.log('Audio play failed:', err));
      setIsMuted(false);
    } else {
      audioRef.pause();
      setIsMuted(true);
    }
  };

  const handleAddPrize = (name: string, count: number, description?: string) => {
    try {
      addPrize(name, count, description);
    } catch (error) {
      alert(`添加失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handleDraw = async () => {
    try {
      const availablePrizes = state.prizes.filter(p => p.remainingCount > 0);
      if (availablePrizes.length === 0) {
        alert('没有可用的奖品了！');
        return;
      }

      setIsAnimating(true);
      setFinalPrize('');
      
      // Generate animation items
      const items: SlotItem[] = [];
      for (let i = 0; i < 20; i++) {
        const randomPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
        items.push({
          id: Date.now() + i,
          text: randomPrize.name
        });
      }
      
      // Execute actual draw
      const result = draw();
      if (result) {
        items.push({
          id: Date.now() + 999,
          text: result.name
        });
      }
      
      setSlotItems(items);
      setSlotOffset(0);
      
      // Start scroll animation
      setTimeout(() => {
        setSlotOffset((items.length - 1) * 180);
      }, 50);
      
      // Show result after animation
      setTimeout(() => {
        setIsAnimating(false);
        if (result) {
          setFinalPrize(result.name);
        }
      }, 3500);
      
    } catch (error) {
      setIsAnimating(false);
      alert(`抽奖失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置所有数据吗？')) {
      reset();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎊 春晚庙会抽奖系统 🎊</h1>
        <div className="header-buttons">
          <button 
            className="config-toggle"
            onClick={() => {
              if (!showConfig) {
                const pwd = prompt('请输入管理密码：');
                if (!pwd || btoa(pwd) !== 'c21pbGUyMDI2') return;
              }
              setShowConfig(!showConfig);
            }}
          >
            {showConfig ? '隐藏配置 ▲' : '显示配置 ▼'}
          </button>
          <button 
            className="mute-toggle"
            onClick={toggleMute}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>

      {/* 可折叠的配置区域 */}
      {showConfig && (
        <div className="config-area">
          <div className="config-content">
            <section className="config-section">
              <PrizeConfigForm onAddPrize={handleAddPrize} />
            </section>

            <section className="prizes-section">
              <h2>奖品列表</h2>
              {state.prizes.length === 0 ? (
                <p className="empty-message">还没有添加奖品</p>
              ) : (
                <ul className="prizes-list">
                  {state.prizes.map((prize) => (
                    <li key={prize.id} className="prize-item">
                      <div>
                        <strong>{prize.name}</strong>
                        {prize.description && <span className="desc"> - {prize.description}</span>}
                      </div>
                      <div className="prize-controls">
                        <input
                          type="number"
                          min="0"
                          value={prize.remainingCount}
                          onChange={(e) => updatePrize(prize.id, parseInt(e.target.value) || 0)}
                          className="count-input"
                        />
                        <span className="count-total">/ {prize.totalCount}</span>
                        <button 
                          className="delete-button"
                          onClick={() => {
                            if (confirm(`确定要删除 "${prize.name}" 吗？`)) {
                              removePrize(prize.id);
                            }
                          }}
                          title="删除奖品"
                        >
                          🗑️
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="actions-section">
              <button className="reset-button" onClick={handleReset}>
                🔄 重置系统
              </button>
            </section>
          </div>
        </div>
      )}

      {/* 主抽奖展示区域 - 全屏显示 */}
      <main className="lottery-display">
        <div className="envelope env-1">🧧</div>
        <div className="envelope env-2">🎁</div>
        <div className="envelope env-3">🧧</div>
        <div className="envelope env-4">🎊</div>
        <div className="envelope env-5">🎁</div>
        <div className="envelope env-6">🧧</div>
        <div className="envelope env-7">🎉</div>
        <div className="envelope env-8">🎁</div>
        <div className="envelope env-9">🧧</div>
        <div className="envelope env-10">🎊</div>
        <div className="envelope env-11">🎁</div>
        <div className="envelope env-12">🎉</div>
        <div className="envelope env-13">🧧</div>
        <div className="envelope env-14">🎁</div>
        <div className="envelope env-15">🎊</div>
        
        <div className="slot-machine-container">
          {/* Slot Machine Body */}
          <div className="slot-machine-body">
            <div className="slot-window">
              {(isAnimating || finalPrize) ? (
                <div className="slot-reel" key={slotItems[0]?.id || 'empty'}>
                  <div 
                    className={`slot-reel-inner ${!isAnimating ? 'stopped' : ''}`}
                    style={{ transform: `translateY(-${slotOffset}px)` }}
                  >
                    {slotItems.map((item) => (
                      <div key={item.id} className="slot-item">
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="slot-placeholder">准备抽奖</div>
              )}
            </div>
          </div>

          {/* Slot Machine Handle */}
          <div className="slot-handle-container">
            <button 
              className={`slot-handle ${isAnimating ? 'pulled' : ''}`}
              onClick={handleDraw}
              disabled={state.prizes.filter(p => p.remainingCount > 0).length === 0 || isAnimating}
            >
              <div className="handle-ball">🎁</div>
              <div className="handle-stick"></div>
            </button>
          </div>
        </div>
        
        {!isAnimating && finalPrize && (
          <div className="stats-large">
            <h2 className="result-text">🎉 恭喜中奖 🎉</h2>
          </div>
        )}
        
        <div className="stats-info">
          <span>已抽取：{state.totalDrawn} 个</span>
          <span>•</span>
          <span>剩余：{state.prizes.reduce((sum, p) => sum + p.remainingCount, 0)} 个</span>
        </div>
      </main>
    </div>
  );
}

export default App;
