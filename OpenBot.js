
//OpenBot v1
//Preleminary Release
var Robot = function(a) {};
var VragTank = {
    now: function() {},
    last: function() {}
};
var VT = {};
var MyTank = {
    id: null,
    X: null,
    Y: null,
    Life: null,
    Angle: null,
    cannonRelativeAngle: null,
    cannonAbsoluteAngle: null,
    trendMove: 1,
    trendRotate: 1
};
var MT = MyTank;
var Timer = 0;
var timeFire = 0;
var timeViev = 0;
var myev = null;
var ltm = 0;
var p = false;
var e = false;
var k = 0;
var X, Y;
var truTurn = function(a) {
    if ((a - 90) >= 0) return (a - 90);
    else return (360 + a - 90);
};
var yravn = {};
yravn.Set = function(a, b, c, d) {
    this.x1 = a;
    this.x2 = c;
    this.y1 = b;
    this.y2 = d;
};
yravn.GetX = function(a) {
    var b = (((a - this.y1) * (this.x2 - this.x1)) / (this.y2 - this.y1)) + this.x1;
    return b;
};
yravn.GetY = function(a) {
    var b = (((a - this.x1) * (this.y2 - this.y1)) / (this.x2 - this.x1)) + this.y1;
    return b;
};
var truXY = function(a, b, c, d, e) {
    var f = a.robot;
    var g = d;
    var h = e;
    yravn.Set(b, c, d, e);
    if (d < 0) {
        g = 0;
        h = yravn.GetY(g);
    }
    if (e < 0) {
        h = 0;
        g = yravn.GetX(h);
    }
    if (d > f.arenaWidth) {
        g = f.arenaWidth;
        h = yravn.GetY(g);
    }
    if (e > f.arenaHeight) {
        h = f.arenaHeight;
        g = yravn.GetX(h);
    }
    var i = {};
    i.x = Math.round(g);
    i.y = Math.round(h);
    return i;
};

function clone(a) {
    if (a == null || typeof a != 'object') return a;
    var b = {};
    for (var c in a) b[c] = clone(a[c]);
    return b;
}
var Distance = function(a, b, c, d) {
    var e;
    e = Math.sqrt(((c - a) * (c - a)) + ((d - b) * (d - b)));
    return e;
};
var Degres = function(a, b, c, d) {
    var e, f;
    if ((c >= a) & (d < b)) {
        e = Math.atan((c - a) / (b - d));
        f = (e * 180 / Math.PI);
    };
    if ((c > a) & (d >= b)) {
        e = Math.atan((d - b) / (c - a));
        f = 90 + (e * 180 / Math.PI);
    };
    if ((c <= a) & (d > b)) {
        e = Math.atan((a - c) / (d - b));
        f = 180 + (e * 180 / Math.PI);
    };
    if ((c < a) & (d <= b)) {
        e = Math.atan((b - d) / (a - c));
        f = 270 + (e * 180 / Math.PI);
    };
    return f;
};
var KratYglov = function(a, b) {
    var c = null;
    c = b - a;
    if (c < (-180)) c = 360 + c;
    if (c > 180) c = -360 + c;
    return c;
};
var VievObject = function(a) {
    for (var b in a) r.log(b + ':' + a[b]);
};
var Moved = function(a, b) {
    var c = a.robot,
        d = null;
    for (d = 0; d < Math.abs(b); d++) {
        if (b > 0) c.ahead(1);
        else c.back(1);
        if (c.parentId == null) Timer++;
    }
};
var Moved1 = function(a) {
    var b = this.robot,
        c = null;
    for (c = 0; c < Math.abs(a); c++) {
        if (a > 0) b.ahead(1);
        else b.back(1);
        if (b.parentId == null) Timer++;
    }
};
var Turned = function(a, b) {
    var c = a.robot,
        d = null;
    for (d = 0; d < Math.abs(b); d++) {
        if (b > 0) c.turn(1);
        else c.turn(-1);
        if (c.parentId == null) Timer++;
    }
};
var TurnedXY = function(a, b, c) {
    var d = a.robot,
        e = null;
    var f = Degres(d.position.x, d.position.y, b, c);
    var g = KratYglov(truTurn(d.cannonAbsoluteAngle), f);
    g = Math.round(g);
    Turned(a, g);
};
var Rotated = function(a, b) {
    var c = a.robot,
        d = null;
    for (d = 0; d < Math.abs(b); d++) {
        if (b > 0) c.rotateCannon(1);
        else c.rotateCannon(-1);
        if (c.parentId == null) Timer++;
    }
};
var Fired = function(a) {
    var b = a.robot;
    b.fire();
    if (b.parentId == null) Timer++;
};
var RobotInfo = function(a, b) {
    var c = a.robot,
        d = a.scannedRobot;
    if (typeof b[d.id] == 'undefined') {
        b[d.id] = {};
        b[d.id].now = {};
        b[d.id].last = {};
    };
    b[d.id].last = clone(b[d.id].now);
    var e = b[d.id].now;
    var f = b[d.id].last;
    e.x = d.position.x;
    e.y = d.position.y;
    e.life = d.life;
    if ((d.angle + 90) < 360) e.angle = d.angle + 90;
    else e.angle = ((d.angle + 90) - 360);
    e.cannonAngle = d.cannonAngle + e.angle;
    if (e.cannonAngle > 360) e.cannonAngle = e.cannonAngle - 360;
    e.id = d.id;
    e.dx = e.x - f.x;
    e.dy = e.y - f.y;
    e.time = Timer;
    e.dt = e.time - f.time;
    e.vx = e.dx / e.dt;
    e.vy = e.dy / e.dt;
    e.azimut = Degres(f.x, f.y, e.x, e.y);
    if ((typeof e.azimut == 'undefined') | (typeof e.azimut == 'NaN')) e.azimut = d.angle;
    e.step = Distance(f.x, f.y, e.x, e.y);
    e.v = e.step / e.dt;
    e.v = (Math.round(e.v * 10)) / 10;
    if (e.v > 1) e.v = 1;
    e.aazimut = KratYglov(e.azimut, f.azimut) / e.dt;
    e.a = (e.v - f.v) / e.dt;
};
MT.Initiation = function(a) {
    var b = a.robot;
    if (typeof this[b.id] == 'undefined') {
        this[b.id] = {};
        if (b.parentId == null) {
            this[b.id].trendMove = 1;
            this[b.id].trendRotate = 1;
        } else {
            this[b.id].trendMove = -1;
            this[b.id].trendRotate = -1;
            this[b.id].overTank = b.parentId;
            this[b.parentId].overTank = b.id;
        }
        this[b.id].status = 'poyavilsa';
        this[b.id].VT = {};
    }
};
MT.GetXY = function(a) {
    var b = a.robot;
    var c = 50;
    var d = this[b.id].lsatScanId;
    var e = {
        x: null,
        y: null
    };
    var f = this[b.id].VT[d].now;
    var g = this[b.id].VT[d].last;
    var h = b.position.x;
    var i = b.position.y;
    var j = Distance(h, i, f.x, f.y);
    var k = null;
    var l = Timer - f.time;
    var m = 0;
    if ((f.v < 0.5) & (f.v > 0)) m = 0.2;
    if (f.v > 0.5) m = -0.2;
    for (var n = 0; n <= 20; n++) {
        var o = (f.v * (l + (j / 2)));
        var p = (f.azimut + (f.aazimut * l)) * 0.0175;
        var q = o * Math.sin(p);
        var r = o * Math.cos(p);
        e.x = f.x + q;
        e.y = f.y - r;
        var s = {};
        s = truXY(a, f.x, f.y, e.x, e.y);
        e.x = s.x;
        e.y = s.y;
        j = Distance(h, i, e.x, e.y);
        if (Math.round(k) == Math.round(j)) break;
        k = j;
    }
    if (j < c) {
        e.x = f.x;
        e.y = f.y;
    }
    return e;
};
MT.GetVozvratXY = function(a) {
    var b = a.robot;
    var c = this[b.id].lsatScanId;
    var d = {};
    d.point1 = {
        x: null,
        y: null
    };
    d.point2 = {
        x: null,
        y: null
    };
    d.point3 = {
        x: null,
        y: null
    };
    var e = this[b.id].VT[c].now;
    var f = this[b.id].VT[c].last;
    var g = b.position.x;
    var h = b.position.y;
    var i = Timer - e.time;
    var j = Distance(g, h, e.x, e.y);
    var k = this[b.id].timeView + 50;
    var l = k - this[b.id].VT[c].now.time;
    var m = (e.v * l);
    var n = e.azimut * 0.0175;
    var o = m * Math.sin(n);
    var p = m * Math.cos(n);
    d.point1.x = e.x + o;
    d.point1.y = e.y - p;
    var q = {};
    d.point1.x = q.x;
    d.point1.y = q.y;
    var i = Timer - this[b.id].VT[c].now.time;
    var r = Math.abs(Degres(e.x, e.y, g, h) - e.angle);
    if (r > 180) r -= 180;
    var s = Math.abs(Math.round(r - 90));
    var m = i - s;
    if (m < 40) m = 40;
    var t = Degres(g, h, e.x, e.y);
    var u = t + 90;
    if (u > 360) u -= 360;
    u *= 0.0175;
    var o = m * Math.sin(u);
    var p = m * Math.cos(u);
    var v = {
        point1: {},
        point2: {}
    };
    v.point1.x = e.x + o;
    v.point1.y = e.y - p;
    q = truXY(a, e.x, e.y, v.point1.x, v.point1.y);
    v.point1.x = q.x;
    v.point1.y = q.y;
    v.point2.x = e.x - o;
    v.point2.y = e.y + p;
    q = truXY(a, e.x, e.y, v.point2.x, v.point2.y);
    v.point2.x = q.x;
    v.point2.y = q.y;
    var w = Distance(d.point1.x, d.point1.y, v.point1.x, v.point1.y);
    var x = Distance(d.point1.x, d.point1.y, v.point2.x, v.point2.y);
    if (x >= w) {
        d.point2 = v.point1;
        d.point3 = v.point2;
    } else {
        d.point3 = v.point2;
        d.point2 = v.point1;
    }
    return d;
};
MT.Find = function(a) {
    var b = a.robot;
    var c = this[b.id].lsatScanId;
    var d = this[b.id].VT[c].now;
    var e = this[b.id].VT[c].last;
    var f = b.position.x;
    var g = b.position.y;
    var h = Distance(f, g, d.x, d.y);
    var i = Math.atan(150 / h) * 57.296;
    i = Math.round(i);
    if (i > 30) i = 30;
    Turned(a, -1 * i * this[b.id].trendRotate);
};
MT.Uklon = function(a) {
    var b = a.robot;
    var c = this[b.id].lsatScanId;
    var d = this[b.id].VT[c].now;
    var e = this[b.id].VT[c].last;
    var f = Degres(d.x, d.y, b.position.x, b.position.y);
    var g = f - d.cannonAngle;
    if (g < -180) g += 360;
    if (g > 180) g -= 360;
    if (g > 0) var h = 1;
    else var h = -1;
    return h;
};
Robot.prototype.onIdle = function(a) {
    var b = a.robot;
    MT.Initiation(a);
    var c = {};
    var d;
    if (MT[b.id].status == 'poyavilsa') {
        if (b.availableDisappears != 0) b.disappear();;
        if ((b.availableClones == true) & (b.parentId == null)) b.clone();
        MT[b.id].status = 'poisk';
    }
    if (MT[b.id].status == 'poisk')
        if (truTurn(b.cannonRelativeAngle) < 45) Rotated(a, 1);
        else Turned(a, MT[b.id].trendRotate);
    if (MT[b.id].status == 'ogon') {
        c = MT.GetXY(a);
        var e = Degres(b.position.x, b.position.y, c.x, c.y);
        var f = KratYglov(truTurn(b.cannonAbsoluteAngle), e);
        f = Math.round(f);
        if (f != 0)
            if (f < 0) MT[b.id].trendRotate = 1;
            else MT[b.id].trendRotate = -1;;
        Turned(a, f);
        if (b.gunCoolDownTime == 0) {
            b.fire();
            MT[b.id].trendMove = MT.Uklon(a);
            MT[b.id].status = 'poteryal';
        }
        Moved(a, 1 * MT[b.id].trendMove);
    }
    if (MT[b.id].status == 'poteryal') {
        var g = 55 - (Timer - MT[b.id].timeView);
        var h = MT.GetVozvratXY(a);
        if (g > 0) {
            TurnedXY(a, h.point1.x, h.point1.y);
            Moved(a, (1 * MT[b.id].trendMove));
        } else {
            TurnedXY(a, h.point2.x, h.point2.y);
            var e = Degres(b.position.x, b.position.y, h.point3.x, h.point3.y);
            var f = KratYglov(truTurn(b.cannonAbsoluteAngle), e);
            f = Math.round(f);
            if (f != 0)
                if (f < 0) MT[b.id].trendRotate = -1;
                else MT[b.id].trendRotate = 1;
            if (f = 0) MT[b.id].trendRotate *= -1;
            MT[b.id].status = 'poisk';
        }
    }
};
Robot.prototype.onScannedRobot = function(a) {
    var b = a.robot;
    var c = a.scannedRobot;
    var d, e;
    if ((a.scannedRobot.parentId == b.id) | (a.scannedRobot.id == b.parentId)) return;
    b.stop();
    RobotInfo(a, MT[b.id].VT);
    MT[b.id].status = 'ogon';
    MT[b.id].lsatScanId = c.id;
    MT[b.id].timeView = Timer;
};
Robot.prototype.onWallCollision = function(a) {
    var b = a.robot;
    b.stop();
    MT[b.id].trendMove *= -1;
};
Robot.prototype.onRobotCollision = function(a) {
    var b = a.robot;
    MT[b.id].trendMove *= -1;
    Moved(a, 10 * MT[b.id].trendMove);
};
Robot.prototype.onHitByBullet = function(a) {
    var b = a.robot;
    var c = truTurn(b.cannonRelativeAngle);
    if (c > 180) c -= 360;
    if (MT[b.id].status == 'poisk') {
        if ((a.bearing - 90) > 0) MT[b.id].trendMove = 1;
        else MT[b.id].trendMove = -1;
        if ((Math.abs(a.bearing) > 45) & (Math.abs(a.bearing) < 135)) Moved(a, 50 * MT[b.id].trendMove);
    }
};
