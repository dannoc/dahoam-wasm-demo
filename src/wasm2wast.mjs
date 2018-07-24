// Copyright 2018 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// These globals are exported by the bundled versions of wasm-parser
// and wast-printer. See `public/index.html` and `postinstall` in
// `package.json`.
const decode = _webassemblyjs_wasmParser.decode;
const print = _webassemblyjs_wastPrinter.print;

export default function wasm2wast(bytes) {
  const wasmAst = decode(bytes);
  return print(wasmAst);
}
