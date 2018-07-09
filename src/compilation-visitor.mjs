import Assembler from './assembler.mjs';

const kTypeSection = 0x01;
const kFunctionSection = 0x03;
const kExportSection = 0x07;
const kCodeSection = 0x0a;

const kFunctionCount = 1;

function comment(c) {
  return { comment: c }
}

export default class CompilationVisitor {
    constructor() {
      this.assembler = new Assembler();
      this.name = undefined;
      this.parameters = [];
    }

    body_pre(params) {
        let masm = this.assembler;
        masm.emitHeader();
      
        masm.beginSection(kTypeSection);
        masm.emit([
          0x01, comment("// num types"),
          // type 0
          0x60, comment("// func"),
          params, comment("// num params")]);
        for (let p = 0; p < params; ++p) {
            masm.emit([
              0x7f, comment("// i32")]);
        }
        masm.emit([
          0x01, comment("// num results"),
          0x7f, comment("// i32"),
        ]);
        masm.endSection();
      
        masm.beginSection(kFunctionSection);
        masm.emit([
          kFunctionCount, comment("// num functions"),
          0x00, comment("// function 0 signature index"),
        ]);
        masm.endSection();
      
        masm.beginSection(kExportSection);
        masm.emit([
          kFunctionCount, comment("// num exports"),
        ]);
        masm.emit(this.name);
        masm.emit([
          0x00, comment("// export kind"),
          0x00, comment("// export func index"),
        ]);
        masm.endSection();
      
        masm.beginSection(kCodeSection);
        masm.emit([
          kFunctionCount, comment("// num functions"),
          // function body 0
        ]);
        masm.beginSubSection();
        masm.emit([
          0x00, comment("// local decl count"),
        ]);
    }

    body_post() {
        let masm = this.assembler;
        masm.endSubSection();
        masm.endSection();
      
        masm.beginSection(0);
        masm.emit("name");
        masm.emit([
          0x01, comment("// function name type"),
        ]);
        masm.beginSubSection();
        masm.emit([
          kFunctionCount, // num functions
          0x00, comment("// function index"),
        ]);
        masm.emit(this.name);
        masm.emit([
          0x02, comment("// local name type"),
        ]);
        masm.endSubSection();
        masm.beginSubSection();
        masm.emit([
          kFunctionCount, comment("// num functions"),
          0x00, comment("// function index"),
          0x02, comment("// num locals"),
          0x00, comment("// local index"),
          0x00, comment("// string length"),
          0x01, comment("// local index"),
          0x00, comment("// string length"),
        ]);
        masm.endSubSection();
        masm.endSection();      
    }
  
    Program(node) {
      this.visitArray(node.body, "Body");
    }
  
    BlockStatement(node) {
      this.visitArray(node.body, "Body");
    }
  
    FunctionDeclaration(node) {
      this.name = node.id.name;
      this.parameters = [];
      for (let x of node.params) {
        this.parameters.push(x.name);
      }
      this.body_pre(node.params.length);
      this.visit(node.body);
      this.body_post();
    }

    Identifier(node) {
      console.log(node);
      let index = this.parameters.indexOf(node.name);
      if (index == -1) throw ("no parameter with name" + node.name);
      this.assembler.get_local(index);
    }
  
    ReturnStatement(node) {
      this.visit(node.argument);
      this.assembler.end();
    }
  
    BinaryExpression(node) {
      this.visit(node.left);
      this.visit(node.right);
      if (node.operator == '+') {        
        this.assembler.i32_add();
      } else {
        throw ("unsupported operator" + node.operator);
      }
    }
  
    visitArray(a, name) {
      for (let node of a) {
        this.visit(node);
      }
    }
  
    visit(node) {
      let handler = this[node.type];
      if (handler !== undefined) {
        return handler.call(this, node);
      } else {
        let props = [];
        for (var name in node) {
          if (node.hasOwnProperty(name)) {
            props.push(name);
          }
        }
        throw ("unhandled node \"" + node["type"] + "\" with props: " +
          props.reduce((a, b) => a + ", " + b));
      }
    }
  
    getName() {
      return this.name;
    }

    getBytes() {
      return this.assembler.getBytes();
    }

    getSource() {
        return this.assembler.getSource();
    } 
  }