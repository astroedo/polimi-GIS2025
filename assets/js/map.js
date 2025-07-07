import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';

import { Map, View } from 'ol';
import { Tile as TileLayer, Image as ImageLayer } from 'ol/layer';
import { OSM, ImageWMS } from 'ol/source';
import { fromLonLat } from 'ol/proj';

import LayerSwitcher from 'ol-layerswitcher';

// Base Layer
const osmBase = new TileLayer({
  title: 'OpenStreetMap',
  type: 'base',
  visible: true,
  source: new OSM()
});

// URL del GeoServer
const geoserverURL = 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_01/wms';

// Configurazione dei layer con eventuali SLD
const germanyLayersConfig = [
  { name: 'statistic', visible: true }, // default ON
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

// Creazione dinamica dei layer
const germanyWMSLayers = germanyLayersConfig.map(layer => {
  return new ImageLayer({
    title: layer.name.replace(/_/g, ' ').replace(/ +/g, ' '), // Pulizia nome
    visible: !!layer.visible, // visibile solo se true
    source: new ImageWMS({
      url: geoserverURL,
      params: {
        'LAYERS': `gisgeoserver_01:${layer.name}`,
        ...(layer.style && { 'STYLES': layer.style })
      },
      serverType: 'geoserver',
      crossOrigin: 'anonymous'
    })
  });
});

// Mappa
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
map.addControl(new LayerSwitcher({
  tipLabel: 'Layer Switcher',
  groupSelectStyle: 'children'
}));

// Fix resize mappa
setTimeout(() => map.updateSize(), 1000);
