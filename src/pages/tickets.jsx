import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from 'src/components/Layout';
import { useApp } from 'src/contexts/AppContext';
import classes from 'src/styles/Tickets.module.css';

const Tickets = () => {
  const router = useRouter();
  const { state } = useApp();

  useEffect(() => {
    // 管理者の場合は管理画面へ、それ以外はユーザー画面へリダイレクト
    if (state.user?.isAdmin) {
      router.replace('/admin/tickets');
    } else {
      router.replace('/ticket-purchase');
    }
  }, [state.user, router]);

  return (
    <Layout>
      <div className={classes.redirectMessage}>
        リダイレクト中...
      </div>
    </Layout>
  );
};

export default Tickets;