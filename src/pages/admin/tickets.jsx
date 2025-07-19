import { useState, useEffect } from 'react';
import { Layout } from 'src/components/Layout';
import { TicketValidator } from 'src/components/TicketValidator';
import { TicketDisplay } from 'src/components/TicketDisplay';
import { ticketService } from 'src/services/ticketService';
import { useApp } from 'src/contexts/AppContext';
import classes from 'src/styles/Tickets.module.css';

const AdminTickets = () => {
  const { dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('validate');
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadTickets();
    loadStats();
  }, []);

  const loadTickets = () => {
    setTickets(ticketService.getAllTickets());
  };

  const loadStats = () => {
    setStats(ticketService.getTicketStats());
  };

  const handleValidationComplete = (result) => {
    loadTickets();
    loadStats();
    if (result.success) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'チケットの検証が完了しました',
          type: 'success'
        }
      });
    }
  };

  const handleCancelTicket = (ticketId) => {
    if (window.confirm('このチケットをキャンセルしますか？')) {
      const result = ticketService.cancelTicket(ticketId);
      if (result.success) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            message: result.message,
            type: 'success'
          }
        });
        loadTickets();
        loadStats();
      } else {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            message: result.message,
            type: 'error'
          }
        });
      }
    }
  };

  const getFilteredTickets = () => {
    let filtered = tickets;

    // Apply status filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(t => t.status === 'active');
        break;
      case 'used':
        filtered = filtered.filter(t => t.status === 'used');
        break;
      case 'cancelled':
        filtered = filtered.filter(t => t.status === 'cancelled');
        break;
      default:
        break;
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(term) ||
        (t.customerName && t.customerName.toLowerCase().includes(term)) ||
        (t.eventName && t.eventName.toLowerCase().includes(term))
      );
    }

    return filtered;
  };

  const filteredTickets = getFilteredTickets();

  return (
    <Layout title="チケット管理 - 管理者">
      <div className={classes.ticketsContainer}>
        <h1 className={classes.pageTitle}>🛡️ チケット管理システム（管理者）</h1>

        <div className={classes.tabs}>
          <button
            className={`${classes.tab} ${activeTab === 'validate' ? classes.active : ''}`}
            onClick={() => setActiveTab('validate')}
          >
            <span className={classes.tabIcon}>✅</span>
            チケット検証
          </button>
          <button
            className={`${classes.tab} ${activeTab === 'manage' ? classes.active : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            <span className={classes.tabIcon}>📋</span>
            チケット管理
          </button>
          <button
            className={`${classes.tab} ${activeTab === 'stats' ? classes.active : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <span className={classes.tabIcon}>📊</span>
            統計・分析
          </button>
        </div>

        <div className={classes.content}>
          {activeTab === 'validate' && (
            <div>
              <div className={classes.sectionHeader}>
                <h2 className={classes.sectionTitle}>チケット検証（もぎり）</h2>
                <p className={classes.sectionDescription}>
                  チケットIDを入力するか、スワイプ機能でチケットの検証を行えます。
                </p>
              </div>
              <TicketValidator onValidationComplete={handleValidationComplete} />
            </div>
          )}

          {activeTab === 'manage' && (
            <div className={classes.listSection}>
              <div className={classes.sectionHeader}>
                <h2 className={classes.sectionTitle}>チケット管理</h2>
                <p className={classes.sectionDescription}>
                  全てのチケットの管理、検索、キャンセルが行えます。
                </p>
              </div>

              <div className={classes.controlBar}>
                <div className={classes.searchSection}>
                  <input
                    type="text"
                    placeholder="チケットID、顧客名、イベント名で検索"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={classes.searchInput}
                  />
                </div>

                <div className={classes.filters}>
                  <button
                    className={`${classes.filterButton} ${filter === 'all' ? classes.active : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    すべて ({tickets.length})
                  </button>
                  <button
                    className={`${classes.filterButton} ${filter === 'active' ? classes.active : ''}`}
                    onClick={() => setFilter('active')}
                  >
                    有効 ({tickets.filter(t => t.status === 'active').length})
                  </button>
                  <button
                    className={`${classes.filterButton} ${filter === 'used' ? classes.active : ''}`}
                    onClick={() => setFilter('used')}
                  >
                    使用済み ({tickets.filter(t => t.status === 'used').length})
                  </button>
                  <button
                    className={`${classes.filterButton} ${filter === 'cancelled' ? classes.active : ''}`}
                    onClick={() => setFilter('cancelled')}
                  >
                    キャンセル ({tickets.filter(t => t.status === 'cancelled').length})
                  </button>
                </div>
              </div>

              {filteredTickets.length === 0 ? (
                <div className={classes.emptyState}>
                  <span className={classes.emptyIcon}>🎫</span>
                  <p>該当するチケットがありません</p>
                </div>
              ) : (
                <div className={classes.ticketGrid}>
                  {filteredTickets.map(ticket => (
                    <TicketDisplay
                      key={ticket.id}
                      ticket={ticket}
                      onCancel={ticket.status === 'active' ? handleCancelTicket : null}
                      showQRCode={false}
                      compact={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className={classes.statsSection}>
              <div className={classes.sectionHeader}>
                <h2 className={classes.sectionTitle}>統計・分析</h2>
                <p className={classes.sectionDescription}>
                  チケットシステムの利用状況と統計データです。
                </p>
              </div>

              <div className={classes.statsGrid}>
                <div className={classes.statCard}>
                  <span className={classes.statIcon}>📊</span>
                  <div>
                    <p className={classes.statLabel}>総発券数</p>
                    <p className={classes.statValue}>{stats.total || 0}</p>
                  </div>
                </div>
                <div className={classes.statCard}>
                  <span className={classes.statIcon}>✅</span>
                  <div>
                    <p className={classes.statLabel}>有効チケット</p>
                    <p className={classes.statValue}>{stats.active || 0}</p>
                  </div>
                </div>
                <div className={classes.statCard}>
                  <span className={classes.statIcon}>🎯</span>
                  <div>
                    <p className={classes.statLabel}>使用済み</p>
                    <p className={classes.statValue}>{stats.used || 0}</p>
                  </div>
                </div>
                <div className={classes.statCard}>
                  <span className={classes.statIcon}>❌</span>
                  <div>
                    <p className={classes.statLabel}>キャンセル</p>
                    <p className={classes.statValue}>{stats.cancelled || 0}</p>
                  </div>
                </div>
                <div className={classes.statCard}>
                  <span className={classes.statIcon}>📅</span>
                  <div>
                    <p className={classes.statLabel}>本日の検証数</p>
                    <p className={classes.statValue}>{stats.todayValidated || 0}</p>
                  </div>
                </div>
              </div>

              {stats.byType && Object.keys(stats.byType).length > 0 && (
                <div className={classes.typeStatsSection}>
                  <h3 className={classes.subsectionTitle}>チケット種別内訳</h3>
                  <div className={classes.typeStats}>
                    {Object.entries(stats.byType).map(([type, count]) => (
                      <div key={type} className={classes.typeStatItem}>
                        <span className={classes.typeName}>
                          {type === 'general' ? '一般' : 
                           type === 'student' ? '学生' : 
                           type === 'senior' ? 'シニア' : 
                           type === 'child' ? '子供' : type}
                        </span>
                        <span className={classes.typeCount}>{count}枚</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminTickets;