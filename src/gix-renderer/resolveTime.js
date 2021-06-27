function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

function averageVariables(var1, var2, var1Weight) {
  if (var1 === null) {
    return null;
  }
  if (typeof var1 === 'number') {
    return var1Weight * var1 + (1 - var1Weight) * var2;
  }
  if (typeof var1 === 'string') {
    return var1;
  }
  if (Array.isArray(var1)) {
    return var1.map((val, i) => averageVariables(val, var2[i], var1Weight));
  }
  if (isObject(var1)) {
    return Object.fromEntries(
      Object.keys(var1).map((key) => [
        key,
        averageVariables(var1[key], var2[key], var1Weight),
      ]),
    );
  }
  throw Error(`Unknown averageVariables handling for ${var1}`);
}

function resolveTimeVariable(timeVariable, t) {
  if (t <= timeVariable[0].t) {
    return timeVariable[0].value;
  }
  const lastIndexBeforeT = timeVariable.findIndex((e) => e.t >= t);
  if (lastIndexBeforeT === -1) {
    return timeVariable[timeVariable.length - 1].value;
  }
  const before = timeVariable[lastIndexBeforeT - 1];
  const after = timeVariable[lastIndexBeforeT];
  const beforeWeigth = 1 - (t - before.t) / (after.t - before.t);
  return averageVariables(before.value, after.value, beforeWeigth);
}

function resolveTimeVaryingAttributes(obj, t) {
  if (!isObject(obj)) {
    return obj;
  }
  if (obj.timeVariable) {
    return resolveTimeVariable(obj.timeVariable, t);
  }
  return Object.fromEntries(
    Object.keys(obj).map((key) => [
      key,
      resolveTimeVaryingAttributes(obj[key], t),
    ]),
  );
}

export default {
  resolveTimeVaryingAttributes,
};

// const obj = {
//   id: '457fa5ce-2119-4987-937f-76c9bf23d8d8',
//   editorSettings: {
//     isMainElement: false,
//     isDraggable: false,
//   },
//   timeSegment: {
//     start: 0,
//     end: 4,
//     alwaysShow: true,
//   },
//   position: {
//     x: {
//       timeVariable: [
//         { t: 0, value: 100 },
//         { t: 1, value: 200 },
//         { t: 2, value: 300 },
//       ],
//     },
//     y: 0,
//     scale: 1,
//     rotation: 0,
//     xAlign: 'left',
//     yAlign: 'top',
//   },
//   stroke: {
//     width: 1,
//     color: '#000000',
//   },
//   type: 'asset',
//   subtype: 'gif',
//   url: 'https://help.imgur.com/hc/en-us/article_attachments/115000241146/mindblown.gif',
//   size: {
//     width: 300,
//     height: 125,
//     aspectRatio: 2.4,
//   },
//   crop: {
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//   },
//   timeCrop: {
//     start: 0,
//     end: 4,
//   },
//   speedFactor: 1,
// };

// const resolved = resolveTimeVaryingAttributes(obj, 1.5);
// console.log(JSON.stringify(resolved, null, 4));
