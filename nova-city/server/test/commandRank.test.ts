import { describe, expect, it } from 'vitest';
import { commandRank } from '../src/domain/commandRank.js';

describe('commandRank', () => {
  it('starts everyone as a Drifter', () => {
    expect(commandRank({ shipCount: 1, stationCount: 0, sectorsControlled: 0, alignment: 0 })).toBe('Drifter');
  });

  it('progresses with fleet size before any sectors are controlled', () => {
    expect(commandRank({ shipCount: 2, stationCount: 0, sectorsControlled: 0, alignment: 0 })).toBe('Ship Captain');
    expect(commandRank({ shipCount: 4, stationCount: 0, sectorsControlled: 0, alignment: 0 })).toBe('Squadron Leader');
    expect(commandRank({ shipCount: 8, stationCount: 0, sectorsControlled: 0, alignment: 0 })).toBe('Fleet Commander');
  });

  it('branches by alignment once sectors are controlled', () => {
    expect(commandRank({ shipCount: 0, stationCount: 0, sectorsControlled: 3, alignment: -50 })).toBe('Sector Warlord');
    expect(commandRank({ shipCount: 0, stationCount: 0, sectorsControlled: 3, alignment: 50 })).toBe('Sector Steward');
    expect(commandRank({ shipCount: 0, stationCount: 0, sectorsControlled: 3, alignment: 0 })).toBe('Sector Commander');
  });

  it('tops out at Galactic Commander regardless of alignment', () => {
    expect(commandRank({ shipCount: 0, stationCount: 0, sectorsControlled: 6, alignment: -80 })).toBe(
      'Galactic Commander',
    );
  });
});
