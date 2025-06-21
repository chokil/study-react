import React, { useState } from 'react';
import { Layout } from 'src/components/Layout';
import styles from '../styles/TicketPurchase.module.css';
import { issueTicket, getTicketsByCustomer } from '../services/ticketService';
import { TicketDisplay } from '../components/TicketDisplay';

export default function TicketPurchase() {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    customerName: '',
    ticketType: 'general',
    quantity: 1
  });
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const [showPurchaseForm, setShowPurchaseForm] = useState(true);
  const [message, setMessage] = useState('');
  const [myTickets, setMyTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('purchase');

  const ticketTypes = [
    { value: 'general', label: '一般', price: 1000 },
    { value: 'student', label: '学生', price: 500 },
    { value: 'senior', label: 'シニア', price: 700 },
    { value: 'child', label: '子供', price: 300 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tickets = [];
    
    for (let i = 0; i < formData.quantity; i++) {
      const result = issueTicket(
        formData.eventName,
        formData.eventDate,
        formData.customerName,
        formData.ticketType
      );
      
      if (result.success) {
        tickets.push(result.ticket);
      }
    }
    
    if (tickets.length > 0) {
      setPurchasedTickets(tickets);
      setShowPurchaseForm(false);
      setMessage(`${tickets.length}枚のチケットを購入しました！`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleNewPurchase = () => {
    setShowPurchaseForm(true);
    setPurchasedTickets([]);
    setFormData({
      eventName: '',
      eventDate: '',
      customerName: '',
      ticketType: 'general',
      quantity: 1
    });
  };

  const loadMyTickets = () => {
    if (formData.customerName) {
      const tickets = getTicketsByCustomer(formData.customerName);
      setMyTickets(tickets);
    }
  };

  const selectedTicketType = ticketTypes.find(t => t.value === formData.ticketType);
  const totalPrice = selectedTicketType ? selectedTicketType.price * formData.quantity : 0;

  return (
    <Layout title="チケット購入 - Study React">
      <div className={styles.container}>
        <h1 className={styles.title}>チケット購入</h1>
        
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'purchase' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('purchase')}
          >
            チケット購入
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'mytickets' ? styles.activeTab : ''}`}
            onClick={() => {
              setActiveTab('mytickets');
              loadMyTickets();
            }}
          >
            マイチケット
          </button>
        </div>

        {message && (
          <div className={styles.successMessage}>{message}</div>
        )}

        {activeTab === 'purchase' && (
          <div className={styles.purchaseSection}>
            {showPurchaseForm ? (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="eventName">イベント名</label>
                  <input
                    type="text"
                    id="eventName"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    required
                    placeholder="例: 夏祭り2024"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="eventDate">イベント日</label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="customerName">お名前</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    placeholder="山田太郎"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="ticketType">チケット種別</label>
                  <select
                    id="ticketType"
                    name="ticketType"
                    value={formData.ticketType}
                    onChange={handleInputChange}
                  >
                    {ticketTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} (¥{type.price})
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
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    required
                  />
                </div>

                <div className={styles.priceDisplay}>
                  <span>合計金額: </span>
                  <span className={styles.totalPrice}>¥{totalPrice.toLocaleString()}</span>
                </div>

                <button type="submit" className={styles.purchaseButton}>
                  購入する
                </button>
              </form>
            ) : (
              <div className={styles.purchaseComplete}>
                <h2>購入完了</h2>
                <p>以下のチケットを購入しました：</p>
                <div className={styles.ticketList}>
                  {purchasedTickets.map(ticket => (
                    <TicketDisplay
                      key={ticket.id}
                      ticket={ticket}
                      showCancelButton={false}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNewPurchase}
                  className={styles.newPurchaseButton}
                >
                  新しいチケットを購入
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'mytickets' && (
          <div className={styles.myTicketsSection}>
            {!formData.customerName ? (
              <div className={styles.namePrompt}>
                <p>マイチケットを表示するには、お名前を入力してください。</p>
                <input
                  type="text"
                  placeholder="お名前"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  className={styles.nameInput}
                />
                <button onClick={loadMyTickets} className={styles.loadButton}>
                  チケットを表示
                </button>
              </div>
            ) : (
              <>
                <h2>{formData.customerName}様のチケット</h2>
                {myTickets.length === 0 ? (
                  <p className={styles.noTickets}>チケットがありません。</p>
                ) : (
                  <div className={styles.ticketList}>
                    {myTickets.map(ticket => (
                      <TicketDisplay
                        key={ticket.id}
                        ticket={ticket}
                        showCancelButton={ticket.status === 'active'}
                        onCancel={() => loadMyTickets()}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}