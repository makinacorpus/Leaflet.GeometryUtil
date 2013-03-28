var assert = require('assert')
  , GeometryUtil = require('./../dist/leaflet.geometryutil').GeometryUtil;

describe('distance', function() {
  it('should be ok', function(done) {
    assert.equal(11, GeometryUtil.distance());
    done();
  });
});