/**
 * @fileOverview Leaflet Geometry utilities for distances and linear referencing.
 * @name L.GeometryUtil
 */

var L = L || exports;

L.GeometryUtil = {

    /**
        Shortcut function for planar distance between two {L.LatLng} at current zoom.
        @param {L.Map} map
        @param {L.LatLng} origin
        @param {L.LatLng} destination
        @returns {Number}
     */
    distance: function (map, latlng1, latlng2) {
        return map.latLngToLayerPoint(latlng1).distanceTo(map.latLngToLayerPoint(latlng2));
    }
}