describe('Destination', function() {

  it('It should be [90.0,0.0]', function(done) {
    var latlng1 = L.latLng([0.0, 0.0]),
        heading = 0.0;
        dist = 6378137 * Math.PI / 2.0; // 1/4 Earth's circumference.
        result = L.latLng([90.0,0.0]);
    assert.latLngEqual(result, L.GeometryUtil.destination(latlng1, heading, dist));
    done();
  });

  it('Crossing the International Date Line', function(done) {
    var latlng1 = L.latLng([0.0, -175.0]),
        heading = -90.0;
        dist = 6378137 * Math.PI / 8.0;
        result = L.latLng([0.0, 162.5]);
    assert.latLngEqual(result, L.GeometryUtil.destination(latlng1, heading, dist));
    done();
  });

  it('Crossing the Prime Meridian', function(done) {
    var latlng1 = L.latLng([10.0, -10.0]),
        heading = 134.5614514132577;
        dist = 3140555.3283872544;
        result = L.latLng([-10, 10.0]);
    assert.latLngEqual(result, L.GeometryUtil.destination(latlng1, heading, dist));
    done();
  });
});