load('vendor/bitsurf/bitsurf.js');

host.defineController(
    'Generic', 'Beatfader',
    '0.1.0', 'd256d290-726b-11e4-82f8-0800200c9a66',
    'stylemistake'
);

var beatfader = bitsurf.module('beatfader', ['bitsurf']);

load('beatfader/beatfaderdevice.js');
load('beatfader/beatfadersettings.js');
load('beatfader/beatfadercontrol.js');

bitsurf.bootstrap(['beatfader']);
