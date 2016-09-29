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
    // TODO: should not be almost equal
    assert.almostEqual(0, closest.lat, 2);
    assert.almostEqual(0, closest.lng, 2);
    done();
  });
});