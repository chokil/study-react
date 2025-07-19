import { memo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useApp } from "src/contexts/AppContext";
import classes from "./Header.module.css";

const NAV_ITEMS = [
  { href: "/", label: "ホーム" },
  { href: "/about", label: "About" },
  { href: "/aria", label: "✨ AI Aria", special: true },
  { href: "/reservation", label: "予約", requireAuth: true },
  { href: "/ticket-purchase", label: "チケット購入" },
  { href: "/coupon", label: "クーポン" },
];

const ADMIN_NAV_ITEMS = [
  { href: "/admin/tickets", label: "チケット管理" },
];

export const Header = memo(() => {
  const router = useRouter();
  const { state, dispatch } = useApp();
  
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    router.push('/');
  };

  const isAdmin = state.user?.email?.endsWith('@admin.com');
  
  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        {NAV_ITEMS.map((item) => {
          if (item.requireAuth && !state.user?.isLoggedIn) {
            return null;
          }
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`${classes.anchor} ${item.special ? classes.specialLink : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
        {isAdmin && ADMIN_NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={`${classes.anchor} ${classes.adminLink}`}>
            {item.label}
          </Link>
        ))}
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
