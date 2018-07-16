import setupTabs from './tabs.mjs';

function initTabs() {
  const tabs = document.querySelector('#tabs');
  const wrapper = document.querySelector('#wrapper');
  setupTabs(tabs, wrapper);
}

function initForm(compile) {
  const js = document.querySelector('#js textarea');
  const ast = document.querySelector('#ast pre');
  const wast = document.querySelector('#wast pre');
  const wasm = document.querySelector('#wasm pre');
  const calculate = document.querySelector('#calculate');

  function astListener(text) {
    ast.textContent = text;
  }

  function wastListener(text) {
    wast.textContent = text;
  }

  function wasmListener(text) {
    wasm.textContent = text;
  }

  calculate.addEventListener('click', (event) => {
    tabs.classList.add('show');
    // TODO: Hook up `wastListener`.
    compile(js.value, astListener, wasmListener);
  });
}

export default function init(compile) {
  initTabs();
  initForm(compile);
}
