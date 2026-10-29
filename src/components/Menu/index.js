import Link from "next/link";
import styles from "./Menu.module.css";

export default function Menu() {
  return (
    <header className={styles.menu}>
      <Link href="/" className={styles.brand} aria-label="Zooly, página inicial">
        <img src="/img/Logo.png" alt="Zooly Education" />
      </Link>
      <nav className={styles.navigation} aria-label="Navegação principal">
        <a href="#sobre">O Zooly</a>
        <a href="#como-funciona">Como funciona</a>
        <Link href="/painel">Área do professor</Link>
        <Link href="/login" className={styles.login}>Entrar</Link>
      </nav>
    </header>
  );
}
