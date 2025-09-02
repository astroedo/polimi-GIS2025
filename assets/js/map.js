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

// NOX LAYERS
let LayerNOX_1 = new Image({
    title: "no2_concentration_map_2020",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_no2_concentration_map_2020', 'STYLES': 'LC_style' }
    }),
    visible: false
});

var LayerNOX_2  = new Image({
    title: "CAMS_no2_2022_12",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_CAMS_no2_2022_12' }
    }),
    visible: false
});

var LayerNOX_3  = new Image({
    title: "GERMANY_no2_2017_2021_AAD_map_2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_no2_2017_2021_AAD_map_2022', 'STYLES': 'GERMANY_no2_2017_2021_AAD_2022' }
    }),
    visible: false
});

var LayerNOX_4  = new Image({
    title: "no2_concentration_map_2020",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_no2_concentration_map_2020' }
    }),
    visible: false,
});
var LayerNOX_5  = new Image({
    title: "no2_2020_bivariate",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_no2_2020_bivariate' }
    }),
    visible: false,
});

/*
var wfsUrl = "https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms?" +
"service=WFS&" +
"version=2.0.0&" +
"request=GetFeature&" +
"typeName=gis:COL_water_areas&" +
"srsname=EPSG:3857&" +
"outputFormat=application/json";*/

// PM2.5 LAYERS
let LayerPM25_1 = new Image({
    title: "pm2p5_2017_2021_AAD_map _2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_pm2p5_2017_2021_AAD_map _2022' , 'STYLES': 'Germany_pm2p5 _2017-2021_AAD_map _2022'}
    }),
    visible: false
});

var LayerPM25_2  = new Image({
    title: "pm2p5_concentration_2020",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_pm2p5_concentration_2020' }
    }),
    visible: false
});

var LayerPM25_3  = new Image({
    title: "average_pm2p5_2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_average_pm2p5_2022' }
    }),
    visible: false
});

var LayerPM25_4  = new Image({
    title: "CAMS_pm2p5_2022_12",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_CAMS_pm2p5_2022_12' }
    }),
    visible: false,
});

var LayerPM25_5  = new Image({
    title: "pm2p5_2020_bivariate",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'Germany_pm2p5_2020_bivariate' }
    }),
    visible: false,
});


// PM10 LAYERS
let LayerPM10_1 = new Image({
    title: "pm10_2017_2021_AAD_map_2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_pm10_2017_2021_AAD_map_2022', 'STYLES': 'Germany_pm2p5 _2017-2021_AAD_map _2022' }
    }),
    visible: false
});

var LayerPM10_2  = new Image({
    title: "CAMS_pm10_2022_12",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_CAMS_pm10_2022_12' }
    }),
    visible: false
});

var LayerPM10_3  = new Image({
    title: "average_pm10_2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_average_pm10_2022' }
    }),
    visible: false
});

var LayerPM10_4  = new Image({
    title: "pm10_concentration_2020",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_pm10_concentration_2020' }
    }),
    visible: false,
});

var LayerPM10_5  = new Image({
    title: "pm10_2020_bivariate",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'Germany_pm10_2020_bivariate' }
    }),
    visible: false,
});

var LayerLC  = new Image({
    title: "LC_reclassified_2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_LC_reclassified_2022', 'STYLES': 'LC_style' }
    }),
    visible: false,
});
/*

var wfsUrlPM10 = "https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms?" +
"service=WFS&" +
"version=2.0.0&" +
"request=GetFeature&" +
"typeName=gisgeoserver_01:Germany_pm10_2020_bivariate&" +
"srsname=EPSG:4326&" +
"outputFormat=application/json";

let wfsSourcePM10 = new VectorSource({});

let wfsLayerPM10 = new Vector({
title: "pm10_2020_bivariate",
source: wfsSourcePM10,
visible: false,
style: "bivariate_5x5_legend_vector_v2"
});

fetch(wfsUrlPM10)
.then((response) => {
if (!response.ok) {
throw new Error('Error ' + response.statusText);
}
response.json().then(data => {
wfsSourcePM10.addFeatures(
new GeoJSON().readFeatures(data)
);
})
});
*/
// Add the layer groups code here:
let basemapLayers = new Group({
    title: 'Base Maps',
    layers: [osm]
});
let landCover = new Group({
    title: 'Land cover',
    layers: [LayerLC]
});
let nox = new Group({
    title: 'NOx',
    layers: [
        LayerNOX_1 ,
        LayerNOX_2 ,
        LayerNOX_3 ,
        LayerNOX_4 ,
        LayerNOX_5
    ]
});
let pm2p5 = new Group({
    title: 'PM2.5',
    layers: [
        LayerPM25_1 ,
        LayerPM25_2 ,
        LayerPM25_3 ,
        LayerPM25_4,
        LayerPM25_5 
    ]
});
let pm10 = new Group({
    title: 'PM10',
    layers: [
        LayerPM10_1 ,
        LayerPM10_2 ,
        LayerPM10_3 ,
        LayerPM10_4,
        LayerPM10_5
    ]
});

//pm10.getLayers().extend([wfsLayerPM10]);


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
map.addLayer(landCover);
map.addLayer(nox);
map.addLayer(pm2p5);
map.addLayer(pm10);

