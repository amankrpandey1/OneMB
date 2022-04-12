var a = [[4,8,9],[10,18,23],["VIT","CSE","MCA"]];
var ch = 'a';
for(var i=0;i<a.length;i++){
    console.log(ch+" = "+a[i]);
    ch=nextCharacter(ch);
    // for(var j=0;j<a[i].length();j++){

    // }
}
function nextCharacter(ch) {
    return String.fromCharCode(ch.charCodeAt(0) + 1);
}