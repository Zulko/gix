# Gix code documentation

Keep in mind: Gix is a *side*-project, as in *test suite, project plan and general good practices have been left aside*. This being said, the project strives to have a sound, easy-to-explain structure, which we'll dive into here.

## Acknowledging the dependencies

Before getting to what the code does, let's have a look at what it code **doesn't** do and delegates to dependencies (or to the browser)instead. Here are the awesome projects that made Gix possible:

- The editor is written with `VueJS` and uses the `Buefy` components library, complemented with widget libraries (`vue-color`, `vue-emoji-picker`).
- The reading of GIFs is done using libraries `gif-frames` and `gif-infos`. GIF generation is provided by `GIF.js`. The element-to-frame-pixels rendering is done with `canvg`.
- Undo/Redo, save-project-in-browser courtesy of `vuex` and `vuex-persisted-state`.
- Projects can fit in URLs thanks to `pako` (for zipping) and `base64url` (to form url-friendly data).
- Google fonts are downloaded with vue-webfont-loader.
- The rest is courtesy of your browser, and this includes in-browser SVG rendering (fonts, image transformations), video reading, image reading and encoding (JPEG, PNG).

## General structure of the project

In a single picture:

- The `project` is the central data object of your GIX session, it contains the project's infos (name, author, duration...) and each element's data (its type, size, rotation, duration in the project, etc.)
- The Editor contains the GixPlayer that plays the gix (see below), but also all the buttons to change every aspect of the `project`. 
- The `frameServers` contain the data of all assets used in the project (images, GIFs, MP4s) and you can ask them "give me the frame at time t for the gif `http:/coolgifs.com/e4rt33s.gif`".
- The `gix-renderer` module is responsible for a few steps:
  - 1. "Resolving" each element of the project for a certain time `t`. That means determining if the element is visible in the project at this time, what it's size or rotation or position is at this time, what frame the GIF or video element is showing at this time (that's where the `frameServers` come in)
  - 2. Quickly compose the elements of a frame into a single SVG, draw this SVG into a pixel image (using `canvg`), and feed these frame images to `GIF.js` for GIF generation.
- The `GixPlayer` is responsible for the live preview of the Gix in the browser. It re-uses step (1) of `gix-renderer` to "resolve" each element of the project at each frame, but instead of directly creating a SVG and then a pixelated image, it will display each element as a separate, interactive Vue component, so they can be separately moved, resized, deleted, etc.


## File structure of the project




## Events structure of the project
