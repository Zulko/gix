export const STORAGE_KEY = 'gix-settings'

export const state = {
  savedProjects: [],
  globals: {
    source: {
      height: 0,
      width: 0,
      duration: 0,
      fps: 0
    },
    gifClickMode: {
      mode: 'none',
      targetCaption: null
    }
  },
  project: {
    source: {
      // url: 'https://i.imgur.com/S8QQRI4.gif',
      // url: 'https://i.imgur.com/DZWTwH1.gif',
      url: 'https://help.imgur.com/hc/en-us/article_attachments/115000241146/mindblown.gif',
      // url: 'https://i.imgur.com/h1gYzMv.mp4',
      transform: {
        timeSegment: {
          start: 0,
          end: 3
        },
        crop: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      }
    },
    gifOptions: {
      fps: 10,
      quality: 10
    },
    elements: [
      {
        id: '0',
        type: 'asset',
        url: 'https://help.imgur.com/hc/en-us/article_attachments/115000241146/mindblown.gif',
        assetTransform: {
          timeSegment: {
            start: 0,
            end: 3
          },
          crop: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }
        },
        animation: {
          in: {
            class: 'none',
            speed: 'normal-speed'
          },
          out: {
            class: 'none',
            speed: 'normal-speed'
          },
          loop: {
            class: 'none',
            speed: 'normal-speed'
          }
        }
      },
      {
        id: '1',
        timeSegment: {
          start: 1,
          end: 2
        },
        text: 'Wow',
        font: {
          family: 'Impact',
          bold: true,
          color: 'rgba(235, 247, 8, 1)',
          stroke: {
            width: 1,
            color: 'rgba(0, 0, 0, 1)'
          },
          size: 40
        },
        position: {
          x: 100,
          y: 50,
          xAlign: 'center',
          yAlign: 'middle',
          lineHeight: 50
        },
        animation: {
          in: {
            class: ['animation-category-zoom', 'zoomIn'],
            speed: 'normal-speed'
          },
          out: {
            class: ['none'],
            speed: 'normal-speed'
          },
          loop: {
            class: ['none'],
            speed: 'normal-speed'
          }
        }
      },
      {
        id: '2',
        timeSegment: {
          start: 2,
          end: 3
        },
        text: 'Waaaah',
        font: {
          family: 'Impact',
          bold: true,
          color: 'rgba(235, 247, 8, 1)',
          size: 40,
          stroke: {
            width: 1,
            color: 'rgba(0, 0, 0, 1)'
          }
        },
        position: {
          x: 150,
          y: 100,
          xAlign: 'center',
          yAlign: 'middle',
          lineHeight: 50
        },
        animation: {
          in: {
            class: ['animation-category-zoom', 'zoomIn'],
            speed: 'normal-speed'
          },
          out: {
            class: ['none'],
            speed: 'normal-speed'
          },
          loop: {
            class: ['none'],
            speed: 'normal-speed'
          }
        }
      }
    ]
  }
}
