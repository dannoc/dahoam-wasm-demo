import esprima from 'esprima';
import PrintVisitor from './print-visitor.mjs';
import CompilationVisitor from './compilation-visitor.mjs';

export default function compile({ input, elements }) {
  const ast = esprima.parse(input);
  const printVisitor = new PrintVisitor();
  const compilationVisitor = new CompilationVisitor();

  printVisitor.visit(ast);
  elements.ast.textContent = printVisitor.getResult();

  const wast = 'TODO(danno)';
  elements.wast.textContent = wast;

  compilationVisitor.visit(ast);
  elements.wasm.textContent = compilationVisitor.getSource();

  const buffer = compilationVisitor.getBytes();
  WebAssembly.instantiate(buffer, {}).then(result => {
    for (const name of Object.keys(result.instance.exports)) {
      window[name] = result.instance.exports[name];
    }
  });
}