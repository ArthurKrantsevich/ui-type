import { useEffect, useState, type CSSProperties } from "react";
import { BuildLab, CapsLab, FontsLab, GroupsLab, MeasureLab, NumbersLab, RemLab, SizesLab, WrapLab } from "./Labs";
import { cssFile, FONTS, roles, type Settings } from "./type";

const DEFAULT: Settings = { font: "Onest", base: 14, heading: 18, title: 28, bold: 700, line: 1.5 };

const VIEWS = [
  { id: "", label: "Шкала" },
  { id: "build", label: "Иерархия" },
  { id: "groups", label: "Группы" },
  { id: "sizes", label: "Размеры" },
  { id: "rem", label: "rem" },
  { id: "measure", label: "Длина строки" },
  { id: "numbers", label: "Цифры" },
  { id: "wrap", label: "Переносы" },
  { id: "caps", label: "Интервалы" },
  { id: "fonts", label: "Шрифты" },
];

const useHash = () => {
  const read = () => location.hash.replace(/^#\/?/, "");
  const [h, setH] = useState(read);
  useEffect(() => {
    const on = () => setH(read());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return h;
};

export function App() {
  const view = useHash();
  const [s, setS] = useState<Settings>(DEFAULT);
  return (
    <div className="app">
      <nav className="nav" aria-label="Разделы">
        <span className="logo">
          <i>Аа</i>Типографика
        </span>
        {VIEWS.map((v) => (
          <a key={v.id} href={`#/${v.id}`} aria-current={view === v.id ? "page" : undefined}>
            {v.label}
          </a>
        ))}
      </nav>
      {view === "" && <Tool s={s} setS={setS} />}
      {view === "build" && <BuildLab />}
      {view === "groups" && <GroupsLab />}
      {view === "sizes" && <SizesLab />}
      {view === "rem" && <RemLab />}
      {view === "measure" && <MeasureLab />}
      {view === "numbers" && <NumbersLab />}
      {view === "wrap" && <WrapLab />}
      {view === "caps" && <CapsLab />}
      {view === "fonts" && <FontsLab />}
    </div>
  );
}

/** Лента видео — пример интерфейса, на котором видна шкала. */
export const FEED = [
  { t: "Я собрал студию роликов за одну ночь и вот что получилось", ch: "Нейропилот", v: "128 тыс. просмотров", d: "2 дня назад", time: "12:04", h: 25 },
  { t: "Форма входа на React без библиотек анимации", ch: "Нейропилот", v: "41 тыс. просмотров", d: "неделю назад", time: "4:56", h: 265 },
  { t: "Цвета интерфейса: три группы и контраст", ch: "Нейропилот", v: "9,6 тыс. просмотров", d: "вчера", time: "5:33", h: 150 },
];

function Seg<T extends string | number>({ id, value, options, onChange, fmt }: { id: string; value: T; options: T[]; onChange: (v: T) => void; fmt?: (v: T) => string }) {
  return (
    <div className="seg" role="radiogroup">
      {options.map((o) => (
        <button key={String(o)} id={`${id}-${o}`} role="radio" aria-checked={value === o} onClick={() => onChange(o)}>
          {fmt ? fmt(o) : String(o)}
        </button>
      ))}
    </div>
  );
}

function Range({ id, label, value, min, max, step, onChange, unit = "px" }: { id: string; label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; unit?: string }) {
  return (
    <label className="slider" htmlFor={id}>
      <span className="slider-head">
        {label}
        <b>
          {value}
          {unit}
        </b>
      </span>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </label>
  );
}

function Tool({ s, setS }: { s: Settings; setS: (s: Settings) => void }) {
  const [copied, setCopied] = useState(false);
  const rs = roles(s);
  const st = (name: string): CSSProperties => {
    const r = rs.find((x) => x.name === name)!;
    return { fontFamily: `"${s.font}", system-ui, sans-serif`, fontSize: r.size, fontWeight: r.weight, lineHeight: r.line, letterSpacing: r.track };
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cssFile(s));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* буфер обмена недоступен — CSS виден справа, его можно выделить */
    }
  };
  return (
    <main className="tool">
      <aside className="panel">
        <h2>Шрифт</h2>
        <select id="font" value={s.font} onChange={(e) => setS({ ...s, font: e.target.value })}>
          {FONTS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <h2>Основной размер</h2>
        <Seg id="base" value={s.base} options={[14, 16] as (14 | 16)[]} onChange={(v) => setS({ ...s, base: v })} fmt={(v) => `${v} px`} />
        <h2>Заголовки</h2>
        <Range id="title" label="Экрана" value={s.title} min={20} max={40} step={1} onChange={(v) => setS({ ...s, title: v })} />
        <Range id="heading" label="Блока" value={s.heading} min={15} max={26} step={1} onChange={(v) => setS({ ...s, heading: v })} />
        <h2>Начертание заголовков</h2>
        <Seg id="bold" value={s.bold} options={[600, 700] as (600 | 700)[]} onChange={(v) => setS({ ...s, bold: v })} />
        <Range id="line" label="Высота строки" value={s.line} min={1.2} max={1.8} step={0.05} onChange={(v) => setS({ ...s, line: v })} unit="" />
        <button id="copy" className="btn primary wide" onClick={copy}>
          {copied ? "Скопировано ✓" : "Скопировать CSS"}
        </button>
      </aside>

      <section className="preview" aria-label="Пример интерфейса">
        <div style={st("title")} className="t-text">
          Рекомендации
        </div>
        <div style={st("body")} className="t-muted preview-sub">
          Подборка на основе того, что вы смотрели на этой неделе.
        </div>
        <div className="feed">
          {FEED.map((f) => (
            <article key={f.t} className="video">
              <div className="thumb" style={{ background: `linear-gradient(135deg, oklch(45% 0.12 ${f.h}), oklch(28% 0.08 ${f.h + 40}))` }}>
                <span style={{ ...st("caption"), fontWeight: 600 }}>{f.time}</span>
              </div>
              <div style={st("body-strong")} className="t-text clamp">
                {f.t}
              </div>
              <div style={st("body")} className="t-muted">
                {f.ch}
              </div>
              <div style={st("caption")} className="t-faint">
                {f.v} · {f.d}
              </div>
            </article>
          ))}
        </div>
        <div style={st("heading")} className="t-text heading-gap">
          Ваши подписки
        </div>
        <div className="subs">
          {["Нейропилот", "Фронтенд за 5 минут", "Дизайн без воды"].map((n, i) => (
            <div key={n} className="sub-row">
              <span className="avatar" style={{ background: `oklch(60% 0.12 ${i * 110 + 20})` }} />
              <div>
                <div style={st("body-strong")} className="t-text">
                  {n}
                </div>
                <div style={st("caption")} className="t-faint">
                  {[18, 240, 57][i]} тыс. подписчиков
                </div>
              </div>
              <button className="btn small" style={st("caption")}>
                Подписаться
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="roles" aria-label="Роли текста">
        {rs.map((r) => (
          <div className="role" key={r.name}>
            <div className="role-sample" style={{ fontFamily: `"${s.font}", sans-serif`, fontSize: r.size, fontWeight: r.weight, lineHeight: r.line, letterSpacing: r.track }}>
              {r.label}
            </div>
            <code>
              --{r.name}: {r.weight} {r.size}px/{r.line}
            </code>
          </div>
        ))}
        <pre className="css-out" aria-label="CSS">{cssFile(s)}</pre>
      </section>
    </main>
  );
}
