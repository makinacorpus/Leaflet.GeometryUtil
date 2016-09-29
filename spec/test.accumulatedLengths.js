describe('Accumulated length of line', function() {
  it('It should be empty for empty line', function(done) {
    assert.deepEqual([], L.GeometryUtil.accumulatedLengths([]));
    done();
  });

  it('It should return 0 and length in meters for a segment', function(done) {
    var accumulatedLengths = L.GeometryUtil.accumulatedLengths(L.polyline([[0, 0], [1, 0]]));
    assert.equal(accumulatedLengths[0], 0);
    assert.closeTo(accumulatedLengths[1], 111319.49079327357, 500); // compatibility of Leaflet 1.0, due to earth R changed
    done();
  });

  it('It should return accumulated lengths', function(done) {
    var accumulatedLengths = L.GeometryUtil.accumulatedLengths(L.polyline([[0, 0], [0.5, 0], [1, 0]]));
    assert.equal(accumulatedLengths[0], 0);
    assert.closeTo(accumulatedLengths[1],  55659.74539663678, 500); // compatibility of Leaflet 1.0, due to earth R changed
    assert.closeTo(accumulatedLengths[2], 111319.49079327357, 500); // compatibility of Leaflet 1.0, due to earth R changed
    done();
  });
});
