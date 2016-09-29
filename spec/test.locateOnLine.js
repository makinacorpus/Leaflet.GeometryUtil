describe('Locate on line', function() {
  var line = L.polyline([[0,0], [1, 1], [2, 2]]);

  it('It should return 0 if start', function(done) {
    assert.equal(0, L.GeometryUtil.locateOnLine(map, line, L.latLng([0, 0])));
    done();
  });

  it('It should return 1 if end', function(done) {
    assert.equal(1, L.GeometryUtil.locateOnLine(map, line, L.latLng([2, 2])));
    done();
  });

  it('It should return ratio of point', function(done) {
    assert.almostEqual(0.5, L.GeometryUtil.locateOnLine(map, line, L.latLng([1, 1])), 4);
    assert.almostEqual(0.25, L.GeometryUtil.locateOnLine(map, line, L.latLng([0.5, 0.5])), 4);
    assert.almostEqual(0.85, L.GeometryUtil.locateOnLine(map, line, L.latLng([1.7, 1.7])), 4);
    done();
  });
});