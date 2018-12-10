### State

```
state: {
    project: {}
    savedProjects: [{}, {}, {}],
}
```
### project

```javascript
project: {
  title: '',
  author: '',
  params: {
      width: 300,
      height: 300,
      duration: 5,
      fps: 10
  },
  gifOptions: {
    quality: 90
  },
  elements: [{element}, {}, {} ...]
}
```

### element

```javascript
element: {
  id: 'asf-asdf-asdf-asdf`,
  timeSegment: {
      start: 0
      end: 5
  },
  position: {
    x: float || interpolation
    y: float || interpolation
  }
  angle: float || interpolation,
  anchor: {
    horizontal: 'left',
    vertical: 'top'
  }
}
```

### element: asset

```javascript
asset: {
  ...element
  transform: {
    segment: {
      start:
      end:
    }
    crop: {
      left:
      top:
      right:
      bottom
    },
    scale: 1.0,

  }
}
```

### interpolation

```javascript
interpolation: [
    { t: 0, value: 10},
    { t: 0, value: 10},
]
```


