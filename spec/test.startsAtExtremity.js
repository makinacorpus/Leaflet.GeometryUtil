describe('Line order', function() {
  var lineA = L.polyline([[0, 0], [1, 1]]),
      lineB = L.polyline([[1, 1], [2, 2]]);

  it('It should detect if line starts at extremity', function(done) {
    var lineC = L.polyline([[0, 0], [1, 1]]);
    assert.isTrue(L.GeometryUtil.startsAtExtremity(lineA, lineC));
    assert.isTrue(L.GeometryUtil.startsAtExtremity(lineB, lineC));
    assert.isFalse(L.GeometryUtil.startsAtExtremity(lineC, lineB));
    done();
  });
});