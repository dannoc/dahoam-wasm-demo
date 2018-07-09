const input = document.querySelector('#input');
const calculate = document.querySelector('#calculate');
const source = document.querySelector('#source');
const ast = document.querySelector('#ast');

function astListener(text) {
  ast.innerText = text;
  ast.classList = ["prettyprint"];
  ast.style.minHeight = "200px"
  ast.style.width = "400px"
}

function sourceListener(text) {
  source.innerText = text;
  source.classList = ["prettyprint"];
  source.style.minHeight = "200px"
  source.style.width = "400px"
}

export default function init(compile) {
  astListener("");
  calculate.addEventListener("click", (event) => {
    compile(input.value, astListener, sourceListener);
  });
}
