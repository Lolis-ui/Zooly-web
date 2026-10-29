import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { clearSession, getSession } from "../../services/session";
import { demoEnabled } from "../../services/demo";
import styles from "./TeacherLayout.module.css";
// Modo temporário para desenvolver o visual sem a API.
const navigation = [
  { href: "/painel", label: "Visão geral", symbol: "⌂" },
  { href: "/turmas", label: "Turmas e alunos", symbol: "♧" },
  { href: "/atividades", label: "Atividades", symbol: "▤" },
  { href: "/desempenho", label: "Desempenho", symbol: "↗" },
];

export default function TeacherLayout({ title, subtitle, children }) {
  const router = useRouter();
  const [mostrarSaida, setMostrarSaida] = useState(false);
  const [menuMobile, setMenuMobile] = useState(false);
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [sessionState, setSessionState] = useState({ ready: false, usuario: null });
  const { ready, usuario } = sessionState;

  useEffect(() => {
    let ativo = true;
    Promise.resolve().then(() => {
      if (!ativo) return;
      const session = getSession();
      if (!demoEnabled() && !session.token) {
        router.replace("/login");
        return;
      }
      setSessionState({ ready: true, usuario: session.usuario });
    });
    return () => { ativo = false; };
  }, [router]);
  function sair() {
    clearSession();
    router.replace("/login");
  }

  if (!ready) {
    return <main className={styles.checking}>Verificando sua sessão do Zooly...</main>;
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/painel" className={styles.brand}>
          <img src="/img/Logo.png" alt="Zooly Education" />
        </Link>
        <div className={styles.sideCaption}>ESPAÇO DO PROFESSOR</div>
        <button type="button" className={styles.mobileMenuButton} onClick={() => setMenuMobile((open) => !open)} aria-expanded={menuMobile}>☰ <span>Menu</span></button>
        <nav className={`${styles.nav} ${menuMobile ? styles.navOpen : ""}`} aria-label="Menu do professor">
          {navigation.filter((item) => !["/login", "/cadastro", "/configuracoes"].includes(item.href)).map((item) => {
            const active = router.pathname === item.href || (item.href !== "/painel" && router.pathname.startsWith(item.href));
            return (
              <Link href={item.href} key={item.href} className={`${styles.navItem} ${active ? styles.active : ""}`}>
                <span className={styles.navSymbol} aria-hidden="true">{item.symbol}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className={styles.sidebarBottom}>
          <Link href="/configuracoes" className={`${styles.navItem} ${router.pathname === "/configuracoes" ? styles.active : ""}`}><span className={styles.navSymbol} aria-hidden="true">⚙</span><span>Configurações</span></Link>
          <button type="button" className={styles.logout} onClick={() => setMostrarSaida(true)}><span aria-hidden="true">↪</span> Sair</button>
        </div>
      </aside>

      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <label className={styles.search}><span aria-hidden="true">⌕</span><input type="search" placeholder="Pesquisar..." aria-label="Pesquisar" /></label>
          <div className={styles.profile}>
            <div className={styles.notificationWrap}>
              <button type="button" className={styles.notificationButton} aria-label="Notificações" aria-expanded={notificacoesAbertas} onClick={() => setNotificacoesAbertas((open) => !open)}>♧<i /></button>
              {notificacoesAbertas ? <div className={styles.notificationPanel}><strong>Notificações</strong><p>Você está em dia! Nenhuma notificação nova.</p></div> : null}
            </div>
            <span className={styles.profileDivider} />
            <div className={styles.avatar}>{(usuario?.nome || "P").trim().charAt(0).toUpperCase()}</div>
            <div><strong>{usuario?.nome || "Professor(a)"}</strong><span>PROFESSOR(A)</span></div>
          </div>
        </header>
        <main className={styles.content}>
          <div className={styles.pageHeading}><h1>{title}</h1>{subtitle ? <p>{subtitle}</p> : null}</div>
          {children}
        </main>
      </div>
      {mostrarSaida ? <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setMostrarSaida(false); }}><section className={styles.exitModal} role="dialog" aria-modal="true" aria-labelledby="exit-title"><div className={styles.exitIcon}>↪</div><h2 id="exit-title">Deseja sair?</h2><p>Você será desconectado da sua conta Zooly.</p><div><button type="button" onClick={() => setMostrarSaida(false)}>Cancelar</button><button type="button" onClick={sair}>Sair</button></div></section></div> : null}
    </div>
  );
}
