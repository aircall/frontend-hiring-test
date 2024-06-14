import { defaultTheme, getColor } from '@aircall/tractor';

const darkColorToken = {
  'neutral-800': '#121212',
  'neutral-700': '#232323',
  'neutral-600': '#2E2E2E',
  'neutral-500': '#383838',
  'neutral-400': '#6B6B6B',
  'neutral-300': '#A0A0A0',
  'neutral-100': '#E0E0E0',

  'interaction-standard': 'transparent',
  'interaction-standard-border': getColor('neutral-500'),
  'interaction-standard-hover': 'rgba(0, 0, 0, 0.11)',
  'interaction-standard-active': 'rgba(0, 0, 0, 0.4)',
  'interaction-standard-focus': getColor('neutral-800'),
  'interaction-standard-content': getColor('white'),

  'border-base': getColor('neutral-800'),

  // text
  'text-core': getColor('white'),
  'text-deemphasized': getColor('neutral-500'),

  // background
  'background-01': getColor('secondary-700'),
  'background-02': getColor('secondary-500'),
  'background-overlay': getColor('black-a70'),

  'input-background-01': getColor('secondary-500'),
  'input-hover-01': getColor('neutral-500'),
  'input-focus-01': getColor('neutral-500'),
  'input-active-01': getColor('neutral-700'),

  'input-background-02': getColor('neutral-300'),
  'input-02-hover': getColor('neutral-500')
};

export const darkTheme = {
  inset: defaultTheme.space,
  colors: {
    ...defaultTheme.colors,

    'availability-status-available': getColor('primary-500'),
    'availability-status-busy': getColor('red-500'),
    'availability-status-offline': getColor('neutral-700'),
    modes: {
      dark: darkColorToken
    }
  }
};
