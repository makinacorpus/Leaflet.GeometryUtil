
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