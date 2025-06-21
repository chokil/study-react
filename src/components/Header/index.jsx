import { memo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useApp } from "src/contexts/AppContext";
import classes from "./Header.module.css";

const NAV_ITEMS = [
  { href: "/", label: "ホーム" },
  { href: "/about", label: "About" },
  { href: "/reservation", label: "予約", requireAuth: true },
  { href: "/ticket-purchase", label: "チケット購入" },
  { href: "/admin/tickets", label: "チケット管理", adminOnly: true },
];

export const Header = memo(() => {
  const router = useRouter();
  const { state, dispatch } = useApp();
  
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    router.push('/');
  };
  
  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        {NAV_ITEMS.map((item) => {
          if (item.requireAuth && !state.user?.isLoggedIn) {
            return null;
          }
          if (item.adminOnly && !state.user?.isAdmin) {
            return null;
          }
          return (
            <Link key={item.href} href={item.href} className={classes.anchor}>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className={classes.authSection}>
        {state.user?.isLoggedIn ? (
          <>
            <span className={classes.userEmail}>{state.user.email}</span>
            <button onClick={handleLogout} className={classes.logoutButton}>
              ログアウト
            </button>
          </>
        ) : (
          <Link href="/login" className={classes.loginButton}>
            ログイン
          </Link>
        )}
      </div>
    </header>
  );
});

Header.displayName = "Header";
