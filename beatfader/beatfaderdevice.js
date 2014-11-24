bitsurf
    .module('beatfader')
    .device('BeatFaderDevice', function ($proto) {
        return {
            name: 'Beatfader',
            protocol: $proto.midi({
                portsIn: 1,
                portsOut: 0,
            }),
            controls: {
                beatfader: {
                    handler: 'BeatFaderControl',
                    selector: {
                        type: "cc",
                    },
                },
            }
        };
    });
