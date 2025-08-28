// ES6 imports for OpenLayers
import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import XYZ from 'https://cdn.skypack.dev/ol/source/XYZ.js';
import Overlay from 'https://cdn.skypack.dev/ol/Overlay.js';
import {fromLonLat, toLonLat} from 'https://cdn.skypack.dev/ol/proj.js';
import {defaults as defaultControls} from 'https://cdn.skypack.dev/ol/control.js';
import ScaleLine from 'https://cdn.skypack.dev/ol/control/ScaleLine.js';
import FullScreen from 'https://cdn.skypack.dev/ol/control/FullScreen.js';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing map with ES6 modules...');

    try {
        // Create base layers
        const osmLayer = new TileLayer({
            source: new OSM(),
            visible: true
        });

        const satelliteLayer = new TileLayer({
            source: new XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                attributions: '© Esri'
            }),
            visible: false
        });

        // Create sample pollutant layers (using different map styles as demonstration)
        const no2Layer = new TileLayer({
            source: new XYZ({
                url: 'https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png',
                attributions: 'Sample NO₂ Data Layer'
            }),
            visible: true,
            opacity: 0.6
        });

        const pm25Layer = new TileLayer({
            source: new XYZ({
                url: 'https://tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png',
                attributions: 'Sample PM2.5 Data Layer'
            }),
            visible: false,
            opacity: 0.6
        });

        const pm10Layer = new TileLayer({
            source: new XYZ({
                url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
                attributions: 'Sample PM10 Data Layer'
            }),
            visible: false,
            opacity: 0.6
        });

        // Create the map
        const map = new Map({
            target: 'map',
            layers: [
                osmLayer,
                satelliteLayer,
                no2Layer,
                pm25Layer,
                pm10Layer
            ],
            view: new View({
                center: fromLonLat([10.4515, 51.1657]), // Center of Germany
                zoom: 6,
                minZoom: 4,
                maxZoom: 15
            }),
            controls: defaultControls().extend([
                new ScaleLine(),
                new FullScreen()
            ])
        });

        console.log('Map created successfully!');

        // Setup popup overlay
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

        // Close popup handler
        popupCloser.onclick = function() {
            overlay.setPosition(undefined);
            popupCloser.blur();
            return false;
        };

        // Map click handler for popup
        map.on('singleclick', function(event) {
            const coordinate = event.coordinate;
            const lonLat = toLonLat(coordinate);
            
            // Get currently selected pollutant
            const selectedPollutant = document.querySelector('input[name="pollutant"]:checked');
            if (!selectedPollutant) return;
            
            let pollutantName, concentration, unit = 'μg/m³';
            
            switch(selectedPollutant.value) {
                case 'no2':
                    pollutantName = 'NO₂';
                    concentration = (Math.random() * 40 + 5).toFixed(1);
                    break;
                case 'pm25':
                    pollutantName = 'PM2.5';
                    concentration = (Math.random() * 25 + 3).toFixed(1);
                    break;
                case 'pm10':
                    pollutantName = 'PM10';
                    concentration = (Math.random() * 45 + 8).toFixed(1);
                    break;
                default:
                    pollutantName = 'NO₂';
                    concentration = (Math.random() * 40 + 5).toFixed(1);
            }
            
            // Determine air quality category
            let category = 'Good';
            let categoryColor = '#1a9850';
            
            if (pollutantName === 'NO₂') {
                if (concentration > 50) { category = 'Very Unhealthy'; categoryColor = '#d73027'; }
                else if (concentration > 40) { category = 'Unhealthy'; categoryColor = '#fdae61'; }
                else if (concentration > 25) { category = 'Unhealthy for Sensitive'; categoryColor = '#fee08b'; }
                else if (concentration > 10) { category = 'Moderate'; categoryColor = '#66bd63'; }
            } else if (pollutantName === 'PM2.5') {
                if (concentration > 25) { category = 'Very Unhealthy'; categoryColor = '#d73027'; }
                else if (concentration > 20) { category = 'Unhealthy'; categoryColor = '#fdae61'; }
                else if (concentration > 10) { category = 'Unhealthy for Sensitive'; categoryColor = '#fee08b'; }
                else if (concentration > 5) { category = 'Moderate'; categoryColor = '#66bd63'; }
            } else if (pollutantName === 'PM10') {
                if (concentration > 50) { category = 'Very Unhealthy'; categoryColor = '#d73027'; }
                else if (concentration > 40) { category = 'Unhealthy'; categoryColor = '#fdae61'; }
                else if (concentration > 30) { category = 'Unhealthy for Sensitive'; categoryColor = '#fee08b'; }
                else if (concentration > 15) { category = 'Moderate'; categoryColor = '#66bd63'; }
            }
            
            popupContent.innerHTML = `
                <h4>Air Quality Information</h4>
                <p><strong>Location:</strong><br>
                ${lonLat[1].toFixed(4)}°N, ${lonLat[0].toFixed(4)}°E</p>
                <p><strong>${pollutantName} Concentration:</strong><br>
                <span style="color: ${categoryColor}; font-weight: bold;">${concentration} ${unit}</span></p>
                <p><strong>Air Quality:</strong><br>
                <span style="color: ${categoryColor}; font-weight: bold;">${category}</span></p>
                <p style="font-size: 11px; color: #666;"><em>Sample data for demonstration</em></p>
            `;
            
            overlay.setPosition(coordinate);
        });

        // Layer control functionality
        function setupLayerControls() {
            // Pollutant layer controls
            const pollutantRadios = document.querySelectorAll('input[name="pollutant"]');
            pollutantRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    console.log('Switching to pollutant:', this.value);
                    
                    // Hide all pollutant layers
                    no2Layer.setVisible(false);
                    pm25Layer.setVisible(false);
                    pm10Layer.setVisible(false);
                    
                    // Show selected layer
                    switch(this.value) {
                        case 'no2':
                            no2Layer.setVisible(true);
                            updateLegend('NO₂');
                            break;
                        case 'pm25':
                            pm25Layer.setVisible(true);
                            updateLegend('PM2.5');
                            break;
                        case 'pm10':
                            pm10Layer.setVisible(true);
                            updateLegend('PM10');
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
                        osmLayer.setVisible(true);
                        satelliteLayer.setVisible(false);
                    } else {
                        osmLayer.setVisible(false);
                        satelliteLayer.setVisible(true);
                    }
                });
            });

            // Additional layers (placeholder functionality)
            const boundariesCheckbox = document.getElementById('boundaries-layer');
            if (boundariesCheckbox) {
                boundariesCheckbox.addEventListener('change', function() {
                    console.log('Administrative boundaries:', this.checked ? 'ON' : 'OFF');
                    // Placeholder for boundaries layer
                });
            }

            const populationCheckbox = document.getElementById('population-layer');
            if (populationCheckbox) {
                populationCheckbox.addEventListener('change', function() {
                    console.log('Population density:', this.checked ? 'ON' : 'OFF');
                    // Placeholder for population layer
                });
            }
        }

        // Update legend function
        function updateLegend(pollutant) {
            const legendContent = document.getElementById('legend-content');
            const legendTitle = document.querySelector('.legend-title');
            
            if (!legendContent || !legendTitle) return;
            
            legendTitle.textContent = `${pollutant} Concentration Legend`;
            
            let legendData = [];
            
            switch(pollutant) {
                case 'NO₂':
                    legendData = [
                        { color: '#1a9850', label: 'Good (0-10 μg/m³)' },
                        { color: '#66bd63', label: 'Moderate (10-25 μg/m³)' },
                        { color: '#fee08b', label: 'Unhealthy for Sensitive (25-40 μg/m³)' },
                        { color: '#fdae61', label: 'Unhealthy (40-50 μg/m³)' },
                        { color: '#d73027', label: 'Very Unhealthy (>50 μg/m³)' }
                    ];
                    break;
                case 'PM2.5':
                    legendData = [
                        { color: '#1a9850', label: 'Good (0-5 μg/m³)' },
                        { color: '#66bd63', label: 'Moderate (5-10 μg/m³)' },
                        { color: '#fee08b', label: 'Unhealthy for Sensitive (10-20 μg/m³)' },
                        { color: '#fdae61', label: 'Unhealthy (20-25 μg/m³)' },
                        { color: '#d73027', label: 'Very Unhealthy (>25 μg/m³)' }
                    ];
                    break;
                case 'PM10':
                    legendData = [
                        { color: '#1a9850', label: 'Good (0-15 μg/m³)' },
                        { color: '#66bd63', label: 'Moderate (15-31 μg/m³)' },
                        { color: '#fee08b', label: 'Unhealthy for Sensitive (31-40 μg/m³)' },
                        { color: '#fdae61', label: 'Unhealthy (40-50 μg/m³)' },
                        { color: '#d73027', label: 'Very Unhealthy (>50 μg/m³)' }
                    ];
                    break;
            }
            
            legendContent.innerHTML = legendData.map(item => `
                <div class="legend-item">
                    <div class="legend-color" style="background-color: ${item.color};"></div>
                    <span class="legend-label">${item.label}</span>
                </div>
            `).join('');
        }

        // Initialize controls and legend
        setupLayerControls();
        updateLegend('NO₂');

        // Add some map interaction feedback
        map.on('moveend', function() {
            const view = map.getView();
            const zoom = view.getZoom();
            const center = toLonLat(view.getCenter());
            console.log(`Map moved: Zoom ${zoom.toFixed(1)}, Center: ${center[1].toFixed(3)}°N, ${center[0].toFixed(3)}°E`);
        });

        console.log('Air Quality WebGIS initialized successfully with ES6 modules!');

    } catch (error) {
        console.error('Error initializing map:', error);
        document.getElementById('map').innerHTML = `
            <div style="padding: 50px; text-align: center; color: red; font-family: Arial, sans-serif;">
                <h3>Map Loading Error</h3>
                <p>There was an error loading the map: ${error.message}</p>
                <p>Please check your internet connection and refresh the page.</p>
                <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 10px; cursor: pointer;">
                    Refresh Page
                </button>
            </div>
        `;
    }
});