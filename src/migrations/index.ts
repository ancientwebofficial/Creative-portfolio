import * as migration_20260709_122250 from './20260709_122250';

export const migrations = [
  {
    up: migration_20260709_122250.up,
    down: migration_20260709_122250.down,
    name: '20260709_122250'
  },
];
