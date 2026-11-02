import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-typescript';

export const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', ext: '.js', defaultCode: '// Exemplo em JavaScript\nfunction calcularMedia(notas) {\n  const soma = notas.reduce((acc, n) => acc + n, 0);\n  const media = soma / notas.length;\n  console.log(`Média calculada: ${media.toFixed(2)}`);\n  return media;\n}\n\ncalcularMedia([8.5, 9.0, 7.5]);' },
  { id: 'python', name: 'Python', ext: '.py', defaultCode: '# Exemplo em Python\ndef calcular_media(notas):\n    soma = sum(notas)\n    media = soma / len(notas)\n    print(f"Média calculada: {media:.2f}")\n    return media\n\ncalcular_media([8.5, 9.0, 7.5])' },
  { id: 'typescript', name: 'TypeScript', ext: '.ts', defaultCode: '// Exemplo em TypeScript\ninterface Aluno {\n  nome: string;\n  notas: number[];\n}\n\nfunction avaliarAluno(aluno: Aluno): boolean {\n  const media = aluno.notas.reduce((a, b) => a + b, 0) / aluno.notas.length;\n  return media >= 7.0;\n}' },
  { id: 'html', name: 'HTML / CSS', ext: '.html', defaultCode: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <title>UniStudy Hub</title>\n  <style>\n    .card { background: #1e293b; color: #fff; padding: 1rem; border-radius: 8px; }\n  </style>\n</head>\n<body>\n  <div class="card">Aprenda na prática!</div>\n</body>\n</html>' },
  { id: 'sql', name: 'SQL', ext: '.sql', defaultCode: '-- Consulta SQL no UniStudy Hub\nSELECT u.username, u.email, q.xp_reward, q.title\nFROM users u\nJOIN user_quiz_results r ON u.id = r.user_id\nJOIN quizzes q ON r.quiz_id = q.id\nWHERE r.score >= 70\nORDER BY r.score DESC;' },
  { id: 'java', name: 'Java', ext: '.java', defaultCode: '// Exemplo em Java\npublic class UniStudy {\n    public static void main(String[] args) {\n        String mensagem = "Bem-vindo ao UniStudy Hub!";\n        System.out.println(mensagem);\n    }\n}' },
  { id: 'cpp', name: 'C++', ext: '.cpp', defaultCode: '// Exemplo em C++\n#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> pontuacoes = {100, 250, 400};\n    for (int p : pontuacoes) {\n        std::cout << "XP: " << p << std::endl;\n    }\n    return 0;\n}' },
  { id: 'bash', name: 'Bash / Shell', ext: '.sh', defaultCode: '#!/bin/bash\n# Script de inicialização\necho "Iniciando serviços do UniStudy..."\npython manage.py runserver 0.0.0.0:8001 &\nnpm run dev' },
  { id: 'json', name: 'JSON', ext: '.json', defaultCode: '{\n  "plataforma": "UniStudy Hub",\n  "versao": "2.0.0",\n  "status": "online",\n  "modos": ["dark", "light"],\n  "recursos": ["gamificacao", "quizzes", "sala_foco"]\n}' }
];

const TOKEN_STYLES = {
  keyword: 'color: #c586c0; font-weight: bold;',
  string: 'color: #ce9178;',
  function: 'color: #dcdcaa;',
  comment: 'color: #6a9955; font-style: italic;',
  number: 'color: #b5cea8;',
  boolean: 'color: #569cd6; font-weight: bold;',
  operator: 'color: #d4d4d4;',
  punctuation: 'color: #808080;',
  variable: 'color: #9cdcfe;',
  property: 'color: #9cdcfe;',
  'class-name': 'color: #4ec9b0;',
  tag: 'color: #569cd6;',
  'attr-name': 'color: #9cdcfe;',
  'attr-value': 'color: #ce9178;',
  regex: 'color: #d16969;',
  important: 'color: #c586c0; font-weight: bold;'
};

export function highlightCode(code, lang = 'javascript') {
  const grammar = Prism.languages[lang] || Prism.languages.javascript;
  let rawHtml = '';
  try {
    rawHtml = Prism.highlight(code, grammar, lang);
  } catch {
    rawHtml = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Enriquecer tokens com estilos inline para fidelidade visual absoluta em qualquer contexto
  let styledHtml = rawHtml.replace(/<span class="token ([^"]+)">/g, (match, classes) => {
    const classList = classes.split(/\s+/);
    let inlineStyle = '';
    for (const cls of classList) {
      if (TOKEN_STYLES[cls]) {
        inlineStyle = TOKEN_STYLES[cls];
        break;
      }
    }
    return `<span class="token ${classes}" style="${inlineStyle}">`;
  });

  return styledHtml;
}

/**
 * Gera o bloco completo de código formatado estilo IDE (VS Code) com botões, cabeçalho e suporte a cópia.
 */
export function generateVsCodeHtml({ code, language = 'javascript', fileName = '' }) {
  const langConfig = SUPPORTED_LANGUAGES.find(l => l.id === language) || SUPPORTED_LANGUAGES[0];
  const fileDisplayName = fileName.trim() || `script${langConfig.ext}`;
  const highlighted = highlightCode(code, language);
  const blockId = 'vscode-' + Math.random().toString(36).substring(2, 9);

  return `
    <div id="${blockId}" class="vscode-ide-container" data-lang="${language}" data-filename="${fileDisplayName}" style="margin: 1.5rem 0; border-radius: 0.5rem; overflow: hidden; border: 1px solid #334155; background: #1e1e1e; box-shadow: 0 10px 30px rgba(0,0,0,0.55); font-family: 'Consolas', 'Fira Code', 'Courier New', monospace;">
      <div class="vscode-ide-header" style="background: #252526; padding: 0.4rem 0.75rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; user-select: none;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="display: flex; gap: 6px; align-items: center;">
            <span style="width: 11px; height: 11px; border-radius: 50%; background: #ff5f56; display: inline-block; box-shadow: 0 0 4px rgba(255,95,86,0.5);"></span>
            <span style="width: 11px; height: 11px; border-radius: 50%; background: #ffbd2e; display: inline-block; box-shadow: 0 0 4px rgba(255,189,46,0.5);"></span>
            <span style="width: 11px; height: 11px; border-radius: 50%; background: #27c93f; display: inline-block; box-shadow: 0 0 4px rgba(39,201,63,0.5);"></span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; background: #1e1e1e; padding: 0.2rem 0.6rem; border-top: 2px solid #007acc; border-radius: 4px 4px 0 0; font-size: 0.75rem; color: #cccccc;">
            <span style="color: #38bdf8;">📄</span>
            <span class="vscode-filename" style="font-weight: 600;">${fileDisplayName}</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.7rem; color: #858585; background: #2d2d2d; padding: 0.15rem 0.5rem; border-radius: 4px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">${langConfig.name}</span>
          <button type="button" class="vscode-copy-btn" onclick="navigator.clipboard.writeText(this.closest('.vscode-ide-container').querySelector('code').innerText); const self = this; self.innerText = '✓ Copiado!'; setTimeout(() => self.innerText = 'Copiar', 2000);" style="background: #333333; color: #e2e8f0; border: 1px solid #475569; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.7rem; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#3b82f6'; this.style.borderColor='#60a5fa';" onmouseout="this.style.background='#333333'; this.style.borderColor='#475569';">Copiar</button>
        </div>
      </div>
      <div style="position: relative; background: #1e1e1e;">
        <pre class="vscode-pre" style="margin: 0; padding: 1.25rem; font-family: 'Consolas', 'Fira Code', 'Courier New', monospace; font-size: 0.9rem; color: #d4d4d4; background: transparent; line-height: 1.6; overflow-x: auto; white-space: pre;"><code class="language-${language}">${highlighted}</code></pre>
      </div>
    </div>
    <p><br></p>
  `;
}
