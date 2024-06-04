import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export const config: Config = {
  namespace: 'stencil-library',
  globalStyle: './src/global/app.css',
  globalScript: 'src/global/app.ts',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        { src: 'global/app.css', dest: 'app.css' }
      ]
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    reactOutputTarget({
      componentCorePackage: 'unity-ambient-x',
      proxiesFile: '../react-library/lib/components/stencil-generated/index.ts',
      includeImportCustomElements: true,
      customElementsDir: 'dist/components',
    }),
  ],
  extras:{
    enableImportInjection: true,
  },
  testing: {
    browserHeadless: 'new',
  },
  plugins: [nodePolyfills()],
  nodeResolve: {
    browser: true,
    preferBuiltins: true,
  },
};


