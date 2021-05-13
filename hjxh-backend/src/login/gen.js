const encryptPassword = function(e) {
    var t = function(e, t) {
        if (t < e.length + 11)
            return console.error("Message too long for RSA"),
                null;
        for (var n = [], r = e.length - 1; r >= 0 && t > 0; ) {
            var o = e.charCodeAt(r--);
            o < 128 ? n[--t] = o : o > 127 && o < 2048 ? (n[--t] = 63 & o | 128,
                n[--t] = o >> 6 | 192) : (n[--t] = 63 & o | 128,
                n[--t] = o >> 6 & 63 | 128,
                n[--t] = o >> 12 | 224)
        }
        n[--t] = 0;
        for (var i = new Q, a = []; t > 2; ) {
            for (a[0] = 0; 0 == a[0]; )
                i.nextBytes(a);
            n[--t] = a[0]
        }
        return n[--t] = 2,
            n[--t] = 0,
            new E(n)
    }(e, this.n.bitLength() + 7 >> 3);
    if (null == t)
        return null;
    var n = this.doPublic(t);
    if (null == n)
        return null;
    var r = n.toString(16);
    return 0 == (1 & r.length) ? r : "0" + r
}


console.log(encryptPassword('FL123456...'))