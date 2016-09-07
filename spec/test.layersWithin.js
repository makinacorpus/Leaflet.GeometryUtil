describe('Layers within a radius of the given location', function() {
  it('It should return an empty array if the list is empty', function(done) {
    var ll = L.latLng([0, 0]);
    var results = L.GeometryUtil.layersWithin(map, [], ll);
    assert.equal(0, results.length);
    done();
  });

  it('It should return an array containing one layer', function(done) {
    var ll = L.latLng([0, 0]);
    var layers = [L.marker([2, 2]), L.marker([100, 100])];
    var results = L.GeometryUtil.layersWithin(map, layers, ll, 5);
    assert.equal(1, results.length);
    assert.deepEqual(results[0], {layer: layers[0], latlng: layers[0].getLatLng(), distance: Math.sqrt(2)});
    done();
  });

  it('It should return an array containing two layers ordered by distance', function(done) {
    var ll = L.latLng([0, 0]);
    var layers = [L.marker([2, 2]), L.marker([3, 3])];
    var results = L.GeometryUtil.layersWithin(map, layers, ll, 10);
    assert.equal(2, results.length);
    assert.equal(true, results[0].distance < results[1].distance);
    done();
  });
});