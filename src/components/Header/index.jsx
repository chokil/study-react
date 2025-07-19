import { memo, useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useApp } from "src/contexts/AppContext";
import classes from "./Header.module.css";

const NAV_ITEMS = [
  { href: "/", label: "ホーム" },
  { href: "/about", label: "About" },
  { href: "/aria", label: "✨ AI Aria" },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNavRef = useRef(null);
  
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    router.push('/');
    setMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMobileMenuToggle();
    }
  };

  const handleEscapeKey = (event) => {
    if (event.key === 'Escape' && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Outside click handling and focus management
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      
      // Focus management - focus first focusable element in mobile nav
      const firstFocusableElement = mobileNavRef.current?.querySelector('a, button');
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mobileMenuOpen]);

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  const isAdmin = useMemo(() => 
    state.user?.email?.endsWith('@admin.com'), 
    [state.user?.email]
  );
  
  return (
    <header className={classes.header}>
      {/* Desktop Navigation */}
      <nav className={classes.nav}>
        {NAV_ITEMS.map((item) => {
          if (item.requireAuth && !state.user?.isLoggedIn) {
            return null;
          }
          return (
            <Link key={item.href} href={item.href} className={classes.anchor}>
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

      {/* Mobile Hamburger Menu */}
      <button 
        className={`${classes.hamburger} ${mobileMenuOpen ? classes.open : ''}`}
        onClick={handleMobileMenuToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-nav"
        aria-label="メニューを開く"
        type="button"
      >
        <span className={classes.lineTop}></span>
        <span className={classes.lineMiddle}></span>
        <span className={classes.lineBottom}></span>
      </button>

      {/* Desktop Auth Section */}
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

      {/* Mobile Navigation Menu */}
      <nav 
        ref={mobileNavRef}
        id="mobile-nav"
        className={`${classes.mobileNav} ${mobileMenuOpen ? classes.open : ''}`}
        role="navigation"
        aria-label="モバイルナビゲーション"
      >
        {NAV_ITEMS.map((item) => {
          if (item.requireAuth && !state.user?.isLoggedIn) {
            return null;
          }
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={classes.mobileNavItem}
              onClick={handleMobileNavClick}
            >
              {item.label}
            </Link>
          );
        })}
        {isAdmin && ADMIN_NAV_ITEMS.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={classes.mobileNavItem}
            onClick={handleMobileNavClick}
          >
            {item.label}
          </Link>
        ))}
        
        {/* Mobile Auth Section */}
        <div className={classes.mobileAuthSection}>
          {state.user?.isLoggedIn ? (
            <>
              <div className={classes.userEmail}>{state.user.email}</div>
              <button onClick={handleLogout} className={classes.logoutButton}>
                ログアウト
              </button>
            </>
          ) : (
            <Link href="/login" className={classes.loginButton} onClick={handleMobileNavClick}>
              ログイン
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
});

Header.displayName = "Header";
