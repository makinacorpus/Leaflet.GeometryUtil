describe('Line order', function() {
  var lineA = L.polyline([[0, 0], [1, 1]]),
      lineB = L.polyline([[1, 1], [2, 2]]);

  it('It should detect if line is before', function(done) {
    assert.isTrue(L.GeometryUtil.isBefore(lineA, lineB));
    assert.isFalse(L.GeometryUtil.isBefore(lineB, lineA));
    done();
  });
  
});