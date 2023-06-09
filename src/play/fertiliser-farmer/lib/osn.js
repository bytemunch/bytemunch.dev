// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.makeNoise4D = exports.makeNoise3D = exports.makeNoise2D = void 0;
import * as constants_1 from './constants.js';

export function contribution2D(multiplier, xsb, ysb) {
    return {
        dx: -xsb - multiplier * constants_1.SQUISH_2D,
        dy: -ysb - multiplier * constants_1.SQUISH_2D,
        xsb: xsb,
        ysb: ysb
    };
}
export function contribution3D(multiplier, xsb, ysb, zsb) {
    return {
        dx: -xsb - multiplier * constants_1.SQUISH_3D,
        dy: -ysb - multiplier * constants_1.SQUISH_3D,
        dz: -zsb - multiplier * constants_1.SQUISH_3D,
        xsb: xsb,
        ysb: ysb,
        zsb: zsb
    };
}
export function contribution4D(multiplier, xsb, ysb, zsb, wsb) {
    return {
        dx: -xsb - multiplier * constants_1.SQUISH_4D,
        dy: -ysb - multiplier * constants_1.SQUISH_4D,
        dz: -zsb - multiplier * constants_1.SQUISH_4D,
        dw: -wsb - multiplier * constants_1.SQUISH_4D,
        xsb: xsb,
        ysb: ysb,
        zsb: zsb,
        wsb: wsb
    };
}
export function makeNoise2D(clientSeed) {
    var contributions = [];
    for (var i = 0; i < constants_1.p2D.length; i += 4) {
        var baseSet = constants_1.base2D[constants_1.p2D[i]];
        var previous = null;
        var current = null;
        for (var k = 0; k < baseSet.length; k += 3) {
            current = contribution2D(baseSet[k], baseSet[k + 1], baseSet[k + 2]);
            if (previous === null)
                contributions[i / 4] = current;
            else
                previous.next = current;
            previous = current;
        }
        current.next = contribution2D(constants_1.p2D[i + 1], constants_1.p2D[i + 2], constants_1.p2D[i + 3]);
    }
    var lookup = [];
    for (var i = 0; i < constants_1.lookupPairs2D.length; i += 2) {
        lookup[constants_1.lookupPairs2D[i]] = contributions[constants_1.lookupPairs2D[i + 1]];
    }
    var perm = new Uint8Array(256);
    var perm2D = new Uint8Array(256);
    var source = new Uint8Array(256);
    for (var i = 0; i < 256; i++)
        source[i] = i;
    var seed = new Uint32Array(1);
    seed[0] = clientSeed;
    seed = shuffleSeed(shuffleSeed(shuffleSeed(seed)));
    for (var i = 255; i >= 0; i--) {
        seed = shuffleSeed(seed);
        var r = new Uint32Array(1);
        r[0] = (seed[0] + 31) % (i + 1);
        if (r[0] < 0)
            r[0] += i + 1;
        perm[i] = source[r[0]];
        perm2D[i] = perm[i] & 0x0e;
        source[r[0]] = source[i];
    }
    return function (x, y) {
        var stretchOffset = (x + y) * constants_1.STRETCH_2D;
        var xs = x + stretchOffset;
        var ys = y + stretchOffset;
        var xsb = Math.floor(xs);
        var ysb = Math.floor(ys);
        var squishOffset = (xsb + ysb) * constants_1.SQUISH_2D;
        var dx0 = x - (xsb + squishOffset);
        var dy0 = y - (ysb + squishOffset);
        var xins = xs - xsb;
        var yins = ys - ysb;
        var inSum = xins + yins;
        var hash = (xins - yins + 1) |
            (inSum << 1) |
            ((inSum + yins) << 2) |
            ((inSum + xins) << 4);
        var value = 0;
        for (var c = lookup[hash]; c !== undefined; c = c.next) {
            var dx = dx0 + c.dx;
            var dy = dy0 + c.dy;
            var attn = 2 - dx * dx - dy * dy;
            if (attn > 0) {
                var px = xsb + c.xsb;
                var py = ysb + c.ysb;
                var indexPartA = perm[px & 0xff];
                var index = perm2D[(indexPartA + py) & 0xff];
                var valuePart = constants_1.gradients2D[index] * dx + constants_1.gradients2D[index + 1] * dy;
                value += attn * attn * attn * attn * valuePart;
            }
        }
        return value * constants_1.NORM_2D;
    };
}
export function makeNoise3D(clientSeed) {
    var contributions = [];
    for (var i = 0; i < constants_1.p3D.length; i += 9) {
        var baseSet = constants_1.base3D[constants_1.p3D[i]];
        var previous = null;
        var current = null;
        for (var k = 0; k < baseSet.length; k += 4) {
            current = contribution3D(baseSet[k], baseSet[k + 1], baseSet[k + 2], baseSet[k + 3]);
            if (previous === null)
                contributions[i / 9] = current;
            else
                previous.next = current;
            previous = current;
        }
        current.next = contribution3D(constants_1.p3D[i + 1], constants_1.p3D[i + 2], constants_1.p3D[i + 3], constants_1.p3D[i + 4]);
        current.next.next = contribution3D(constants_1.p3D[i + 5], constants_1.p3D[i + 6], constants_1.p3D[i + 7], constants_1.p3D[i + 8]);
    }
    var lookup = [];
    for (var i = 0; i < constants_1.lookupPairs3D.length; i += 2) {
        lookup[constants_1.lookupPairs3D[i]] = contributions[constants_1.lookupPairs3D[i + 1]];
    }
    var perm = new Uint8Array(256);
    var perm3D = new Uint8Array(256);
    var source = new Uint8Array(256);
    for (var i = 0; i < 256; i++)
        source[i] = i;
    var seed = new Uint32Array(1);
    seed[0] = clientSeed;
    seed = shuffleSeed(shuffleSeed(shuffleSeed(seed)));
    for (var i = 255; i >= 0; i--) {
        seed = shuffleSeed(seed);
        var r = new Uint32Array(1);
        r[0] = (seed[0] + 31) % (i + 1);
        if (r[0] < 0)
            r[0] += i + 1;
        perm[i] = source[r[0]];
        perm3D[i] = (perm[i] % 24) * 3;
        source[r[0]] = source[i];
    }
    return function (x, y, z) {
        var stretchOffset = (x + y + z) * constants_1.STRETCH_3D;
        var xs = x + stretchOffset;
        var ys = y + stretchOffset;
        var zs = z + stretchOffset;
        var xsb = Math.floor(xs);
        var ysb = Math.floor(ys);
        var zsb = Math.floor(zs);
        var squishOffset = (xsb + ysb + zsb) * constants_1.SQUISH_3D;
        var dx0 = x - (xsb + squishOffset);
        var dy0 = y - (ysb + squishOffset);
        var dz0 = z - (zsb + squishOffset);
        var xins = xs - xsb;
        var yins = ys - ysb;
        var zins = zs - zsb;
        var inSum = xins + yins + zins;
        var hash = (yins - zins + 1) |
            ((xins - yins + 1) << 1) |
            ((xins - zins + 1) << 2) |
            (inSum << 3) |
            ((inSum + zins) << 5) |
            ((inSum + yins) << 7) |
            ((inSum + xins) << 9);
        var value = 0;
        for (var c = lookup[hash]; c !== undefined; c = c.next) {
            var dx = dx0 + c.dx;
            var dy = dy0 + c.dy;
            var dz = dz0 + c.dz;
            var attn = 2 - dx * dx - dy * dy - dz * dz;
            if (attn > 0) {
                var px = xsb + c.xsb;
                var py = ysb + c.ysb;
                var pz = zsb + c.zsb;
                var indexPartA = perm[px & 0xff];
                var indexPartB = perm[(indexPartA + py) & 0xff];
                var index = perm3D[(indexPartB + pz) & 0xff];
                var valuePart = constants_1.gradients3D[index] * dx +
                    constants_1.gradients3D[index + 1] * dy +
                    constants_1.gradients3D[index + 2] * dz;
                value += attn * attn * attn * attn * valuePart;
            }
        }
        return value * constants_1.NORM_3D;
    };
}

export function makeNoise4D(clientSeed) {
    var contributions = [];
    for (var i = 0; i < constants_1.p4D.length; i += 16) {
        var baseSet = constants_1.base4D[constants_1.p4D[i]];
        var previous = null;
        var current = null;
        for (var k = 0; k < baseSet.length; k += 5) {
            current = contribution4D(baseSet[k], baseSet[k + 1], baseSet[k + 2], baseSet[k + 3], baseSet[k + 4]);
            if (previous === null)
                contributions[i / 16] = current;
            else
                previous.next = current;
            previous = current;
        }
        current.next = contribution4D(constants_1.p4D[i + 1], constants_1.p4D[i + 2], constants_1.p4D[i + 3], constants_1.p4D[i + 4], constants_1.p4D[i + 5]);
        current.next.next = contribution4D(constants_1.p4D[i + 6], constants_1.p4D[i + 7], constants_1.p4D[i + 8], constants_1.p4D[i + 9], constants_1.p4D[i + 10]);
        current.next.next.next = contribution4D(constants_1.p4D[i + 11], constants_1.p4D[i + 12], constants_1.p4D[i + 13], constants_1.p4D[i + 14], constants_1.p4D[i + 15]);
    }
    var lookup = [];
    for (var i = 0; i < constants_1.lookupPairs4D.length; i += 2) {
        lookup[constants_1.lookupPairs4D[i]] = contributions[constants_1.lookupPairs4D[i + 1]];
    }
    var perm = new Uint8Array(256);
    var perm4D = new Uint8Array(256);
    var source = new Uint8Array(256);
    for (var i = 0; i < 256; i++)
        source[i] = i;
    var seed = new Uint32Array(1);
    seed[0] = clientSeed;
    seed = shuffleSeed(shuffleSeed(shuffleSeed(seed)));
    for (var i = 255; i >= 0; i--) {
        seed = shuffleSeed(seed);
        var r = new Uint32Array(1);
        r[0] = (seed[0] + 31) % (i + 1);
        if (r[0] < 0)
            r[0] += i + 1;
        perm[i] = source[r[0]];
        perm4D[i] = perm[i] & 0xfc;
        source[r[0]] = source[i];
    }
    return function (x, y, z, w) {
        var stretchOffset = (x + y + z + w) * constants_1.STRETCH_4D;
        var xs = x + stretchOffset;
        var ys = y + stretchOffset;
        var zs = z + stretchOffset;
        var ws = w + stretchOffset;
        var xsb = Math.floor(xs);
        var ysb = Math.floor(ys);
        var zsb = Math.floor(zs);
        var wsb = Math.floor(ws);
        var squishOffset = (xsb + ysb + zsb + wsb) * constants_1.SQUISH_4D;
        var dx0 = x - (xsb + squishOffset);
        var dy0 = y - (ysb + squishOffset);
        var dz0 = z - (zsb + squishOffset);
        var dw0 = w - (wsb + squishOffset);
        var xins = xs - xsb;
        var yins = ys - ysb;
        var zins = zs - zsb;
        var wins = ws - wsb;
        var inSum = xins + yins + zins + wins;
        var hash = (zins - wins + 1) |
            ((yins - zins + 1) << 1) |
            ((yins - wins + 1) << 2) |
            ((xins - yins + 1) << 3) |
            ((xins - zins + 1) << 4) |
            ((xins - wins + 1) << 5) |
            (inSum << 6) |
            ((inSum + wins) << 8) |
            ((inSum + zins) << 11) |
            ((inSum + yins) << 14) |
            ((inSum + xins) << 17);
        var value = 0;
        for (var c = lookup[hash]; c !== undefined; c = c.next) {
            var dx = dx0 + c.dx;
            var dy = dy0 + c.dy;
            var dz = dz0 + c.dz;
            var dw = dw0 + c.dw;
            var attn = 2 - dx * dx - dy * dy - dz * dz - dw * dw;
            if (attn > 0) {
                var px = xsb + c.xsb;
                var py = ysb + c.ysb;
                var pz = zsb + c.zsb;
                var pw = wsb + c.wsb;
                var indexPartA = perm[px & 0xff];
                var indexPartB = perm[(indexPartA + py) & 0xff];
                var indexPartC = perm[(indexPartB + pz) & 0xff];
                var index = perm4D[(indexPartC + pw) & 0xff];
                var valuePart = constants_1.gradients4D[index] * dx +
                    constants_1.gradients4D[index + 1] * dy +
                    constants_1.gradients4D[index + 2] * dz +
                    constants_1.gradients4D[index + 3] * dw;
                value += attn * attn * attn * attn * valuePart;
            }
        }
        return value * constants_1.NORM_4D;
    };
}

export function shuffleSeed(seed) {
    var newSeed = new Uint32Array(1);
    newSeed[0] = seed[0] * 1664525 + 1013904223;
    return newSeed;
}
