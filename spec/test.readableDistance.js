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