var Crypto = require("crypto-js");
var priMsisdn = "12345678";
var secMsisdn = "87654321";
var timestamp = "1430229729";
var nonce = 886655;
var apiSecretKey = "ct1616";
var concatenatedMessage = priMsisdn + secMsisdn;

var kMessage = Crypto.HmacSHA256(concatenatedMessage, apiSecretKey).toString().toLowerCase();
var ktimestamp = Crypto.HmacSHA256(timestamp, kMessage).toString().toLowerCase();
var hash = Crypto.HmacSHA256(nonce.toString(), ktimestamp);

var signature = hash.toString().toLowerCase();

console.log(kMessage);
console.log(ktimestamp);
console.log(signature);