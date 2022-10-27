import * as L from "leaflet";
import { LatLngLiteral, Layer } from "leaflet"

interface LayerPointRelation<LayerType extends Layer = Layer> {
    layer: LayerType;
    latlng: LatLngLiteral;
    distance: number;
}

interface LatLngWithDistance extends LatLngLiteral {
    distance: number;
}

declare module "leaflet" {
    namespace Polyline {
        function _flat(latlngs: LatLngExpression[]): boolean;
    }

    namespace GeometryUtil {

        function distance(map: Map, latlngA: LatLngExpression, latlngB: LatLngExpression): number;
    
        function distanceSegment(map: Map, latlng: LatLngExpression, latlngA: LatLngExpression, latlngB: LatLngExpression): number;
    
        function readableDistance(distance: number, unit?: 'metric' | 'imperial'): string;
    
        function belongsSegment(latlng: LatLngExpression, latlngA: LatLngExpression, latlngB: LatLngExpression, tolerance?: number): boolean;
    
        function length(coords: LatLng[] | Point[] | Polyline): number;
    
        function accumulatedLengths(coords: LatLng[] | Point[] | Polyline): number[];
    
        function closestOnSegment(map: Map, latlng: LatLngExpression, latlngA: LatLngExpression, latlngB: LatLngExpression): LatLng;
    
        function closest(map: Map, layer: LatLngExpression[] | LatLngExpression[][] | Polyline | Polygon, latlng: LatLngExpression, vertices?: boolean): LatLngWithDistance | null;
    
        function closestLayer<LayerType extends Layer>(map: Map, layers: LayerType[], latlng: LatLngExpression): LayerPointRelation<LayerType> | null;
    
        function nClosestLayers<LayerType extends Layer>(map: Map, layers: LayerType[], latlng: LatLngExpression, n?: number): Array<LayerPointRelation<LayerType>> | null;
    
        function layersWithin<LayerType extends Layer>(map: Map, layers: LayerType[], latlng: LatLngExpression, radius?: number): Array<LayerPointRelation<LayerType>>;
    
        function closestLayerSnap<LayerType extends Layer>(map: Map, layers: LayerType[], latlng: LatLngExpression, tolerance?: number, withVertices?: boolean): LayerPointRelation<LayerType>;
    
        function interpolateOnPointSegment(pA: Point, pB: Point, ratio: number): Point;
    
        function interpolateOnLine(map: Map, latLngs: LatLngExpression[] | Polyline, ratio: number): { latLng: LatLng, predecessor: number } | null;
    
        function locateOnLine(map: Map, polyline: Polyline, latlng: LatLng): number;
    
        function reverse(polyline: Polyline): Polyline;
    
        function extract(map: Map, polyline: Polyline, start: number, end: number): LatLng[];
    
        function isBefore(polyline: Polyline, other: Polyline): boolean;
    
        function isAfter(polyline: Polyline, other: Polyline): boolean;
    
        function startsAtExtremity(polyline: Polyline, other: Polyline): boolean;
    
        function computeAngle(a: Point, b: Point): number;
    
        function computeSlope(a: Point, b: Point): { a: number, b: number };
    
        function rotatePoint(map: Map, latlngPoint: LatLngExpression, angleDeg: number, latlngCenter: LatLngExpression): LatLng;
    
        function bearing(latlng1: LatLngLiteral | LatLng, latlng2: LatLngLiteral | LatLng): number;
    
        function destination(latlng: LatLngLiteral | LatLng, heading: number, distance: number): LatLng;
    
        function angle(map: Map, latlngA: LatLngExpression, latlngB: LatLngExpression): number;
    
        function destinationOnSegment(map: Map, latlngA: LatLngLiteral | LatLng, latlngB: LatLngLiteral | LatLng, distance: number): LatLng;
    
    }
}

declare const GeometryUtil: typeof L.GeometryUtil;
export default GeometryUtil;
