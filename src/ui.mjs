// Copyright 2018 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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
  const compileButton = document.querySelector('#compile');

  compileButton.addEventListener('click', (event) => {
    tabs.classList.add('show');
    const input = js.value;
    compile({ input, elements: { ast, wast, wasm } });
  });
}

export default function init(compile) {
  initTabs();
  initForm(compile);
}
