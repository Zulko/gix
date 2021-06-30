# Gix

Gix is a GIF editor using web technologies:

- No account needed, no privacy issues, no server costs: it runs entirely in your browser.
- Share your projects as (long!) URLs, so others can build on your work.
- Freely create, combine, caption, and animate.
- An intuitive (?) interface to make or remix GIFs in minutes.

**This is still work in progress. Expect no stability**

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

```
yarn test:unit
```

### Lints and fixes files

```
yarn lint
```

## Acknowledging the dependencies

This project is an exploration of what is achievable in a browser, and it comes with many thanks to all the projects that made it possible:

- The editor is written with `VueJS` and uses the `Buefy` components library, complemented with widget libraries (`vue-color`, `vue-emoji-picker`).
- The reading of GIFs is done using libraries `gif-frames` and `gif-infos`. GIF generation is provided by `GIF.js`. The element-to-frame-pixels rendering is done with `canvg`.
- Undo/Redo, save-project-in-browser courtesy of `vuex` and `vuex-persisted-state`.
- Projects can fit in URLs thanks to `pako` (for zipping) and `base64url` (to form url-friendly data).
- Google fonts are downloaded with vue-webfont-loader.
- The rest is courtesy of your browser, and this includes in-browser SVG rendering (fonts, image transformations), video reading, image reading and encoding (JPEG, PNG).

## Contribute

Gix is open source software originally written by Zulko and released on Github under the MIT License.