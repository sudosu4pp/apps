/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('@dailydotdev/shared/tailwind.config');
const { ColorName, colorLevels, MandatoryColorLevels } = require('@dailydotdev/shared/src/styles/colors');

const colorsMap = Object.values(ColorName).flatMap((colorKey) => colorLevels.map((colorLevel) => `bg-${colorKey}-${colorLevel}`));

module.exports = {
  ...config,
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@dailydotdev/shared/src/**/*.{ts,tsx}',
  ],
  safelist: [
    'typo-mega1',
    'typo-giga2',
    'typo-giga1',
    'gap-10',
    'rounded-14',
    ...colorsMap
  ]
};
