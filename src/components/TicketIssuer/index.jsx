import { useState } from 'react';
import PropTypes from 'prop-types';
import { ticketService } from 'src/services/ticketService';
import classes from './TicketIssuer.module.css';

const ticketTypes = [
  { id: 'general', name: '一般', price: 1000, color: '#4CAF50' },
  { id: 'student', name: '学生', price: 500, color: '#2196F3' },
  { id: 'senior', name: 'シニア', price: 700, color: '#FF9800' },
  { id: 'child', name: '子供', price: 300, color: '#E91E63' },
];

export const TicketIssuer = ({ onTicketIssued }) => {
  const [selectedType, setSelectedType] = useState('general');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [isIssuing, setIsIssuing] = useState(false);

  const handleIssueTickets = async () => {
    if (!customerName || !eventName || !eventDate) {
      alert('すべての項目を入力してください');
      return;
    }

    setIsIssuing(true);
    const issuedTickets = [];
    const ticketType = ticketTypes.find(t => t.id === selectedType);

    for (let i = 0; i < quantity; i++) {
      const ticket = ticketService.issueTicket({
        type: selectedType,
        typeName: ticketType.name,
        price: ticketType.price,
        color: ticketType.color,
        customerName,
        eventName,
        eventDate,
        expiryDate: new Date(eventDate).toISOString(),
      });
      issuedTickets.push(ticket);
    }

    setIsIssuing(false);
    
    setCustomerName('');
    setQuantity(1);
    setSelectedType('general');
    
    if (onTicketIssued) {
      onTicketIssued(issuedTickets);
    }
  };

  const getTotalPrice = () => {
    const ticketType = ticketTypes.find(t => t.id === selectedType);
    return ticketType.price * quantity;
  };

  return (
    <div className={classes.issuerContainer}>
      <h2 className={classes.title}>チケット発券</h2>

      <div className={classes.formGroup}>
        <label>イベント名</label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="例：春の音楽祭"
          className={classes.input}
        />
      </div>

      <div className={classes.formGroup}>
        <label>イベント日</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className={classes.input}
        />
      </div>

      <div className={classes.formGroup}>
        <label>お客様名</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="例：山田太郎"
          className={classes.input}
        />
      </div>

      <div className={classes.formGroup}>
        <label>チケット種別</label>
        <div className={classes.ticketTypes}>
          {ticketTypes.map(type => (
            <button
              key={type.id}
              className={`${classes.typeButton} ${selectedType === type.id ? classes.selected : ''}`}
              onClick={() => setSelectedType(type.id)}
              style={{ 
                backgroundColor: selectedType === type.id ? type.color : 'transparent',
                borderColor: type.color,
                color: selectedType === type.id ? 'white' : type.color
              }}
            >
              <span className={classes.typeName}>{type.name}</span>
              <span className={classes.typePrice}>¥{type.price}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={classes.formGroup}>
        <label>枚数</label>
        <div className={classes.quantityControl}>
          <button
            className={classes.quantityButton}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className={classes.quantity}>{quantity}</span>
          <button
            className={classes.quantityButton}
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            disabled={quantity >= 10}
          >
            +
          </button>
        </div>
      </div>

      <div className={classes.totalSection}>
        <span>合計金額</span>
        <span className={classes.totalPrice}>¥{getTotalPrice().toLocaleString()}</span>
      </div>

      <button
        className={classes.issueButton}
        onClick={handleIssueTickets}
        disabled={isIssuing || !customerName || !eventName || !eventDate}
      >
        {isIssuing ? '発券中...' : 'チケットを発券する'}
      </button>
    </div>
  );
};

TicketIssuer.propTypes = {
  onTicketIssued: PropTypes.func,
};