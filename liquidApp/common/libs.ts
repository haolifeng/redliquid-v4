function idleSleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

const txMap = new Map();
const txStateMap:Map<string,boolean> = new Map();



export {
    idleSleep,
    txMap,
    txStateMap,

}