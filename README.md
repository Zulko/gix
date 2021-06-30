# Gix

Gix is a GIF editor with the following selling points:

- It runs entirely in your browser, so no account needed, no privacy issues, no server costs to cover.
- Easily share your project by fitting all the data in a long URL, so others can create variations.
- Creative freedom: free placement of gifs, texts, and shapes. Huge choise of fonts, animations.
- An intuitive interface to make or remix GIFs in minutes.



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

- The editor is written in Vue and uses the Buefy components library.
- Gif generation is courtesy of GIF.js
- Undo/Redo, save-project-in-browser courtesy of vuex and vuex-persisted-state.
- Projects can fit in URLs thanks to pako and base64url
- Google fonts are downloaded with vue-webfont-loader

## Contribute

Gix is open source software originally written by Zulko and released on Github under the MIT License.