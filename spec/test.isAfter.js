describe('Line order', function() {
  var lineA = L.polyline([[0, 0], [1, 1]]),
      lineB = L.polyline([[1, 1], [2, 2]]);

  it('It should detect if line is after', function(done) {
    assert.isTrue(L.GeometryUtil.isAfter(lineB, lineA));
    assert.isFalse(L.GeometryUtil.isAfter(lineA, lineB));
    done();
  });

});