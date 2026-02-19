# wavy-loader

A React wavy loader component built with TypeScript and Vite. Ready to publish to npm.

## Installation

```bash
yarn add wavy-loader
```

## Usage

```tsx
import { WavyLoader } from "wavy-loader";

function App() {
  return <WavyLoader />;
}
```

### Props

| Prop       | Type     | Default        | Description                |
| ---------- | -------- | -------------- | -------------------------- |
| `bars`     | number   | 5              | Number of wave bars        |
| `barWidth` | number   | 4              | Bar width (px)             |
| `color`    | string   | "currentColor" | Bar color                  |
| `duration` | number   | 1.2            | Animation duration (sec)   |
| `height`   | number   | 40             | Height (px)                |
| `className`| string   | ""             | CSS class name            |
| `style`    | object   | {}             | Inline styles             |

## Development

```bash
yarn install
yarn dev     # run demo (index.html + src/demo.tsx)
yarn build   # build library to dist/
```

## Publishing to npm

1. Sign up at [npmjs.com](https://www.npmjs.com).
2. Log in: `yarn login` (or `npm login`).
3. Update `name` in `package.json` if needed (must be unique).
4. Build: `yarn build`.
5. Publish: `yarn publish` or `npm publish`.

For a scoped package (e.g. `@yourname/wavy-loader`), set `"name": "@yourname/wavy-loader"` in `package.json` and run `npm publish --access public`.
