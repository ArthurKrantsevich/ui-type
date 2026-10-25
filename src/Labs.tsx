import { useEffect, useState, type CSSProperties } from "react";
import { FEED } from "./App";
import { FONTS } from "./type";

/** Учебные экраны: каждый показывает одну идею из ролика и работает сам по себе. */

// ── иерархия по шагам: без стилей → размер → начертание → цвет → интервалы ─
const STEPS = [
  { label: "Без стилей", css: [".title, .channel, .meta {", "  font: 400 15px/1 var(--font);", "  color: var(--text);", "}"] },
  { label: "Размер", css: [".title { font-size: 17px; }"] },
  { label: "Начертание", css: [".title { font-weight: 600; }"] },
  { label: "Цвет", css: [".channel { color: var(--text-muted); }", ".meta    { color: var(--text-faint); }"] },
  { label: "Интервалы", css: [".title { line-height: 1.35; }", ".channel, .meta { line-height: 1.5; }"] },
];
export function BuildLab() {
  const [step, setStep] = useState(0);
  const title: CSSProperties = { fontSize: step >= 1 ? 17 : 15, fontWeight: step >= 2 ? 600 : 400, lineHeight: step >= 4 ? 1.35 : 1, color: "var(--text)" };
  const ch: CSSProperties = { fontSize: 15, lineHeight: step >= 4 ? 1.5 : 1, color: step >= 3 ? "var(--text-muted)" : "var(--text)", marginTop: step >= 4 ? 4 : 0 };
  const meta: CSSProperties = { fontSize: 15, lineHeight: step >= 4 ? 1.5 : 1, color: step >= 3 ? "var(--text-faint)" : "var(--text)" };
  return (
    <main className="lab two">
      <div className="feed big">
        {FEED.map((f) => (
          <article key={f.t} className="video">
            <div className="thumb" style={{ background: `linear-gradient(135deg, oklch(45% 0.12 ${f.h}), oklch(28% 0.08 ${f.h + 40}))` }} />
            <div style={title} className="ease">{f.t}</div>
            <div style={ch} className="ease">{f.ch}</div>
            <div style={meta} className="ease">{f.v} · {f.d}</div>
          </article>
        ))}
      </div>
      <div className="side">
        <div className="seg vertical" role="radiogroup" aria-label="Шаг">
          {STEPS.map((x, i) => (
            <button key={x.label} id={`step-${i}`} role="radio" aria-checked={step === i} onClick={() => setStep(i)}>
              {i}. {x.label}
            </button>
          ))}
        </div>
        <pre className="code">
          {STEPS.slice(0, step + 1).flatMap((x, i) =>
            x.css.map((l, j) => (
              <span key={`${i}-${j}`} className={i === step ? "new" : ""}>
                {l + "\n"}
              </span>
            )),
          )}
        </pre>
      </div>
    </main>
  );
}

// ── группы: как глаз делит шесть кругов на две тройки ─
const GROUP = [
  { id: "gap", label: "Отступ" },
  { id: "size", label: "Размер" },
  { id: "color", label: "Цвет" },
  { id: "shift", label: "Сдвиг вниз" },
];
export function GroupsLab() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setOn((o) => ({ ...o, [k]: !o[k] }));
  return (
    <main className="lab">
      <h1>Сколько здесь групп?</h1>
      <div className="dots">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const second = i >= 3;
          const style: CSSProperties = {
            width: second && on.size ? 54 : 84,
            height: second && on.size ? 54 : 84,
            background: second && on.color ? "var(--accent)" : "var(--text)",
            marginLeft: i === 3 && on.gap ? 90 : 0,
            transform: second && on.shift ? "translateY(120px)" : "none",
          };
          return <span key={i} className="dot ease" style={style} />;
        })}
      </div>
      <div className="btn-row">
        {GROUP.map((g) => (
          <button key={g.id} id={`g-${g.id}`} className={`btn ${on[g.id] ? "primary" : ""}`} onClick={() => toggle(g.id)}>
            {g.label}
          </button>
        ))}
      </div>
    </main>
  );
}

// ── размеры: на экране почти всё одного размера ─
export function SizesLab() {
  const [show, setShow] = useState(false);
  const Tag = ({ px, children, style }: { px: number; children: React.ReactNode; style?: CSSProperties }) => (
    <span className="sized" style={{ fontSize: px, ...style }}>
      {children}
      {show && <i className="px-tag">{px}</i>}
    </span>
  );
  return (
    <main className="lab two">
      <div className="settings">
        <Tag px={26} style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>Профиль</Tag>
        <div className="set-row">
          <span className="avatar big" />
          <div>
            <Tag px={14} style={{ fontWeight: 600, color: "var(--text)" }}>Анна Смирнова</Tag>
            <br />
            <Tag px={14} style={{ color: "var(--text-faint)" }}>anya@studio.ru</Tag>
          </div>
          <button className="btn small">
            <Tag px={14} style={{ fontWeight: 600 }}>Изменить</Tag>
          </button>
        </div>
        <Tag px={18} style={{ fontWeight: 700, color: "var(--text)" }}>Уведомления</Tag>
        {["Новые комментарии", "Ответы на мои комментарии", "Еженедельная сводка"].map((x, i) => (
          <div className="set-row line" key={x}>
            <div>
              <Tag px={14} style={{ fontWeight: 600, color: "var(--text)" }}>{x}</Tag>
              <br />
              <Tag px={12} style={{ color: "var(--text-faint)" }}>{["Сразу, как появятся", "Только от подписчиков", "По понедельникам в 10:00"][i]}</Tag>
            </div>
            <span className={`switch ${i !== 1 ? "on" : ""}`} />
          </div>
        ))}
      </div>
      <div className="side">
        <button id="sizes-show" className="btn primary" onClick={() => setShow((v) => !v)}>
          {show ? "Скрыть размеры" : "Показать размеры"}
        </button>
        <pre className="code">{"/* весь экран — три размера */\n12px  подписи\n14px  почти всё\n18px  заголовок блока\n26px  заголовок экрана\n\n/* иерархию дают начертание\n   и цвет, а не размер */"}</pre>
      </div>
    </main>
  );
}

// ── rem: пользователь увеличил шрифт в браузере ─
export function RemLab() {
  const [root, setRoot] = useState(16);
  const card = (unit: "px" | "rem") => {
    const k = unit === "rem" ? root / 16 : 1;
    return (
      <div className="rem-card">
        <div className="rem-label">{unit === "px" ? "font-size: 14px" : "font-size: 0.875rem"}</div>
        <div style={{ fontSize: 30 * k, fontWeight: 700, color: "var(--text)" }}>Счёт за июль</div>
        <div style={{ fontSize: 20 * k, color: "var(--text-muted)", lineHeight: 1.5 }}>Оплачен 12 июля. Чек отправили на почту anya@studio.ru.</div>
        <div style={{ fontSize: 16 * k, color: "var(--text-faint)" }}>Вопросы — в поддержку</div>
      </div>
    );
  };
  return (
    <main className="lab">
      <label className="slider wide" htmlFor="browser-font">
        <span className="slider-head">
          Размер шрифта в настройках браузера <b>{root}px</b>
        </span>
        <input id="browser-font" type="range" min={16} max={24} step={1} value={root} onChange={(e) => setRoot(+e.target.value)} />
      </label>
      <div className="rem-grid">
        {card("px")}
        {card("rem")}
      </div>
    </main>
  );
}

// ── длина строки: удобно 45–75 символов ─
const TEXT =
  "Хорошая строка читается без усилий: взгляд доходит до края и легко находит начало следующей. Если строка слишком длинная, глаз теряется при переходе. Если слишком короткая, ритм рвётся каждые несколько слов. Поэтому основной текст ограничивают по ширине, а не растягивают на весь экран.";
export function MeasureLab() {
  const [ch, setCh] = useState(110);
  const zone = ch < 45 ? ["Коротко", "bad"] : ch > 75 ? ["Длинно", "bad"] : ["Удобно", "ok"];
  return (
    <main className="lab">
      <div className="measure-head">
        <span className="big-num">{ch}</span> символов в строке
        <span className={`zone ${zone[1]}`}>{zone[0]}</span>
      </div>
      <p className="measure" style={{ maxWidth: `${ch}ch` }}>
        {TEXT}
      </p>
      <label className="slider wide" htmlFor="ch">
        <span className="slider-head">
          max-width <b>{ch}ch</b>
        </span>
        <input id="ch" type="range" min={30} max={110} step={1} value={ch} onChange={(e) => setCh(+e.target.value)} />
      </label>
    </main>
  );
}

// ── цифры: пропорциональные прыгают, табличные стоят ─
export function NumbersLab() {
  const [n, setN] = useState(1111.11);
  const [run, setRun] = useState(false);
  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => setN((x) => +(x + 7.89 + Math.random() * 1200).toFixed(2)), 110);
    return () => clearInterval(t);
  }, [run]);
  const fmt = (x: number) => x.toLocaleString("ru-RU", { minimumFractionDigits: 2 }) + " ₽";
  const rows = [1111.11, 88888.8, 41.07, 707070.7];
  return (
    <main className="lab">
      <div className="num-grid">
        {(["proportional", "tabular"] as const).map((k) => (
          <div key={k} className="num-card">
            <div className="rem-label">{k === "tabular" ? "font-variant-numeric: tabular-nums" : "по умолчанию"}</div>
            <div className="balance" style={{ fontVariantNumeric: k === "tabular" ? "tabular-nums" : "normal" }}>
              <span className="balance-box">{fmt(n)}</span>
            </div>
            <div className="rows" style={{ fontVariantNumeric: k === "tabular" ? "tabular-nums" : "normal" }}>
              {rows.map((r) => (
                <div key={r}>{fmt(r)}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button id="num-run" className="btn primary" onClick={() => setRun((v) => !v)}>
        {run ? "Остановить" : "Запустить счётчик"}
      </button>
    </main>
  );
}

// ── переносы: balance для заголовков, pretty для текста, обрезка в две строки ─
export function WrapLab() {
  const [fix, setFix] = useState(false);
  return (
    <main className="lab">
      <div className="wrap-grid">
        <div className="wrap-card">
          <div className="rem-label">{fix ? "text-wrap: balance" : "по умолчанию"}</div>
          <h3 style={{ textWrap: fix ? "balance" : "wrap" } as CSSProperties}>Как собрать интерфейс, который читается с первого взгляда</h3>
        </div>
        <div className="wrap-card">
          <div className="rem-label">{fix ? "text-wrap: pretty" : "по умолчанию"}</div>
          <p style={{ textWrap: fix ? "pretty" : "wrap" } as CSSProperties}>Последнее слово абзаца не должно висеть на строке одно. Браузер умеет это исправить сам.</p>
        </div>
        <div className="wrap-card">
          <div className="rem-label">{fix ? "line-clamp: 2" : "по умолчанию"}</div>
          <div className="video small">
            <div className="thumb" style={{ background: "linear-gradient(135deg, oklch(45% 0.12 25), oklch(28% 0.08 65))" }} />
            <div className={fix ? "clamp" : ""} style={{ color: "var(--text)", fontWeight: 600 }}>
              Я неделю делал интерфейс только на системных шрифтах, и вот что из этого вышло в итоге
            </div>
            <div style={{ color: "var(--text-faint)", fontSize: 12 }}>Нейропилот · вчера</div>
          </div>
        </div>
      </div>
      <button id="wrap-fix" className="btn primary" onClick={() => setFix((v) => !v)}>
        {fix ? "Вернуть как было" : "Применить три правила"}
      </button>
    </main>
  );
}

// ── межбуквенный интервал: крупному — меньше, капсу — больше ─
export function CapsLab() {
  const [fix, setFix] = useState(false);
  return (
    <main className="lab">
      <div className="caps-grid">
        <div className="rem-label">{fix ? "letter-spacing: -0.03em" : "по умолчанию"}</div>
        <div className="caps-big" style={{ letterSpacing: fix ? "-0.03em" : "0" }}>Доход за год</div>
        <div className="rem-label">{fix ? "letter-spacing: 0.08em" : "по умолчанию"}</div>
        <div className="caps-label" style={{ letterSpacing: fix ? "0.08em" : "0" }}>ПОСЛЕДНИЕ ПЛАТЕЖИ</div>
      </div>
      <button id="caps-fix" className="btn primary" onClick={() => setFix((v) => !v)}>
        {fix ? "Вернуть как было" : "Поправить интервал"}
      </button>
    </main>
  );
}

// ── шрифты с кириллицей ─
export function FontsLab() {
  return (
    <main className="lab">
      <div className="fonts">
        {FONTS.map((f) => (
          <div key={f} className="font-row">
            <span className="font-name">{f}</span>
            <span style={{ fontFamily: `"${f}", sans-serif`, fontSize: 30, color: "var(--text)", fontWeight: 500 }}>Съешь же ещё этих мягких булок</span>
            <span style={{ fontFamily: `"${f}", sans-serif`, fontSize: 22, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>0123456789</span>
          </div>
        ))}
      </div>
    </main>
  );
}
