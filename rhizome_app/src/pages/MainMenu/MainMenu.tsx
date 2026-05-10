import styles from "./MainMenu.module.css"

function MainMenu() {
  return (
    <section className={styles.contentWrapper}>
      <header className={styles.header}>
        <h1>Rhizome</h1>
        <p>A rota do sistema!</p>
      </header>

      <div className={styles.btnWrapper}>
        <button >Novo Jogo</button>
      </div>

    </section>
  );
}

export default MainMenu;