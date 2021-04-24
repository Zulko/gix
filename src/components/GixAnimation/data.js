export default {
  loadingElements(project, total, current) {
    return [
      {
        type: 'text',
        text: `Loading\n${current}/${total}`,
        font: {
          family: 'Anton',
          bold: false,
          size: 20,
          lineHeight: 1,
        },
        position: {
          x: project.canvas.width / 2,
          y: project.canvas.height / 2,
          scale: 1.0,
          rotation: 0,
          xAlign: 'center',
          yAlign: 'center',
        },
        stroke: {
          width: 0,
        },
        outline: {
          width: 1,
          color: '#000000',
        },
        timeSegment: {
          start: 0,
          end: 1000000,
        },
        color: '#EEEE20',
      },
    ];
  },
};
