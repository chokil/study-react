import { memo } from "react";
import Link from "next/link";
import classes from "./Header.module.css";

const NAV_ITEMS = [
  { href: "/", label: "index" },
  { href: "/about", label: "About" },
];

export const Header = memo(() => {
  return (
    <header className={classes.header}>
      {NAV_ITEMS.map((item) => {
        return (
          <Link key={item.href} href={item.href} className={classes.anchor}>
            {item.label}
          </Link>
        );
      })}
    </header>
  );
});
