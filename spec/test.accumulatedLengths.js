describe('Accumulated length of line', function() {
  it('It should be empty for empty line', function(done) {
    assert.deepEqual([], L.GeometryUtil.accumulatedLengths([]));
    done();
  });

  it('It should return 0 and length in meters for a segment', function(done) {
    assert.deepEqual([0, 111319.49079327357], L.GeometryUtil.accumulatedLengths(L.polyline([[0, 0], [1, 0]])));
    done();
  });

  it('It should return accumulated lengths', function(done) {
    assert.deepEqual([0, 55659.74539663678, 111319.49079327357], L.GeometryUtil.accumulatedLengths(L.polyline([[0, 0], [0.5, 0], [1, 0]])));
    done();
  });
});
