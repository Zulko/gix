function computedStyle (element) {
  var cSSStyleDeclarationComputed = getComputedStyle(element)
  var i, len, key, value
  var svgExcludedValues = ['height', 'width', 'min-height', 'min-width']
  var computedStyleStr = ''
  for (i = 0, len = cSSStyleDeclarationComputed.length; i < len; i++) {
    key = cSSStyleDeclarationComputed[i]
    if (!((element instanceof SVGElement) && svgExcludedValues.indexOf(key) >= 0)) {
      value = cSSStyleDeclarationComputed.getPropertyValue(key)
      computedStyleStr += key + ':' + value + ';'
    }
  }
  return computedStyleStr
}
function cloneWithInlineStyle (node) {
  var newNode = node.cloneNode(false)
  newNode.setAttribute('style', computedStyle(node))
  while (newNode.firstChild) {
    newNode.removeChild(newNode.firstChild)
  }
  if (node && node.hasChildNodes()) {
    var child = node.firstChild
    while (child) {
      if (child.nodeType === 1 && child.nodeName !== 'SCRIPT') {
        newNode.appendChild(cloneWithInlineStyle(child))
      } else {
        newNode.appendChild(child.cloneNode())
      }
      child = child.nextSibling
    }
  }
  return newNode
}

exports.cloneWithInlineStyle = cloneWithInlineStyle
