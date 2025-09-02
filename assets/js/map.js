import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';

import { Map, View } from 'ol';
import { Tile, Image, Group } from 'ol/layer';
import { OSM, ImageWMS } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { ScaleLine, FullScreen, MousePosition } from 'ol/control';
import LayerSwitcher from 'ol-layerswitcher';
import { createStringXY } from 'ol/coordinate';

// Funzione helper
function createWMSLayer(title, layerName, style = null, visible = false) {
  return new Image({
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
const osm = new Tile({ title: 'OpenStreetMap', type: 'base', visible: true, source: new OSM() });
const baseMaps = new Group({ title: 'Base Maps', layers: [osm] });

// Gruppi ordinati
const landCover = new Group({
  title: 'Land Cover',
  layers: [ createWMSLayer("LC reclassified 2022", "Germany_LC_reclassified_2022", "LC_style") ]
});

const nox = new Group({
  title: 'NOx',
  layers: [
    createWMSLayer('no2_concentration_map_2020', 'gisgeoserver_01:GERMANY_no2_concentration_map_2020', 'LC_style'), // concentration
    createWMSLayer('average_no2_2022', 'gisgeoserver_01:GERMANY_average_no2_2022'), // average
    createWMSLayer('no2_2017_2021_AAD_map_2022', 'gisgeoserver_01:GERMANY_no2_2017_2021_AAD_map_2022', 'GERMANY_no2_2017_2021_AAD_2022'), // AAD
    createWMSLayer('no2_2020_bivariate', 'gisgeoserver_01:GERMANY_no2_2020_bivariate'), // bivariate
    createWMSLayer('CAMS_no2_2022_12', 'gisgeoserver_01:GERMANY_CAMS_no2_2022_12') // CAMS
  ]
});


const pm25 = new Group({
  title: 'PM2.5',
  layers: [
    createWMSLayer('pm2p5_concentration_2020', 'gisgeoserver_01:Germany_pm2p5_concentration_2020'), // concentration
    createWMSLayer('average_pm2p5_2022', 'gisgeoserver_01:Germany_average_pm2p5_2022'), // average
    createWMSLayer('pm2p5_2017_2021_AAD_map _2022', 'gisgeoserver_01:Germany_pm2p5_2017_2021_AAD_map _2022', 'Germany_pm2p5 _2017-2021_AAD_map _2022'), // AAD
    createWMSLayer('pm2p5_2020_bivariate', 'gisgeoserver_01:Germany_pm2p5_2020_bivariate'), // bivariate
    createWMSLayer('CAMS_pm2p5_2022_12', 'gisgeoserver_01:Germany_CAMS_pm2p5_2022_12') // CAMS
  ]
});

const pm10 = new Group({
  title: 'PM10',
  layers: [
    createWMSLayer('pm10_concentration_2020', 'gisgeoserver_01:Germany_pm10_concentration_2020'), // concentration
    createWMSLayer('average_pm10_2022', 'gisgeoserver_01:Germany_average_pm10_2022'), // average
    createWMSLayer('pm10_2017_2021_AAD_map_2022', 'gisgeoserver_01:Germany_pm10_2017_2021_AAD_map_2022', 'Germany_pm2p5 _2017-2021_AAD_map _2022'), // AAD
    createWMSLayer('pm10_2020_bivariate', 'gisgeoserver_01:Germany_pm10_2020_bivariate'), // bivariate
    createWMSLayer('CAMS_pm10_2022_12', 'gisgeoserver_01:Germany_CAMS_pm10_2022_12') // CAMS
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
  groupSelectStyle: 'none'  // nessun checkbox a livello di gruppo
});
map.addControl(layerSwitcher);

// Aggiungi gruppi
[baseMaps, landCover, nox, pm25, pm10].forEach(group => map.addLayer(group));

// Funzione per simulare radio-button per gruppo
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
