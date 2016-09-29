describe('Compute angle', function() {
  it('It should return angle', function(done) {
    var p1 = L.point(0, 0),
        p2 = L.point(6, 6);
    assert.equal(L.GeometryUtil.computeAngle(p1, p2), 45);
    done();
  });
});