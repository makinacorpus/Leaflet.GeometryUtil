describe('Compute Bearing', function() {

  it('It should be degrees clockwise from north, 0 degrees.', function(done) {
    var latlng1 = L.latLng([0.0, 0.0]),
        latlng2 = L.latLng([90.0, 0.0]);
    assert.equal(0.0, L.GeometryUtil.bearing(latlng1,latlng2));
    done();
  });

  it('Same point, should be zero.', function(done) {
    var latlng1 = L.latLng([0.0, 0.0]),
        latlng2 = L.latLng([0.0, 0.0]);
    assert.equal(0, L.GeometryUtil.bearing(latlng1,latlng2));
    done();
  });

  it('Crossing Prime Meridian.', function(done) {
    var latlng1 = L.latLng([10.0, -10.0]),
        latlng2 = L.latLng([-10.0, 10.0]);
    assert.equal(134.5614514132577, L.GeometryUtil.bearing(latlng1,latlng2));
    done();
  });

  it('Negative value for bearing greater than / equal to 180', function(done) {
    var latlng1 = L.latLng([33.0, -120.0]),
        latlng2 = L.latLng([34.0, -122.0]);
    assert.equal(-58.503883697887375, L.GeometryUtil.bearing(latlng1,latlng2));
    done();
  });

});
