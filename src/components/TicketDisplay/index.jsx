import PropTypes from 'prop-types';
import classes from './TicketDisplay.module.css';

export const TicketDisplay = ({ ticket, onCancel }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '有効';
      case 'used': return '使用済み';
      case 'cancelled': return 'キャンセル済み';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'used': return '#9E9E9E';
      case 'cancelled': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <div 
      className={classes.ticketCard}
      style={{ borderColor: ticket.color || '#2196F3' }}
    >
      <div className={classes.ticketHeader}>
        <h3 className={classes.eventName}>{ticket.eventName}</h3>
        <span 
          className={classes.status}
          style={{ backgroundColor: getStatusColor(ticket.status) }}
        >
          {getStatusText(ticket.status)}
        </span>
      </div>

      <div className={classes.ticketBody}>
        <div className={classes.ticketInfo}>
          <div className={classes.infoRow}>
            <span className={classes.label}>チケットID:</span>
            <span className={classes.value}>{ticket.id}</span>
          </div>
          
          <div className={classes.infoRow}>
            <span className={classes.label}>種別:</span>
            <span 
              className={classes.ticketType}
              style={{ backgroundColor: ticket.color }}
            >
              {ticket.typeName}
            </span>
          </div>
          
          <div className={classes.infoRow}>
            <span className={classes.label}>お客様名:</span>
            <span className={classes.value}>{ticket.customerName}</span>
          </div>
          
          <div className={classes.infoRow}>
            <span className={classes.label}>イベント日:</span>
            <span className={classes.value}>{formatDate(ticket.eventDate)}</span>
          </div>
          
          <div className={classes.infoRow}>
            <span className={classes.label}>価格:</span>
            <span className={classes.price}>¥{ticket.price.toLocaleString()}</span>
          </div>
          
          <div className={classes.infoRow}>
            <span className={classes.label}>発券日時:</span>
            <span className={classes.value}>{formatDate(ticket.issuedAt)}</span>
          </div>
          
          {ticket.validatedAt && (
            <div className={classes.infoRow}>
              <span className={classes.label}>使用日時:</span>
              <span className={classes.value}>{formatDate(ticket.validatedAt)}</span>
            </div>
          )}
        </div>

        {ticket.status === 'active' && (
          <div className={classes.qrSection}>
            <img 
              src={ticket.qrCode} 
              alt="QR Code"
              className={classes.qrCode}
            />
            <p className={classes.qrLabel}>入場用QRコード</p>
          </div>
        )}
      </div>

      {ticket.status === 'active' && onCancel && (
        <div className={classes.actions}>
          <button 
            className={classes.cancelButton}
            onClick={() => onCancel(ticket.id)}
          >
            キャンセル
          </button>
        </div>
      )}
    </div>
  );
};

TicketDisplay.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.string.isRequired,
    eventName: PropTypes.string.isRequired,
    eventDate: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    typeName: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    color: PropTypes.string,
    status: PropTypes.string.isRequired,
    qrCode: PropTypes.string,
    issuedAt: PropTypes.string.isRequired,
    validatedAt: PropTypes.string,
  }).isRequired,
  onCancel: PropTypes.func,
};