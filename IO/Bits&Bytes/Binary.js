const combineMap = (a1, a2, fn)=>{
    return a1.map((x, i)=> fn(x, a2[i]));
};

const reverse = a => [...a].reverse();

class Binary{
    constructor(bits){
        this.bits = bits;
    }

    assertIsBinary(other){
        if(!(other instanceof Binary))
            throw new Error('Not an instance of Binary');
    }

    assertSameNumberOfBits(other){
        if(other.bits.length !== this.bits.length)
            throw new Error(`Bit mismatch (a =  ${this.bits.length}, b = ${other.bits.length})`);
    }

    static fromSigned(n){
        if(!Number.isInteger(n))
            throw new Error('Can only create Binary from integers');

        if(n === 0)
            return new Binary([0]);


        const unsigned = Binary.fromUnsigned(Math.abs(n));
        const numberOfBits = unsigned.bits.length + 1;
        const withZeroSignBit = unsigned.zeroExtend(numberOfBits);

        if(n > 0)
            return withZeroSignBit;

        const flipped = withZeroSignBit.not();
        const withAddedOne = flipped.add(Binary.fromUnsigned(1).zeroExtend(numberOfBits));

        return new Binary(withAddedOne.bits.slice(1));
    }

    static fromUnsigned(n){
        if(!Number.isInteger(n))
            throw new Error('Can only create Binary from integers');

        if(n === 0)
            return new Binary([0]);

        const bits = [];
        let nearestPowerOfTwo = Math.floor(Math.log2(n));
        let numberInProgress = n;

        while(nearestPowerOfTwo >= 0){
            if(numberInProgress >= 2**nearestPowerOfTwo){
                bits.push(1);
                numberInProgress -= 2**nearestPowerOfTwo;
            }else{
                bits.push(0);
            }
            nearestPowerOfTwo -= 1;
        }
        return new Binary(bits);
    }

    toSignedNumber(){
        if(this.bits[0] === 0)
            return this.toNumber();

        const minusOneBits = Array.from({length: this.bits.length}, () => 1 );
        const minusOne = new Binary(minusOneBits);

        const positiveWithCarry = this.add(minusOne).not();
        const positiveNumber = new Binary(positiveWithCarry.bits.slice(1));

        return -positiveNumber.toNumber();
    }

    toNumber(){
        let total = 0;

        this.bits.forEach((bit, i) => {
            const powerOfTwo = this.bits.length - i - 1;

            if(bit === 1)
            total += 2**powerOfTwo;
        });

        return total;
    }

    zeroExtend(nBits){
        if(nBits <= this.bits.length){
            throw new Error(`Need to extend to a larger number of bits (current = ${this.bits.length}, target = ${nBits})`);
        }

        const numberExtraZeros = nBits - this.bits.length;
        const zeros = Array.from({length: numberExtraZeros}, ()=> 0);
        return new Binary([...zeros, ...this.bits]);
    }

    zeroExtendToMatch(other){
        this.assertIsBinary(other);
        return this.zeroExtend(other.bits.length);
    }

    add(other){
        this.assertIsBinary(other);
        this.assertSameNumberOfBits(other);

        let carryBit = 0;
        const newBits = combineMap(reverse(this.bits), reverse(other.bits), (a,b)=>{
            const abSum =  a ^ b;
            const abCarry = a & b;

            const abSumPlusCarry = abSum ^ carryBit;
            const abSumCarry = abSum & carryBit;

            carryBit = abCarry | abSumCarry;
            return abSumPlusCarry;
        });

        return new Binary([carryBit, ...reverse(newBits)]);
    }

    and(other){
        this.assertIsBinary(other);
        this.assertSameNumberOfBits(other);

        const newBits = combineMap(this.bits, other.bits, (bit1, bit2)=> bit1 & bit2);
        return new Binary(newBits);
    }
    
    or(other){
        this.assertIsBinary(other);
        this.assertSameNumberOfBits(other);

        const newBits = combineMap(this.bits, other.bits, (bit1, bit2)=> bit1 | bit2);
        return new Binary(newBits);
    }
    
    xor(other){
        this.assertIsBinary(other);
        this.assertSameNumberOfBits(other);

        const newBits = combineMap(this.bits, other.bits, (bit1, bit2) => bit1 ^ bit2);
        return new Binary(newBits);
    }

    not(){
        const newBits = this.bits.map(x=> x === 0 ? 1 : 0);
        return new Binary(newBits);
    }

    toHexString(){
        const GROUP = 4;
        const HEXVALUES = [0,1,2,3,4,5,6,7,8,9,'A','B','C', 'D', 'E', 'F'].map(v=> v.toString());
        let bitsNeeded = this.bits.length;
        while((bitsNeeded % GROUP) > 0){
            bitsNeeded++;
        }

        if(this.bits.length < bitsNeeded)
            return this.zeroExtend(bitsNeeded).toHexString();
        
        return '0x' + (this.bits
        .map((v, i)=> {
            if(i % GROUP === 0)
                return this.bits.slice(i, GROUP + i);
            else
                return null;
        })
        .filter(v=> v !== null)
        .map(v=> new Binary(v).toNumber())
        .map(v=>{
            const HEX = 16;
            const accumulator = [];
            let rest = v;

            while(rest >= 0){
                accumulator.push(rest % HEX);
                if(rest === 0) 
                    rest = -1;
                rest = Math.floor(rest / HEX);
            }

            let resulting = reverse(accumulator)
            .map(h=> HEXVALUES[h])
            .join('');
            if(resulting.length > 1 && resulting[0] === HEXVALUES[0])
                resulting = resulting.substring(1);
            return resulting;
        })
        .join(''));
    }
}
module.exports = Binary;
/*
const a = new Binary([1,0,1,1]);
const b = new Binary([1,1,0,1]);

console.log(a.toNumber());
console.log(a.and(b));
console.log(a.or(b));
console.log(a.xor(b));
console.log(a.not());
console.log(`Binary from unsigned 10 = `, Binary.fromUnsigned(10));
console.log(`Binary from unsigned 10 then as number again = `, Binary.fromUnsigned(10).toNumber());

const seven = Binary.fromUnsigned(7);
const six = Binary.fromUnsigned(6);

console.log(`seven + six = `, seven.add(six));
console.log(`seven + six then as number is: ${seven.add(six).toNumber()}`);

const eleven = Binary.fromUnsigned(11);
var five = Binary.fromUnsigned(5);

//console.log(eleven.add(five));
five = five.zeroExtendToMatch(eleven);
console.log(eleven.add(five));

const fromSigned = Binary.fromSigned(-5);
console.log('From signed -5 =', fromSigned);
console.log('From signed -5 then as signed number again = ', fromSigned.toSignedNumber());
*/