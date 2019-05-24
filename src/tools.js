exports.generateRandomID = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

exports.copyStrToClipboard = function (str) {
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}
exports.copyImgToClipboard = function (src) {
  const el = document.createElement('img')
  el.src = src
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  var r = document.createRange()
  r.setStartBefore(el)
  r.setEndAfter(el)
  r.selectNode(el)
  var sel = window.getSelection()
  sel.addRange(r)
  console.log(sel)
  document.execCommand('copy')
  document.body.removeChild(el)
}
