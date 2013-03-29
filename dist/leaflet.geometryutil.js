"use strict";

/**
 * @fileOverview Leaflet Geometry utilities for distances and linear referencing.
 * @name L.GeometryUtil
 */

var L = L || exports;

L.GeometryUtil = {

    /** Default snapping distance in pixels */
    SNAP_DISTANCE: 15,

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
        Returns the point on that is closest to latlng.
        @param {L.Map} map
        @param {Array|L.PolyLine} layer - An array of {L.LatLng} or the {L.PolyLine} that contains the result.
        @param {L.LatLng} latlng
        @returns {L.LatLng}
    */
    closest: function (map, layer, latlng) {
        if (typeof layer.getLatLngs != 'function')
            layer = L.polyline(layer);

        var latlngs = layer.getLatLngs(),
            mindist = Number.MAX_VALUE,
            result = null;
        // Keep the closest point of all segments
        for (var i = 0, n = latlngs.length; i < n-1; i++) {
            var latlngA = latlngs[i],
                latlngB = latlngs[i+1],
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
        Snap the specified {LatLng} to the closest layer.
        @param {L.Map} map
        @param {Array} layers - A list of layers to snap on.
        @param {L.LatLng} latlng - The position to snap.
        @returns {Object} with snapped {LatLng} and snapped {Layer}.
    */
    snapLayer: function (map, latlng, layers, tolerance) {
        var mindist = Number.MAX_VALUE,
            result = null,
            tolerance = tolerance || L.GeometryUtil.SNAP_DISTANCE,
            ll = null,
            distance = null;

        // Iterate the whole snaplist
        for (var i = 0, n = layers.length; i < n ; i++) {
            var layer = layers[i];
            // Single dimension, snap on points, else snap on closest
            if (typeof layer.getLatLng == 'function') {
                ll = layer.getLatLng();
                distance = L.GeometryUtil.distance(map, latlng, ll);
            }
            else {
                ll = L.GeometryUtil.closest(map, latlng, layer);
                distance = ll.distance;
            }
            // Keep the closest point of all objects
            if (distance < tolerance && distance < mindist) {
                mindist = distance;
                result = {snap: object, latlng: ll, distance: mindist};
            }
        }
        // If snapped layer is linear, try to snap on vertices (extremities and middle points)
        if (result && result.snap && result.snap.getLatLngs) {
            var vertices = result.snap.getLatLngs(),
                vertice = null;
            // Do not snap to vertices below tolerance
            mindist = tolerance;
            for (var i=0, n = vertices.length; i < n; i++) {
                vertice = vertices[i];
                distance = L.GeometryUtil.distance(map, result.latlng, vertice);
                if (distance < mindist) {
                    result.latlng = vertice;
                    result.distance = distance;
                    mindist = distance;
                }
            }
        }
        return result;
    }
}
