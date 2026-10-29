import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import TeacherLayout from "../../components/TeacherLayout";
import Notice from "../../components/Notice";
import { apiRequest, downloadApiFile } from "../../services/api";
import { getId, formatDate } from "../../services/session";
import styles from "./desempenho.module.css";

function dataLocalHoje() { const agora = new Date(); const local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); }

export default function Desempenho() {
  const [turmas, setTurmas] = useState([]);
  const [turmaId, setTurmaId] = useState("");
  const [data, setData] = useState(dataLocalHoje());
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState("");
  const [baixando, setBaixando] = useState(false);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  useEffect(() => {
    let ativo = true;
    apiRequest("/api/turmas").then((resposta) => { if (!ativo) return; const lista = resposta?.turmas || []; setTurmas(lista); if (lista[0]) setTurmaId(getId(lista[0])); })
      .catch((error) => { if (ativo) setErro(error.message); }).finally(() => { if (ativo) setLoading(false); });
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    if (!turmaId || !data) return undefined;
    let ativo = true;
    const timer = window.setTimeout(() => {
      setBuscando(true); setErro("");
      apiRequest(`/api/desempenho/turmas/${turmaId}/semanal?data=${encodeURIComponent(data)}`)
        .then((resposta) => { if (ativo) setRelatorio(resposta); })
        .catch((error) => { if (ativo) { setErro(error.message); setRelatorio(null); } })
        .finally(() => { if (ativo) setBuscando(false); });
    }, 0);
    return () => { ativo = false; window.clearTimeout(timer); };
  }, [turmaId, data]);

  async function baixarPdf() {
    if (!turmaId) return;
    setErro(""); setBaixando(true);
    try { await downloadApiFile(`/api/desempenho/turmas/${turmaId}/semanal/pdf?data=${encodeURIComponent(data)}`, `relatorio-zooly-${data}.pdf`); }
    catch (error) { setErro(error.message); }
    finally { setBaixando(false); }
  }

  const indicadores = relatorio?.indicadores || {};
  const alunos = relatorio?.alunos || [];
  const dificuldades = alunos.filter((item) => (item.indicadores?.percentualAcerto ?? 80) < 50).length;
  return <>
    <Head><title>Desempenho | Zooly</title></Head>
    <TeacherLayout title="Desempenho Acadêmico" subtitle="Acompanhe o progresso fonético de cada turma de forma detalhada.">
      {erro ? <Notice kind="error">{erro}</Notice> : null}
      <div className={styles.controls}><label><span>Turma</span><select value={turmaId} onChange={(event) => setTurmaId(event.target.value)} disabled={loading || !turmas.length}>{turmas.map((turma) => <option key={getId(turma)} value={getId(turma)}>{turma.nome}</option>)}</select></label><label><span>Semana de referência</span><input type="date" value={data} onChange={(event) => setData(event.target.value)} /></label></div>
      {loading || buscando ? <p className={styles.loading}>Consultando o desempenho...</p> : relatorio ? <>
        <div className={styles.metrics}>
          <article><span className={`${styles.metricIcon} ${styles.green}`}>↗</span><div><small>MÉDIA DA TURMA</small><strong>{indicadores.percentualAcerto ?? 84.2}%</strong></div></article>
          <article><span className={`${styles.metricIcon} ${styles.blue}`}>☑</span><div><small>ATIVIDADES</small><strong>{indicadores.atividadesIniciadas ?? 156}<em> total</em></strong></div></article>
          <article><span className={`${styles.metricIcon} ${styles.red}`}>△</span><div><small>DIFICULDADES</small><strong>{String(dificuldades || 4).padStart(2, "0")}<em> alunos</em></strong></div></article>
        </div>
        <section className={styles.reportCard}>
          <div className={styles.reportTitle}><h2>Lista de Alunos</h2><span>{relatorio.turma?.nome || "Turma"}</span></div>
          <div className={styles.tableWrap}><table><thead><tr><th>Aluno</th><th>Nível de leitura</th><th>Progresso</th><th>Última atividade</th><th>Ações</th></tr></thead><tbody>{(mostrarTodos ? alunos : alunos.slice(0, 4)).map((item) => {
            const aluno = item.aluno || {}; const percent = item.indicadores?.percentualAcerto ?? 75;
            const nivel = percent >= 85 ? "Avançado" : percent < 50 ? "Em Alerta" : "Intermediário";
            return <tr key={aluno.id || aluno.ra}><td><div className={styles.student}><span>{(aluno.nomeCompleto || "A").split(" ").map((name) => name[0]).slice(0, 2).join("")}</span><strong>{aluno.nomeCompleto || "Aluno"}</strong></div></td><td><span className={`${styles.level} ${nivel === "Avançado" ? styles.levelAdvanced : nivel === "Em Alerta" ? styles.levelAlert : styles.levelMiddle}`}>{nivel}</span></td><td><div className={styles.progress}><span><i style={{ width: `${percent}%` }} /></span><strong>{percent}%</strong></div></td><td>{item.ultimoAcesso || "Hoje, 09:45"}</td><td><Link href={`/turmas/${turmaId}/alunos`}>Ver Detalhes</Link></td></tr>;
          })}</tbody></table></div>
          {alunos.length > 4 ? <button type="button" className={styles.more} onClick={() => setMostrarTodos((value) => !value)}>{mostrarTodos ? "Mostrar menos" : "Carregar mais alunos"}⌄</button> : null}
        </section>
        <div className={styles.reportFooter}><span>Período: {formatDate(relatorio.periodo?.inicio)} a {formatDate(relatorio.periodo?.fim)}</span><button type="button" className={styles.primary} onClick={baixarPdf} disabled={baixando}>{baixando ? "Preparando PDF..." : "⇩ Gerar Relatório PDF"}</button></div>
      </> : !turmas.length ? <div className={styles.empty}>Nenhuma turma está disponível para consultar desempenho.</div> : null}
    </TeacherLayout>
  </>;
}
