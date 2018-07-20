import { decode } from '@webassemblyjs/wasm-parser';
import { print } from '@webassemblyjs/wast-printer';

export default function wasm2wast(bytes) {
  const wasmAst = decode(bytes);
  return print(wasmAst);
}
