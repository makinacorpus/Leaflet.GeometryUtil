describe('Reverse line', function() {
  var line = L.polyline([[0,0], [1, 1]]);

  it('It should invert coordinates', function(done) {
    assert.latLngEqual(line.getLatLngs()[0], L.GeometryUtil.reverse(line).getLatLngs()[1]);
    done();
  });

  it('It should not affect original', function(done) {
    var start = line.getLatLngs()[0];
    L.GeometryUtil.reverse(line);
    assert.latLngEqual(start, line.getLatLngs()[0]);
    done();
  });
});