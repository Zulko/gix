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
async function copyImgToClipboard(src) {
  const res = await fetch(src);
  const blob = await res.blob();
  navigator.clipboard.write([
    new window.ClipboardItem({
      'image/png': blob,
    }),
  ]);
}

export default {
  copyImgToClipboard,
  copyStrToClipboard,
};
