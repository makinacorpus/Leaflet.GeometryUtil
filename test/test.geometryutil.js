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
assert.latLngEqual = function (a, b, n) {
    n = n || 2;
    return assert.almostequal(a.lat, b.lat, 2) && assert.almostequal(a.lng, b.lng, n);
};

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


describe('Length of line', function() {
  it('It should be 0 for empty line', function(done) {
    assert.equal(0, L.GeometryUtil.length([]));
    done();
  });

  it('It should return length in meters', function(done) {
    assert.equal(111319.49079327357, L.GeometryUtil.length(L.polyline([[0, 0], [1, 0]])));
    done();
  });
});


describe('Readable distances', function() {
  it('It should be meters by default', function(done) {
    assert.equal("0 m", L.GeometryUtil.readableDistance(0));
    done();
  });

  it('It should be 0 yd if imperial', function(done) {
    assert.equal("0 yd", L.GeometryUtil.readableDistance(0, 'imperial'));
    done();
  });

  it('It should be kilometers if superior to 1000', function(done) {
    assert.equal("1.01 km", L.GeometryUtil.readableDistance(1010));
    done();
  });

  it('It should be miles if superior to 1760', function(done) {
    assert.equal("1.24 miles", L.GeometryUtil.readableDistance(2000, 'imperial'));
    done();
  });
});


describe('Accumulated length of line', function() {
  it('It should be empty for empty line', function(done) {
    assert.deepEqual([], L.GeometryUtil.accumulatedLengths([]));
    done();
  });

  it('It should return 0 and length in meters for a segment', function(done) {
    assert.deepEqual([0, 111319.49079327357], L.GeometryUtil.accumulatedLengths(L.polyline([[0, 0], [1, 0]])));
    done();
  });

  it('It should return accumulated lengths', function(done) {
    assert.deepEqual([0, 55659.74539663678, 111319.49079327357], L.GeometryUtil.accumulatedLengths(L.polyline([[0, 0], [0.5, 0], [1, 0]])));
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

  it('It should be the first vertex if offset is less than 0', function(done) {
    var interp = L.GeometryUtil.interpolateOnLine(map, [llA, llB], -10);
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

  it('It should be the last vertex if offset is more than 1', function(done) {
    var interp = L.GeometryUtil.interpolateOnLine(map, [llA, llB, llC], 10);
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
    assert.latLngEqual(interp1.latLng, llB);
    var interp2 = L.GeometryUtil.interpolateOnLine(map, [llA, llB, llC], 0.75);
    assert.latLngEqual(interp2.latLng, L.latLng([4, 5]));
    done();
  });

  it('It should work the same with instances of L.PolyLine and arrays of L.LatLng', function(done) {
    var lls = [llA, llB, llC];
    var withArray = L.GeometryUtil.interpolateOnLine(map, lls, 0.75);
    var withPolyLine = L.GeometryUtil.interpolateOnLine(map, L.polyline(lls), 0.75);
    assert.deepEqual(withArray, withPolyLine);
    done();
  });

  it('Should always return a LatLng object.', function() {
    var interp1 = L.GeometryUtil.interpolateOnLine(map, [llA, llB, llC], 0);
    var interp2 = L.GeometryUtil.interpolateOnLine(map, [llA, llB, llC], 1);

    assert.isDefined(interp1.latLng.lat);
    assert.isDefined(interp1.latLng.lng);
    assert.isDefined(interp2.latLng.lat);
    assert.isDefined(interp2.latLng.lng);
  });
});


describe('Locate on line', function() {
  var line = L.polyline([[0,0], [1, 1], [2, 2]]);

  it('It should return 0 if start', function(done) {
    assert.equal(0, L.GeometryUtil.locateOnLine(map, line, L.latLng([0, 0])));
    done();
  });

  it('It should return 1 if end', function(done) {
    assert.equal(1, L.GeometryUtil.locateOnLine(map, line, L.latLng([2, 2])));
    done();
  });

  it('It should return ratio of point', function(done) {
    assert.almostequal(0.5, L.GeometryUtil.locateOnLine(map, line, L.latLng([1, 1])), 4);
    assert.almostequal(0.25, L.GeometryUtil.locateOnLine(map, line, L.latLng([0.5, 0.5])), 4);
    assert.almostequal(0.85, L.GeometryUtil.locateOnLine(map, line, L.latLng([1.7, 1.7])), 4);
    done();
  });
});


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


describe('Line order', function() {
  var lineA = L.polyline([[0, 0], [1, 1]]),
      lineB = L.polyline([[1, 1], [2, 2]]);

  it('It should detect if line is before', function(done) {
    assert.isTrue(L.GeometryUtil.isBefore(lineA, lineB));
    assert.isFalse(L.GeometryUtil.isBefore(lineB, lineA));
    done();
  });

  it('It should detect if line is after', function(done) {
    assert.isTrue(L.GeometryUtil.isAfter(lineB, lineA));
    assert.isFalse(L.GeometryUtil.isAfter(lineA, lineB));
    done();
  });

  it('It should detect if line starts at extremity', function(done) {
    var lineC = L.polyline([[0, 0], [1, 1]]);
    assert.isTrue(L.GeometryUtil.startsAtExtremity(lineA, lineC));
    assert.isTrue(L.GeometryUtil.startsAtExtremity(lineB, lineC));
    assert.isFalse(L.GeometryUtil.startsAtExtremity(lineC, lineB));
    done();
  });
});

describe('Concatenate polylines', function(done) {

  it('It should return an empty array if no polyline is given', function(done) {
    var concated = L.GeometryUtil.concatLines(map, []);
    assert.equal(concated.length, 0);
    done();
  });

  it('It should return the original array if there is one given polyline', function(done) {
    var line = L.polyline([[0, 0], [1, 1]]);
    var concated = L.GeometryUtil.concatLines(map, [line]);
    assert.equal(concated.length, 1);
    done();
  });

  it('It should return an arry of concatenated lines', function(done) {
    var lineA = L.polyline([[0, 0], [1, 1]]);
    var lineB = L.polyline([[0.1, 0.1], [2, 1]]);
    var lineC = L.polyline([[20, 20], [30, 30]]);
    var lineD = L.polyline([[35, 35], [40, 40], [30, 30]]);
    var concated = L.GeometryUtil.concatLines(map, [lineD, lineA, lineC, lineB], 1);

    assert.equal(concated.length, 2);

    var concatedLatLngs = concated[0].getLatLngs();
    assert.equal(concatedLatLngs.length, 4);
    assert.isTrue(concatedLatLngs[0].equals(L.latLng([35, 35])));
    assert.isTrue(concatedLatLngs[3].equals(L.latLng([20, 20])));

    var concatedLatLngs = concated[1].getLatLngs();
    assert.equal(concatedLatLngs.length, 3);
    assert.isTrue(concatedLatLngs[0].equals(L.latLng([2, 1])));
    assert.isTrue(concatedLatLngs[2].equals(L.latLng([1, 1])));

    done();
  })

  it('It should return an array of all polylines if none of them can be concatenated', function(done) {
    var lineA = L.polyline([[0, 0], [1, 1]]);
    var lineB = L.polyline([[100, 100], [200, 200]]);
    var concated = L.GeometryUtil.concatLines(map, [lineA, lineB]);

    assert.equal(concated.length, 2);
    done();
  });
});

describe('Compute angle', function() {
  it('It should return angle', function(done) {
    var p1 = L.point(0, 0),
        p2 = L.point(6, 6);
    assert.equal(L.GeometryUtil.computeAngle(p1, p2), 45);
    done();
  });
});

describe('Compute slope', function() {
  it('It should return A and B', function(done) {
    var p1 = L.point(0, 2),
        p2 = L.point(5, 7);
    assert.deepEqual(L.GeometryUtil.computeSlope(p1, p2), {a: 1, b: 2})
    done();
  });
});

describe('Point rotation', function() {
  it('It should return the same point if angle is 0', function(done) {
    var llPoint = L.latLng([3, 3]),
        llCenter = L.latLng([2, 2]),
        rotated = L.GeometryUtil.rotatePoint(map, llPoint, 0, llCenter);
    assert.latLngEqual(llPoint, rotated);
    done();
  });

  it('It should return the same point if center and point are the same', function(done) {
    var llPoint = L.latLng([1, 1]),
        llCenter = L.latLng([1, 1]),
        rotated = L.GeometryUtil.rotatePoint(map, llPoint, 90, llCenter);
    assert.latLngEqual(llPoint, rotated);
    done();
  });

  it('It should return a rotated point', function(done) {
    var llPoint = L.latLng([1, 1]),
        llCenter = L.latLng([2, 2]),
        rotated = L.GeometryUtil.rotatePoint(map, llPoint, 90, llCenter);
    assert.latLngEqual(rotated, L.latLng([3, 1]));
    done();
  });
});

describe('Compute Bearing', function() {

  it('It should be degrees clockwise from north, 0 degrees.', function(done) {
    var latlng1 = L.latLng([0.0, 0.0]),
        latlng2 = L.latLng([90.0, 0.0]);
    assert.equal(0.0, L.GeometryUtil.bearing(latlng1,latlng2));
    done();
  });

  it('Same point, should be zero.', function(done) {
    var latlng1 = L.latLng([0.0, 0.0]),
        latlng2 = L.latLng([0.0, 0.0]);
    assert.equal(0, L.GeometryUtil.bearing(latlng1,latlng2));
    done();
  });

  it('Crossing Prime Meridian.', function(done) {
    var latlng1 = L.latLng([10.0, -10.0]),
        latlng2 = L.latLng([-10.0, 10.0]);
    assert.equal(134.5614514132577, L.GeometryUtil.bearing(latlng1,latlng2));
    done();
  });

  it('Negative value for bearing greater than / equal to 180', function(done) {
    var latlng1 = L.latLng([33.0, -120.0]),
        latlng2 = L.latLng([34.0, -122.0]);
    assert.equal(-58.503883697887375, L.GeometryUtil.bearing(latlng1,latlng2));
    done();
  });

});

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
