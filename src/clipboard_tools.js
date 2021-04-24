function copyStrToClipboard(str) {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
function copyImgToClipboard(src) {
  const el = document.createElement('img');
  el.src = src;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const r = document.createRange();
  r.setStartBefore(el);
  r.setEndAfter(el);
  r.selectNode(el);
  const sel = window.getSelection();
  sel.addRange(r);
  document.execCommand('copy');
  document.body.removeChild(el);
}

export default {
  copyImgToClipboard,
  copyStrToClipboard,
};
