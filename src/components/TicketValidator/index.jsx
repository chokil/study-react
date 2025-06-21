import { useState, useRef, useEffect } from 'react';
import ticketService from '../../services/ticketService';
import TicketDisplay from '../TicketDisplay';
import styles from './TicketValidator.module.css';

export default function TicketValidator() {
  const [ticketId, setTicketId] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [swipeTickets, setSwipeTickets] = useState([]);
  const swipeContainerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    updateStats();
    loadPendingTickets();
  }, []);

  const updateStats = () => {
    const ticketStats = ticketService.getTicketStats();
    setStats(ticketStats);
  };

  const loadPendingTickets = () => {
    const validTickets = ticketService.getTicketsByStatus('valid');
    setSwipeTickets(validTickets.slice(0, 10)); // 最大10枚まで表示
  };

  const handleValidate = (e) => {
    e.preventDefault();
    
    if (!ticketId.trim()) {
      alert('チケットIDを入力してください');
      return;
    }
    
    const result = ticketService.validateTicket(ticketId);
    setValidationResult(result);
    setTicketId('');
    updateStats();
    loadPendingTickets();
    
    setTimeout(() => {
      setValidationResult(null);
    }, 5000);
  };

  const handleSwipe = (ticket) => {
    const result = ticketService.validateTicket(ticket.id);
    setValidationResult(result);
    
    // スワイプしたチケットをリストから削除
    setSwipeTickets(prev => prev.filter(t => t.id !== ticket.id));
    updateStats();
    
    setTimeout(() => {
      setValidationResult(null);
    }, 3000);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e, ticket) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipeGesture(ticket);
  };

  const handleSwipeGesture = (ticket) => {
    const swipeThreshold = 100;
    const diff = touchStartX.current - touchEndX.current;
    
    if (diff > swipeThreshold) {
      // 左にスワイプ = 検証
      handleSwipe(ticket);
    }
  };

  return (
    <div className={styles.validator}>
      <h2>チケット検証（もぎり）</h2>
      
      {stats && (
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span>本日の検証数</span>
            <strong>{stats.todayUsed}</strong>
          </div>
          <div className={styles.statItem}>
            <span>有効チケット</span>
            <strong>{stats.valid}</strong>
          </div>
        </div>
      )}
      
      <div className={styles.validationMethods}>
        <div className={styles.manualInput}>
          <h3>手動入力</h3>
          <form onSubmit={handleValidate}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="チケットIDを入力"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
              />
              <button type="submit">検証</button>
            </div>
          </form>
        </div>
        
        <div className={styles.swipeSection}>
          <h3>スワイプで検証</h3>
          <p className={styles.instruction}>
            チケットを左にスワイプして検証します
          </p>
          
          <div className={styles.swipeContainer} ref={swipeContainerRef}>
            {swipeTickets.length === 0 ? (
              <p className={styles.noTickets}>有効なチケットがありません</p>
            ) : (
              swipeTickets.map(ticket => (
                <div
                  key={ticket.id}
                  className={styles.swipeableTicket}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={(e) => handleTouchEnd(e, ticket)}
                  onMouseDown={(e) => { touchStartX.current = e.screenX; }}
                  onMouseUp={(e) => {
                    touchEndX.current = e.screenX;
                    handleSwipeGesture(ticket);
                  }}
                >
                  <div className={styles.swipeIndicator}>
                    ← スワイプして検証
                  </div>
                  <TicketDisplay ticket={ticket} />
                </div>
              ))
            )}
          </div>
          
          <button 
            className={styles.refreshButton}
            onClick={loadPendingTickets}
          >
            チケットを更新
          </button>
        </div>
      </div>
      
      {validationResult && (
        <div className={`${styles.result} ${validationResult.success ? styles.success : styles.error}`}>
          <h3>{validationResult.success ? '✓ 検証成功' : '✗ 検証失敗'}</h3>
          <p>{validationResult.message}</p>
          {validationResult.ticket && (
            <TicketDisplay ticket={validationResult.ticket} />
          )}
        </div>
      )}
    </div>
  );
}