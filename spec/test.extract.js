describe('Extract line', function() {
  var line = L.polyline([[0,0], [1, 1], [2, 2], [3, 3]]);

  it('It should return all coordinates from 0 to 1', function(done) {
    assert.deepEqual(L.GeometryUtil.extract(map, line, 0, 1), line.getLatLngs());
    done();
  });

  it('It should return inverted coordinates from 1 to 0', function(done) {
    assert.deepEqual(L.GeometryUtil.extract(map, line, 1, 0), L.GeometryUtil.reverse(line).getLatLngs());
    done();
  });

  it('It should return one coordinate if start equals end', function(done) {
    assert.latLngEqual(L.latLng(0.7501691078194406, 0.7501524538236026),
                       L.GeometryUtil.extract(map, line, 0.25, 0.25)[0]);
    done();
  });

  it('It should return extra coordinate if middle of segment', function(done) {
    assert.deepEqual(L.GeometryUtil.extract(map, line, 0, 0.2),
                     [L.latLng([0, 0]), L.latLng([0.600141459027052, 0.6001219630588661])]);
    assert.deepEqual(L.GeometryUtil.extract(map, line, 0, 0.6),
                     [L.latLng([0, 0]), L.latLng([1, 1]), L.latLng([1.800282914111311, 1.8002439493392906])]);
    assert.deepEqual(L.GeometryUtil.extract(map, line, 0.6, 1.0),
                     [L.latLng([1.800282914111311, 1.8002439493392906]), L.latLng([2, 2]), L.latLng([3, 3])]);
    assert.deepEqual(L.GeometryUtil.extract(map, line, 0.2, 0.8),
                     [L.latLng([0.600141459027052, 0.6001219630588661]), L.latLng([1, 1]), L.latLng([2, 2]), L.latLng([2.40024267258436, 2.4001524293923637])]);

    // Should work symetrically
    assert.deepEqual(L.GeometryUtil.extract(map, line, 1.0, 0.6),
                     [L.latLng([3, 3]), L.latLng([2, 2]), L.latLng([1.800282914111311, 1.8002439493392906])]);
    done();
  });
});