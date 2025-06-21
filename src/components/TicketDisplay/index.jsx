import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import styles from './TicketDisplay.module.css';

export default function TicketDisplay({ ticket, onCancel }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (ticket && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, ticket.id, {
        width: 150,
        margin: 1,
      });
    }
  }, [ticket]);

  if (!ticket) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = () => {
    switch (ticket.status) {
      case 'valid': return '#4CAF50';
      case 'used': return '#2196F3';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusText = () => {
    switch (ticket.status) {
      case 'valid': return '有効';
      case 'used': return '使用済み';
      case 'cancelled': return 'キャンセル済み';
      default: return ticket.status;
    }
  };

  return (
    <div className={styles.ticket}>
      <div className={styles.header}>
        <h3 className={styles.eventName}>{ticket.eventName}</h3>
        <span 
          className={styles.status}
          style={{ backgroundColor: getStatusColor() }}
        >
          {getStatusText()}
        </span>
      </div>
      
      <div className={styles.info}>
        <p><strong>日付:</strong> {formatDate(ticket.eventDate)}</p>
        <p><strong>お客様名:</strong> {ticket.customerName}</p>
        <p><strong>チケットタイプ:</strong> {ticket.ticketType}</p>
        <p><strong>チケットID:</strong> {ticket.id}</p>
      </div>
      
      <div className={styles.qrContainer}>
        <canvas ref={canvasRef}></canvas>
      </div>
      
      {ticket.status === 'valid' && onCancel && (
        <button 
          className={styles.cancelButton}
          onClick={() => onCancel(ticket.id)}
        >
          キャンセル
        </button>
      )}
      
      {ticket.usedAt && (
        <p className={styles.usedAt}>
          使用日時: {new Date(ticket.usedAt).toLocaleString('ja-JP')}
        </p>
      )}
    </div>
  );
}