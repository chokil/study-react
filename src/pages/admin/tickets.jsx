import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/AdminTickets.module.css';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Main } from '../../components/Main';
import { TicketValidator } from '../../components/TicketValidator';
import { TicketDisplay } from '../../components/TicketDisplay';
import { getAllTickets, getTicketStatistics } from '../../services/ticketService';

export default function AdminTickets() {
  const [activeTab, setActiveTab] = useState('validate');
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    used: 0,
    cancelled: 0,
    expired: 0,
    validatedToday: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, filter, searchTerm]);

  const loadData = () => {
    const allTickets = getAllTickets();
    setTickets(allTickets);
    setStatistics(getTicketStatistics());
  };

  const filterTickets = () => {
    let filtered = [...tickets];
    
    if (filter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTickets(filtered);
  };

  const handleValidation = () => {
    loadData();
  };

  const handleTicketUpdate = () => {
    loadData();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>チケット管理 (管理者) - Study React</title>
        <meta name="description" content="チケット管理システム - 管理者用" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Main>
        <div className={styles.header}>
          <h1 className={styles.title}>チケット管理システム</h1>
          <span className={styles.adminBadge}>管理者</span>
        </div>

        <div className={styles.statistics}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>総発行数</div>
            <div className={styles.statValue}>{statistics.total}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>有効</div>
            <div className={styles.statValue}>{statistics.active}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>使用済み</div>
            <div className={styles.statValue}>{statistics.used}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>本日検証</div>
            <div className={styles.statValue}>{statistics.validatedToday}</div>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'validate' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('validate')}
          >
            チケット検証（もぎり）
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'manage' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            チケット管理
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'analytics' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            統計・分析
          </button>
        </div>

        {activeTab === 'validate' && (
          <div className={styles.validateSection}>
            <TicketValidator onValidate={handleValidation} />
          </div>
        )}

        {activeTab === 'manage' && (
          <div className={styles.manageSection}>
            <div className={styles.controls}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="チケットID、顧客名、イベント名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.filterButtons}>
                <button
                  className={`${styles.filterButton} ${filter === 'all' ? styles.activeFilter : ''}`}
                  onClick={() => setFilter('all')}
                >
                  すべて ({tickets.length})
                </button>
                <button
                  className={`${styles.filterButton} ${filter === 'active' ? styles.activeFilter : ''}`}
                  onClick={() => setFilter('active')}
                >
                  有効 ({statistics.active})
                </button>
                <button
                  className={`${styles.filterButton} ${filter === 'used' ? styles.activeFilter : ''}`}
                  onClick={() => setFilter('used')}
                >
                  使用済み ({statistics.used})
                </button>
                <button
                  className={`${styles.filterButton} ${filter === 'cancelled' ? styles.activeFilter : ''}`}
                  onClick={() => setFilter('cancelled')}
                >
                  キャンセル ({statistics.cancelled})
                </button>
              </div>
            </div>

            <div className={styles.ticketGrid}>
              {filteredTickets.length === 0 ? (
                <p className={styles.noTickets}>該当するチケットがありません。</p>
              ) : (
                filteredTickets.map(ticket => (
                  <TicketDisplay
                    key={ticket.id}
                    ticket={ticket}
                    onCancel={handleTicketUpdate}
                    showCancelButton={ticket.status === 'active'}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className={styles.analyticsSection}>
            <h2>チケット統計</h2>
            
            <div className={styles.analyticsGrid}>
              <div className={styles.analyticsCard}>
                <h3>ステータス別内訳</h3>
                <div className={styles.chartPlaceholder}>
                  <div className={styles.barChart}>
                    <div className={styles.barItem}>
                      <span className={styles.barLabel}>有効</span>
                      <div className={styles.barContainer}>
                        <div 
                          className={`${styles.bar} ${styles.activeBar}`}
                          style={{ width: `${(statistics.active / statistics.total * 100) || 0}%` }}
                        />
                        <span className={styles.barValue}>{statistics.active}</span>
                      </div>
                    </div>
                    <div className={styles.barItem}>
                      <span className={styles.barLabel}>使用済み</span>
                      <div className={styles.barContainer}>
                        <div 
                          className={`${styles.bar} ${styles.usedBar}`}
                          style={{ width: `${(statistics.used / statistics.total * 100) || 0}%` }}
                        />
                        <span className={styles.barValue}>{statistics.used}</span>
                      </div>
                    </div>
                    <div className={styles.barItem}>
                      <span className={styles.barLabel}>キャンセル</span>
                      <div className={styles.barContainer}>
                        <div 
                          className={`${styles.bar} ${styles.cancelledBar}`}
                          style={{ width: `${(statistics.cancelled / statistics.total * 100) || 0}%` }}
                        />
                        <span className={styles.barValue}>{statistics.cancelled}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.analyticsCard}>
                <h3>チケット種別統計</h3>
                <div className={styles.typeStats}>
                  {['general', 'student', 'senior', 'child'].map(type => {
                    const typeTickets = tickets.filter(t => t.ticketType === type);
                    const typeLabels = {
                      general: '一般',
                      student: '学生',
                      senior: 'シニア',
                      child: '子供'
                    };
                    return (
                      <div key={type} className={styles.typeStatItem}>
                        <span className={styles.typeLabel}>{typeLabels[type]}</span>
                        <span className={styles.typeCount}>{typeTickets.length}枚</span>
                        <span className={styles.typePercentage}>
                          ({((typeTickets.length / tickets.length * 100) || 0).toFixed(1)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.analyticsCard}>
                <h3>日次検証数</h3>
                <div className={styles.dailyStats}>
                  <div className={styles.todayHighlight}>
                    <span className={styles.todayLabel}>本日の検証数</span>
                    <span className={styles.todayValue}>{statistics.validatedToday}</span>
                  </div>
                  <div className={styles.validationRate}>
                    検証率: {((statistics.used / statistics.total * 100) || 0).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Main>
      <Footer />
    </div>
  );
}