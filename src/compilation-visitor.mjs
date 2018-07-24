// Copyright 2018 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import Assembler from './assembler.mjs';

const TYPE_SECTION = 0x01;
const FUNCTION_SECTION = 0x03;
const EXPORT_SECTION = 0x07;
const CODE_SECTION = 0x0a;

const FUNCTION_COUNT = 1;

function comment(c) {
  return { comment: c };
}

export default class CompilationVisitor {
  constructor() {
    this.assembler = new Assembler();
    this.name = undefined;
    this.parameters = [];
  }

  body_pre(params) {
    const masm = this.assembler;
    masm.emitHeader();

    masm.beginSection(TYPE_SECTION);
    masm.emit([
      0x01, comment('// num types'),
      // type 0
      0x60, comment('// func'),
      params, comment('// num params')]);
    for (let p = 0; p < params; ++p) {
      masm.emit([
        0x7f, comment('// i32')]);
    }
    masm.emit([
      0x01, comment('// num results'),
      0x7f, comment('// i32'),
    ]);
    masm.endSection();

    masm.beginSection(FUNCTION_SECTION);
    masm.emit([
      FUNCTION_COUNT, comment('// num functions'),
      0x00, comment('// function 0 signature index'),
    ]);
    masm.endSection();

    masm.beginSection(EXPORT_SECTION);
    masm.emit([
      FUNCTION_COUNT, comment('// num exports'),
    ]);
    masm.emit(this.name);
    masm.emit([
      0x00, comment('// export kind'),
      0x00, comment('// export func index'),
    ]);
    masm.endSection();

    masm.beginSection(CODE_SECTION);
    masm.emit([
      FUNCTION_COUNT, comment('// num functions'),
      // function body 0
    ]);
    masm.beginSubSection();
    masm.emit([
      0x00, comment('// local decl count'),
    ]);
  }

  body_post() {
    const masm = this.assembler;
    masm.endSubSection();
    masm.endSection();

    masm.beginSection(0);
    masm.emit('name');
    masm.emit([
      0x01, comment('// function name type'),
    ]);
    masm.beginSubSection();
    masm.emit([
      FUNCTION_COUNT, // num functions
      0x00, comment('// function index'),
    ]);
    masm.emit(this.name);
    masm.emit([
      0x02, comment('// local name type'),
    ]);
    masm.endSubSection();
    masm.beginSubSection();
    masm.emit([
      FUNCTION_COUNT, comment('// num functions'),
      0x00, comment('// function index'),
      0x02, comment('// num locals'),
      0x00, comment('// local index'),
      0x00, comment('// string length'),
      0x01, comment('// local index'),
      0x00, comment('// string length'),
    ]);
    masm.endSubSection();
    masm.endSection();
  }

  Program(node) {
    this.visitArray(node.body, 'Body');
  }

  BlockStatement(node) {
    this.visitArray(node.body, 'Body');
  }

  FunctionDeclaration(node) {
    this.name = node.id.name;
    this.parameters = [];
    for (const param of node.params) {
      this.parameters.push(param.name);
    }
    this.body_pre(node.params.length);
    this.visit(node.body);
    this.body_post();
  }

  BinaryExpression(node) {
    this.visit(node.left);
    this.visit(node.right);
    if (node.operator == '+') {
      this.assembler.i32_add();
    } else {
      throw('unsupported');
    }
  }

  Identifier(node) {
    const index = this.parameters.indexOf(node.name);
    if (index === -1) {
      throw (`no parameter with name ${ node.name }`);
    }
    this.assembler.get_local(index);
  }

  ReturnStatement(node) {
    this.visit(node.argument);
    this.assembler.end();
  }

  visitArray(array, name) {
    for (const node of array) {
      this.visit(node);
    }
  }

  visit(node) {
    const handler = this[node.type];
    if (handler !== undefined) {
      return handler.call(this, node);
    }
    const props = Object.keys(node);
    throw (`unhandled node "${ node.type }" with props: ${
      props.join(', ') }`);
  }

  getName() {
    return this.name;
  }

  getAssembler() {
    return this.assembler;
  }
}
