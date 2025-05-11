
function random(min, max) {
    return Math.floor(Math.random() * max) + min;
 }
 
 function rand(arr) {
     return arr[random(0, arr.length)];
 }

 function getUid() {
    const d = new Date();
    return `_${d.getTime()}${random(0, 1000000)}_`;
 }

 function ssmmhh(secs) {
    let d = new Date(secs * 1000).toISOString().slice(11, 19);
    return d;
 }