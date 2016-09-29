describe('Closest snap', function() {
  var square, diagonal, d, w, layers;

  beforeEach(function() {
    // Snapping distance
    d = L.GeometryUtil.distance(map, L.latLng([0, 0]), L.latLng([0, 10]));
    w = 3 * d;
    square = L.rectangle([[-w, -w], [w, w]]);
    diagonal = L.polyline([[-w, -w], [0, 0], [w, w]]);
    layers = [square, diagonal];
  });

  it('It should snap even if over layer', function(done) {
    var snap = L.GeometryUtil.closestLayerSnap(map, layers, L.latLng([0, 0]));
    assert.equal(snap.distance, 0);
    assert.equal(snap.layer, diagonal);
    done();
  });

  it('It should not snap if tolerance exceeded', function(done) {
    var snap = L.GeometryUtil.closestLayerSnap(map, layers, L.latLng([-w-d, w+d]), d);
    assert.equal(null, snap);
    done();
  });

  it('It should snap to corners by default', function(done) {
    var snap = L.GeometryUtil.closestLayerSnap(map, layers, L.latLng([-w-d, w+d]));
    assert.isTrue(snap.distance > d);
    assert.equal(snap.layer, square);
    done();
  });

  it('It should not snap to corners if vertices disabled', function(done) {
    var corner = L.GeometryUtil.closestLayerSnap(map, layers, L.latLng([w-d, -w-d]));
    assert.equal(corner.layer, square);
    assert.almostEqual(corner.latlng.lat, w);
    assert.almostEqual(corner.latlng.lng, -w);

    var snap = L.GeometryUtil.closestLayerSnap(map, layers, L.latLng([w-d, -w-d]), Infinity, false);
    assert.almostEqual(snap.latlng.lat, w-d);
    assert.almostEqual(snap.latlng.lng, -w);
    done();
  });

  it('It should not snap to corners if distance to vertice exceeds tolerance', function(done) {
    var corner = L.GeometryUtil.closestLayerSnap(map, layers, L.latLng([w-d-d/2, -w-d]));
    assert.equal(corner.layer, square);
    assert.almostEqual(corner.latlng.lat, w);
    assert.almostEqual(corner.latlng.lng, -w);

    var snap = L.GeometryUtil.closestLayerSnap(map, layers, L.latLng([w-d-d/2, -w-d]), d);
    assert.almostEqual(snap.latlng.lat, w-d-d/2);
    assert.almostEqual(snap.latlng.lng, -w);
    done();
  });
});