export default class PrintVisitor {
  constructor() {
    this.result = "";
    this.indentCount = 0;
  }

  generateIndent() {
    for (let x = 0; x < this.indentCount; ++x) {
      this.result += "  ";
    }
    this.result += "+-";
  }

  generate(s) {
    this.result += s;
  }

  Program(node) {
    this.visitArray(node.body, "Body");
  }

  BlockStatement(node) {
    this.visitArray(node.body, "Body");
  }

  FunctionDeclaration(node) {
    this.visit(node.id);
    this.visitArray(node.params, "Parameters");
    this.visit(node.body);
  }

  Identifier(node) {
    this.generateIndent();
    this.generate("name: \"" + node.name + "\"\n");
  }

  ReturnStatement(node) {
    this.visit(node.argument);
  }

  BinaryExpression(node) {
    this.visit(node.left);
    this.generateIndent();
    this.generate("operator: \"" + node.operator + "\"\n");
    this.visit(node.right);
  }

  visitArray(a, name) {
    this.generateIndent();
    this.generate(name + "\n");
    this.indent();
    for (let node of a) {
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
    let handler = this[node.type];
    if (handler !== undefined) {
      this.generateIndent();
      this.generate(node.type + "\n");
      this.indent();
      handler.call(this, node);
      this.outdent();
    } else {
      let props = [];
      for (var name in node) {
        if (node.hasOwnProperty(name)) {
          props.push(name);
        }
      }
      console.log("unhandled node \"" + node["type"] + "\" with props: " +
        props.reduce((a, b) => a + ", " + b));
    }
  }

  getResult() {
    return this.result;
  }
}