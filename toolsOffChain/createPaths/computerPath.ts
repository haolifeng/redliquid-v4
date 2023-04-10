import {tokenAddrPair} from '../types';


//
function isVexInArc(tokenPair: tokenAddrPair, addr:string){
    return tokenPair[0] === addr || tokenPair[1] === addr;
}
function otherEnd(tokenPair:tokenAddrPair, verx:string){
     return (tokenPair[0] === verx ? tokenPair[1]: tokenPair [0]);

}
//


function computerPath(tokenpairs:tokenAddrPair[], inTokenAddr: string, outTokenAddr: string):string[]{
    let target:string[] = [];

    let tmpTokensPairs = tokenpairs;
    let leftTokenAddrPairs = [];
    let relativeTokensAddrPairs =[];

    let verxLayers =[];
    let trance =[];
    verxLayers.push([inTokenAddr]);
    let verxLayersIndex = 0;

    let find = false;

    let breakJ = -1;

    while(1) {

        let verxArray = verxLayers[verxLayersIndex];
        console.log('verxArrayIndex: ', verxLayersIndex);
        console.log('verxArray: ', verxArray);

        let newVerxLayer =[];
        let newTrance = [];


        for (let i = 0; i < verxArray.length; i++) {
            let verx = verxArray[i];
            console.log('verx: ', verx);
            if(verx === '0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a'){
                console.log('wasp -- find');
            }

            if(tmpTokensPairs.length===0){
                return []; //
            }


           console.log('before walk tmpTokensPairs ------------ 0, tmpTokensPairs.length ', tmpTokensPairs.length);

            for (let tokenPair of tmpTokensPairs) {

                if (isVexInArc(tokenPair, verx)) {
                    if(verx === '0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a'){

                        let other = otherEnd(tokenPair, verx);
                        console.log('wasp -- others:', other);
                       // if(other === '0x52f44783BdF480e88C0eD4cF341A933CAcfDBcaa'){
                       //     console.log('find wasp-dot');
                       // }
                    }
                    relativeTokensAddrPairs.push(tokenPair);
                } else {

                    if(leftTokenAddrPairs.includes(tokenPair)){

                    }else{
                        leftTokenAddrPairs.push(tokenPair);
                    }

                }
            }
            //console.log('relativeTokensAddrPairs: ', relativeTokensAddrPairs);
           // console.log('leftTokenAddrPairs: ', leftTokenAddrPairs);

          /*  if(relativeTokensAddrPairs.length===0){
                continue;
            }*/



            for (let relativePair of relativeTokensAddrPairs) {
                if (isVexInArc(relativePair, outTokenAddr)) {
                    breakJ = i;
                    find = true;
                    break;
                } else {
                    let other = otherEnd(relativePair, verx);
                    newVerxLayer.push(other);
                    newTrance.push(i);
                }
            }
            if(find){
                break;
            }

            tmpTokensPairs = leftTokenAddrPairs;
            leftTokenAddrPairs = [];
            relativeTokensAddrPairs = [];


        }

        if(find){
            break;
        }
        verxLayers.push(newVerxLayer);
        trance.push(newTrance);

        verxLayersIndex++;

    }
    console.log('breakJ: ', breakJ);
    console.log('verxLayersIndex', verxLayersIndex)

    console.log('verxLayers: ', verxLayers);

    console.log('trance: ', trance);


    let j = breakJ;
    let l = verxLayersIndex;

    if(trance.length!==0){
        target.push(outTokenAddr);
        while(l>0){

            let tranceLayer = l-1;

            let t = trance[tranceLayer][j];
            console.log('t: ', t);
            console.log(verxLayers[l][j]);
            target.push(verxLayers[l][j]);

            j = t;
            l--;
        }
        target.push(inTokenAddr);
    }else{
        target.push(outTokenAddr);
        target.push(inTokenAddr);

    }

    console.log('target: ', target);



    return target.reverse();
}

export default  computerPath;

