describe('Closest among layers', function() {
  it('It should return null if list is empty', function(done) {
    var ll = L.latLng([0, 0]),
        closest = L.GeometryUtil.closestLayer(map, [], ll);
    assert.equal(null, closest);
    done();
  });

  it('It should return an object with layer, latlng and distance', function(done) {
    var ll = L.latLng([0, 0]),
        layers = [L.marker([2, 2])],
        closest = L.GeometryUtil.closestLayer(map, layers, ll);
    assert.deepEqual(closest,
                     {layer: layers[0], latlng: layers[0].getLatLng(), distance: Math.sqrt(2)});
    done();
  });
});