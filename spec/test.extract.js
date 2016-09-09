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
    
    var extract1 = L.GeometryUtil.extract(map, line, 0, 0.2),
        extract2 = L.GeometryUtil.extract(map, line, 0, 0.6),
        extract3 = L.GeometryUtil.extract(map, line, 0.6, 1.0),
        extract4 = L.GeometryUtil.extract(map, line, 0.2, 0.8),
        extract5 = L.GeometryUtil.extract(map, line, 1.0, 0.6);
    
    assert.deepEqual(extract1[0], L.latLng([0, 0]));
    assert.closeTo(extract1[1].lat, 0.600141459027052, 0.0000001);  // compatibility of Leaflet 1.0, due to earth R changed
    assert.closeTo(extract1[1].lng, 0.6001219630588661, 0.0000001); // compatibility of Leaflet 1.0, due to earth R changed

    assert.deepEqual(extract2[0], L.latLng([0, 0]));
    assert.deepEqual(extract2[1], L.latLng([1, 1]));
    assert.closeTo(extract2[2].lat, 1.800282914111311, 0.0000001);  // compatibility of Leaflet 1.0, due to earth R changed
    assert.closeTo(extract2[2].lng, 1.8002439493392906, 0.0000001); // compatibility of Leaflet 1.0, due to earth R changed
    
    assert.closeTo(extract3[0].lat, 1.800282914111311, 0.0000001);  // compatibility of Leaflet 1.0, due to earth R changed
    assert.closeTo(extract3[0].lng, 1.8002439493392906, 0.0000001); // compatibility of Leaflet 1.0, due to earth R changed
    assert.deepEqual(extract3[1], L.latLng([2, 2]));
    assert.deepEqual(extract3[2], L.latLng([3, 3]));

    assert.closeTo(extract4[0].lat, 0.600141459027052, 0.0000001);  // compatibility of Leaflet 1.0, due to earth R changed
    assert.closeTo(extract4[0].lng, 0.6001219630588661, 0.0000001); // compatibility of Leaflet 1.0, due to earth R changed
    assert.deepEqual(extract4[1], L.latLng([1, 1]));
    assert.deepEqual(extract4[2], L.latLng([2, 2]));
    assert.closeTo(extract4[3].lat, 2.40024267258436, 0.0000001);   // compatibility of Leaflet 1.0, due to earth R changed
    assert.closeTo(extract4[3].lng, 2.4001524293923637, 0.0000001); // compatibility of Leaflet 1.0, due to earth R changed

    // Should work symetrically
    assert.deepEqual(extract5[0], L.latLng([3, 3]));
    assert.deepEqual(extract5[1], L.latLng([2, 2]));
    assert.closeTo(extract5[2].lat, 1.800282914111311, 0.0000001);  // compatibility of Leaflet 1.0, due to earth R changed
    assert.closeTo(extract5[2].lng, 1.8002439493392906, 0.0000001); // compatibility of Leaflet 1.0, due to earth R changed

    done();
  });
});