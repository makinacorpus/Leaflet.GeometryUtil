describe('Point rotation', function() {
  it('It should return the same point if angle is 0', function(done) {
    var llPoint = L.latLng([3, 3]),
        llCenter = L.latLng([2, 2]),
        rotated = L.GeometryUtil.rotatePoint(map, llPoint, 0, llCenter);
    assert.latLngEqual(llPoint, rotated);
    done();
  });

  it('It should return the same point if center and point are the same', function(done) {
    var llPoint = L.latLng([1, 1]),
        llCenter = L.latLng([1, 1]),
        rotated = L.GeometryUtil.rotatePoint(map, llPoint, 90, llCenter);
    assert.latLngEqual(llPoint, rotated);
    done();
  });

  it('It should return a rotated point', function(done) {
    var llPoint = L.latLng([1, 1]),
        llCenter = L.latLng([2, 2]),
        rotated = L.GeometryUtil.rotatePoint(map, llPoint, 90, llCenter);
    assert.latLngEqual(rotated, L.latLng([3, 1]));
    done();
  });
});