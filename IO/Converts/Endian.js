const Binary = require('../Bits&Bytes/Binary');

class Endian extends Binary{
    /**
     * Constructor
     * @param {Binary} binary 
     */
    constructor (binary){
        if(binary instanceof Binary){
            super(binary.bits);
        }
        else if(binary instanceof Uint8Array){
            super(Endian._constructFromUint8Array(binary));
        }
        else if(binary instanceof Uint16Array){
            super(Endian._constructFromUint16Array(binary));
        }
        else if(binary instanceof Uint32Array){
            super(Endian._constructFromUint32Array(binary));
        }
        else if(binary instanceof Array){
            super(Endian._constructFromUint8Array(binary));
        }
        else{
            throw new Error('Invalid Endian Number');
        }
    }

    /**
     * Converts the Uint8Array in bits
     * @param {Uint8Array} uint8 
     * @returns {number[]}
     */
    static _constructFromUint8Array(uint8){
        let minBits = 8;
        uint8 = Array.from(uint8);
        let bin = Binary.fromUnsigned(eval(`0x${uint8.map(value => Binary.fromUnsigned(value).toHexString().replace('0x','')).join('')}`));
        return (bin.bitsLength < minBits ? bin.zeroExtend(minBits) : bin).bits;
    }    

    /**
     * Converts the Uint16Array in bits
     * @param {Uint16Array} uint16 
     * @returns {number[]}
     */
    static _constructFromUint16Array(uint16){
         let minBits = 8*2;
         uint16 = Array.from(uint16);
        let bin = Binary.fromUnsigned(eval(`0x${uint16.map(value => Binary.fromUnsigned(value).toHexString().replace('0x','')).join('')}`));
        return (bin.bitsLength < minBits ? bin.zeroExtend(minBits) : bin).bits;
    }

    /**
     * Converts the Uint32Array in bits
     * @param {Uint32Array} uint32 
     * @returns {number[]}
     */
    static _constructFromUint32Array(uint32){
         let minBits = 8*4;
         uint32 = Array.from(uint32);
        let bin = Binary.fromUnsigned(eval(`0x${uint32.map(value => Binary.fromUnsigned(value).toHexString().replace('0x','')).join('')}`));
        return (bin.bitsLength < minBits ? bin.zeroExtend(minBits) : bin).bits;
    }
}

class LittleEndian extends Endian
{
    constructor(binary){
        if(binary instanceof Binary){
            super(LittleEndian._buildFromBinary(binary));
        }
        else if(binary instanceof Uint8Array){
            super(LittleEndian._buildFromArray(binary));
        }
        else if(binary instanceof Uint16Array){
            super(LittleEndian._buildFromArray(binary));
        }
        else if(binary instanceof Uint32Array){
            super(LittleEndian._buildFromArray(binary));
        }
        else if(binary instanceof Array){
            super(LittleEndian._buildFromArray(binary));
        }
        else{
            throw new Error('Invalid Little-Endian Number');
        }
    }

    /**
     * set the binary to a correct structure
     * @param {Binary} binary 
     * @returns {number[]} 
     */
    static _buildFromBinary(binary){
        return (binary || {bits:[0]}).bits;
    }

    /**
     * set the array to a correct structure
     * @param {Array} _array 
     */
    static _buildFromArray(_array){
        let littleEndiaDecimal = Array.from( _array ).map( (v, i)=> v*16**(i*2) ).reduce( (a,b)=> a + b , 0 );
        return Binary.fromUnsigned( littleEndiaDecimal ).bits;
    }
}

class BigEndian extends Endian{
    constructor(binary){
        if(binary instanceof Binary){
            super(BigEndian._buildFromBinary(binary));
        }
        else if(binary instanceof Uint8Array){
            super(BigEndian._buildFromArray(binary));
        }
        else if(binary instanceof Uint16Array){
            super(BigEndian._buildFromArray(binary));
        }
        else if(binary instanceof Uint32Array){
            super(BigEndian._buildFromArray(binary));
        }
        else if(binary instanceof Array){
            super(BigEndian._buildFromArray(binary));
        }
        else{
            throw new Error('Invalid Big-Endian Number');
        }
    }

    /**
     * set the binary to a correct structure
     * @param {Binary} binary 
     * @returns {number[]} 
     */
    static _buildFromBinary( binary ){
        return (binary || {bits:[0]}).bits;
    }

    /**
     * set the array to a correct structure
     * @param {number[]} _array 
     */
    static _buildFromArray( _array ){
        let bigEndiaDecimal = Array.from( _array ).map( (v, i, self) => self[self.length-1-i]*16**(i*2) ).reduce( (a,b) => a + b , 0 );
        return Binary.fromUnsigned( bigEndiaDecimal ).bits;
    }
}

module.exports = {
    BigEndian,
    LittleEndian
};