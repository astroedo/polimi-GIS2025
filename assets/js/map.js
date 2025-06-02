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
import RBush from 'rbush';


// OpenStreetMap base map
let osm = new Tile({
    title: "Open Street Map",
    type: "base",
    visible: true,
    source: new OSM()
});

// ------- layers -------
// step 1
let Germany_no2_dec2022 = new Image({
    title: "NO2 in Germany - December 2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_CAMS_no2_2022_12' }
    }),
    visible: false
});
//
let Germany_pm2p5_dec2022 = new Image({
    title: "PM2.5 in Germany - December 2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_CAMS_pm2p5_2022_12' }
    }),
    visible: false
});
 let Germany_pm10_dec2022 = new Image({
    title: "PM10 in Germany - December 2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_CAMS_pm10_2022_12' }
    }),
    visible: false
});

// step 2
var GermanyAvg_no2_2022 = new Image({
    title: "Average NO2 in Germany - 2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_average_no2_2022' }
    }),
    opacity: 0.5,
    visible: false
});
var GermanyAvg_pm2p5_2022 = new Image({
    title: "Average PM2.5 in Germany - 2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_average_pm2p5_2022' }
    }),
    opacity: 0.5,
    visible: false
});
var GermanyAvg_pm10_2022 = new Image({
    title: "Average PM10 in Germany - 2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_average_pm10_2022' }
    }),
    opacity: 0.5,
    visible: false
});

// step 3
var Germany_no2_2020 = new Image({
    title: "NO2 in Germany - 2020",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_no2_concentration_map_2020' }
    }),
    visible: false
});
var Germany_pm2p5_2020 = new Image({
    title: "PM2.5 in Germany - 2020",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_pm2p5_concentration_map_2020' }
    }),
    visible: false
});var Germany_pm10_2020 = new Image({
    title: "PM10 in Germany - 2020",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_pm10_concentration_map_2020' }
    }),
    visible: false
});

// step 4
var Germany_no2_2017_2021_AAD_map_2022 = new Image({
    title: "Germany NO2 - 2017-2021 AAD map 2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_no2_2017_2021_AAD_map_2022' }
    }),
    visible: false
});
var Germany_pm2p5_2017_2021_AAD_map_2022 = new Image({
    title: "Germany PM2.5 - 2017-2021 AAD map 2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_pm2p5 _2017-2021_AAD_map _2022' }
    }),
    visible: false
});
var Germany_pm10_2017_2021_AAD_map_2022 = new Image({
    title: "Germany PM10 - 2017-2021 AAD map 2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_pm10_2017_2021_AAD_map_2022' }
    }),
    visible: false
});

// step 5
var Germany_LC_2022 = new Image({
    title: "Germany Land Cover - 2022",
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_LC_reclassified_2022' }
    }),
    visible: false
});

// Add the layer groups code here:
let basemapLayers = new Group({
    title: 'Base Maps',
    layers: [osm]
});
let overlayLayers = new Group({
    title: 'Overlay Layers',
    layers: [
        Germany_no2_dec2022,
        Germany_pm2p5_dec2022,
        Germany_pm10_dec2022,
        GermanyAvg_no2_2022,
        GermanyAvg_pm2p5_2022,
        GermanyAvg_pm10_2022,
        Germany_no2_2020,
        Germany_pm2p5_2020,
        Germany_pm10_2020,
        Germany_no2_2017_2021_AAD_map_2022,
        Germany_pm2p5_2017_2021_AAD_map_2022,
        Germany_pm10_2017_2021_AAD_map_2022,
        Germany_LC_2022
    ]
});


// Map Initialization
let mapOrigin = fromLonLat([10.5, 51.5]);
let zoomLevel = 6;
let map = new Map({
    target: document.getElementById('map'),
    layers: [basemapLayers, overlayLayers],
    //layers: [],
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

// step 6
// Add the WFS layer here:
// First, the URL definition:
var wfsUrl1 = "https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/gis/wfs?" + 
"service=WFS&" + 
"version=2.0.0&" +
"request=GetFeature&" + 
"typeName=gisgeoserver_01:germany_no2_zonal_statistics_2013_2022&" + 
"srsname=EPSG:4326&" + 
"outputFormat=application/json";
// Then the Source and Layer definitions:
let wfsSource1 = new VectorSource({});
let wfsLayer1 = new Vector({
    title: "Germany NO2 Zonal Statistics",
    source: wfsSource1,
    visible: false,
    style: new Style({
        fill: new Fill({
            color: "#bde0fe"
        }),
        stroke: new Stroke({
            width: 2,
            color: "#a2d2ff"
        })
    })
});

var wfsUrl2 = "https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/gis/wfs?" + 
"service=WFS&" + 
"version=2.0.0&" +
"request=GetFeature&" + 
"typeName=gisgeoserver_01:Germany_pm2p5_zonal_statistics_2013-2022&" + 
"srsname=EPSG:4326&" + 
"outputFormat=application/json";
// Then the Source and Layer definitions:
let wfsSource2 = new VectorSource({});
let wfsLayer2 = new Vector({
    title: "Germany PM2.5 Zonal Statistics",
    source: wfsSource2,
    visible: false,
    style: new Style({
        fill: new Fill({
            color: "#bde0fe"
        }),
        stroke: new Stroke({
            width: 2,
            color: "#a2d2ff"
        })
    })
});

var wfsUrl3 = "https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/gis/wfs?" + 
"service=WFS&" + 
"version=2.0.0&" +
"request=GetFeature&" + 
"typeName=gisgeoserver_01:Germany_pm10_zonal_statistics_2013-2022&" + 
"srsname=EPSG:4326&" + 
"outputFormat=application/json";
// Then the Source and Layer definitions:
let wfsSource3 = new VectorSource({});
let wfsLayer3 = new Vector({
    title: "Germany PM10 Zonal Statistics",
    source: wfsSource3,
    visible: false,
    style: new Style({
        fill: new Fill({
            color: "#bde0fe"
        }),
        stroke: new Stroke({
            width: 2,
            color: "#a2d2ff"
        })
    })
});

// Finally the call to the WFS service:
fetch(wfsUrl1)
.then((response) => {
    if (!response.ok) {
        throw new Error('Error ' + response.statusText);
    }
    response.json().then(data => {
        wfsSource1.addFeatures(
	    new GeoJSON().readFeatures(data)
	);
    })
});
overlayLayers.getLayers().extend([wfsLayer1]);

fetch(wfsUrl2)
.then((response) => {
    if (!response.ok) {
        throw new Error('Error ' + response.statusText);
    }
    response.json().then(data => {
        wfsSource2.addFeatures(
	    new GeoJSON().readFeatures(data)
	);
    })
});
overlayLayers.getLayers().extend([wfsLayer2]);

fetch(wfsUrl3)
.then((response) => {
    if (!response.ok) {
        throw new Error('Error ' + response.statusText);
    }
    response.json().then(data => {
        wfsSource3.addFeatures(
	    new GeoJSON().readFeatures(data)
	);
    })
});
overlayLayers.getLayers().extend([wfsLayer3]);

// step 7
var wfsUrl4 = "https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/gis/wfs?" + 
"service=WFS&" + 
"version=2.0.0&" +
"request=GetFeature&" + 
"typeName=gisgeoserver_01:GERMANY_no2_2020_bivariate&" + 
"srsname=EPSG:4326&" + 
"outputFormat=application/json";
// Then the Source and Layer definitions:
let wfsSource4 = new VectorSource({});
let wfsLayer4 = new Vector({
    title: "Germany NO2 bivariate map",
    source: wfsSource4,
    visible: false,
    style: new Style({
        fill: new Fill({
            color: "#bde0fe"
        }),
        stroke: new Stroke({
            width: 2,
            color: "#a2d2ff"
        })
    })
});

var wfsUrl5 = "https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/gis/wfs?" + 
"service=WFS&" + 
"version=2.0.0&" +
"request=GetFeature&" + 
"typeName=gisgeoserver_01:Germany_pm2p5_2020_bivariate&" + 
"srsname=EPSG:4326&" + 
"outputFormat=application/json";
// Then the Source and Layer definitions:
let wfsSource5 = new VectorSource({});
let wfsLayer5 = new Vector({
    title: "Germany PM2.5 bivariate map",
    source: wfsSource5,
    visible: false,
    style: new Style({
        fill: new Fill({
            color: "#bde0fe"
        }),
        stroke: new Stroke({
            width: 2,
            color: "#a2d2ff"
        })
    })
});

var wfsUrl6 = "https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/gis/wfs?" + 
"service=WFS&" + 
"version=2.0.0&" +
"request=GetFeature&" + 
"typeName=gisgeoserver_01:Germany_pm10_2020_bivariate&" + 
"srsname=EPSG:4326&" + 
"outputFormat=application/json";
// Then the Source and Layer definitions:
let wfsSource6 = new VectorSource({});
let wfsLayer6 = new Vector({
    title: "Germany PM10 bivariate map",
    source: wfsSource6,
    visible: false,
    style: new Style({
        fill: new Fill({
            color: "#bde0fe"
        }),
        stroke: new Stroke({
            width: 2,
            color: "#a2d2ff"
        })
    })
});

// Finally the call to the WFS service:
fetch(wfsUrl4)
.then((response) => {
    if (!response.ok) {
        throw new Error('Error ' + response.statusText);
    }
    response.json().then(data => {
        wfsSource4.addFeatures(
	    new GeoJSON().readFeatures(data)
	);
    })
});
overlayLayers.getLayers().extend([wfsLayer4]);

fetch(wfsUrl5)
.then((response) => {
    if (!response.ok) {
        throw new Error('Error ' + response.statusText);
    }
    response.json().then(data => {
        wfsSource5.addFeatures(
	    new GeoJSON().readFeatures(data)
	);
    })
});
overlayLayers.getLayers().extend([wfsLayer5]);

fetch(wfsUrl6)
.then((response) => {
    if (!response.ok) {
        throw new Error('Error ' + response.statusText);
    }
    response.json().then(data => {
        wfsSource6.addFeatures(
	    new GeoJSON().readFeatures(data)
	);
    })
});
overlayLayers.getLayers().extend([wfsLayer6]);

// Add the popup code here:
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var popup = new Overlay({
    element: container
}); 

map.addOverlay(popup);

closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur(); 
    return false;
};


// Add the singleclick event code here
map.on('singleclick', function (event) {
    var feature = map.forEachFeatureAtPixel(
        event.pixel, 
        function (feature, layer) {
            if(layer == staticGeoJSONLayer1 ||
                layer == staticGeoJSONLayer2 ||
                layer == staticGeoJSONLayer3 ||
                layer == staticGeoJSONLayer4 ||
                layer == staticGeoJSONLayer5 ||
                layer == staticGeoJSONLayer6 
            ){
                return feature;
            }
        }
    );

    if (feature != null) {
        var pixel = event.pixel;
        var coord = map.getCoordinateFromPixel(pixel);
        popup.setPosition(coord);

        content.innerHTML =
            '<h5####h5><br>' +
            '<span>' 
            + JSON.stringify(feature.getProperties()) +
            '</span>';
    }
});

// Add the pointermove event code here:
map.on('pointermove', function(event) {
    var pixel = map.getEventPixel(event.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});

// Add the legend code here:
var legendHTMLString = '<ul>';
function getLegendElement(title, color){
    return '<li>' + 
        '<span class="legend-color" style="background-color: ' + color + ' ">' + 
        '</span><span>' + 
        title +
        '</span></li>';
}

for(let overlayLayer of overlayLayers.getLayers().getArray()){
    if(overlayLayer.getSource() instanceof ImageWMS){
        var legendURLParams = {format: "application/json"};
        var legendUrl = overlayLayer.getSource().getLegendUrl(0, legendURLParams);
        // make the legend JSON request
        await fetch(legendUrl).then(async (response) => {
            await response.json().then((data) => {
                var layerTitle = overlayLayer.get('title');
                var layerSymbolizer = data["Legend"][0]["rules"][0]["symbolizers"][0];
                var layerColor = null;
                if("Polygon" in layerSymbolizer){
                    layerColor = layerSymbolizer["Polygon"]["fill"];
                } else if("Line" in layerSymbolizer){
                    layerColor = layerSymbolizer["Line"]["stroke"];
                }

                if(layerColor != null){
                    legendHTMLString += getLegendElement(layerTitle, layerColor);
                }
            });
        });

    } else {
        var layerStyle = overlayLayer.getStyle();
        var layerColor = layerStyle.getFill().getColor();
        var layerTitle = overlayLayer.get('title');
        legendHTMLString += getLegendElement(layerTitle, layerColor);
    }
}
// Finish building the legend HTML string
var legendContent = document.getElementById('legend-content');
legendHTMLString += "</ul>";
legendContent.innerHTML = legendHTMLString;

// Add the layer groups to the map here, at the end of the script!
map.addLayer(basemapLayers);
map.addLayer(overlayLayers);
