// Versione corretta del map.js senza import ES6 modules
// Usa le librerie caricate da CDN nel HTML

// OpenStreetMap base map
let osm = new ol.layer.Tile({
    title: "Open Street Map",
    type: "base",
    visible: true,
    source: new ol.source.OSM()
});

// ------- WMS layers -------
let Germany_no2_dec2022 = new ol.layer.Image({
    title: "NO2 in Germany - December 2022",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_CAMS_no2_2022_12' }
    }),
    visible: false
});

let Germany_pm2p5_dec2022 = new ol.layer.Image({
    title: "PM2.5 in Germany - December 2022",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_CAMS_pm2p5_2022_12' }
    }),
    visible: false
});

let Germany_pm10_dec2022 = new ol.layer.Image({
    title: "PM10 in Germany - December 2022",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_CAMS_pm10_2022_12' }
    }),
    visible: false
});

// Average layers
var GermanyAvg_no2_2022 = new ol.layer.Image({
    title: "Average NO2 in Germany - 2022",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_average_no2_2022' }
    }),
    opacity: 0.7,
    visible: false
});

var GermanyAvg_pm2p5_2022 = new ol.layer.Image({
    title: "Average PM2.5 in Germany - 2022",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_average_pm2p5_2022' }
    }),
    opacity: 0.7,
    visible: false
});

var GermanyAvg_pm10_2022 = new ol.layer.Image({
    title: "Average PM10 in Germany - 2022",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_average_pm10_2022' }
    }),
    opacity: 0.7,
    visible: false
});

// 2020 concentration maps
var Germany_no2_2020 = new ol.layer.Image({
    title: "NO2 in Germany - 2020",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:GERMANY_no2_concentration_map_2020' }
    }),
    visible: false
});

var Germany_pm2p5_2020 = new ol.layer.Image({
    title: "PM2.5 in Germany - 2020",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_pm2p5_concentration_map_2020' }
    }),
    visible: false
});

var Germany_pm10_2020 = new ol.layer.Image({
    title: "PM10 in Germany - 2020",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_pm10_concentration_map_2020' }
    }),
    visible: false
});

// Land Cover layer
var Germany_LC_2022 = new ol.layer.Image({
    title: "Germany Land Cover - 2022",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wms',
        params: { 'LAYERS': 'gisgeoserver_01:Germany_LC_reclassified_2022' }
    }),
    visible: false
});

// Layer groups
let basemapLayers = new ol.layer.Group({
    title: 'Base Maps',
    layers: [osm]
});

let overlayLayers = new ol.layer.Group({
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
        Germany_LC_2022
    ]
});

// Map Initialization - CORREZIONE COORDINATE PER LA GERMANIA
let mapOrigin = ol.proj.fromLonLat([10.5, 51.5]); // Centro della Germania
let zoomLevel = 6;

let map = new ol.Map({
    target: document.getElementById('map'),
    layers: [basemapLayers, overlayLayers],
    view: new ol.View({
        center: mapOrigin,
        zoom: zoomLevel
    })
});

// Map controls
map.addControl(new ol.control.ScaleLine());
map.addControl(new ol.control.FullScreen());
map.addControl(
    new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        className: 'custom-control',
        placeholder: '0.0000, 0.0000'
    })
);

// LayerSwitcher control
var layerSwitcher = new ol.control.LayerSwitcher({});
map.addControl(layerSwitcher);

// Additional basemaps
var stamenWatercolor = new ol.layer.Tile({
    title: 'Stamen Watercolor',
    type: 'base',
    visible: false,
    source: new ol.source.StadiaMaps({
        layer: 'stamen_watercolor'
    })
});

var stamenToner = new ol.layer.Tile({
    title: 'Stamen Toner',
    type: 'base',
    visible: false,
    source: new ol.source.StadiaMaps({
        layer: 'stamen_toner'
    })
});

basemapLayers.getLayers().extend([stamenWatercolor, stamenToner]);

// WFS layers - Zonal Statistics
var wfsUrl1 = "https://www.gis-geoserver.polimi.it/geoserver/geoserver_01/wfs?" + 
"service=WFS&" + 
"version=2.0.0&" +
"request=GetFeature&" + 
"typeName=gisgeoserver_01:germany_no2_zonal_statistics_2013_2022&" + 
"srsname=EPSG:4326&" + 
"outputFormat=application/json";

let wfsSource1 = new ol.source.Vector({});
let wfsLayer1 = new ol.layer.Vector({
    title: "Germany NO2 Zonal Statistics",
    source: wfsSource1,
    visible: false,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: "rgba(189, 224, 254, 0.6)"
        }),
        stroke: new ol.style.Stroke({
            width: 2,
            color: "#a2d2ff"
        })
    })
});

// Fetch WFS data
fetch(wfsUrl1)
.then((response) => {
    if (!response.ok) {
        throw new Error('Error ' + response.statusText);
    }
    return response.json();
})
.then(data => {
    wfsSource1.addFeatures(
        new ol.format.GeoJSON().readFeatures(data)
    );
})
.catch(error => {
    console.error('Error loading WFS data:', error);
});

overlayLayers.getLayers().push(wfsLayer1);

// Popup setup
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
}); 

map.addOverlay(popup);

closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur(); 
    return false;
};

// Click event for popup
map.on('singleclick', function (event) {
    var feature = map.forEachFeatureAtPixel(
        event.pixel, 
        function (feature, layer) {
            return feature;
        }
    );

    if (feature) {
        var coord = event.coordinate;
        popup.setPosition(coord);

        var properties = feature.getProperties();
        var htmlContent = '<h5>Feature Information</h5>';
        
        // Show some properties (excluding geometry)
        for (var key in properties) {
            if (key !== 'geometry') {
                htmlContent += '<p><strong>' + key + ':</strong> ' + properties[key] + '</p>';
            }
        }
        
        content.innerHTML = htmlContent;
    } else {
        popup.setPosition(undefined);
    }
});

// Pointer move event
map.on('pointermove', function(event) {
    var pixel = map.getEventPixel(event.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});

// Simple legend (you can expand this)
var legendContent = document.getElementById('legend-content');
legendContent.innerHTML = `
    <ul>
        <li><span class="legend-color" style="background-color: #ff0000"></span>High Pollution</li>
        <li><span class="legend-color" style="background-color: #ffff00"></span>Medium Pollution</li>
        <li><span class="legend-color" style="background-color: #00ff00"></span>Low Pollution</li>
    </ul>
`;

console.log('Map initialized successfully!');