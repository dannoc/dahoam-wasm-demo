// Copyright 2018 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import esprima from 'esprima';
import PrintVisitor from './print-visitor.mjs';
import CompilationVisitor from './compilation-visitor.mjs';
import wasm2wast from './wasm2wast.mjs';

export default function compile({ input, elements }) {
  const jsAst = esprima.parse(input);
  const printVisitor = new PrintVisitor();
  const compilationVisitor = new CompilationVisitor();

  printVisitor.visit(jsAst);
  elements.ast.textContent = printVisitor.getResult();

  compilationVisitor.visit(jsAst);
  const assembler = compilationVisitor.getAssembler();
  elements.wasm.textContent = assembler.getSource();

  const buffer = assembler.getBytes();
  elements.wast.textContent = wasm2wast(buffer);

  WebAssembly.instantiate(buffer, {}).then(result => {
    for (const name of Object.keys(result.instance.exports)) {
      window[name] = result.instance.exports[name];
    }
  });
}
