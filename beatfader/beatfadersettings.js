bitsurf
    .module('beatfader')
    .service('beatFaderSettings', function ($preferences) {

        var self = this;

        // Prefs state
        this.cc = 0;
        this.channel = 0;
        this.pointNum = 0;
        this.points = [];
        this.noteLength = 0;
        this.noteStart = 0;

        // Prefs object
        this.prefs = {
            cc: $preferences.create({
                category: 'General',
                label: 'Control #',
                type: 'number',
                minValue: 0,
                maxValue: 0x7f,
                value: 0,
                observer: function (value) {
                    self.cc = value;
                },
            }),
            channel: $preferences.create({
                category: 'General',
                label: 'Channel #',
                type: 'number',
                minValue: 0,
                maxValue: 0x10,
                value: 0,
                observer: function (value) {
                    self.channel = value;
                },
            }),
            noteStart: $preferences.create({
                category: 'Note settings',
                label: 'Root note',
                type: 'number',
                minValue: 0,
                maxValue: 0x7f,
                value: 0x24,
                observer: function (value) {
                    self.noteStart = value;
                },
            }),
            noteLength: $preferences.create({
                category: 'Note settings',
                label: 'Note length',
                type: 'number',
                minValue: 0,
                maxValue: 2000,
                value: 100,
                unit: 'ms',
                observer: function (value) {
                    self.noteLength = value;
                },
            }),
            pointNum: $preferences.create({
                category: 'Control points',
                label: 'Control points',
                type: 'number',
                minValue: 2,
                maxValue: 8,
                value: 2,
                unit: 'points',
            }),
            points: [],
        };

        // Observe pointNum
        this.prefs.pointNum.observe(function (num) {
            var i, ii, point,
                points = self.prefs.points;

            // Save value
            self.pointNum = num;

            // Add missing points to prefs
            for (i = points.length, ii = num; i < ii; i += 1) {
                self.points.push(0);
                point = $preferences.create({
                    category: 'Control points',
                    label: 'Point #' + (i+1),
                    type: 'number',
                    minValue: 0,
                    maxValue: 0x7f,
                    value: 0,
                });
                (function (i) {
                    point.observe(function (value) {
                        self.points[i] = value;
                    });
                })(i);
                points.push(point);
            }

            // Reinitialize points
            for (i = 0, ii = points.length; i < ii; i += 1) {
                if (i < num) {
                    point = num == 1 ? 0 : Math.round(0x7f * i / (num-1));
                    points[i].getValueObj().setRaw(point);
                } else {
                    points[i].getValueObj().setRaw(0);
                }
            }
        });

    });
