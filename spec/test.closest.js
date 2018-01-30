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
      assert.almostEqual(closest.lat, 1.7, 2);
      assert.almostEqual(closest.lng, 1.7, 2);
      done();
  });

  it('It should be exactly on path', function(done) {
    var ll = L.latLng([1, -1]),
        closest = L.GeometryUtil.closest(map, [[-10, -10], [10, 10]], ll);
    assert.equal(Math.sqrt(2), closest.distance);
    // TODO: should not be almost equal
    assert.almostEqual(closest.lat, 0, 2);
    assert.almostEqual(closest.lng, 0, 2);
    done();
  });

  it('It should not depend on zoom', function(done) {
    // Test with plain value
    var ll = L.latLng([5, 10]),
        line = L.polyline([[-50, -10], [30, 40]])/*.addTo(map)*/,
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
    assert.almostEqual(closest.lat, -1.467431, 6)
    assert.almostEqual(closest.lng, 21.5729367, 6)

    // Change zoom and check that closest did not change.
    assert.equal(0, map.getZoom());
    L.Util.setOptions(map, {maxZoom: 18});

    map.on('moveend', function () {
        assert.notEqual(0, map.getZoom());

        closest = L.GeometryUtil.closest(map, line, ll);
        assert.almostEqual(closest.lat, -1.467431, 6)
        assert.almostEqual(closest.lng, 21.5729367, 6)
        // Restore zoom
        map.off('moveend');
        map._resetView(map.getCenter(), 0);
        done();
    });

    map._resetView(map.getCenter(), 17);
  });

  it('It should work with last segment of polygon', function(done) {
      var polygon = L.polygon([[0, 0], [10, 10], [0, 10]])/*.addTo(map)*/,
          ll = [0, 5],
          marker = L.marker(ll)/*.addTo(map)*/,
          closest = L.GeometryUtil.closest(map, polygon, ll);
      assert.almostEqual(closest.lat, 0, 2);
      assert.almostEqual(closest.lng, 5, 2);
      done();
  });

  it('It should not alterate the latLngs of a polygon', function(done) {
      var polygon = L.polygon([[0, 0], [10, 10], [0, 10]])/*.addTo(map)*/,
          ll = [0, 5],
          marker = L.marker(ll),
          latlngs;

      latlngs = polygon.getLatLngs();
      if (L.Polyline._flat(latlngs)) {
        assert.equal(latlngs.length, 3)
      } else {
        assert.equal(latlngs.length, 1)
        assert.equal(latlngs[0].length, 3)
      }

      closest = L.GeometryUtil.closest(map, polygon, ll);

      latlngs = polygon.getLatLngs();
      if (L.Polyline._flat(latlngs)) {
        assert.equal(latlngs.length, 3)
      } else {
        assert.equal(latlngs.length, 1)
        assert.equal(latlngs[0].length, 3)
      }

      done();
  });

  it('It should return null if layer param is not instance of Array|L.Polygon|L.Polyline (Leaflet 0.7.7 only)', function(done) {
      var campus = {
          "type": "Feature",
          "properties": {
              "popupContent": "This is the Auraria West Campus",
              "style": {
                  weight: 2,
                  color: "#999",
                  opacity: 1,
                  fillColor: "#B0DE5C",
                  fillOpacity: 0.8
              }
          },
          "geometry": {
              "type": "MultiPolygon",
              "coordinates": [
                  [
                      [
                          [-105.00432014465332, 39.74732195489861],
                          [-105.00715255737305, 39.74620006835170],
                          [-105.00921249389647, 39.74468219277038],
                          [-105.01067161560059, 39.74362625960105],
                          [-105.01195907592773, 39.74290029616054],
                          [-105.00989913940431, 39.74078835902781],
                          [-105.00758171081543, 39.74059036160317],
                          [-105.00346183776855, 39.74059036160317],
                          [-105.00097274780272, 39.74059036160317],
                          [-105.00062942504881, 39.74072235994946],
                          [-105.00020027160645, 39.74191033368865],
                          [-105.00071525573731, 39.74276830198601],
                          [-105.00097274780272, 39.74369225589818],
                          [-105.00097274780272, 39.74461619742136],
                          [-105.00123023986816, 39.74534214278395],
                          [-105.00183105468751, 39.74613407445653],
                          [-105.00432014465332, 39.74732195489861]
                      ],[
                          [-105.00361204147337, 39.74354376414072],
                          [-105.00301122665405, 39.74278480127163],
                          [-105.00221729278564, 39.74316428375108],
                          [-105.00283956527711, 39.74390674342741],
                          [-105.00361204147337, 39.74354376414072]
                      ]
                  ],[
                      [
                          [-105.00942707061768, 39.73989736613708],
                          [-105.00942707061768, 39.73910536278566],
                          [-105.00685214996338, 39.73923736397631],
                          [-105.00384807586671, 39.73910536278566],
                          [-105.00174522399902, 39.73903936209552],
                          [-105.00041484832764, 39.73910536278566],
                          [-105.00041484832764, 39.73979836621592],
                          [-105.00535011291504, 39.73986436617916],
                          [-105.00942707061768, 39.73989736613708]
                      ]
                  ]
              ]
          }
        },
        layers = L.geoJson(campus)/*.addTo(map)*/,
        ll = [-1, 5],
        marker = L.marker(ll)/*.addTo(map)*/,
        closest = L.GeometryUtil.closest(map, layers.getLayers()[0], ll);
      // if layers.getLayers()[0] is a LayerGroup, we are in Leaflet 0.7.7
      // so there is no result
      // if not, we are in Leaflet 1.0, and we don't need to test it, because
      // layers.getLayers()[0] will contain a multipolygon, and so there is a result
      if (layers.getLayers()[0] instanceof L.LayerGroup) {
        assert.isNull(closest);
      } else {
        assert.isNotNull(closest);
      }
      done();
  });

  it('It should have distance at 0 if on path of a nested array', function(done) {
    var ll = L.latLng([0, 0]),
        closest = L.GeometryUtil.closest(map, [ [[-30, -50], [-10, -10], [10, 10], [30, 50]],  [[-10, -20], [-30, -10], [40, 10], [50, 50]] ], ll);
    assert.equal(0, closest.distance);
    assert.equal(ll.toString(), closest.toString());
    done();
  });

  it('It should work with nested arrays and return the correct point', function(done) {
      var closest = L.GeometryUtil.closest(map, [ [[0,0], [1, 1], [2, 2]], [[0,0], [2, 2], [4, 4]] ], [3, 3]);
      assert.latLngEqual(closest, L.latLng(3, 3));
      done();
  });

  it('It should work with nested arrays and last segment of polygon', function(done) {
      var campus = {
          "type": "Feature",
          "geometry": {
              "type": "MultiPolygon",
              "coordinates": [
                  [
                      [
                          [0, 0], [50, 50], [100, 0]
                      ],
                      [
                          [20,10], [50, 40], [80, 10]
                      ]
                  ]
              ]
          }
        },
        layers = L.geoJson(campus)/*.addTo(map)*/,
        ll =  L.latLng([0, 50]),
        closest = L.GeometryUtil.closest(map, layers.getLayers()[0], ll);
      // if layers.getLayers()[0] is a LayerGroup, we are in Leaflet 0.7.7
      // so there is no result
      if (layers.getLayers()[0] instanceof L.LayerGroup) {
        assert.isNull(closest);
      } else {
        assert.latLngEqual(L.latLng(0,2), closest);
        assert.equal(closest.distance, 0);
      }
      done();
  });

  it('It must not return a point on a segment between the last point of a polygon and the first point of his follower', function(done) {
      var campus = {
          "type": "Feature",
          "geometry": {
              "type": "MultiPolygon",
              "coordinates": [
                  [
                      [
                          [0, 0], [50, 50], [100, 0]
                      ],
                      [
                          [20,10], [50, 40], [80, 10]
                      ]
                  ]
              ]
          }
        },
        layers = L.geoJson(campus)/*.addTo(map)*/,
        ll =  L.latLng(5,10),
        marker = L.marker(ll)/*.addTo(map)*/,
        closest = L.GeometryUtil.closest(map, layers.getLayers()[0], ll);
      // if layers.getLayers()[0] is a LayerGroup, we are in Leaflet 0.7.7
      // so there is no result
      if (layers.getLayers()[0] instanceof L.LayerGroup) {
        assert.isNull(closest);
      } else {
        // L.marker(closest).addTo(map)
        assert.almostNotEqual(ll.lat, closest.lat, .5);
        assert.almostNotEqual(ll.lng, closest.lng, .5);
        assert.almostEqual('7.8', closest.lat, .5);
        assert.almostEqual('6.75', closest.lng, .5);
      }
      done();
  });

});
