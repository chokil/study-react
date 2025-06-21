import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ticketService } from 'src/services/ticketService';
import classes from './TicketValidator.module.css';

export const TicketValidator = ({ onValidationComplete }) => {
  const [ticketId, setTicketId] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [activeTickets, setActiveTickets] = useState([]);
  const [showSwipeView, setShowSwipeView] = useState(false);
  const [swipingTicketId, setSwipingTicketId] = useState(null);
  const swipeRefs = useRef({});

  useEffect(() => {
    if (showSwipeView) {
      setActiveTickets(ticketService.getActiveTickets());
    }
  }, [showSwipeView]);

  const handleValidate = async (id = ticketId) => {
    if (!id.trim()) {
      alert('チケットIDを入力してください');
      return;
    }

    setIsValidating(true);
    const result = ticketService.validateTicket(id);
    setValidationResult(result);
    setIsValidating(false);

    if (result.success) {
      if (onValidationComplete) {
        onValidationComplete(result);
      }
      // Update active tickets list after successful validation
      setActiveTickets(ticketService.getActiveTickets());
    }

    setTimeout(() => {
      setTicketId('');
      setValidationResult(null);
      setSwipingTicketId(null);
    }, 5000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleValidate();
    }
  };

  const handleSwipeStart = (ticketId, e) => {
    const ticket = e.currentTarget;
    const startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    
    swipeRefs.current[ticketId] = {
      startX,
      element: ticket,
      isSwiping: true
    };
    
    setSwipingTicketId(ticketId);
  };

  const handleSwipeMove = (ticketId, e) => {
    const swipeData = swipeRefs.current[ticketId];
    if (!swipeData || !swipeData.isSwiping) return;

    const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const diffX = currentX - swipeData.startX;
    
    // Only allow left swipe
    if (diffX < 0) {
      swipeData.element.style.transform = `translateX(${diffX}px)`;
      swipeData.element.style.opacity = 1 + diffX / 200;
    }
  };

  const handleSwipeEnd = (ticketId, e) => {
    const swipeData = swipeRefs.current[ticketId];
    if (!swipeData || !swipeData.isSwiping) return;

    const endX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
    const diffX = endX - swipeData.startX;
    
    // If swiped more than 100px to the left, validate the ticket
    if (diffX < -100) {
      swipeData.element.style.transform = 'translateX(-100%)';
      swipeData.element.style.opacity = '0';
      setTimeout(() => {
        handleValidate(ticketId);
      }, 300);
    } else {
      // Reset position
      swipeData.element.style.transform = 'translateX(0)';
      swipeData.element.style.opacity = '1';
    }
    
    swipeData.isSwiping = false;
    setSwipingTicketId(null);
  };

  return (
    <div className={classes.validatorContainer}>
      <h2 className={classes.title}>チケット検証（もぎり）</h2>
      
      <div className={classes.viewToggle}>
        <button
          className={`${classes.toggleButton} ${!showSwipeView ? classes.active : ''}`}
          onClick={() => setShowSwipeView(false)}
        >
          手動入力
        </button>
        <button
          className={`${classes.toggleButton} ${showSwipeView ? classes.active : ''}`}
          onClick={() => setShowSwipeView(true)}
        >
          スワイプ検証
        </button>
      </div>
      
      {!showSwipeView ? (
        <>
          <div className={classes.scanSection}>
            <div className={classes.scanIcon}>📷</div>
            <p className={classes.scanText}>QRコードをスキャンまたは下記にチケットIDを入力</p>
          </div>

          <div className={classes.inputSection}>
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="チケットID (例: TKT-1234567890-1234)"
              className={classes.input}
              disabled={isValidating}
            />
            
            <button
              onClick={() => handleValidate()}
              disabled={isValidating || !ticketId.trim()}
              className={classes.validateButton}
            >
              {isValidating ? '検証中...' : '検証する'}
            </button>
          </div>
        </>
      ) : (
        <div className={classes.swipeSection}>
          <div className={classes.swipeInstruction}>
            <span className={classes.swipeIcon}>👈</span>
            <p>チケットを左にスワイプして検証</p>
          </div>
          
          {activeTickets.length === 0 ? (
            <div className={classes.emptyState}>
              <p>有効なチケットがありません</p>
            </div>
          ) : (
            <div className={classes.ticketList}>
              {activeTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`${classes.swipeableTicket} ${swipingTicketId === ticket.id ? classes.swiping : ''}`}
                  onTouchStart={(e) => handleSwipeStart(ticket.id, e)}
                  onTouchMove={(e) => handleSwipeMove(ticket.id, e)}
                  onTouchEnd={(e) => handleSwipeEnd(ticket.id, e)}
                  onMouseDown={(e) => handleSwipeStart(ticket.id, e)}
                  onMouseMove={(e) => handleSwipeMove(ticket.id, e)}
                  onMouseUp={(e) => handleSwipeEnd(ticket.id, e)}
                  onMouseLeave={(e) => handleSwipeEnd(ticket.id, e)}
                  style={{ transition: swipingTicketId === ticket.id ? 'none' : 'all 0.3s' }}
                >
                  <div className={classes.ticketContent}>
                    <div className={classes.ticketHeader}>
                      <span className={classes.ticketIcon}>🎫</span>
                      <span className={classes.ticketId}>{ticket.id}</span>
                    </div>
                    <div className={classes.ticketDetails}>
                      <p><strong>{ticket.eventName}</strong></p>
                      <p>{ticket.customerName} - {ticket.typeName}</p>
                      <p className={classes.ticketDate}>
                        {new Date(ticket.eventDate).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                  </div>
                  <div className={classes.swipeIndicator}>
                    <span>👈</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {validationResult && (
        <div 
          className={`${classes.result} ${validationResult.success ? classes.success : classes.error}`}
        >
          <div className={classes.resultIcon}>
            {validationResult.success ? '✅' : '❌'}
          </div>
          <div className={classes.resultMessage}>
            <h3>{validationResult.message}</h3>
            {validationResult.ticket && (
              <div className={classes.ticketDetails}>
                <p><strong>イベント:</strong> {validationResult.ticket.eventName}</p>
                <p><strong>お客様:</strong> {validationResult.ticket.customerName}</p>
                <p><strong>種別:</strong> {validationResult.ticket.typeName}</p>
                <p><strong>状態:</strong> {validationResult.ticket.status}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={classes.stats}>
        <div className={classes.statItem}>
          <span className={classes.statLabel}>本日の検証数</span>
          <span className={classes.statValue}>
            {ticketService.getUsedTickets().filter(t => 
              new Date(t.validatedAt).toDateString() === new Date().toDateString()
            ).length}
          </span>
        </div>
        <div className={classes.statItem}>
          <span className={classes.statLabel}>有効チケット数</span>
          <span className={classes.statValue}>
            {ticketService.getActiveTickets().length}
          </span>
        </div>
      </div>
    </div>
  );
};

TicketValidator.propTypes = {
  onValidationComplete: PropTypes.func,
};