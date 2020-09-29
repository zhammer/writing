/**
 * INSERT HERE
 */

// const scenes = [...];
// const meta = {...};

/**
 * DO NOT TOUCH AFTER THIS
 */

const yml = require('yaml');

const obj = {
  sections,
  meta
};

let doc = yml.parseDocument(yml.stringify(obj));
doc.contents.items[0].value.items.forEach(sectionNode => {
  let contentNode = sectionNode.items[1].value;
  if (contentNode.value.length >= yml.scalarOptions.str.doubleQuoted.minMultiLineLength) {
    sectionNode.items[1].value.type = 'BLOCK_FOLDED';
  }
});

console.log(doc.toString())
