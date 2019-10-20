/* 
FROM :
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
>>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
*/


let CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

function uuid(len, radix) {
     var chars = CHARS, uuid = [], i;
     radix = radix || chars.length;
 
     if (len) {
       // Compact form
       for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
     } else {
       // rfc4122, version 4 form
       var r;
 
       // rfc4122 requires these characters
       uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
       uuid[14] = '4';
 
       // Fill in random data.  At i==19 set the high bits of clock sequence as
       // per rfc4122, sec. 4.1.5
       for (i = 0; i < 36; i++) {
         if (!uuid[i]) {
           r = 0 | Math.random()*16;
           uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
         }
       }
     }
 
     return uuid.join('');
   };

 