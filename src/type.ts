/** Шкала типографики для интерфейса: пять ролей текста и три уровня цвета. */

export type Settings = {
  font: string;
  base: 14 | 16; // основной размер, px
  heading: number; // заголовок блока, px
  title: number; // заголовок экрана, px
  bold: 600 | 700;
  line: number; // высота строки основного текста
};

export const FONTS = ["Onest", "Inter", "Manrope", "Golos Text", "PT Sans", "Montserrat", "Roboto"];

export type Role = { name: string; label: string; size: number; weight: number; line: number; track: string };

/** Роли: всё держится на основном размере ±2 px, крупнее — только заголовки. */
export function roles(s: Settings): Role[] {
  return [
    { name: "title", label: "Заголовок экрана", size: s.title, weight: s.bold, line: 1.2, track: "-0.02em" },
    { name: "heading", label: "Заголовок блока", size: s.heading, weight: s.bold, line: 1.3, track: "-0.01em" },
    { name: "body-strong", label: "Акцент", size: s.base, weight: 600, line: s.line, track: "0" },
    { name: "body", label: "Основной текст", size: s.base, weight: 400, line: s.line, track: "0" },
    { name: "caption", label: "Подпись", size: s.base - 2, weight: 400, line: +(s.line - 0.05).toFixed(2), track: "0" },
  ];
}

/** px → rem: размер следует за настройкой шрифта в браузере. */
export const rem = (px: number) => `${+(px / 16).toFixed(4)}rem`;

export const fontValue = (r: Role) => `${r.weight} ${rem(r.size)}/${r.line} var(--font)`;

export function cssFile(s: Settings) {
  const rs = roles(s);
  return `:root {
  --font: "${s.font}", system-ui, sans-serif;

${rs.map((r) => `  --${r.name}: ${fontValue(r)};`).join("\n")}

  --text: oklch(96% 0 0);        /* заголовки и важное */
  --text-muted: oklch(72% 0 0);  /* основной текст */
  --text-faint: oklch(56% 0 0);  /* подписи и даты */
}

.title   { font: var(--title); letter-spacing: -0.02em; text-wrap: balance; }
.heading { font: var(--heading); letter-spacing: -0.01em; text-wrap: balance; }
.body    { font: var(--body); text-wrap: pretty; max-width: 65ch; }
.caption { font: var(--caption); color: var(--text-faint); }
.num     { font-variant-numeric: tabular-nums; }
`;
}
