import esprima from 'esprima';
import PrintVisitor from './print-visitor.mjs';
import CompilationVisitor from './compilation-visitor.mjs';

export default function compile(source, astListener, sourceListener) {
  let ast = esprima.parse(source);
  let printVisitor = new PrintVisitor();
  let compilationVisitor = new CompilationVisitor();

  printVisitor.visit(ast);
  astListener(printVisitor.getResult());

  compilationVisitor.visit(ast);
  sourceListener(compilationVisitor.getSource());

  let byte_buffer = compilationVisitor.getBytes();
  WebAssembly.instantiate(byte_buffer, {}).then(result => {
    for (let name in result.instance.exports) {
      window[name] = result.instance.exports[name];
    }
  });
}