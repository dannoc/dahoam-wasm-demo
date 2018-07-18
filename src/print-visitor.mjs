export default class PrintVisitor {
  constructor() {
    this.result = '';
    this.indentCount = 0;
  }

  generateIndent() {
    for (let x = 0; x < this.indentCount; ++x) {
      this.result += '  ';
    }
    this.result += '+-';
  }

  generate(s) {
    this.result += s;
  }

  Program(node) {
    this.visitArray(node.body, 'Body');
  }

  BlockStatement(node) {
    this.visitArray(node.body, 'Body');
  }

  FunctionDeclaration(node) {
    this.visit(node.id);
    this.visitArray(node.params, 'Parameters');
    this.visit(node.body);
  }

  Identifier(node) {
    this.generateIndent();
    this.generate(`name: "${ node.name }"\n`);
  }

  ReturnStatement(node) {
    this.visit(node.argument);
  }

  BinaryExpression(node) {
    this.visit(node.left);
    this.generateIndent();
    this.generate(`operator: "${ node.operator }"\n`);
    this.visit(node.right);
  }

  visitArray(array, name) {
    this.generateIndent();
    this.generate(`${ name }\n`);
    this.indent();
    for (const node of array) {
      this.visit(node);
    }
    this.outdent();
  }

  indent() {
    ++this.indentCount;
  }

  outdent() {
    --this.indentCount;
  }

  visit(node) {
    const handler = this[node.type];
    if (handler !== undefined) {
      this.generateIndent();
      this.generate(`${ node.type }\n`);
      this.indent();
      handler.call(this, node);
      this.outdent();
    } else {
      const props = Object.keys(node);
      console.log(`unhandled node "${ node.type }" with props: ${
        props.join(', ') }`);
    }
  }

  getResult() {
    return this.result;
  }
}
