import { useState, useEffect } from 'react';
import { Layout } from 'src/components/Layout';
import { TicketIssuer } from 'src/components/TicketIssuer';
import { TicketDisplay } from 'src/components/TicketDisplay';
import { ticketService } from 'src/services/ticketService';
import { useApp } from 'src/contexts/AppContext';
import classes from 'src/styles/Tickets.module.css';

const TicketPurchase = () => {
  const { dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('purchase');
  const [searchName, setSearchName] = useState('');
  const [userTickets, setUserTickets] = useState([]);

  const handleTicketIssued = (issuedTickets) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: `${issuedTickets.length}枚のチケットを購入しました`,
        type: 'success'
      }
    });
    setActiveTab('my-tickets');
    // If we know the customer name, load their tickets
    if (issuedTickets.length > 0 && issuedTickets[0].customerName) {
      setSearchName(issuedTickets[0].customerName);
      setUserTickets(ticketService.getTicketsByCustomer(issuedTickets[0].customerName));
    }
  };

  const handleSearchTickets = () => {
    if (!searchName.trim()) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: '名前を入力してください',
          type: 'error'
        }
      });
      return;
    }
    const tickets = ticketService.getTicketsByCustomer(searchName);
    setUserTickets(tickets);
    if (tickets.length === 0) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: '該当するチケットが見つかりませんでした',
          type: 'info'
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
        // Refresh user tickets
        if (searchName) {
          setUserTickets(ticketService.getTicketsByCustomer(searchName));
        }
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

  const activeTickets = userTickets.filter(t => t.status === 'active');
  const usedTickets = userTickets.filter(t => t.status === 'used');
  const cancelledTickets = userTickets.filter(t => t.status === 'cancelled');

  return (
    <Layout title="チケット購入">
      <div className={classes.ticketsContainer}>
        <h1 className={classes.pageTitle}>🎫 チケット購入・確認</h1>

        <div className={classes.tabs}>
          <button
            className={`${classes.tab} ${activeTab === 'purchase' ? classes.active : ''}`}
            onClick={() => setActiveTab('purchase')}
          >
            <span className={classes.tabIcon}>🎟️</span>
            チケット購入
          </button>
          <button
            className={`${classes.tab} ${activeTab === 'my-tickets' ? classes.active : ''}`}
            onClick={() => setActiveTab('my-tickets')}
          >
            <span className={classes.tabIcon}>📱</span>
            マイチケット
          </button>
        </div>

        <div className={classes.content}>
          {activeTab === 'purchase' && (
            <div>
              <div className={classes.sectionHeader}>
                <h2 className={classes.sectionTitle}>チケット購入</h2>
                <p className={classes.sectionDescription}>
                  イベントのチケットを購入できます。購入後は「マイチケット」から確認できます。
                </p>
              </div>
              <TicketIssuer onTicketIssued={handleTicketIssued} />
            </div>
          )}

          {activeTab === 'my-tickets' && (
            <div className={classes.listSection}>
              <div className={classes.sectionHeader}>
                <h2 className={classes.sectionTitle}>マイチケット</h2>
                <p className={classes.sectionDescription}>
                  お名前で検索して、購入したチケットを確認できます。
                </p>
              </div>

              <div className={classes.searchSection}>
                <div className={classes.searchBar}>
                  <input
                    type="text"
                    placeholder="お名前を入力してください"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className={classes.searchInput}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchTickets()}
                  />
                  <button 
                    onClick={handleSearchTickets}
                    className={classes.searchButton}
                  >
                    検索
                  </button>
                </div>
              </div>

              {userTickets.length > 0 && (
                <>
                  <div className={classes.ticketStats}>
                    <div className={classes.statItem}>
                      <span className={classes.statIcon}>✅</span>
                      <span>有効: {activeTickets.length}枚</span>
                    </div>
                    <div className={classes.statItem}>
                      <span className={classes.statIcon}>🎯</span>
                      <span>使用済み: {usedTickets.length}枚</span>
                    </div>
                    <div className={classes.statItem}>
                      <span className={classes.statIcon}>❌</span>
                      <span>キャンセル: {cancelledTickets.length}枚</span>
                    </div>
                  </div>

                  <div className={classes.ticketGrid}>
                    {userTickets.map(ticket => (
                      <TicketDisplay
                        key={ticket.id}
                        ticket={ticket}
                        onCancel={ticket.status === 'active' ? handleCancelTicket : null}
                        showQRCode={true}
                        compact={false}
                      />
                    ))}
                  </div>
                </>
              )}

              {userTickets.length === 0 && searchName && (
                <div className={classes.emptyState}>
                  <span className={classes.emptyIcon}>🎫</span>
                  <p>「{searchName}」さんのチケットが見つかりませんでした</p>
                  <p className={classes.emptyHint}>正確な名前でお試しください</p>
                </div>
              )}

              {!searchName && (
                <div className={classes.emptyState}>
                  <span className={classes.emptyIcon}>🔍</span>
                  <p>名前を入力してチケットを検索してください</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TicketPurchase;