describe('Closest on path with precision', function() {
  it('It should have distance at 0 if on path', function(done) {
    var ll = L.latLng([0, 0]),
        closest = L.GeometryUtil.closest(map, [[-30, -50], [-10, -10], [10, 10], [30, 50]], ll);
    assert.equal(0, closest.distance);
    assert.equal(ll.toString(), closest.toString());
    done();
  });

  it('It should return same point if on path', function(done) {
      var line = L.polyline([[0,0], [1, 1], [2, 2]]);
          closest = L.GeometryUtil.closest(map, line, [1.7, 1.7]);
      assert.almostequal(closest.lat, 1.7, 2);
      assert.almostequal(closest.lng, 1.7, 2);
      done();
  });

  it('It should be exactly on path', function(done) {
    var ll = L.latLng([1, -1]),
        closest = L.GeometryUtil.closest(map, [[-10, -10], [10, 10]], ll);
    assert.equal(Math.sqrt(2), closest.distance);
    // TODO: should not be almost equal
    assert.almostequal(closest.lat, 0, 2);
    assert.almostequal(closest.lng, 0, 2);
    done();
  });

  it('It should not depend on zoom', function(done) {
    // Test with plain value
    var ll = L.latLng([5, 10]),
        line = L.polyline([[-50, -10], [30, 40]]).addTo(map),
        closest = L.GeometryUtil.closest(map, line, ll);
    assert.isTrue(closest.distance > 0);
    /*
      SELECT ST_AsText(
                ST_ClosestPoint(
                    ST_MakeLine('SRID=4326;POINT(-10 -50)'::geometry, 'SRID=4326;POINT(40 30)'::geometry),
                    'SRID=4326;POINT(10 5)'::geometry))
      Gives:
        "POINT(20.3370786516854 -1.46067415730337)"
      TODO: find out what's going on with Longitudes :)
     */
    assert.equal('LatLng(-1.46743, 21.57294)', closest.toString());

    // Change zoom and check that closest did not change.
    assert.equal(0, map.getZoom());
    L.Util.setOptions(map, {maxZoom: 18});

    map.on('moveend', function () {
        assert.notEqual(0, map.getZoom());

        closest = L.GeometryUtil.closest(map, line, ll);
        assert.equal('LatLng(-1.46743, 21.57294)', closest.toString());
        // Restore zoom
        map.off('moveend');
        map._resetView(map.getCenter(), 0);
        done();
    });

    map._resetView(map.getCenter(), 17);
  });

  it('It should work with last segment of polygon', function(done) {
      var polygon = L.polygon([[0, 0], [10, 10], [0, 10]]),
          ll = [-1, 5],
          closest = L.GeometryUtil.closest(map, polygon, ll);
      assert.almostequal(closest.lat, 0, 2);
      assert.almostequal(closest.lng, 5, 2);
      done();
  });
});