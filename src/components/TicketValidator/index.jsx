import { useState } from 'react';
import PropTypes from 'prop-types';
import { ticketService } from 'src/services/ticketService';
import classes from './TicketValidator.module.css';

export const TicketValidator = ({ onValidationComplete }) => {
  const [ticketId, setTicketId] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const handleValidate = async () => {
    if (!ticketId.trim()) {
      alert('チケットIDを入力してください');
      return;
    }

    setIsValidating(true);
    const result = ticketService.validateTicket(ticketId);
    setValidationResult(result);
    setIsValidating(false);

    if (result.success && onValidationComplete) {
      onValidationComplete(result);
    }

    setTimeout(() => {
      setTicketId('');
      setValidationResult(null);
    }, 5000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleValidate();
    }
  };

  return (
    <div className={classes.validatorContainer}>
      <h2 className={classes.title}>チケット検証（もぎり）</h2>
      
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
          onClick={handleValidate}
          disabled={isValidating || !ticketId.trim()}
          className={classes.validateButton}
        >
          {isValidating ? '検証中...' : '検証する'}
        </button>
      </div>

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