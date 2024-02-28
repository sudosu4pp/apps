import React from 'react';
import type { Meta } from '@storybook/react';
import colors, { colorLevels, ColorName, MandatoryColorLevels } from '@dailydotdev/shared/src/styles/colors';
import classNames from 'classnames';
const meta: Meta = {
  title: 'Colors',
};

export default meta;

export const Colors = {
  render: () => {
    return (
      <div className="flex flex-wrap gap-10">
        {Object.values(ColorName).map((colorKey: ColorName) => {
          return (
            <div>
              {colorKey}
              <div className="rounded-14 overflow-hidden">
                {colorLevels.map((colorLevel: MandatoryColorLevels) => (
                  <div
                    className={classNames(
                      "w-64 flex justify-between p-2 font-bold",
                      `bg-${colorKey}-${colorLevel}`,
                      (colorKey === 'pepper' || colorKey === 'twitter') && 'text-theme-label-invert'
                    )}>
                    <span>{`bg-${colorKey}-${colorLevel} `}</span>
                    <span>{colors[colorKey][colorLevel]}</span>
                  </div>
                ))}
              </div>
            </div>);
        })}
      </div>
    )
  },
  args: {
    Tag: 'p',
    children: 'The quick brown fox jumps over the lazy dog.',
    className: null
  },
  name: 'All',
}
