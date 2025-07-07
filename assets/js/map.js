import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import ImageLayer from 'ol/layer/Image.js';
import OSM from 'ol/source/OSM.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import Overlay from 'ol/Overlay.js';
import {fromLonLat, toLonLat} from 'ol/proj.js';

import LayerSwitcher from 'ol-layerswitcher';

// URL Geoserver
const geoserverURL = 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms';

// Base Layer
const osmBase = new TileLayer({
  title: 'OpenStreetMap',
  type: 'base',
  visible: true,
  source: new OSM()
});

// Configurazione layer WMS
const germanyLayersConfig = [
  { name: 'statistic', visible: true },
  { name: 'germany_no2_zonal_statistics_2013_2022' },
  { name: 'Germany_pm2p5_zonal_statistics_2013-2022' },
  { name: 'Germany_pm2p5_concentration_2020' },
  { name: 'Germany_pm2p5_2020_chart' },
  { name: 'Germany_pm2p5_2020_bivariate', style: 'bivariate_5x5_legend_vector_v2' },
  { name: 'Germany_pm2p5_2017_2021_AAD_map _2022', style: 'Germany_pm2p5 _2017-2021_AAD_map _2022' },
  { name: 'Germany_pm10_zonal_statistics_2013-2022' },
  { name: 'Germany_pm10_concentration_2020' },
  { name: 'Germany_pm10_2020_bivariate' },
  { name: 'Germany_pm10_2017_2021_AAD_map_2022' },
  { name: 'Germany_no2_2020_chart' },
  { name: 'Germany_average_pm2p5_2022' },
  { name: 'Germany_average_pm10_2022' },
  { name: 'Germany_LC_reclassified_2022', style: 'LC_style' },
  { name: 'Germany_CAMS_pm2p5_2022_12' },
  { name: 'Germany_CAMS_pm10_2022_12' },
  { name: 'GERMANY_no2_concentration_map_2020' },
  { name: 'GERMANY_no2_2020_bivariate' },
  { name: 'GERMANY_no2_2017_2021_AAD_map_2022', style: 'GERMANY_no2_2017_2021_AAD_2022' },
  { name: 'GERMANY_average_no2_2022' },
  { name: 'GERMANY_CAMS_no2_2022_12' }
];

// Crea i layer WMS dinamicamente
const germanyWMSLayers = germanyLayersConfig.map(layer => new ImageLayer({
  title: layer.name.replace(/_/g, ' ').replace(/ +/g, ' ').trim(),
  visible: !!layer.visible,
  source: new ImageWMS({
    url: geoserverURL,
    params: {
      'LAYERS': `gisgeoserver_01:${layer.name}`,
      ...(layer.style && { 'STYLES': layer.style })
    },
    serverType: 'geoserver',
    crossOrigin: 'anonymous'
  })
}));

// Crea mappa
const map = new Map({
  target: 'map',
  layers: [
    osmBase,
    ...germanyWMSLayers
  ],
  view: new View({
    center: fromLonLat([10.0, 51.0]),
    zoom: 6
  })
});

// LayerSwitcher
const layerSwitcher = new LayerSwitcher({
  tipLabel: 'Legenda e Layers',
  groupSelectStyle: 'children'
});
map.addControl(layerSwitcher);

// Popup
const popup = document.getElementById('popup');
const popupContent = document.getElementById('popup-content');
const popupCloser = document.getElementById('popup-closer');

const overlay = new Overlay({
  element: popup,
  autoPan: {
    animation: {
      duration: 250
    }
  }
});
map.addOverlay(overlay);

popupCloser.onclick = function() {
  overlay.setPosition(undefined);
  popupCloser.blur();
  return false;
};

// Popup info base (da migliorare a seconda layer)
map.on('singleclick', evt => {
  const coordinate = evt.coordinate;
  const lonLat = toLonLat(coordinate);

  // Trova layer visibile tra i WMS
  const visibleLayer = germanyWMSLayers.find(l => l.getVisible());
  if (!visibleLayer) {
    overlay.setPosition(undefined);
    return;
  }

  // Mostra popup con info sintetiche (esempio)
  popupContent.innerHTML = `
    <h4>${visibleLayer.get('title')}</h4>
    <p><b>Coordinate:</b> ${lonLat[1].toFixed(4)}°N, ${lonLat[0].toFixed(4)}°E</p>
    <p><em>Dati WMS - esempio info punto</em></p>
  `;

  overlay.setPosition(coordinate);
});

// Legenda dinamica
const legendContent = document.getElementById('legend-content');
const legendTitle = document.querySelector('.legend-title');

function updateLegend() {
  // Trova layer visibile
  const visibleLayer = germanyWMSLayers.find(l => l.getVisible());

  if (!visibleLayer) {
    legendTitle.textContent = 'Nessun layer selezionato';
    legendContent.innerHTML = '';
    return;
  }

  const title = visibleLayer.get('title');
  legendTitle.textContent = `${title} - Legenda`;

  // Se hai URL di legenda vera, la puoi mettere qui.
  // Qui faccio un esempio statico:
  legendContent.innerHTML = `
    <p>Legenda personalizzata per <b>${title}</b></p>
    <ul>
      <li><span style="background:#1a9850; padding:4px;"></span> Basso</li>
      <li><span style="background:#fee08b; padding:4px;"></span> Medio</li>
      <li><span style="background:#d73027; padding:4px;"></span> Alto</li>
    </ul>
    <p><small>(Legenda demo, adattare per layer reali)</small></p>
  `;
}

// Aggiorna legenda quando cambia visibilità layer
germanyWMSLayers.forEach(layer => {
  layer.on('change:visible', () => {
    updateLegend();
  });
});

// Inizializza legenda
updateLegend();

// Forza resize mappa dopo caricamento
setTimeout(() => map.updateSize(), 1000);
