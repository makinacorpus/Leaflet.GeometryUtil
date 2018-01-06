describe('Angle', function() {

  it('It should be 45 degrees', function(done) {
    var latlng1 = L.latLng([0.0, 0.0]),
        latlng2 = L.latLng([1.0, 1.0]),
        result = 45.0;
    assert.equal(result, L.GeometryUtil.angle(map, latlng1, latlng2));
    done();
  });

  it('It should be degrees clockwise from east, 0 degrees', function(done) {
    var latlng1 = L.latLng([0.0, 0.0]),
        latlng2 = L.latLng([1.0, 0.0]),
        result = 0.0;
    assert.equal(result, L.GeometryUtil.angle(map, latlng1, latlng2));
    done();
  });

  it('It should not be a negative value when the angle is greater than 180', function(done) {
    var latlng1 = L.latLng([0.0, 0.0]),
        latlng2 = L.latLng([-1.0, 1.0]),
        result = -135.0;
    assert.notEqual(result, L.GeometryUtil.angle(map, latlng1, latlng2));
    done();
  });
});
