const input = document.querySelector('#input');
const calculate = document.querySelector('#calculate');
const source = document.querySelector('#source');
const ast = document.querySelector('#ast');

function astListener(text) {
  ast.textContent = text;
}

function sourceListener(text) {
  source.textContent = text;
}

export default function init(compile) {
  calculate.addEventListener("click", (event) => {
    compile(input.value, astListener, sourceListener);
  });
}
