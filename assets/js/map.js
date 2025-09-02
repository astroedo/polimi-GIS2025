import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import { Map, View, Overlay } from 'ol';
import { Tile, Image, Group, Vector } from 'ol/layer';
import { OSM, ImageWMS, XYZ, StadiaMaps } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { fromLonLat } from 'ol/proj';
import { ScaleLine, FullScreen, MousePosition, } from 'ol/control';
import LayerSwitcher from 'ol-layerswitcher';
import { createStringXY } from 'ol/coordinate';
import { Style, Fill, Stroke } from 'ol/style';


// OpenStreetMap base map
var osm = new Tile({
title: 'OpenStreetMap',
type: 'base',
visible: true,
source: new OSM()
});

// Colombia Administrative Boundaries
let LayerNOX_1 = new Image({
    title: "no2_concentration_map_2020",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_no2_concentration_map_2020' }
    }),
    visible: false
});

// Colombia Administrative level 1
var LayerNOX_2  = new Image({
    title: "CAMS_no2_2022_12",
    source: new ImageWMS({
        url: 'https://www.gis-gisgeoserver_01.polimi.it/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_CAMS_no2_2022_12' }
    }),
    visible: false
});

// Colombia Roads
var LayerNOX_3  = new Image({
    title: "GERMANY_no2_2017_2021_AAD_map_2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.gisgeoserver_01/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_no2_2017_2021_AAD_map_2022', 'STYLES': 'GERMANY_no2_2017_2021_AAD_2022' }
    }),
    visible: false
});

// Colombia Rivers
var LayerNOX_4  = new Image({
    title: "no2_concentration_map_2020",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_no2_concentration_map_2020' }
    }),
    visible: false,
});

// Add the layer groups code here:
let basemapLayers = new Group({
    title: 'Base Maps',
    layers: [osm]
});
let overlayLayers = new Group({
    title: 'Overlay Layers',
    layers: [
        LayerNOX_1 ,
        LayerNOX_2 ,
        LayerNOX_3 ,
        LayerNOX_4 
    ]
});


// Map Initialization
let mapOrigin = fromLonLat([10.4, 51.1]);
let zoomLevel = 5;
let map = new Map({
    target: document.getElementById('map'),
    layers: [],
    view: new View({
        center: mapOrigin,
        zoom: zoomLevel
    }),
    projection: 'EPSG:4326'
});

// Add the map controls here:
map.addControl(new ScaleLine());
map.addControl(new FullScreen());
map.addControl(
new MousePosition({
coordinateFormat: createStringXY(4),
projection: 'EPSG:4326',
className: 'custom-control',
placeholder: '0.0000, 0.0000'
})
);

// Add the LayerSwitcher control here:
var layerSwitcher = new LayerSwitcher({});
map.addControl(layerSwitcher);

// Add the Stadia Basemaps here:


// Add the ESRI XYZ basemaps here:


// Add the WFS layer here:
// First, the URL definition:
// Then the Source and Layer definitions:
// Finally the call to the WFS service:


// Add the local static GeoJSON layer here:


// Add the popup code here:


// Add the singleclick event code here


// Add the pointermove event code here:





// Add the layer groups to the map here, at the end of the script!
map.addLayer(basemapLayers);
map.addLayer(overlayLayers);
