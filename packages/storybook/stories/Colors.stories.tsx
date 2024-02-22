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
      <div className="grid gap-10">
        {Object.values(ColorName).map((colorKey: ColorName) => {
          return (<div className="">
              {colorLevels.map((colorLevel: MandatoryColorLevels) => (
            <div className={classNames("w-20", `bg-${colorKey}-${colorLevel}`)}>{colors[colorKey][colorLevel]}</div>
            ))}
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
