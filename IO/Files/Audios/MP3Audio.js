const Audio = require('../Audio.js') ;
const WaveAudio = require('./WaveAudio.js');
const LameLib = require('lamejs');
class MP3Audio extends Audio {

     
    /**
     * 
     * @param {Uint8Array} buffer 
     */
    constructor(buffer){
        super();
        this.Buffer = buffer ? buffer : [new Uint8Array(0)];
        this.MP3FileBlob = new Blob(this.Buffer, {type: "audio/mp3"});
    }

    /**
     * Converts WaveAudio to MP3 using LameLib
     * @param {WaveAudio} waveAudio 
     */
    static ConvertFromWave(waveAudio){
        let enconder = new LameLib.Mp3Encoder(waveAudio.Header.FormatSubChunk.NumChannels, waveAudio.Header.FormatSubChunk.SampleRate, waveAudio.Header.FormatSubChunk.ByteRate || 128);
        let encondedData = [];
        MP3Audio[ waveAudio.Header.FormatSubChunk.NumChannels == 1 ? "getMonoChunk" : "getStereoChunk"](new Uint16Array(waveAudio.Header.DataSubChunk.Data))
        .forEach(chunck=>{
            let enconded = enconder.encodeBuffer.apply(enconder, chunck);
            if(enconded.length > 0)
                encondedData.push(enconded);
        });
        let enconderFlush = enconder.flush();
        if(enconderFlush.length > 0)
            encondedData.push(enconderFlush);

        return new MP3Audio(new Uint8Array(encondedData));
    }

    /*
     * [] => returning
     * [[uint16Array]] => returning Mono
     * [[uint16Array, uint16Array]] => returning stereo
     * 
     * returning usage =>  [].forEach(chunk=>{ enconder.encodeBuffer.apply(encoder, chunck)});
     * 
     * 
     *****/


    /**
     * 
     * @param {Uint16Array} sample 
     * @param {number} sampleLength 
     * @param {number} sampleBlockSize 
     * @returns {Uint16Array[][]} buffer to be enconded
     */
    static getMonoChunk(sample, sampleLength, sampleBlockSize){
        let buffer = [];
        for(let index = 0; index < sampleLength; index += sampleBlockSize){
            let sampleChunk = sample.subarray(index, index + sampleBlockSize);
            if(sampleChunk != null && sampleChunk.length > 0){
                buffer.push([sampleChunk]);
            }
        }
        return buffer;
    }

    /**
     * 
     * @param {Uint16Array} sample 
     * @param {number} sampleLength 
     * @param {number} sampleBlockSize 
     * @returns {Uint16Array[][]} buffer to be enconded
     */
    static getStereoChunk(sample, sampleLength, sampleBlockSize){
        let buffer = [];
        for(let index = 0; index < sampleLength; index += (sampleBlockSize * 2)){
            let sampleChunkLeft = sample.subarray(index, index + sampleBlockSize);
            let sampleChunkRight = sample.subarray(index + sampleBlockSize, index + (sampleBlockSize * 2));
            if(sampleChunk != null && sampleChunk.length > 0){
                buffer.push([sampleChunkLeft, sampleChunkRight]);
            }
        }
        return buffer;
    }

}
module.exports = MP3Audio;