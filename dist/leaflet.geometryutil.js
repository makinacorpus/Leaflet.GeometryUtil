var L = L || exports;

(function () {
"use strict";

/**
 * @fileOverview Leaflet Geometry utilities for distances and linear referencing.
 * @name L.GeometryUtil
 */

L.GeometryUtil = {

    /**
        Shortcut function for planar distance between two {L.LatLng} at current zoom.
        @param {L.Map} map
        @param {L.LatLng} latlngA
        @param {L.LatLng} latlngB
        @returns {Number} in pixels
     */
    distance: function (map, latlngA, latlngB) {
        return map.latLngToLayerPoint(latlngA).distanceTo(map.latLngToLayerPoint(latlngB));
    },

    /**
        Shortcut function for planar distance between a {L.LatLng} and a segment (A-B).
        @param {L.Map} map
        @param {L.LatLng} latlng
        @param {L.LatLng} latlngA
        @param {L.LatLng} latlngB
        @returns {Number} in pixels
    */
    distanceSegment: function (map, latlng, latlngA, latlngB) {
        var p = map.latLngToLayerPoint(latlng),
           p1 = map.latLngToLayerPoint(latlngA),
           p2 = map.latLngToLayerPoint(latlngB);
        return L.LineUtil.pointToSegmentDistance(p, p1, p2);
    },

    /**
        Returns the closest point of a {L.LatLng} on the segment (A-B)
        @param {L.Map} map
        @param {L.LatLng} latlng
        @param {L.LatLng} latlngA
        @param {L.LatLng} latlngB
        @returns {L.LatLng}
    */
    closestOnSegment: function (map, latlng, latlngA, latlngB) {
        var maxzoom = map.getMaxZoom();
        if (maxzoom === Infinity)
            maxzoom = map.getZoom();
        var p = map.project(latlng, maxzoom),
           p1 = map.project(latlngA, maxzoom),
           p2 = map.project(latlngB, maxzoom),
           closest = L.LineUtil.closestPointOnSegment(p, p1, p2);
        return map.unproject(closest, maxzoom);
    },

    /**
        Returns the closest latlng on layer.
        @param {L.Map} map
        @param {Array<L.LatLng>|L.PolyLine} layer - Layer that contains the result.
        @param {L.LatLng} latlng
        @param {?boolean} [vertices=false] - Whether to restrict to path vertices.
        @returns {L.LatLng}
    */
    closest: function (map, layer, latlng, vertices) {
        if (typeof layer.getLatLngs != 'function')
            layer = L.polyline(layer);

        var latlngs = layer.getLatLngs(),
            mindist = Infinity,
            result = null,
            i, n, distance;

        // Lookup vertices
        if (vertices) {
            for(i = 0, n = latlngs.length; i < n; i++) {
                var ll = latlngs[i];
                distance = L.GeometryUtil.distance(map, latlng, ll);
                if (distance < mindist) {
                    mindist = distance;
                    result = ll;
                    result.distance = distance;
                }
            }
            return result;
        }

        // Keep the closest point of all segments
        for (i = 0, n = latlngs.length; i < n-1; i++) {
            var latlngA = latlngs[i],
                latlngB = latlngs[i+1];
            distance = L.GeometryUtil.distanceSegment(map, latlng, latlngA, latlngB);
            if (distance < mindist) {
                mindist = distance;
                result = L.GeometryUtil.closestOnSegment(map, latlng, latlngA, latlngB);
                result.distance = distance;
            }
        }
        return result;
    },

    /**
        Returns the closest layer to latlng among a list of layers.
        @param {L.Map} map
        @param {Array<L.ILayer>} layers
        @param {L.LatLng} latlng
        @returns {object} with layer, latlng and distance or {null} if list is empty;
    */
    closestLayer: function (map, layers, latlng) {
        var mindist = Infinity,
            result = null,
            ll = null,
            distance = Infinity;

        for (var i = 0, n = layers.length; i < n; i++) {
            var layer = layers[i];
            // Single dimension, snap on points, else snap on closest
            if (typeof layer.getLatLng == 'function') {
                ll = layer.getLatLng();
                distance = L.GeometryUtil.distance(map, latlng, ll);
            }
            else {
                ll = L.GeometryUtil.closest(map, layer, latlng);
                if (ll) distance = ll.distance;  // Can return null if layer has no points.
            }
            if (distance < mindist) {
                mindist = distance;
                result = {layer: layer, latlng: ll, distance: distance};
            }
        }
        return result;
    },

    /**
        Returns the closest position from specified {LatLng} among specified layers,
        with a maximum tolerance in pixels, providing snapping behaviour.
        @param {L.Map} map
        @param {Array<ILayer>} layers - A list of layers to snap on.
        @param {L.LatLng} latlng - The position to snap.
        @param {?Number} [tolerance=Infinity] - Maximum number of pixels.
        @param {?boolean} [withVertices=true] - Snap to layers vertices.
        @returns {object} with snapped {LatLng} and snapped {Layer} or null if tolerance exceeded.
    */
    closestLayerSnap: function (map, layers, latlng, tolerance, withVertices) {
        tolerance = typeof tolerance == 'number' ? tolerance : Infinity;
        withVertices = typeof withVertices == 'boolean' ? withVertices : true;

        var result = L.GeometryUtil.closestLayer(map, layers, latlng);
        if (!result || result.distance > tolerance)
            return null;

        // If snapped layer is linear, try to snap on vertices (extremities and middle points)
        if (withVertices && typeof result.layer.getLatLngs == 'function') {
            var closest = L.GeometryUtil.closest(map, result.layer, result.latlng, true);
            if (closest.distance < tolerance) {
                result.latlng = closest;
                result.distance = L.GeometryUtil.distance(map, closest, latlng);
            }
        }
        return result;
    },

    /**
        Returns the Point located on a segment at the specified ratio of the segment length.
        @param {L.Point} pA
        @param {L.Point} pB
        @param {Number} the length ratio, expressed as a decimal between 0 and 1, inclusive.
        @returns {L.Point} the interpolated point.
    */
    interpolateOnPointSegment: function (pA, pB, ratio) {
        return L.point(
            (pA.x * (1 - ratio)) + (ratio * pB.x),
            (pA.y * (1 - ratio)) + (ratio * pB.y)
        );
    },

    /**
        Returns the coordinate of the point located on a line at the specified ratio of the line length.
        @param {L.Map} map
        @param {Array<L.LatLng>|L.PolyLine} latlngs
        @param {Number} the length ratio, expressed as a decimal between 0 and 1, inclusive
        @returns {Object} an object with latLng ({LatLng}) and predecessor ({Number}), the index of the preceding vertex in the Polyline
        (-1 if the interpolated point is the first vertex)
    */
    interpolateOnLine: function (map, latLngs, ratio) {
        latLngs = (latLngs instanceof L.Polyline) ? latLngs.getLatLngs() : latLngs;
        var n = latLngs.length;
        if (n < 2) {
            return null;
        }

        // ensure the ratio is between 0 and 1;
        ratio = Math.max(Math.min(ratio, 1), 0);

        // project the LatLngs as Points,
        // and compute total planar length of the line at max precision
        var maxzoom = map.getMaxZoom();
        if (maxzoom === Infinity)
            maxzoom = map.getZoom();
        var pts = [];
        var lineLength = 0;
        for(var i = 0; i < n; i++) {
            pts[i] = map.project(latLngs[i], maxzoom);
            if(i > 0)
              lineLength += pts[i-1].distanceTo(pts[i]);
        }

        var ratioDist = lineLength * ratio;
        var a = pts[0],
            b = pts[1],
            distA = 0,
            distB = a.distanceTo(b);
        // follow the line segments [ab], adding lengths,
        // until we find the segment where the points should lie on
        var index = 1;
        for (; index < n && distB < ratioDist; index++) {
            a = b;
            distA = distB;
            b = pts[index];
            distB += a.distanceTo(b);
        }
        // compute the ratio relative to the segment [ab]
        var segmentRatio = ((distB - distA) !== 0) ? ((ratioDist - distA) / (distB - distA)) : 0;
        var interpolatedPoint = L.GeometryUtil.interpolateOnPointSegment(a, b, segmentRatio);
        return {
            latLng: map.unproject(interpolatedPoint, maxzoom),
            predecessor: index-2
        };
    },

    /**
        Returns a clone with reversed coordinates.
        @param {L.PolyLine} polyline
        @returns {L.PolyLine}
    */
    reverse: function (polyline) {
        return L.polyline(polyline.getLatLngs().slice(0).reverse());
    },

    /**
        Returns true if first polyline ends where other second starts.
        @param {L.PolyLine} polyline
        @param {L.PolyLine} other
        @returns {bool}
    */
    isBefore: function (polyline, other) {
        if (!other) return false;
        var lla = polyline.getLatLngs(),
            llb = other.getLatLngs();
        return (lla[lla.length-1]).equals(llb[0]);
    },

    /**
        Returns true if first polyline starts where second ends.
        @param {L.PolyLine} polyline
        @param {L.PolyLine} other
        @returns {bool}
    */
    isAfter: function (polyline, other) {
        if (!other) return false;
        var lla = polyline.getLatLngs(),
            llb = other.getLatLngs();
        return (lla[0]).equals(llb[llb.length-1]);
    },

    /**
        Returns true if first polyline starts where second ends or start.
        @param {L.PolyLine} polyline
        @param {L.PolyLine} other
        @returns {bool}
    */
    startsAtExtremity: function (polyline, other) {
        if (!other) return false;
        var lla = polyline.getLatLngs(),
            llb = other.getLatLngs(),
            start = lla[0];
        return start.equals(llb[0]) || start.equals(llb[llb.length-1]);
    },

    /**
        Returns horizontal angle in degres between two points.
        @param {L.Point} a
        @param {L.Point} b
        @returns {float}
     */
    computeAngle: function(a, b) {
        return (Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI);
    },

    /**
       Returns slope (Ax+B) between two points.
        @param {L.Point} a
        @param {L.Point} b
        @returns {Object} with ``a`` and ``b`` properties.
     */
    computeSlope: function(a, b) {
        var s = (b.y - a.y) / (b.x - a.x),
            o = a.y - (s * a.x);
        return {'a': s, 'b': o};
    }
    
    /**
       Returns LatLng of rotated point around specified LatLng center.
        @param {L.LatLng} point_latlng: point to rotate
        @param {double} angle_deg: angle to rotate in degrees
        @param {L.LatLng} center_latlng: center of rotation.
        @returns {L.LatLng} rotated point
     */
    rotatePoint: function(point_latlng,angle_deg,center_latlng) {

        var angle_rad = angle_deg*Math.PI/180;
        var point_px = map.latLngToLayerPoint(point_latlng);
        var center_px = map.latLngToLayerPoint(center_latlng);
  
        var x2 = Math.cos(angle_rad)*(point_px.x-center_px.x) - Math.sin(angle_rad)*(point_px.y-center_px.y) + center_px.x;
        var y2 = Math.sin(angle_rad)*(point_px.x-center_px.x) + Math.cos(angle_rad)*(point_px.y-center_px.y) + center_px.y;
  
        return map.layerPointToLatLng(new L.Point(x2,y2));  
    }
    
};

}());
