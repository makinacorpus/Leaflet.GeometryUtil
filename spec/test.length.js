describe('Length of line', function() {
  it('It should be 0 for empty line', function(done) {
    assert.equal(0, L.GeometryUtil.length([]));
    done();
  });

  it('It should return length in meters', function(done) {
    assert.closeTo(111319.49079327357, L.GeometryUtil.length(L.polyline([[0, 0], [1, 0]])), 500); // compatibility of Leaflet 1.0, due to earth R changed
    done();
  });
});