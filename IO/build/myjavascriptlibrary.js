'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var combineMap = function combineMap(a1, a2, fn) {
    return a1.map(function (x, i) {
        return fn(x, a2[i]);
    });
};

var reverse = function reverse(a) {
    return [].concat(_toConsumableArray(a)).reverse();
};

var Binary = function () {
    function Binary(bits) {
        _classCallCheck(this, Binary);

        this.bits = bits;
    }

    _createClass(Binary, [{
        key: 'assertIsBinary',
        value: function assertIsBinary(other) {
            if (!(other instanceof Binary)) throw new Error('Not an instance of Binary');
        }
    }, {
        key: 'assertSameNumberOfBits',
        value: function assertSameNumberOfBits(other) {
            if (other.bits.length !== this.bits.length) throw new Error('Bit mismatch (a =  ' + this.bits.length + ', b = ' + other.bits.length + ')');
        }
    }, {
        key: 'toSignedNumber',
        value: function toSignedNumber() {
            if (this.bits[0] === 0) return this.toNumber();

            var minusOneBits = Array.from({ length: this.bits.length }, function () {
                return 1;
            });
            var minusOne = new Binary(minusOneBits);

            var positiveWithCarry = this.add(minusOne).not();
            var positiveNumber = new Binary(positiveWithCarry.bits.slice(1));

            return -positiveNumber.toNumber();
        }
    }, {
        key: 'toNumber',
        value: function toNumber() {
            var _this = this;

            var total = 0;

            this.bits.forEach(function (bit, i) {
                var powerOfTwo = _this.bits.length - i - 1;

                if (bit === 1) total += Math.pow(2, powerOfTwo);
            });

            return total;
        }
    }, {
        key: 'zeroExtend',
        value: function zeroExtend(nBits) {
            if (nBits <= this.bits.length) {
                throw new Error('Need to extend to a larger number of bits (current = ' + this.bits.length + ', target = ' + nBits + ')');
            }

            var numberExtraZeros = nBits - this.bits.length;
            var zeros = Array.from({ length: numberExtraZeros }, function () {
                return 0;
            });
            return new Binary([].concat(_toConsumableArray(zeros), _toConsumableArray(this.bits)));
        }
    }, {
        key: 'zeroExtendToMatch',
        value: function zeroExtendToMatch(other) {
            this.assertIsBinary(other);
            return this.zeroExtend(other.bits.length);
        }
    }, {
        key: 'add',
        value: function add(other) {
            this.assertIsBinary(other);
            this.assertSameNumberOfBits(other);

            var carryBit = 0;
            var newBits = combineMap(reverse(this.bits), reverse(other.bits), function (a, b) {
                var abSum = a ^ b;
                var abCarry = a & b;

                var abSumPlusCarry = abSum ^ carryBit;
                var abSumCarry = abSum & carryBit;

                carryBit = abCarry | abSumCarry;
                return abSumPlusCarry;
            });

            return new Binary([carryBit].concat(_toConsumableArray(reverse(newBits))));
        }
    }, {
        key: 'and',
        value: function and(other) {
            this.assertIsBinary(other);
            this.assertSameNumberOfBits(other);

            var newBits = combineMap(this.bits, other.bits, function (bit1, bit2) {
                return bit1 & bit2;
            });
            return new Binary(newBits);
        }
    }, {
        key: 'or',
        value: function or(other) {
            this.assertIsBinary(other);
            this.assertSameNumberOfBits(other);

            var newBits = combineMap(this.bits, other.bits, function (bit1, bit2) {
                return bit1 | bit2;
            });
            return new Binary(newBits);
        }
    }, {
        key: 'xor',
        value: function xor(other) {
            this.assertIsBinary(other);
            this.assertSameNumberOfBits(other);

            var newBits = combineMap(this.bits, other.bits, function (bit1, bit2) {
                return bit1 ^ bit2;
            });
            return new Binary(newBits);
        }
    }, {
        key: 'not',
        value: function not() {
            var newBits = this.bits.map(function (x) {
                return x === 0 ? 1 : 0;
            });
            return new Binary(newBits);
        }
    }, {
        key: 'toHexString',
        value: function toHexString() {
            var _this2 = this;

            var GROUP = 4;
            var HEXVALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'].map(function (v) {
                return v.toString();
            });
            var bitsNeeded = this.bits.length;
            while (bitsNeeded % GROUP > 0) {
                bitsNeeded++;
            }

            if (this.bits.length < bitsNeeded) return this.zeroExtend(bitsNeeded).toHexString();

            return '0x' + this.bits.map(function (v, i) {
                if (i % GROUP === 0) return _this2.bits.slice(i, GROUP + i);else return null;
            }).filter(function (v) {
                return v !== null;
            }).map(function (v) {
                return new Binary(v).toNumber();
            }).map(function (v) {
                var HEX = 16;
                var accumulator = [];
                var rest = v;

                while (rest >= 0) {
                    accumulator.push(rest % HEX);
                    if (rest === 0) rest = -1;
                    rest = Math.floor(rest / HEX);
                }

                var resulting = reverse(accumulator).map(function (h) {
                    return HEXVALUES[h];
                }).join('');
                if (resulting.length > 1 && resulting[0] === HEXVALUES[0]) resulting = resulting.substring(1);
                return resulting;
            }).join('');
        }
    }, {
        key: 'bitsLength',
        get: function get() {
            return this.bits.length;
        }
    }], [{
        key: 'fromSigned',
        value: function fromSigned(n) {
            if (!Number.isInteger(n)) throw new Error('Can only create Binary from integers');

            if (n === 0) return new Binary([0]);

            var unsigned = Binary.fromUnsigned(Math.abs(n));
            var numberOfBits = unsigned.bits.length + 1;
            var withZeroSignBit = unsigned.zeroExtend(numberOfBits);

            if (n > 0) return withZeroSignBit;

            var flipped = withZeroSignBit.not();
            var withAddedOne = flipped.add(Binary.fromUnsigned(1).zeroExtend(numberOfBits));

            return new Binary(withAddedOne.bits.slice(1));
        }
    }, {
        key: 'fromUnsigned',
        value: function fromUnsigned(n) {
            if (!Number.isInteger(n)) throw new Error('Can only create Binary from integers');

            if (n === 0) return new Binary([0]);

            var bits = [];
            var nearestPowerOfTwo = Math.floor(Math.log2(n));
            var numberInProgress = n;

            while (nearestPowerOfTwo >= 0) {
                if (numberInProgress >= Math.pow(2, nearestPowerOfTwo)) {
                    bits.push(1);
                    numberInProgress -= Math.pow(2, nearestPowerOfTwo);
                } else {
                    bits.push(0);
                }
                nearestPowerOfTwo -= 1;
            }
            return new Binary(bits);
        }
    }]);

    return Binary;
}();

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Endian = function (_Binary) {
    _inherits(Endian, _Binary);

    function Endian(binary) {
        _classCallCheck(this, Endian);

        if (binary instanceof Binary) {
            var _this = _possibleConstructorReturn(this, (Endian.__proto__ || Object.getPrototypeOf(Endian)).call(this, binary.bits));
        } else if (binary instanceof Uint8Array) {
            var _this = _possibleConstructorReturn(this, (Endian.__proto__ || Object.getPrototypeOf(Endian)).call(this, Endian._constructFromUint8Array(binary)));
        } else if (binary instanceof Uint16Array) {
            var _this = _possibleConstructorReturn(this, (Endian.__proto__ || Object.getPrototypeOf(Endian)).call(this, Endian._constructFromUint16Array(binary)));
        } else if (binary instanceof Uint32Array) {
            var _this = _possibleConstructorReturn(this, (Endian.__proto__ || Object.getPrototypeOf(Endian)).call(this, Endian._constructFromUint32Array(binary)));
        } else if (binary instanceof Array) {
            var _this = _possibleConstructorReturn(this, (Endian.__proto__ || Object.getPrototypeOf(Endian)).call(this, Endian._constructFromUint8Array(binary)));
        } else {
            throw new Error('Invalid Endian Number');
        }
        return _possibleConstructorReturn(_this);
    }

    _createClass(Endian, null, [{
        key: '_constructFromUint8Array',
        value: function _constructFromUint8Array(uint8) {
            var minBits = 8;
            uint8 = Array.from(uint8);
            var bin = Binary.fromUnsigned(eval('0x' + uint8.map(function (value) {
                return Binary.fromUnsigned(value).toHexString().replace('0x', '');
            }).join('')));
            return (bin.bitsLength < minBits ? bin.zeroExtend(minBits) : bin).bits;
        }
    }, {
        key: '_constructFromUint16Array',
        value: function _constructFromUint16Array(uint16) {
            var minBits = 8 * 2;
            uint16 = Array.from(uint16);
            var bin = Binary.fromUnsigned(eval('0x' + uint16.map(function (value) {
                return Binary.fromUnsigned(value).toHexString().replace('0x', '');
            }).join('')));
            return (bin.bitsLength < minBits ? bin.zeroExtend(minBits) : bin).bits;
        }
    }, {
        key: '_constructFromUint32Array',
        value: function _constructFromUint32Array(uint32) {
            var minBits = 8 * 4;
            uint32 = Array.from(uint32);
            var bin = Binary.fromUnsigned(eval('0x' + uint32.map(function (value) {
                return Binary.fromUnsigned(value).toHexString().replace('0x', '');
            }).join('')));
            return (bin.bitsLength < minBits ? bin.zeroExtend(minBits) : bin).bits;
        }
    }]);

    return Endian;
}(Binary);

var LittleEndian = function (_Endian) {
    _inherits(LittleEndian, _Endian);

    function LittleEndian(binary) {
        _classCallCheck(this, LittleEndian);

        if (binary instanceof Binary) {
            var _this2 = _possibleConstructorReturn(this, (LittleEndian.__proto__ || Object.getPrototypeOf(LittleEndian)).call(this, LittleEndian._buildFromBinary(binary)));
        } else if (binary instanceof Uint8Array) {
            var _this2 = _possibleConstructorReturn(this, (LittleEndian.__proto__ || Object.getPrototypeOf(LittleEndian)).call(this, LittleEndian._buildFromArray(binary)));
        } else if (binary instanceof Uint16Array) {
            var _this2 = _possibleConstructorReturn(this, (LittleEndian.__proto__ || Object.getPrototypeOf(LittleEndian)).call(this, LittleEndian._buildFromArray(binary)));
        } else if (binary instanceof Uint32Array) {
            var _this2 = _possibleConstructorReturn(this, (LittleEndian.__proto__ || Object.getPrototypeOf(LittleEndian)).call(this, LittleEndian._buildFromArray(binary)));
        } else if (binary instanceof Array) {
            var _this2 = _possibleConstructorReturn(this, (LittleEndian.__proto__ || Object.getPrototypeOf(LittleEndian)).call(this, LittleEndian._buildFromArray(binary)));
        } else {
            throw new Error('Invalid Little-Endian Number');
        }
        return _possibleConstructorReturn(_this2);
    }

    _createClass(LittleEndian, null, [{
        key: '_buildFromBinary',
        value: function _buildFromBinary(binary) {
            return (binary || { bits: [0] }).bits;
        }
    }, {
        key: '_buildFromArray',
        value: function _buildFromArray(_array) {
            var littleEndiaDecimal = Array.from(_array).map(function (v, i) {
                return v * Math.pow(16, i * 2);
            }).reduce(function (a, b) {
                return a + b;
            }, 0);
            return Binary.fromUnsigned(littleEndiaDecimal).bits;
        }
    }]);

    return LittleEndian;
}(Endian);

var BigEndian = function (_Endian2) {
    _inherits(BigEndian, _Endian2);

    function BigEndian(binary) {
        _classCallCheck(this, BigEndian);

        if (binary instanceof Binary) {
            var _this3 = _possibleConstructorReturn(this, (BigEndian.__proto__ || Object.getPrototypeOf(BigEndian)).call(this, BigEndian._buildFromBinary(binary)));
        } else if (binary instanceof Uint8Array) {
            var _this3 = _possibleConstructorReturn(this, (BigEndian.__proto__ || Object.getPrototypeOf(BigEndian)).call(this, BigEndian._buildFromArray(binary)));
        } else if (binary instanceof Uint16Array) {
            var _this3 = _possibleConstructorReturn(this, (BigEndian.__proto__ || Object.getPrototypeOf(BigEndian)).call(this, BigEndian._buildFromArray(binary)));
        } else if (binary instanceof Uint32Array) {
            var _this3 = _possibleConstructorReturn(this, (BigEndian.__proto__ || Object.getPrototypeOf(BigEndian)).call(this, BigEndian._buildFromArray(binary)));
        } else if (binary instanceof Array) {
            var _this3 = _possibleConstructorReturn(this, (BigEndian.__proto__ || Object.getPrototypeOf(BigEndian)).call(this, BigEndian._buildFromArray(binary)));
        } else {
            throw new Error('Invalid Big-Endian Number');
        }
        return _possibleConstructorReturn(_this3);
    }

    _createClass(BigEndian, null, [{
        key: '_buildFromBinary',
        value: function _buildFromBinary(binary) {
            return (binary || { bits: [0] }).bits;
        }
    }, {
        key: '_buildFromArray',
        value: function _buildFromArray(_array) {
            var bigEndiaDecimal = Array.from(_array).map(function (v, i, self) {
                return self[self.length - 1 - i] * Math.pow(16, i * 2);
            }).reduce(function (a, b) {
                return a + b;
            }, 0);
            return Binary.fromUnsigned(bigEndiaDecimal).bits;
        }
    }]);

    return BigEndian;
}(Endian);

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OffSet = function OffSet(start, size) {
    _classCallCheck(this, OffSet);

    this.Start = start || 0;
    this.Size = size || 1;
    this.End = this.Size + this.Start;
    Object.seal(this);
    Object.freeze(this);
};

var CanonicalAudioFormats = {
    OffSet: OffSet,
    'TAGS': Object.seal(Object.freeze({
        "WAVE_TAG": 'RIFF',
        "MP3_TAG": 'ID3'
    })),
    'CHUNK_IDS': Object.seal(Object.freeze({
        "WAVE_CHUNCK_ID_0": 0x52,
        "WAVE_CHUNCK_ID_1": 0x49,
        "WAVE_CHUNCK_ID_2": 0x46,
        "WAVE_CHUNCK_ID_3": 0x46,
        "MP3_CHUNK_ID_0": 0x49,
        "MP3_CHUNK_ID_1": 0x44,
        "MP3_CHUNK_ID_2": 0x33,
        "MP3_CHUNK_ID_3": 0x4
    })),
    'HEARDER_LENGTH': {
        'WAVE': 44,
        'MP3': 32
    },
    'HEADER_OFFSET': {
        'WAVE': {
            'Chunk': {
                'ID': new OffSet(0, 4),
                'Size': new OffSet(4, 4),
                'Format': new OffSet(8, 4)
            },
            'FormatSubChunk': {
                'Subchunk1ID': new OffSet(12, 4),
                'Subchunk1Size': new OffSet(16, 4),
                'AudioFormat': new OffSet(20, 2),
                'NumChannels': new OffSet(22, 2),
                'SampleRate': new OffSet(24, 4),
                'ByteRate': new OffSet(28, 4),
                'BlockAlign': new OffSet(32, 2),
                'BitsPerSample': new OffSet(34, 2)
            },
            'DataSubChunk': {
                'Subchunk2ID': new OffSet(36, 4),
                'Subchunk2Size': new OffSet(40, 4),
                'Data': new OffSet(44, -1)
            }
        }
    }
};

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Audio = function () {
    function Audio() {
        _classCallCheck(this, Audio);
    }

    _createClass(Audio, null, [{
        key: 'AudioFromFile',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(file) {
                var _this = this;

                var AudioArray;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                AudioArray = [0];

                                if (!(typeof file === "string")) {
                                    _context.next = 9;
                                    break;
                                }

                                _context.next = 4;
                                return fetch(file).then(function (response) {
                                    return response.body.getReader().read();
                                }).then(function (response) {
                                    return Audio.AudioArray = response.value;
                                });

                            case 4:
                                _context.next = 6;
                                return new Promise(function () {
                                    _this.ReadFile(AudioArray);
                                });

                            case 6:
                                return _context.abrupt('return', _context.sent);

                            case 9:
                                if (!((typeof file === 'undefined' ? 'undefined' : _typeof(file)) === "object" && file instanceof Array)) {
                                    _context.next = 12;
                                    break;
                                }

                                this.AudioArray = file;
                                return _context.abrupt('return', this.ReadFile(AudioArray));

                            case 12:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function AudioFromFile(_x) {
                return _ref.apply(this, arguments);
            }

            return AudioFromFile;
        }()
    }, {
        key: 'ReadFile',
        value: function ReadFile(AudioArray) {
            if ((AudioArray instanceof Array || AudioArray instanceof ArrayBuffer || AudioArray instanceof Uint8Array) && (AudioArray = new Uint8Array(AudioArray)).length > 44) {
                if (AudioArray[0] === CanonicalAudioFormats.CHUNK_IDS.WAVE_CHUNCK_ID_0 && AudioArray[1] === CanonicalAudioFormats.CHUNK_IDS.WAVE_CHUNCK_ID_1 && AudioArray[2] === CanonicalAudioFormats.CHUNK_IDS.WAVE_CHUNCK_ID_2 && AudioArray[3] === CanonicalAudioFormats.CHUNK_IDS.WAVE_CHUNCK_ID_3) {
                    return new WaveAudio(AudioArray);
                } else if (AudioArray[0] === CanonicalAudioFormats.CHUNK_IDS.MP3_CHUNK_ID_0 && AudioArray[1] === CanonicalAudioFormats.CHUNK_IDS.MP3_CHUNK_ID_1 && AudioArray[2] === CanonicalAudioFormats.CHUNK_IDS.MP3_CHUNK_ID_2) {
                    return new MP3Audio(AudioArray);
                }
                throw new Error('Unrecognized Audio File.');
            } else throw new Error('Invalid Audio File!');
        }
    }]);

    return Audio;
}();

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MP3Audio = function (_Audio) {
    _inherits(MP3Audio, _Audio);

    function MP3Audio(buffer) {
        _classCallCheck(this, MP3Audio);

        var _this = _possibleConstructorReturn(this, (MP3Audio.__proto__ || Object.getPrototypeOf(MP3Audio)).call(this));

        _this.Buffer = buffer ? buffer : [new Uint8Array(0)];
        _this.MP3FileBlob = new Blob(_this.Buffer, { type: "audio/mp3" });
        return _this;
    }

    _createClass(MP3Audio, null, [{
        key: 'ConvertFromWave',
        value: function ConvertFromWave(waveAudio) {
            var enconder = new LameLib.Mp3Encoder(waveAudio.Header.FormatSubChunk.NumChannels, waveAudio.Header.FormatSubChunk.SampleRate, waveAudio.Header.FormatSubChunk.ByteRate || 128);
            var encondedData = [];
            MP3Audio[waveAudio.Header.FormatSubChunk.NumChannels == 1 ? "getMonoChunk" : "getStereoChunk"](new Uint16Array(waveAudio.Header.DataSubChunk.Data)).forEach(function (chunck) {
                var enconded = enconder.encodeBuffer.apply(enconder, chunck);
                if (enconded.length > 0) encondedData.push(enconded);
            });
            var enconderFlush = enconder.flush();
            if (enconderFlush.length > 0) encondedData.push(enconderFlush);

            return new MP3Audio(new Uint8Array(encondedData));
        }
    }, {
        key: 'getMonoChunk',
        value: function getMonoChunk(sample, sampleLength, sampleBlockSize) {
            var buffer = [];
            for (var index = 0; index < sampleLength; index += sampleBlockSize) {
                var _sampleChunk = sample.subarray(index, index + sampleBlockSize);
                if (_sampleChunk != null && _sampleChunk.length > 0) {
                    buffer.push([_sampleChunk]);
                }
            }
            return buffer;
        }
    }, {
        key: 'getStereoChunk',
        value: function getStereoChunk(sample, sampleLength, sampleBlockSize) {
            var buffer = [];
            for (var index = 0; index < sampleLength; index += sampleBlockSize * 2) {
                var sampleChunkLeft = sample.subarray(index, index + sampleBlockSize);
                var sampleChunkRight = sample.subarray(index + sampleBlockSize, index + sampleBlockSize * 2);
                if (sampleChunk != null && sampleChunk.length > 0) {
                    buffer.push([sampleChunkLeft, sampleChunkRight]);
                }
            }
            return buffer;
        }
    }]);

    return MP3Audio;
}(Audio);

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HexArrayToDecimal = function HexArrayToDecimal(hexArray) {
  hexArray = Array.from(hexArray);
  return eval('0x' + hexArray.reverse().map(function (v) {
    return Binary.fromUnsigned(v).toHexString().replace('0x', '');
  }).join(''));
};

var hexArrayToString = function hexArrayToString(hexArray) {
  hexArray = Array.from(hexArray);
  return hexArray.map(function (v) {
    return String.fromCharCode(v);
  }).join('');
};

var WaveAudio = function (_Audio) {
  _inherits(WaveAudio, _Audio);

  function WaveAudio(buffer) {
    _classCallCheck(this, WaveAudio);

    var _this = _possibleConstructorReturn(this, (WaveAudio.__proto__ || Object.getPrototypeOf(WaveAudio)).call(this));

    _this.Header = {
      'Chunk': {
        'ID': '',

        'Size': 0,

        'Format': ''
      },

      'FormatSubChunk': {
        'Subchunk1ID': '',

        'Subchunk1Size': 0,

        'AudioFormat': 0,

        'NumChannels': 2,

        'SampleRate': 8000,

        'ByteRate': 0,

        'BlockAlign': 0,

        'BitsPerSample': 16
      },

      'DataSubChunk': {
        'Subchunk2ID': '',

        'Subchunk2Size': 0,

        'Data': [new Uint8Array(0)]
      }
    };


    _this._AudioBufferArray = buffer || new Uint8Array([0]);
    _this._AudioHeaderBufferArray = new Uint8Array([0]);
    _this._ReadHeaderAudio();
    Object.defineProperty(_this, 'HeaderArray', {
      get: function get() {
        return Array.from(this._AudioHeaderBufferArray);
      },

      enumerable: true,
      configurable: false,
      set: function set(newValue) {},

      writable: false
    });
    return _this;
  }

  _createClass(WaveAudio, [{
    key: '_ReadHeaderAudio',
    value: function _ReadHeaderAudio() {
      this._AudioHeaderBufferArray = this._AudioBufferArray.slice(0, AudioSettings.HEARDER_LENGTH.WAVE);

      this.Header.Chunk.ID = hexArrayToString(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.Chunk.ID.Start, AudioSettings.HEADER_OFFSET.WAVE.Chunk.ID.End));
      this.Header.Chunk.Size = HexArrayToDecimal(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.Chunk.Size.Start, AudioSettings.HEADER_OFFSET.WAVE.Chunk.Size.End));
      this.Header.Chunk.Format = hexArrayToString(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.Chunk.Format.Start, AudioSettings.HEADER_OFFSET.WAVE.Chunk.Format.End));

      this.Header.FormatSubChunk.Subchunk1ID = hexArrayToString(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.Subchunk1ID.Start, AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.Subchunk1ID.End));
      this.Header.FormatSubChunk.Subchunk1Size = HexArrayToDecimal(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.Subchunk1Size.Start, AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.Subchunk1Size.End));
      this.Header.FormatSubChunk.AudioFormat = HexArrayToDecimal(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.AudioFormat.Start, AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.AudioFormat.End));
      this.Header.FormatSubChunk.NumChannels = HexArrayToDecimal(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.NumChannels.Start, AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.NumChannels.End));
      this.Header.FormatSubChunk.SampleRate = HexArrayToDecimal(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.SampleRate.Start, AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.SampleRate.End));
      this.Header.FormatSubChunk.ByteRate = HexArrayToDecimal(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.ByteRate.Start, AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.ByteRate.End));
      this.Header.FormatSubChunk.BlockAlign = HexArrayToDecimal(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.BlockAlign.Start, AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.BlockAlign.End));
      this.Header.FormatSubChunk.BitsPerSample = HexArrayToDecimal(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.BitsPerSample.Start, AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.BitsPerSample.End));

      this.Header.DataSubChunk.Subchunk2ID = hexArrayToString(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.DataSubChunk.Subchunk2ID.Start, AudioSettings.HEADER_OFFSET.WAVE.DataSubChunk.Subchunk2ID.End));
      this.Header.DataSubChunk.Subchunk2Size = HexArrayToDecimal(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.DataSubChunk.Subchunk2Size.Start, AudioSettings.HEADER_OFFSET.WAVE.DataSubChunk.Subchunk2Size.End));
      this.Header.DataSubChunk.Data = this._AudioBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.DataSubChunk.Data.Start);
    }
  }]);

  return WaveAudio;
}(Audio);