describe("Closest on circle", function () {
  it("It should be same point if is on the circle", function (done) {
    const center = L.latLng([0, 0]);
    const radius = 5;
    const point = L.latLng([0, 5]);
    const circle = new L.Circle(center, { radius });
    const closest = L.GeometryUtil.closestOnCircle(circle, point);
    assert.equal(point.toString(), closest.toString());
    done();
  });

  it("It should be closest if is inside the circle", function (done) {
    const center = L.latLng([0, 0]);
    const radius = 5;
    const point = L.latLng([0, 4]);
    const expected = L.latLng([0, 5]);
    const circle = new L.Circle(center, { radius });
    const closest = L.GeometryUtil.closestOnCircle(circle, point);
    assert.equal(expected.toString(), closest.toString());
    done();
  });

  it("It should be closest if is outside the circle to the right", function (done) {
    const center = L.latLng([0, 0]);
    const radius = 5;
    const point = L.latLng([0, 6]);
    const expected = L.latLng([0, 5]);
    const circle = new L.Circle(center, { radius });
    const closest = L.GeometryUtil.closestOnCircle(circle, point);
    assert.equal(expected.toString(), closest.toString());
    done();
  });

  it("It should be closest if is outside the circle to the left", function (done) {
    const center = L.latLng([0, 0]);
    const radius = 5;
    const point = L.latLng([0, -8]);
    const expected = L.latLng([0, -5]);
    const circle = new L.Circle(center, { radius });
    const closest = L.GeometryUtil.closestOnCircle(circle, point);
    assert.equal(expected.toString(), closest.toString());
    done();
  });

  it("It should be closest if is outside the circle downwards", function (done) {
    const center = L.latLng([0, 0]);
    const radius = 5;
    const point = L.latLng([-10, 0]);
    const expected = L.latLng([-5, 0]);
    const circle = new L.Circle(center, { radius });
    const closest = L.GeometryUtil.closestOnCircle(circle, point);
    assert.equal(expected.toString(), closest.toString());
    done();
  });
});
