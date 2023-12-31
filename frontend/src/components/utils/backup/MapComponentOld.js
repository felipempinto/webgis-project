import React, { useState, useEffect, useRef } from 'react';
import tileLayersData from '../tileLayers.json';
import defaultStyle from "./defaultStyle.json";

import './MapComponent.css'
import 'leaflet/dist/leaflet.css';

import {
  MapContainer,
  TileLayer,
  ZoomControl,
  LayersControl,
  GeoJSON,
  ImageOverlay
} from 'react-leaflet';

import BasemapSelector from './BasemapSelector';
import ToggleLayersSelector from './ToggleLayersSelector'
import UpDelButttons from './UploadAndDeleteButtons';
import { leafletDefaultButtons } from './LeafletButtons';

import L from 'leaflet';

import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

import "react-leaflet-fullscreen/styles.css";
import { FullscreenControl } from 'react-leaflet-fullscreen';

import 'leaflet.browser.print/dist/leaflet.browser.print.min.js';

import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet-measure/dist/leaflet-measure.js';


delete L.Icon.Default.prototype._getIconUrl;


L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/'

export const MapComponent = ({
    rasters,
    geojsons,
    setRasters,
    setGeoJSONs,
}) => {
    const [mapInstance, setMapInstance] = useState(null);
    const [selectedTileLayer, setSelectedTileLayer] = useState(tileLayersData[0].url);
    const [visibleGeoJSONs, setVisibleGeoJSONs] = useState({});
    const [polygonStyles, setPolygonStyles] = useState({});
    const [selectedPolygon, setSelectedPolygon] = useState(null);
    const [buttonsCreated,setButtonsCreated] = useState(false); 

    const geojsonLayerRefs = useRef({});

    useEffect(() => {
      leafletDefaultButtons({
        mapInstance: mapInstance,
        buttonsCreated: buttonsCreated,
        setButtonsCreated: setButtonsCreated
      });
    }, [mapInstance,buttonsCreated,setButtonsCreated]);

    const MapItem = <>
      <MapContainer className='map-container'
        ref={(map) => {
          if (map) {
            setMapInstance(map);
          }
        }}
        center={[51.505, -0.09]}
        zoom={5}
        zoomControl={false}
        maxZoom={20}
        minZoom={2}>

        <TileLayer url={selectedTileLayer} />

          {rasters.map((raster, index) => {
            const tileCoordinates = raster.tiles.split(',').map(Number);
            const [xmin, ymin, xmax, ymax] = tileCoordinates;
            const bounds = [[ymin, xmin], [ymax, xmax]];

            return (
              <LayersControl.Overlay checked name={raster.name} key={index}>
                <ImageOverlay
                  url={raster.raster}
                  bounds={bounds}
                  opacity={1}
                  zIndex={10}
                />
              </LayersControl.Overlay>
            );
          })}


          {/* TODO? */}
          {/* NÃO deletar código comentado aqui, vai ser util mais pra frente. */}




          

          {/* TODO */}
          {/* Código para usar com o geoserver */}
          {/* <LayersControl.Overlay name={"AAAAA"} key={141}>
            <WMSTileLayer
                url="http://localhost:8080/geoserver/webgis/wms"
                params={
                  {
                  srs:"EPSG:4326",
                  format:"image/png",
                  layers:"webgis:coverage_test",
                  transparent: true,
                  opacity:1
                  }
                }
              />
          </LayersControl.Overlay> */}


          {/* TODO */}
          {/* Aqui o código funciona com TILES gerados por gdal2tiles */}
          {/* <TileLayer url={`${API_URL}${raster.tiles}/{z}/{x}/{y}.png`} tms={1} opacity={1} attribution="" minZoom={1} maxZoom={18} key={index}/>  */}
          {/* {rasters.map((raster, index) => (
          <LayersControl.Overlay checked name={raster.name} key={index}>

            <WMSTileLayer
                url="http://localhost:8080/geoserver/webgis/wms"
                params={
                  {
                  srs:"EPSG:4326",
                  format:"image/png",
                  layers:"webgis:coverage_test",
                  transparent: true,
                  }
                }
              />
          </LayersControl.Overlay>
        ))} */}

        {geojsons.map((geojson, index) => {
          const isVisible = visibleGeoJSONs[geojson.properties.id];
          return isVisible && (
            <GeoJSON
              key={index}
              ref={(el) => {
                if (el) {
                  geojsonLayerRefs.current[geojson.properties.id] = el;
                }
              }}
              data={{
                type: 'FeatureCollection',
                features: [geojson],
              }}
              style={(feature) => polygonStyles[feature.properties.id] || defaultStyle}

              onEachFeature={(feature, layer) => {
                if (feature.geometry.type !== 'Point') {
                  layer.on('click', () => {
                    setSelectedPolygon(layer);
                  });

                  layer.bindPopup(String(feature.properties.id));

                }
              }}
            />
          )
        })}
        <FullscreenControl position="bottomright" />
        <ZoomControl position="bottomright" />
      </MapContainer>
    
    </>













    return (
    <>
      <ToggleLayersSelector
        geojsons={geojsons}
        polygonStyles={polygonStyles}
        visibleGeoJSONs={visibleGeoJSONs}
        setVisibleGeoJSONs={setVisibleGeoJSONs}
      /> 
      
      <BasemapSelector  
      setSelectedTileLayer={setSelectedTileLayer}
      tileLayersData={tileLayersData}
      />

      <UpDelButttons
      setGeoJSONs={setGeoJSONs}
      setRasters={setRasters}
      mapInstance={mapInstance}
      />


      <div className='home-button-map'>
        <a href="/" className="btn-floating waves-effect waves-light btn-color">
          <i className="material-icons tiny">home</i>
        </a>
      </div>
    
    
    {MapItem}
      
    </>
  );
};
