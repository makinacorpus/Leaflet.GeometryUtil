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