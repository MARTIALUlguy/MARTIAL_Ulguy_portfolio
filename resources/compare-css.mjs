// Usage : node compare-css.mjs resources/maquette-v4.html src/styles.css
// Liste les sélecteurs de la maquette absents du CSS du projet (rapide contrôle de portage).
import fs from 'node:fs';
const [,, a, b] = process.argv;
const strip = s => s.replace(/\/\*[\s\S]*?\*\//g, '');
const sels = css => { const out = new Set();
  for (const m of strip(css).matchAll(/([^{}@]+)\{/g))
    for (const x of m[1].split(',')) { const t = x.trim().replace(/\s+/g, ' '); if (t && !/^(from|to|\d+%)/.test(t)) out.add(t); }
  return out; };
const A = sels(fs.readFileSync(a, 'utf8').match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? fs.readFileSync(a, 'utf8'));
const B = sels(fs.readFileSync(b, 'utf8'));
const miss = [...A].filter(x => !B.has(x));
console.log(`${miss.length} sélecteur(s) de la maquette absent(s) :`); console.log(miss.join('\n'));
