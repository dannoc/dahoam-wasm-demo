// Copyright 2018 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function toggleClass({ elements, target, className }) {
  for (const element of elements) {
    if (element === target) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }
}

export default function(element) {
  const anchors = element.querySelectorAll('a');
  const targets = [];
  for (const anchor of anchors){
    const selector = anchor.hash;
    const target = document.querySelector(selector);
    targets.push(target);
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      toggleClass({
        elements: anchors,
        target: anchor,
        className: 'active'
      });
      toggleClass({
        elements: targets,
        target: target,
        className: 'show'
      });
    });
  }
}
