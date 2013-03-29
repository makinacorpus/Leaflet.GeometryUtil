var assert = chai.assert;


assert.almostequal = function (a, b, n) {
    return assert.equal(Math.round(a * Math.pow(10, n)) / Math.pow(10, n),
                        Math.round(b * Math.pow(10, n)) / Math.pow(10, n));
};


describe('Distance between LatLng', function() {
  it('It should be 0 if same point', function(done) {
    assert.equal(0, L.GeometryUtil.distance(map, L.latLng([10, 10]), L.latLng([10, 10])));
    done();
  });
});


describe('Distance to segment', function() {
  it('It should be 0 if point on segment', function(done) {
    assert.equal(0, L.GeometryUtil.distanceSegment(map, L.latLng([10, 5]), L.latLng([10, 0]), L.latLng([10, 10])));
    done();
  });

  it('It should not fail if segment has no length', function(done) {
    assert.equal(1, L.GeometryUtil.distanceSegment(map, L.latLng([0, 1]), L.latLng([0, 0]), L.latLng([0, 0])));
    done();
  });

  it('It should be the shortest distance', function(done) {
    assert.equal(1, L.GeometryUtil.distanceSegment(map, L.latLng([0, 1]), L.latLng([0, 0]), L.latLng([10, 0])));
    done();
  });
});


describe('Closest on segment', function() {
  it('It should be same point if point on segment', function(done) {
    var ll = L.latLng([0, 0]),
        closest = L.GeometryUtil.closestOnSegment(map, ll, L.latLng([0, 0]), L.latLng([10, 10]));
    assert.equal(ll.toString(), closest.toString());
    done();
  });

  it('It should be exactly on path', function(done) {
    var ll = L.latLng([-1, 1]),
        closest = L.GeometryUtil.closestOnSegment(map, ll, L.latLng([-10, -10]), L.latLng([10, 10]));
    assert.almostequal(0, closest.lat, 2);
    assert.almostequal(0, closest.lng, 2);
    done();
  });
});


describe('Closest on path with precision', function() {
  it('It should have distance at 0 if on path', function(done) {
    var ll = L.latLng([0, 0]),
        closest = L.GeometryUtil.closest(map, ll, [[-10, -10], [10, 10]]);
    assert.equal(0, closest.distance);
    assert.equal(ll.toString(), closest.toString());
    done();
  });

  it('It should be exactly on path', function(done) {
    var ll = L.latLng([1, -1]),
        closest = L.GeometryUtil.closest(map, ll, [[-10, -10], [10, 10]]);
    assert.equal(Math.sqrt(2), closest.distance);
    assert.almostequal(closest.lat, 0, 2);
    assert.almostequal(closest.lng, 0, 2);
    done();
  });

  it('It should just work :)', function(done) {
    // Test with plain value
    var ll = L.latLng([5, 10]),
        line = L.polyline([[-50, -10], [30, 40]]).addTo(map),
        closest = L.GeometryUtil.closest(map, ll, line);
    assert.isTrue(closest.distance > 0);
    assert.equal('LatLng(-1.46743, 21.57294)', closest.toString());
    done();
  });
});


describe('Snap on layers', function() {
  it('TODO', function(done) {
    done();
  });
});
