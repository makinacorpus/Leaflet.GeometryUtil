"use strict";

/**
 * @fileOverview Leaflet Geometry utilities for distances and linear referencing.
 * @name L.GeometryUtil
 */

var L = L || exports;

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
            result = null;

        // Lookup vertices
        if (vertices) {
            for(var i = 0, n = latlngs.length; i < n; i++) {
                var ll = latlngs[i],
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
        var tolerance = typeof tolerance == 'number' ? tolerance : Infinity,
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
    }
};
