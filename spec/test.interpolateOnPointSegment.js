describe('Interpolate on point segment', function() {
  var p1 = L.point(0, 2),
      p2 = L.point(0, 6);
  it('It should be the first point if offset is 0', function(done) {
    assert.pointEqual(p1, L.GeometryUtil.interpolateOnPointSegment(p1, p2, 0));
    done();
  });

  it('It should be the last point if offset is 1', function(done) {
    assert.pointEqual(p2, L.GeometryUtil.interpolateOnPointSegment(p1, p2, 1));
    done();
  });

  it('It should return the correct interpolations', function(done) {
    assert.pointEqual(L.point(0, 4), L.GeometryUtil.interpolateOnPointSegment(p1, p2, 0.5));
    assert.pointEqual(L.point(0, 5), L.GeometryUtil.interpolateOnPointSegment(p1, p2, 0.75));
    done();
  });
});