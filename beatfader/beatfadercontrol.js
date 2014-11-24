bitsurf
    .module('beatfader')
    .control('BeatFaderControl', function (beatFaderSettings) {
        var settings = beatFaderSettings;

        // TODO: Move this to device declaration and add $noteInput service
        var noteInput = host.getMidiInPort(0)
            .createNoteInput('BF', '');

        function triggerNote(id) {
            var note = settings.noteStart + id;
            noteInput.sendRawMidiEvent(0x90, note, 0x7f);
            // TODO: Add $timeout service
            host.scheduleTask(function () {
                noteInput.sendRawMidiEvent(0x80, note, 0x00);
            }, [], settings.noteLength);
        }

        function getFaderNote(value, dir) {
            var i, point = 0,
                points = settings.points,
                length = settings.pointNum;
            if (dir) {
                for (i = 0; i < length; i += 1) {
                    if (value >= points[i]) {
                        point = i;
                    }
                }
            } else {
                for (i = length - 1; i >= 0; i -= 1) {
                    if (value <= points[i]) {
                        point = i;
                    }
                }
            }
            return point * 2 + (dir ? 1 : 0);
        }

        function isSelectedControl(msg) {
            return (settings.cc == msg.data1 || settings.cc == 0)
                && (settings.channel == msg.channel || settings.channel == 0);
        }

        function BeatFaderControl() {
            this.note = null;
            this.value = null;
            this.dir = true; // true/false -> forward/back

            this.$receive = function (msg, stream) {
                if (isSelectedControl(msg)) {
                    var dir, note;
                    if (this.value !== null) {
                        dir = msg.value >= this.value;
                        note = getFaderNote(msg.value, dir);
                        if (dir ? note > this.note : note < this.note) {
                            this.note = note;
                            triggerNote(note);
                            // If 0 is selected, tell the control number
                            if (settings.cc == 0) {
                                host.showPopupNotification(
                                    'cc: ' + msg.data1 + '  ' +
                                    'chan: ' + msg.channel
                                );
                            }
                        }
                    }
                    this.value = msg.value;
                }
            };
        }

        return BeatFaderControl;
    });
