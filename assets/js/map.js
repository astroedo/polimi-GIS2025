// Import the main OpenLayers components from Skypack
import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import ImageLayer from 'https://cdn.skypack.dev/ol/layer/Image.js';
import GroupLayer from 'https://cdn.skypack.dev/ol/layer/Group.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import ImageWMS from 'https://cdn.skypack.dev/ol/source/ImageWMS.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import { ScaleLine, FullScreen, MousePosition } from 'https://cdn.skypack.dev/ol/control.js';
import { createStringXY } from 'https://cdn.skypack.dev/ol/coordinate.js';
import LayerSwitcher from 'https://cdn.jsdelivr.net/npm/ol-layerswitcher@4.1.1/+esm';
import XYZ from 'https://cdn.skypack.dev/ol/source/XYZ.js';


// Funzione helper
function createWMSLayer(title, layerName, style = null, visible = false) {
  return new ImageLayer({
    title,
    source: new ImageWMS({
      url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms',
      params: {
        'LAYERS': `${layerName}`,
        ...(style && { 'STYLES': style })
      },
    }),
    visible
  });
}

// Layer base
const osm = new TileLayer({ title: 'OpenStreetMap', type: 'base', visible: true, source: new OSM() });
// Add after the OSM layer
const satellite = new TileLayer({ 
    title: 'Satellite', 
    type: 'base', 
    visible: false, 
    source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: '© Esri'
    })
});

const baseMaps = new GroupLayer({ title: 'Base Maps', layers: [osm, satellite] });

// Gruppi ordinati
const landCover = new GroupLayer({
  title: 'Land Cover',
  layers: [ createWMSLayer("LC reclassified 2022", "Germany_LC_reclassified_2022", "LC_style") ]
});

const nox = new GroupLayer({
  title: 'NO₂ (Nitrogen Dioxide)',
  layers: [
    createWMSLayer('NO₂ Concentration Map 2020', 'gisgeoserver_01:GERMANY_no2_concentration_map_2020', 'LC_style'),
    createWMSLayer('NO₂ Average 2022', 'gisgeoserver_01:GERMANY_average_no2_2022'),
    createWMSLayer('NO₂ AAD Map 2017-2021', 'gisgeoserver_01:GERMANY_no2_2017_2021_AAD_map_2022', 'GERMANY_no2_2017_2021_AAD_2022'),
    createWMSLayer('NO₂ Bivariate Map 2020', 'gisgeoserver_01:GERMANY_no2_2020_bivariate'),
    createWMSLayer('CAMS NO₂ December 2022', 'gisgeoserver_01:GERMANY_CAMS_no2_2022_12')
  ]
});

const pm25 = new GroupLayer({
  title: 'PM2.5 (Fine Particulate Matter)',
  layers: [
    createWMSLayer('PM2.5 Concentration 2020', 'gisgeoserver_01:Germany_pm2p5_concentration_2020'),
    createWMSLayer('PM2.5 Average 2022', 'gisgeoserver_01:Germany_average_pm2p5_2022'),
    createWMSLayer('PM2.5 AAD Map 2017-2021', 'gisgeoserver_01:Germany_pm2p5_2017_2021_AAD_map _2022', 'Germany_pm2p5 _2017-2021_AAD_map _2022'),
    createWMSLayer('PM2.5 Bivariate Map 2020', 'gisgeoserver_01:Germany_pm2p5_2020_bivariate'),
    createWMSLayer('CAMS PM2.5 December 2022', 'gisgeoserver_01:Germany_CAMS_pm2p5_2022_12')
  ]
});

const pm10 = new GroupLayer({
  title: 'PM10 (Coarse Particulate Matter)',
  layers: [
    createWMSLayer('PM10 Concentration 2020', 'gisgeoserver_01:Germany_pm10_concentration_2020'),
    createWMSLayer('PM10 Average 2022', 'gisgeoserver_01:Germany_average_pm10_2022'),
    createWMSLayer('PM10 AAD Map 2017-2021', 'gisgeoserver_01:Germany_pm10_2017_2021_AAD_map_2022', 'Germany_pm2p5 _2017-2021_AAD_map _2022'),
    createWMSLayer('PM10 Bivariate Map 2020', 'gisgeoserver_01:Germany_pm10_2020_bivariate'),
    createWMSLayer('CAMS PM10 December 2022', 'gisgeoserver_01:Germany_CAMS_pm10_2022_12')
  ]
});

// Mappa
const map = new Map({
  target: 'map',
  view: new View({ center: fromLonLat([10.4, 51.1]), zoom: 5 })
});

// Controlli
map.addControl(new ScaleLine());
map.addControl(new FullScreen());
map.addControl(new MousePosition({
  coordinateFormat: createStringXY(4),
  projection: 'EPSG:4326',
  className: 'custom-control',
  placeholder: '0.0000, 0.0000'
}));

const layerSwitcher = new LayerSwitcher({
  activationMode: 'click',
  startActive: false,
  tipLabel: 'Legenda',
  groupLayerSelectStyle: 'none'  
});
map.addControl(layerSwitcher);

// Correct - use 'group' as the variable name
[baseMaps, landCover, nox, pm25, pm10].forEach(group => map.addLayer(group));

function enableRadioBehavior(group) {
  group.getLayers().forEach(lyr => {
    lyr.on('change:visible', () => {
      if (lyr.getVisible()) {
        group.getLayers().forEach(other => {
          if (other !== lyr && other.getVisible()) {
            other.setVisible(false);
          }
        });
      }
    });
  });
}

// Abilita il comportamento "radio" solo per i gruppi desiderati
[nox, pm25, pm10].forEach(enableRadioBehavior);

// Connect HTML controls to map layers
document.addEventListener('DOMContentLoaded', function() {
    
    // Set initial visibility to match default radio buttons
    nox.setVisible(true);
    pm25.setVisible(false);
    pm10.setVisible(false);
    
    // Make sure the first layer in NO2 group is visible by default
    if (nox.getLayers().getLength() > 0) {
        nox.getLayers().getArray()[0].setVisible(true);
    }
    
    // Pollutant controls
    const pollutantRadios = document.querySelectorAll('input[name="pollutant"]');
    pollutantRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            console.log('Switching to pollutant:', this.value);
            
            // Hide all pollutant groups
            nox.setVisible(false);
            pm25.setVisible(false);
            pm10.setVisible(false);
            
            // Hide all individual layers first
            [nox, pm25, pm10].forEach(group => {
                group.getLayers().forEach(layer => {
                    layer.setVisible(false);
                });
            });
            
            // Show selected group and make first layer visible
            switch(this.value) {
                case 'no2':
                    nox.setVisible(true);
                    if (nox.getLayers().getLength() > 0) {
                        nox.getLayers().getArray()[0].setVisible(true);
                    }
                    break;
                case 'pm25':
                    pm25.setVisible(true);
                    if (pm25.getLayers().getLength() > 0) {
                        pm25.getLayers().getArray()[0].setVisible(true);
                    }
                    break;
                case 'pm10':
                    pm10.setVisible(true);
                    if (pm10.getLayers().getLength() > 0) {
                        pm10.getLayers().getArray()[0].setVisible(true);
                    }
                    break;
            }
        });
    });
    
    // Base map controls
    const basemapRadios = document.querySelectorAll('input[name="basemap"]');
    basemapRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            console.log('Switching basemap to:', this.value);
            
            if(this.value === 'osm') {
                osm.setVisible(true);
                satellite.setVisible(false);
            } else if(this.value === 'satellite') {
                osm.setVisible(false);
                satellite.setVisible(true);
            }
        });
    });
    
    // Additional layer controls (checkboxes)
    const boundariesCheckbox = document.getElementById('boundaries-layer');
    if (boundariesCheckbox) {
        boundariesCheckbox.addEventListener('change', function() {
            console.log('Administrative boundaries:', this.checked ? 'ON' : 'OFF');
            // Implement boundaries layer functionality if needed
        });
    }

    const populationCheckbox = document.getElementById('population-layer');
    if (populationCheckbox) {
        populationCheckbox.addEventListener('change', function() {
            console.log('Population density:', this.checked ? 'ON' : 'OFF');
            // Implement population layer functionality if needed
        });
    }
});

// Force map to resize properly (fix for the top-left corner issue)
setTimeout(() => {
    map.updateSize();
}, 100);

// Also force resize when window is resized
window.addEventListener('resize', () => {
    map.updateSize();
});