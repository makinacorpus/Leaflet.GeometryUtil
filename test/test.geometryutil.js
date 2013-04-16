var assert = chai.assert;


assert.almostequal = function (a, b, n) {
    n = n || 12;
    return assert.equal(Math.round(a * Math.pow(10, n)) / Math.pow(10, n),
                        Math.round(b * Math.pow(10, n)) / Math.pow(10, n));
};
// use Leaflet equality functions for Point and LatLng
assert.pointEqual = function (a, b) {
    return a.equals(b);
};
assert.latLngEqual = function (a, b) {
    return a.equals(b); // includes a small margin of error
};

describe('Distance between LatLng', function() {
  it('It should be 0 if same point', function(done) {
    assert.equal(0, L.GeometryUtil.distance(map, L.latLng([10, 10]), L.latLng([10, 10])));
    done();
  });
});


describe('Distance to segment', function() {
  it('It should be 0 if point on segment', function(done) {
    assert.equal(0, L.GeometryUtil.distanceSegment(map, L.latLng([10, 5]), L.latLng([10, 0]), L.latLng([10, 10])));
    done();
  });

  it('It should not fail if segment has no length', function(done) {
    assert.equal(1, L.GeometryUtil.distanceSegment(map, L.latLng([0, 1]), L.latLng([0, 0]), L.latLng([0, 0])));
    done();
  });

  it('It should be the shortest distance', function(done) {
    assert.equal(1, L.GeometryUtil.distanceSegment(map, L.latLng([0, 1]), L.latLng([0, 0]), L.latLng([10, 0])));
    done();
  });
});


describe('Closest on segment', function() {
  it('It should be same point if point on segment', function(done) {
    var ll = L.latLng([0, 0]),
        closest = L.GeometryUtil.closestOnSegment(map, ll, L.latLng([0, 0]), L.latLng([10, 10]));
    assert.equal(ll.toString(), closest.toString());
    done();
  });

  it('It should be exactly on path', function(done) {
    var ll = L.latLng([-1, 1]),
        closest = L.GeometryUtil.closestOnSegment(map, ll, L.latLng([-10, -10]), L.latLng([10, 10]));
    // TODO: should not be almost equal
    assert.almostequal(0, closest.lat, 2);
    assert.almostequal(0, closest.lng, 2);
    done();
  });
});


describe('Closest on path with precision', function() {
  it('It should have distance at 0 if on path', function(done) {
    var ll = L.latLng([0, 0]),
        closest = L.GeometryUtil.closest(map, [[-30, -50], [-10, -10], [10, 10], [30, 50]], ll);
    assert.equal(0, closest.distance);
    assert.equal(ll.toString(), closest.toString());
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
});


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
    assert.almostequal(corner.latlng.lat, w);
    assert.almostequal(corner.latlng.lng, -w);

    var snap = L.GeometryUtil.closestLayerSnap(map, layers, L.latLng([w-d, -w-d]), Infinity, false);
    assert.almostequal(snap.latlng.lat, w-d);
    assert.almostequal(snap.latlng.lng, -w);
    done();
  });

  it('It should not snap to corners if distance to vertice exceeds tolerance', function(done) {
    var corner = L.GeometryUtil.closestLayerSnap(map, layers, L.latLng([w-d-d/2, -w-d]));
    assert.equal(corner.layer, square);
    assert.almostequal(corner.latlng.lat, w);
    assert.almostequal(corner.latlng.lng, -w);

    var snap = L.GeometryUtil.closestLayerSnap(map, layers, L.latLng([w-d-d/2, -w-d]), d);
    assert.almostequal(snap.latlng.lat, w-d-d/2);
    assert.almostequal(snap.latlng.lng, -w);
    done();
  });
});

describe('Interpolate on point segment', function() {
  var p1 = L.point(0, 2),
      p2 = L.point(0, 6);
  it('It should be the first point if offset is 0', function(done) {
    assert.pointEqual(p1, L.GeometryUtil.interpolateOnPointSegment(p1, p2, 0));
    done();
  });
  
  it('It should be the last point if offset is 1', function(done) {
    assert.pointEqual(p2, L.GeometryUtil.interpolateOnPointSegment(p1, p2, 1));
    done();
  });

  it('It should return the correct interpolations', function(done) {
    assert.pointEqual(L.point(0, 4), L.GeometryUtil.interpolateOnPointSegment(p1, p2, 0.5));
    assert.pointEqual(L.point(0, 5), L.GeometryUtil.interpolateOnPointSegment(p1, p2, 0.75));
    done();
  });
});

describe('Interpolate on line', function() {
  var llA = L.latLng(1, 2),
      llB = L.latLng(3, 4),
      llC = L.latLng(5, 6);
      
  it('It should be null if the line has less than 2 vertices', function(done) {
    assert.equal(null, L.GeometryUtil.interpolateOnLine(map, [], 0.5));
    assert.equal(null, L.GeometryUtil.interpolateOnLine(map, [llA], 0.5));
    done();
  });
  
  it('It should be the first vertex if offset is 0', function(done) {
    var interp = L.GeometryUtil.interpolateOnLine(map, [llA, llB], 0);
    assert.latLngEqual(interp.latLng, llA);
    assert.equal(interp.predecessor, -1);
    done();
  });
  
  it('It should be the last vertex if offset is 1', function(done) {
    var interp = L.GeometryUtil.interpolateOnLine(map, [llA, llB, llC], 1);
    assert.latLngEqual(interp.latLng, llC);
    assert.equal(interp.predecessor, 1);
    done();
  });
  
  it('It should not fail if line has no length', function(done) {
    var interp = L.GeometryUtil.interpolateOnLine(map, [llA, llA, llA], 0.5);
    assert.latLngEqual(interp.latLng, llA);
    done();
  });

  it('It should return the correct interpolations', function(done) {
    var interp1 = L.GeometryUtil.interpolateOnLine(map, [llA, llB, llC], 0.5);
    var interp2 = L.GeometryUtil.interpolateOnLine(map, [llA, llB, llC], 0.75);
    // TODO: how to test that?
    done();
  });
  
  it('It should work the same with instances of L.PolyLine and arrays of L.LatLng', function(done) {
    var lls = [llA, llB, llC];
    var withArray = L.GeometryUtil.interpolateOnLine(map, lls, 0.75);
    var withPolyLine = L.GeometryUtil.interpolateOnLine(map, L.polyline(lls), 0.75);
    assert.deepEqual(withArray, withPolyLine);
    done();
  });
});
