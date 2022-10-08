const Audio = require('../Audio.js');
const Binary = require('../../Bits&Bytes/Binary.js');
const AudioSettings = require('../CanonicalFileFormat.js');
const HexArrayToDecimal = (hexArray)=>{
    hexArray = Array.from(hexArray);
    return eval(`0x${(hexArray.reverse().map(v=> Binary.fromUnsigned(v).toHexString().replace('0x','')).join(''))}`);
};

const hexArrayToString = (hexArray)=>{
    hexArray = Array.from(hexArray);
    return hexArray.map(v=> String.fromCharCode(v)).join('');
};

class WaveAudio extends Audio {
    /**
     * Constructor
     * @param {Uint8Array} buffer 
     */
    constructor(buffer){
        super();
        //_region Header
        /**
         * The "WAVE" format consists of two subchunks: "fmt " and "data"
         */
        this.Header = {
            /**
             * The canonical WAVE format starts with the RIFF header
             */
            'Chunk':{
                /**
                 * Contains the letters "RIFF" in ASCII form
                                 (0x52494646 big-endian form).
                */
                'ID':'',
                /**
                 * 36 + SubChunk2Size, or more precisely:
                                 4 + (8 + SubChunk1Size) + (8 + SubChunk2Size)
                                This is the size of the rest of the chunk 
                                following this number.  This is the size of the 
                                entire file in bytes minus 8 bytes for the
                                two fields not included in this count:
                                ChunkID and ChunkSize.
                */
                'Size':0,
                /**
                 * Contains the letters "WAVE"
                 *                 (0x57415645 big-endian form) 
                 */
                'Format':''
            },
            /** 
            *The "FormatSubChunk" describes the sound data's format  
            */
            'FormatSubChunk':{
                /**
                 * Contains the letters "fmt "
                                 (0x666d7420 big-endian form).
                */
                'Subchunk1ID':'',
                /**
                 * 16 for PCM.  This is the size of the
                                 rest of the Subchunk which follows this number.
                */
                'Subchunk1Size':0,
                /**
                 *  PCM = 1 (i.e. Linear quantization)
                                 Values other than 1 indicate some 
                                form of compression.
                */
                'AudioFormat':0,
                /**
                 * Mono = 1, Stereo = 2, etc.
                 */
                'NumChannels':2,
                /**
                 * 8000, 44100, etc.
                 */
                'SampleRate':8000,
                /**
                 * == SampleRate * NumChannels * BitsPerSample/8
                 */
                'ByteRate':0,
                /**
                 * == NumChannels * BitsPerSample/8
                                 The number of bytes for one sample including
                                all channels. I wonder what happens when
                                this number isn't an integer?
                */
                'BlockAlign':0,
                /**
                 * 8 bits = 8, 16 bits = 16, etc.
                 */
                'BitsPerSample':16
            },
            /**
             * The "DataSubChunk" contains the size of the data and the actual sound
             */
            'DataSubChunk':{
                /**
                 *  Contains the letters "data"
                                 (0x64617461 big-endian form).
                */
                'Subchunk2ID':'',
                /**
                 *  == NumSamples * NumChannels * BitsPerSample/8
                                 This is the number of bytes in the data.
                                You can also think of this as the size
                                of the read of the subchunk following this 
                                number.
                */
                'Subchunk2Size':0,
                /**
                 * The actual sound data.
                 */
                'Data':[new Uint8Array(0)]
            }
        };
        //_endregion

        this._AudioBufferArray = buffer || new Uint8Array([0]);
        this._AudioHeaderBufferArray = new Uint8Array([0]);   
        this._ReadHeaderAudio();
        Object.defineProperty(this, 'HeaderArray', {
            get(){return Array.from(this._AudioHeaderBufferArray);},
            enumerable: true,
            configurable: false,
            set(newValue){ },
            writable: false
        });
    }

    _ReadHeaderAudio(){
        this._AudioHeaderBufferArray = this._AudioBufferArray.slice(0, AudioSettings.HEARDER_LENGTH.WAVE);
        
        //Chunk
        this.Header.Chunk.ID = hexArrayToString(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.Chunk.ID.Start,AudioSettings.HEADER_OFFSET.WAVE.Chunk.ID.End));
        this.Header.Chunk.Size = HexArrayToDecimal(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.Chunk.Size.Start,AudioSettings.HEADER_OFFSET.WAVE.Chunk.Size.End));
        this.Header.Chunk.Format = hexArrayToString(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.Chunk.Format.Start,AudioSettings.HEADER_OFFSET.WAVE.Chunk.Format.End));

        //Format Especifications
        this.Header.FormatSubChunk.Subchunk1ID = hexArrayToString(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.Subchunk1ID.Start,AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.Subchunk1ID.End));
        this.Header.FormatSubChunk.Subchunk1Size = HexArrayToDecimal( this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.Subchunk1Size.Start,AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.Subchunk1Size.End));
        this.Header.FormatSubChunk.AudioFormat = HexArrayToDecimal( this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.AudioFormat.Start,AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.AudioFormat.End));
        this.Header.FormatSubChunk.NumChannels = HexArrayToDecimal(this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.NumChannels.Start,AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.NumChannels.End));
        this.Header.FormatSubChunk.SampleRate = HexArrayToDecimal( this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.SampleRate.Start,AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.SampleRate.End));
        this.Header.FormatSubChunk.ByteRate = HexArrayToDecimal( this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.ByteRate.Start,AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.ByteRate.End));
        this.Header.FormatSubChunk.BlockAlign = HexArrayToDecimal( this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.BlockAlign.Start,AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.BlockAlign.End));
        this.Header.FormatSubChunk.BitsPerSample = HexArrayToDecimal( this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.BitsPerSample.Start,AudioSettings.HEADER_OFFSET.WAVE.FormatSubChunk.BitsPerSample.End));

        //Data Especifications
        this.Header.DataSubChunk.Subchunk2ID = hexArrayToString( this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.DataSubChunk.Subchunk2ID.Start,AudioSettings.HEADER_OFFSET.WAVE.DataSubChunk.Subchunk2ID.End));
        this.Header.DataSubChunk.Subchunk2Size = HexArrayToDecimal( this._AudioHeaderBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.DataSubChunk.Subchunk2Size.Start,AudioSettings.HEADER_OFFSET.WAVE.DataSubChunk.Subchunk2Size.End)); //Dont know why, but it should be reversed
        this.Header.DataSubChunk.Data = this._AudioBufferArray.slice(AudioSettings.HEADER_OFFSET.WAVE.DataSubChunk.Data.Start);
    }

}

module.exports = WaveAudio;