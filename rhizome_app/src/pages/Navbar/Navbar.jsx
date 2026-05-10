import { Outlet } from "react-router";
import styles from "./Navbar.module.css"

function Navbar() {
  return (
    <>
        <nav className={styles.contentWrapper}>
            <h1>Rhizome</h1>
            <p>A rota do sistema!</p>
        </nav>

        <Outlet />
    </>

  );
}

export default Navbar;