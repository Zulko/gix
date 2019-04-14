export default {
  loadingElements (project, total, current) {
    return [
      {
        type: 'text',
        text: `Loading\n${current}/${total}`,
        font: {
          family: 'Impact',
          bold: false,
          size: 20
        },
        position: {
          x: project.canvas.width / 2,
          y: project.canvas.height / 2,
          scale: 1.0,
          rotation: 0,
          xAlign: 'center',
          yAlign: 'center',
          lineHeight: 1
        },
        stroke: {
          width: 0
        },
        timeSegment: {
          start: 0,
          end: 1000000
        },
        color: 'rgba(235, 247, 8, 1)',
        cssAnimation: {
          in: {
            class: 'none',
            speed: 'normal-speed'
          },
          out: {
            class: 'none',
            speed: 'normal-speed'
          },
          loop: {
            class: 'pulse',
            speed: 'normal-speed'
          }
        }
      }
    ]
  }
}
