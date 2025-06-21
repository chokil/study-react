import { useState } from 'react';
import ticketService from '../../services/ticketService';
import styles from './TicketIssuer.module.css';

export default function TicketIssuer({ onTicketsIssued }) {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    customerName: '',
    ticketType: 'general',
    quantity: 1,
  });

  const ticketTypes = [
    { value: 'general', label: '一般' },
    { value: 'student', label: '学生' },
    { value: 'senior', label: 'シニア' },
    { value: 'child', label: '子供' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.eventName || !formData.eventDate || !formData.customerName) {
      alert('すべての必須項目を入力してください');
      return;
    }
    
    const tickets = ticketService.issueTicket(
      formData.eventName,
      formData.eventDate,
      formData.customerName,
      formData.ticketType,
      formData.quantity
    );
    
    if (onTicketsIssued) {
      onTicketsIssued(tickets);
    }
    
    setFormData({
      eventName: '',
      eventDate: '',
      customerName: '',
      ticketType: 'general',
      quantity: 1,
    });
    
    alert(`${tickets.length}枚のチケットを発券しました`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value,
    }));
  };

  return (
    <div className={styles.issuer}>
      <h2>チケット発券</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="eventName">イベント名 *</label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="eventDate">イベント日付 *</label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="customerName">お客様名 *</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="ticketType">チケットタイプ</label>
          <select
            id="ticketType"
            name="ticketType"
            value={formData.ticketType}
            onChange={handleChange}
          >
            {ticketTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="quantity">枚数</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            max="10"
          />
        </div>
        
        <button type="submit" className={styles.submitButton}>
          チケット発券
        </button>
      </form>
    </div>
  );
}