class OffSet{
    /**
     * Constructor
     * @param {number} start Index to start
     * @param {number} size Size os bits to be loeaded
     */
    constructor(start, size){
        this.Start = start || 0;
        this.Size =  size || 1;
        this.End = (this.Size + this.Start);
        Object.seal(this);
        Object.freeze(this);
    }
};

module.exports = {
    OffSet,
    'TAGS': Object.seal(
        Object.freeze({
            "WAVE_TAG":'RIFF',
            "MP3_TAG":'ID3'
        })
    ),
    'CHUNK_IDS':Object.seal(
        Object.freeze({
            "WAVE_CHUNCK_ID_0": 0x52,
            "WAVE_CHUNCK_ID_1": 0x49,
            "WAVE_CHUNCK_ID_2": 0x46,
            "WAVE_CHUNCK_ID_3": 0x46,
            "MP3_CHUNK_ID_0":0x49,
            "MP3_CHUNK_ID_1":0x44,
            "MP3_CHUNK_ID_2":0x33,
            "MP3_CHUNK_ID_3":0x4,
        })
    ),
    'HEARDER_LENGTH':{
        'WAVE':44,
        'MP3': 32
    },
    'HEADER_OFFSET':{
        'WAVE':{
            'Chunk':{
                'ID':new OffSet(0,4),
                'Size':new OffSet(4,4),
                'Format':new OffSet(8,4)
            },
            'FormatSubChunk':{
                'Subchunk1ID':new OffSet(12,4),
                'Subchunk1Size':new OffSet(16,4),
                'AudioFormat':new OffSet(20,2),
                'NumChannels':new OffSet(22,2),
                'SampleRate':new OffSet(24,4),
                'ByteRate':new OffSet(28,4),
                'BlockAlign':new OffSet(32,2),
                'BitsPerSample':new OffSet(34,2)
            },
            'DataSubChunk':{
                'Subchunk2ID':new OffSet(36,4),
                'Subchunk2Size':new OffSet(40,4),
                'Data':new OffSet(44,-1)
            }
        }
    }
}