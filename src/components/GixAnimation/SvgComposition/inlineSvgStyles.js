// const _ = require('lodash')
// var oldCss = {}
function computedStyle (element) {
  var cSSStyleDeclarationComputed = getComputedStyle(element)
  var i, len, key, value
  // var svgExcludedValues = ['height', 'width', 'min-height', 'min-width']
  var svgIncludedValues = [
    // 'class',
    'font-family',
    'font-size',
    'fill',
    'stroke',
    'stroke-color',
    'stroke-width',
    'style',
    'text-anchor',
    'alignment-baseline',
    'transform',
    'transform-origin',
    'perspective',
    'perspective-origin',
    'opacity'
  ]
  // console.log(svgIncludedValues)
  var isSVG = element instanceof SVGElement
  var computedStyleStr = ''
  // var newCss = {}
  for (i = 0, len = cSSStyleDeclarationComputed.length; i < len; i++) {
    key = cSSStyleDeclarationComputed[i]
    // var keyIsIgnored = svgExcludedValues.indexOf(key) >= 0
    var keyIsIgnored = svgIncludedValues.indexOf(key) < 0
    // keyIsIgnored = false
    if (!(isSVG && keyIsIgnored)) {
      value = cSSStyleDeclarationComputed.getPropertyValue(key)
      // newCss[key] = value
      // console.log(key, value)
      computedStyleStr += key + ':' + value + ';'
    }
  }
  // console.log(_.reduce(oldCss, function (result, value, key) {
  //   return _.isEqual(value, newCss[key]) ? result : result.concat([key, value])
  // }, []))
  // oldCss = newCss
  // console.log(computedStyleStr)
  return computedStyleStr
}

function cloneWithInlineStyle (node) {
  var newNode = node.cloneNode(false)
  if (!(['defs', 'style'].some(tagName => tagName === node.tagName))) {
    newNode.setAttribute('style', computedStyle(node))
  }
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
