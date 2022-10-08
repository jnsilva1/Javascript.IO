const CanonicalAudioFormats = require('./CanonicalFileFormat.js');
const WaveAudio = require('./Audios/WaveAudio.js');
const MP3Audio = require('./Audios/MP3Audio.js');

class Audio{

    constructor(){

    }

    static async AudioFromFile(file){
        let AudioArray = [0];
        if(typeof file === "string"){

            await fetch(file)
            .then(response=>response.body.getReader().read())
            .then(response => Audio.AudioArray = response.value);

            return  await new Promise(()=>{ this.ReadFile(AudioArray) }) ;
        }
        else if(typeof file === "object" && file instanceof Array){
            this.AudioArray = file;
            return this.ReadFile(AudioArray);
        }
    }

    /**
     * Read the file then send the correct type
     * @param {Uint8Array} AudioArray 
     */
    static ReadFile(AudioArray){
        //Might be greater than 44, cause until it is just informations
        if((AudioArray instanceof Array || AudioArray instanceof ArrayBuffer || AudioArray instanceof Uint8Array ) && (AudioArray = new Uint8Array(AudioArray)).length > 44){
            
            //Is usual the audio files starts with firsts 4 elements representing the tag ['RIFF', 'ID3']
            if(
                AudioArray[0] === CanonicalAudioFormats.CHUNK_IDS.WAVE_CHUNCK_ID_0 &&
                AudioArray[1] === CanonicalAudioFormats.CHUNK_IDS.WAVE_CHUNCK_ID_1 &&
                AudioArray[2] === CanonicalAudioFormats.CHUNK_IDS.WAVE_CHUNCK_ID_2 &&
                AudioArray[3] === CanonicalAudioFormats.CHUNK_IDS.WAVE_CHUNCK_ID_3 
            ){
                return new WaveAudio(AudioArray);
            }else if(
                AudioArray[0] === CanonicalAudioFormats.CHUNK_IDS.MP3_CHUNK_ID_0 &&
                AudioArray[1] === CanonicalAudioFormats.CHUNK_IDS.MP3_CHUNK_ID_1 &&
                AudioArray[2] === CanonicalAudioFormats.CHUNK_IDS.MP3_CHUNK_ID_2 
            ){
                return new MP3Audio(AudioArray);
            }
            throw new Error('Unrecognized Audio File.');
        }
        else
            throw new Error('Invalid Audio File!');
    }
}
module.exports = Audio;