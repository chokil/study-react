import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TicketIssuer from '../components/TicketIssuer';
import TicketValidator from '../components/TicketValidator';
import TicketDisplay from '../components/TicketDisplay';
import ticketService from '../services/ticketService';
import styles from '../styles/Tickets.module.css';

export default function Tickets() {
  const [activeTab, setActiveTab] = useState('issue');
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    setTickets(ticketService.getAllTickets());
  };

  const handleTicketsIssued = () => {
    loadTickets();
  };

  const handleCancelTicket = (ticketId) => {
    if (confirm('このチケットをキャンセルしますか？')) {
      ticketService.cancelTicket(ticketId);
      loadTickets();
    }
  };

  const getFilteredTickets = () => {
    if (filter === 'all') return tickets;
    return tickets.filter(t => t.status === filter);
  };

  const stats = ticketService.getTicketStats();

  return (
    <Layout>
      <div className={styles.container}>
        <h1>チケット管理システム</h1>
        
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'issue' ? styles.active : ''}`}
            onClick={() => setActiveTab('issue')}
          >
            発券
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'validate' ? styles.active : ''}`}
            onClick={() => setActiveTab('validate')}
          >
            検証（もぎり）
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'manage' ? styles.active : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            管理
          </button>
        </div>
        
        <div className={styles.content}>
          {activeTab === 'issue' && (
            <TicketIssuer onTicketsIssued={handleTicketsIssued} />
          )}
          
          {activeTab === 'validate' && (
            <TicketValidator />
          )}
          
          {activeTab === 'manage' && (
            <div className={styles.management}>
              <div className={styles.statsOverview}>
                <h2>統計情報</h2>
                <div className={styles.statsGrid}>
                  <div className={styles.stat}>
                    <span>総発券数</span>
                    <strong>{stats.total}</strong>
                  </div>
                  <div className={styles.stat}>
                    <span>有効</span>
                    <strong>{stats.valid}</strong>
                  </div>
                  <div className={styles.stat}>
                    <span>使用済み</span>
                    <strong>{stats.used}</strong>
                  </div>
                  <div className={styles.stat}>
                    <span>キャンセル</span>
                    <strong>{stats.cancelled}</strong>
                  </div>
                </div>
              </div>
              
              <div className={styles.ticketList}>
                <div className={styles.filterBar}>
                  <h2>チケット一覧</h2>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={styles.filter}
                  >
                    <option value="all">すべて</option>
                    <option value="valid">有効</option>
                    <option value="used">使用済み</option>
                    <option value="cancelled">キャンセル</option>
                  </select>
                </div>
                
                <div className={styles.tickets}>
                  {getFilteredTickets().map(ticket => (
                    <TicketDisplay
                      key={ticket.id}
                      ticket={ticket}
                      onCancel={handleCancelTicket}
                    />
                  ))}
                  {getFilteredTickets().length === 0 && (
                    <p className={styles.noTickets}>
                      該当するチケットがありません
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}