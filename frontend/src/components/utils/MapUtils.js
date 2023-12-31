
import parse from 'wellknown';
import React, { useState, useEffect, useRef } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch,useSelector } from 'react-redux';
import { delete_geojson,delete_raster } from '../../features/data';
import './MapUtils.css'

const handleDeleteRaster = (rasterId,dispatch,rasters,setRasters)=> {
  dispatch(delete_raster(rasterId))
          .then((action) => {
            
            if (action.meta.requestStatus === 'fulfilled') {
              // window.location.reload();
              const newRasters = rasters.filter(rasterItem => rasterItem.id !== rasterId);
              setRasters(newRasters);
            } else {
              console.error('Failed to delete raser');
            }
          })
          .catch((error) => {
            console.error('Error occurred while deleting request:', error);
          });
}

const handleDeleteGeojson = (geojsonId,dispatch)=> {
  dispatch(delete_geojson(geojsonId))
          .then((action) => {
            
            if (action.meta.requestStatus === 'fulfilled') {
              window.location.reload();
            } else {
              console.error('Failed to delete geojson');
            }
          })
          .catch((error) => {
            console.error('Error occurred while deleting request:', error);
          });
}

export const parseGeoJSON = (data) => {
        return data.map(item => ({
          type: 'Feature',
          geometry: parse(item.geojson.split(';')[1]),
          properties: {
            id: item.id,
            name: item.name
          },
        }));       
};

export const extractCoordsFromPoint = (coords, lats, longs) => {
    let [long, lat] = coords;
    lats.push(lat);
    longs.push(long);
};


const extractCoordsFromLineOrMultiPoint = (coordinates, lats, longs) => {
    for (let i = 0; i < coordinates.length; i++) {
      extractCoordsFromPoint(coordinates[i], lats, longs);
    }
  };
  

const extractCoordsFromPolygonOrMultiLine = (coordinates, lats, longs) => {
    for (let i = 0; i < coordinates.length; i++) {
      extractCoordsFromLineOrMultiPoint(coordinates[i], lats, longs);
    }
  };

export const getCenterOfGeoJSON = (geojson) => {
    let lats = [], longs = [];

    geojson.features.forEach((feature) => {
      switch (feature.geometry.type) {
        case 'Point':
          extractCoordsFromPoint(feature.geometry.coordinates, lats, longs);
          break;
        case 'LineString':
        case 'MultiPoint':
          extractCoordsFromLineOrMultiPoint(feature.geometry.coordinates, lats, longs);
          break;
        case 'Polygon':
        case 'MultiLineString':
          extractCoordsFromPolygonOrMultiLine(feature.geometry.coordinates, lats, longs);
          break;
        case 'MultiPolygon':
          feature.geometry.coordinates.forEach(polygon => extractCoordsFromPolygonOrMultiLine(polygon, lats, longs));
          break;
        default:
          break;
      }
    });
  
    let minLat = Math.min(...lats);
    let maxLat = Math.max(...lats);
    let minLong = Math.min(...longs);
    let maxLong = Math.max(...longs);
  
    return [(minLat + maxLat) / 2, (minLong + maxLong) / 2];
};

export const styleRasterControls = ({
  rasters,
  setRasters,
  dispatch,
  raster,
  zoomToLayerRaster,
  // updateStyle,
  // rasterStyles
}) => {
  return (
  <div className='style-raster-class'>
    <div className='style-raster-item'>
      <button className='zoom-button' onClick={() => zoomToLayerRaster(raster.id)}>
        <span className="material-icons">zoom_in_map</span>
      </button>
      <a href="#" onClick={() => handleDeleteRaster(raster.id,dispatch,rasters,setRasters)}><i className='material-icons'>delete</i></a>
        {/* <span className='style-span'>Opacity</span>
        <input
          type="color"
          value={rasterStyles[raster.id]?.fillColor || "#ff0000"}
          onChange={e => updateStyle(raster.id, "fillColor", e.target.value)}
          style={{ width: '30px', height: '30px', border: '1px solid #ddd', borderRadius: '4px' }}
        /> */}
      </div>
  </div>
  )
}

export const StyleControls = ({ geojson, updateStyle, polygonStyles,zoomanddelete }) => {
  const isPoint = geojson.geometry.type === "Point" || geojson.geometry.type === "MultiPoint";
  const isLine = geojson.geometry.type === "LineString" || geojson.geometry.type === "MultiLineString";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingLeft: '40px' }}>
      {zoomanddelete}
      {!isPoint && !isLine && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ textAlign: 'left', flexGrow: 1 }}>Fill Color</span>
            <input
              type="color"
              value={polygonStyles[geojson.properties.id]?.fillColor || "#ff0000"}
              onChange={e => updateStyle(geojson.properties.id, "fillColor", e.target.value)}
              style={{ width: '30px', height: '30px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </>
      )}
      {!isPoint && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <span style={{ textAlign: 'left', flexGrow: 1 }}>Line Color</span>
            <input
              type="color"
              value={polygonStyles[geojson.properties.id]?.color || "#ff0000"}
              onChange={e => updateStyle(geojson.properties.id, "color", e.target.value)}
              style={{ width: '30px', height: '30px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </>
      )}
      {!isPoint && !isLine &&(
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ textAlign: 'left', flexGrow: 1, marginRight: '15px' }}>Fill Opacity</span>
            <input
              type="range"
              min="0" max="1" step="0.1"
              value={polygonStyles[geojson.properties.id]?.fillOpacity || 0.65}
              onChange={e => updateStyle(geojson.properties.id, "fillOpacity", e.target.value)}
              style={{ width: '80px', height: '30px'}}
            />
          </div>
        </>
      )}
      {!isPoint && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ textAlign: 'left', flexGrow: 1 }}>Line Size</span>
            <input
              type="range"
              min="0" max="10" step="1"
              value={polygonStyles[geojson.properties.id]?.weight || 3}
              onChange={e => updateStyle(geojson.properties.id, "weight", e.target.value)}
              style={{ width: '80px', height: '30px'}}
            />
          </div>
        </>
      )}
    </div>
  );
};

export const ListItemWithStyleControlsRaster = ({
  rasters,
  setRasters,
  raster,
  visibleRasters,
  setVisibleRasters,
  zoomToLayerRaster
}) => {

  const [showStyleControls, setShowStyleControls] = useState(false);

  const handleToggleClick = () => {
    setShowStyleControls(!showStyleControls);
  };

  const dispatch = useDispatch();

  const handleVisibilityChange = (id, isVisible) => {
    setVisibleRasters(prev => ({ ...prev, [id]: isVisible }));
  };
  var url = process.env.PUBLIC_URL
  return (
    <ListItem key={raster.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
         <button 
          className="dropdown-button" 
          onClick={handleToggleClick}
          style={{ visibility: 'visible' }}
          >
          { showStyleControls ? (
            <span className="material-icons">keyboard_arrow_down</span>
          ) :(
            <span className="material-icons">keyboard_arrow_right</span>
          )
          }
        </button>
        <Checkbox
          className='checkbox-button'
          checked={visibleRasters[raster.id] ?? false}
          onClick={() => handleVisibilityChange(raster.id, !(visibleRasters[raster.id] ?? false))}
        />
        <img className="icon-data" src={url + "/raster.png"} alt="raster-item" />
        <ListItemText primary={`${raster.name}`} />
        <button className='zoom-button' onClick={() => zoomToLayerRaster(raster.id)}>
          <span className="material-icons">zoom_in_map</span>
        </button>
        <a href="#" onClick={() => handleDeleteRaster(raster.id,dispatch,rasters,setRasters)}><i className='material-icons'>delete</i></a>
        {showStyleControls && (
        <div style={{ marginTop: '10px' }}>
          <styleRasterControls
          rasters={rasters}
          setRasters={setRasters}
          raster={raster}
          dispatch={dispatch}
          zoomToLayerRaster={zoomToLayerRaster}
          />
        </div>
        )}
      </div>
    </ListItem>
  );
}

export const ListItemWithStyleControls = (
  { 
    geojson, 
    updateStyle, 
    polygonStyles, 
    visibleGeoJSONs, 
    setVisibleGeoJSONs, 
    zoomToLayer 
  }
  ) => {
  const [showStyleControls, setShowStyleControls] = useState(false);

  const dispatch = useDispatch();

  const handleVisibilityChange = (id, isVisible) => {
    setVisibleGeoJSONs(prev => ({ ...prev, [id]: isVisible }));
  };

  const handleToggleClick = () => {
    setShowStyleControls(!showStyleControls);
  };

  const isPoint = geojson.geometry.type === "Point" || geojson.geometry.type === "MultiPoint";
  var url = process.env.PUBLIC_URL
  const zoomanddelete = <>
        <div>
          <button className='zoom-button' onClick={() => zoomToLayer(geojson.properties.id)}>
            <span className="material-icons">zoom_in_map</span>
          </button>
          <a href="#" onClick={() => handleDeleteGeojson(geojson.properties.id,dispatch)}><i className='material-icons'>delete</i></a>
        </div>
        
  </>
  return (
    <ListItem key={geojson.properties.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button 
          className="dropdown-button" 
          onClick={handleToggleClick}
          style={{ visibility: isPoint ? 'hidden' : 'visible' }}>
          { showStyleControls ? (
            <span className="material-icons">keyboard_arrow_down</span>
          ) :(
            <span className="material-icons">keyboard_arrow_right</span>
          )
          }
        </button>
        <Checkbox
          className='checkbox-button'
          checked={visibleGeoJSONs[geojson.properties.id] ?? false}
          onClick={() => handleVisibilityChange(geojson.properties.id, !(visibleGeoJSONs[geojson.properties.id] ?? false))}
        />
        <img className="icon-data" src={url + "/vector.png"} alt="geojson-item" />
       
        
        <ListItemText primary={`${geojson.properties.name}`} />
        {/* <button className='zoom-button' onClick={() => zoomToLayer(geojson.properties.id)}>
          <span className="material-icons">zoom_in_map</span>
        </button>
        <a className="right"  href="#" onClick={() => handleDeleteGeojson(geojson.properties.id,dispatch)}><i className='material-icons'>delete</i></a> */}
      </div>
      {showStyleControls &&(
        <div>
          <StyleControls
            geojson={geojson}
            updateStyle={updateStyle}
            polygonStyles={polygonStyles}
            zoomanddelete={zoomanddelete}
          />
        </div>
      )}
    </ListItem>
  );
};