import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Menu from "../components/Menu";
import styles from "./landing.module.css";

const mascotes = [
  { src: "/img/cobra-vetor.png", nome: "Cobra" },
  { src: "/img/lagarto-vetor.png", nome: "Lagarto" },
  { src: "/img/papagaio-vetor.png", nome: "Papagaio" },
  { src: "/img/sarue-vetor.png", nome: "Saruê" },
];

export default function Home() {
  return (
    <>
      <Head><title>Zooly Education | Aprender é uma aventura</title><meta name="description" content="Uma experiência educativa para transformar a leitura em uma aventura." /></Head>
      <div className={styles.site}>
        <Menu />
        <main>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>EDUCAÇÃO • JOGO • DESCOBERTA</span>
              <h1>Aprender a ler pode virar uma grande <em>aventura.</em></h1>
              <p>O Zooly transforma atividades de leitura em missões divertidas, com histórias, personagens e acompanhamento para quem ensina.</p>
              <div className={styles.actions}>
                <Link href="/cadastro" className={styles.primary}>Começar como professor <span aria-hidden="true">→</span></Link>
                <Link href="/login" className={styles.secondary}>Já tenho uma conta</Link>
              </div>
              <div className={styles.microcopy}><span className={styles.dot} /> Um espaço de aprendizagem pensado para crianças</div>
            </div>
            <div className={styles.heroVisual} aria-label="Mascotes do Zooly">
              <div className={styles.visualCircle} />
              <div className={styles.mascotGrid}>
                {mascotes.map((mascote, index) => <div className={`${styles.mascot} ${styles[`mascot${index + 1}`]}`} key={mascote.nome}><Image src={mascote.src} alt={mascote.nome} width={160} height={160} priority={index < 2} /><span>{mascote.nome}</span></div>)}
              </div>
              <div className={styles.floatingNote}><span>✦</span><div><strong>Aprender brincando</strong><small>Missões no ritmo da criança</small></div></div>
            </div>
          </section>

          <section id="sobre" className={styles.about}>
            <div className={styles.sectionIntro}><span className={styles.eyebrow}>CONHEÇA O ZOOLY</span><h2>Uma jornada educativa que começa com uma história.</h2><p>O projeto combina leitura, atividades e elementos de jogo para incentivar a participação e permitir que professores acompanhem o progresso das turmas.</p></div>
            <div className={styles.featureGrid}>
              <article className={styles.feature}><span className={styles.featureIcon}>♡</span><h3>Aprendizagem acolhedora</h3><p>Uma experiência visual e simples, pensada para crianças em fase de alfabetização.</p></article>
              <article className={styles.feature}><span className={styles.featureIcon}>✦</span><h3>Histórias e missões</h3><p>Atividades organizadas em uma jornada que estimula a curiosidade e a prática.</p></article>
              <article className={styles.feature}><span className={styles.featureIcon}>↗</span><h3>Acompanhamento docente</h3><p>Professores podem gerenciar turmas, publicar atividades e consultar indicadores.</p></article>
            </div>
          </section>

          <section id="como-funciona" className={styles.how}>
            <div><span className={styles.eyebrow}>COMO FUNCIONA</span><h2>Ensinar, explorar e acompanhar.</h2><p>O ambiente do professor permite organizar a experiência educativa e visualizar o andamento das missões.</p></div>
            <div className={styles.steps}>
              <div><span>01</span><strong>Organize as turmas</strong><p>Cadastre a turma e os alunos pela área do professor.</p></div>
              <div><span>02</span><strong>Prepare as atividades</strong><p>Crie missões com histórias e questões de aprendizagem.</p></div>
              <div><span>03</span><strong>Acompanhe o progresso</strong><p>Consulte os indicadores disponíveis na API do Zooly.</p></div>
            </div>
          </section>
          <section className={styles.cta}><div><h2>Vamos começar essa jornada?</h2><p>Acesse a área do professor e continue construindo a experiência do Zooly.</p></div><Link href="/login" className={styles.primary}>Entrar no Zooly <span aria-hidden="true">→</span></Link></section>
        </main>
        <footer className={styles.footer}><span>© {new Date().getFullYear()} Zooly Education</span><span>Projeto Integrador • FATEC Registro</span></footer>
      </div>
    </>
  );
}
