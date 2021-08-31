import {
  trigger,
  transition,
  group,
  query,
  style,
  animate,
} from '@angular/animations';

export const routerAnimation = [
  trigger('routeAnimation', [
    transition('1 => 2, 2 => 3', [
      style({ height: '!' }),
      query(':enter', style({ transform: 'translateX(100%)' })),
      query(
        ':enter, :leave',
        style({ position: 'absolute', top: 0, left: 0, right: 0 })
      ),
      group([
        query(':leave', [
          animate(
            '0.3s cubic-bezier(.35,0,.25,1)',
            style({ transform: 'translateX(-100%)' })
          ),
        ]),
        query(
          ':enter',
          animate(
            '0.3s cubic-bezier(.35,0,.25,1)',
            style({ transform: 'translateX(0)' })
          )
        ),
      ]),
    ]),
    transition('3 => 2, 2 => 1', [
      style({ height: '!' }),
      query(':enter', style({ transform: 'translateX(-100%)' })),
      query(
        ':enter, :leave',
        style({ position: 'absolute', top: 0, left: 0, right: 0 })
      ),
      group([
        query(':leave', [
          animate(
            '0.3s cubic-bezier(.35,0,.25,1)',
            style({ transform: 'translateX(100%)' })
          ),
        ]),
        query(
          ':enter',
          animate(
            '0.3s cubic-bezier(.35,0,.25,1)',
            style({ transform: 'translateX(0)' })
          )
        ),
      ]),
    ]),
  ]),
];
