describe('Compute slope', function() {
  it('It should return A and B', function(done) {
    var p1 = L.point(0, 2),
        p2 = L.point(5, 7);
    assert.deepEqual(L.GeometryUtil.computeSlope(p1, p2), {a: 1, b: 2})
    done();
  });
});