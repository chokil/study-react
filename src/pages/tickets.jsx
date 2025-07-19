import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from 'src/components/Layout';
import { useApp } from 'src/contexts/AppContext';
import classes from 'src/styles/Tickets.module.css';

const Tickets = () => {
  const router = useRouter();
  const { state } = useApp();

  useEffect(() => {
    const isAdmin = state.user?.email?.endsWith('@admin.com');
    
    if (isAdmin) {
      router.push('/admin/tickets');
    } else {
      router.push('/ticket-purchase');
    }
  }, [router, state.user]);

  return (
    <Layout title="チケットシステム">
      <div className={classes.ticketsContainer}>
        <div className={classes.redirectMessage}>
          <h1 className={classes.pageTitle}>🎫 チケットシステム</h1>
          <p>適切なページにリダイレクトしています...</p>
          <div className={classes.redirectOptions}>
            <p>
              <strong>一般ユーザー:</strong> チケット購入ページへ<br/>
              <strong>管理者:</strong> チケット管理ページへ
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tickets;