import { useState, useEffect } from 'react';
import { Layout } from 'src/components/Layout';
import { TicketIssuer } from 'src/components/TicketIssuer';
import { TicketValidator } from 'src/components/TicketValidator';
import { TicketDisplay } from 'src/components/TicketDisplay';
import { ticketService } from 'src/services/ticketService';
import { useApp } from 'src/contexts/AppContext';
import classes from 'src/styles/Tickets.module.css';

const Tickets = () => {
  const { dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('issue');
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    setTickets(ticketService.getAllTickets());
  };

  const handleTicketIssued = (issuedTickets) => {
    loadTickets();
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: `${issuedTickets.length}枚のチケットが発券されました`,
        type: 'success'
      }
    });
    setActiveTab('list');
  };

  const handleValidationComplete = (result) => {
    loadTickets();
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
    switch (filter) {
      case 'active':
        return tickets.filter(t => t.status === 'active');
      case 'used':
        return tickets.filter(t => t.status === 'used');
      case 'cancelled':
        return tickets.filter(t => t.status === 'cancelled');
      default:
        return tickets;
    }
  };

  const filteredTickets = getFilteredTickets();

  return (
    <Layout title="チケット管理システム">
      <div className={classes.ticketsContainer}>
        <h1 className={classes.pageTitle}>🎫 チケット発券・検証システム</h1>

        <div className={classes.tabs}>
          <button
            className={`${classes.tab} ${activeTab === 'issue' ? classes.active : ''}`}
            onClick={() => setActiveTab('issue')}
          >
            <span className={classes.tabIcon}>🎟️</span>
            発券
          </button>
          <button
            className={`${classes.tab} ${activeTab === 'validate' ? classes.active : ''}`}
            onClick={() => setActiveTab('validate')}
          >
            <span className={classes.tabIcon}>✅</span>
            もぎり（検証）
          </button>
          <button
            className={`${classes.tab} ${activeTab === 'list' ? classes.active : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <span className={classes.tabIcon}>📋</span>
            チケット一覧
          </button>
        </div>

        <div className={classes.content}>
          {activeTab === 'issue' && (
            <TicketIssuer onTicketIssued={handleTicketIssued} />
          )}

          {activeTab === 'validate' && (
            <TicketValidator onValidationComplete={handleValidationComplete} />
          )}

          {activeTab === 'list' && (
            <div className={classes.listSection}>
              <div className={classes.filterBar}>
                <h2 className={classes.sectionTitle}>チケット一覧</h2>
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
                  <p>チケットがありません</p>
                </div>
              ) : (
                <div className={classes.ticketGrid}>
                  {filteredTickets.map(ticket => (
                    <TicketDisplay
                      key={ticket.id}
                      ticket={ticket}
                      onCancel={handleCancelTicket}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={classes.footer}>
          <div className={classes.stats}>
            <div className={classes.statCard}>
              <span className={classes.statIcon}>📊</span>
              <div>
                <p className={classes.statLabel}>総発券数</p>
                <p className={classes.statValue}>{tickets.length}</p>
              </div>
            </div>
            <div className={classes.statCard}>
              <span className={classes.statIcon}>✅</span>
              <div>
                <p className={classes.statLabel}>有効チケット</p>
                <p className={classes.statValue}>{tickets.filter(t => t.status === 'active').length}</p>
              </div>
            </div>
            <div className={classes.statCard}>
              <span className={classes.statIcon}>🎯</span>
              <div>
                <p className={classes.statLabel}>使用済み</p>
                <p className={classes.statValue}>{tickets.filter(t => t.status === 'used').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tickets;