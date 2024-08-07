import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { handleRaster, handleGeojson, handleDrawUpload } from './eventHandler';
import L from 'leaflet';
import * as turf from '@turf/turf';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { updateGeometry } from '../../features/data';


const UpDelButttons = ({
    // setGeoJSONs,
    setRasters,
    mapInstance,
    projectid,  //TODO: Change the way to do this, maybe running two different routes
    setUploading,
    setVectors,
}) => {
    const rasterInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isDrawControlVisible, setIsDrawControlVisible] = useState(false);
    const drawControlRef = useRef(null);

    const dispatch = useDispatch()

    // const { isAuthenticated } = useSelector(state => state.user);

    const handleFileClick = () => {
        fileInputRef.current.click();
    };
    const handleFileClickRaster = () => {
        rasterInputRef.current.click();
    };

    const toggleDrawControl = () => {
        if (isDrawControlVisible) {
            mapInstance.removeControl(drawControlRef.current);
        } else {
            mapInstance.addControl(drawControlRef.current);
        }
        setIsDrawControlVisible(!isDrawControlVisible);
    };

    useEffect(() => {
        if (!mapInstance) return;

        const editableLayers = new L.FeatureGroup().addTo(mapInstance);

        const drawControl = new L.Control.Draw({

            draw: {
                polygon: true,
                polyline: true,
                rectangle: true,
                circle: true,
                marker: true,
            },
            // edit: {
            //     featureGroup: editableLayers,
            // },
        });

        drawControlRef.current = drawControl;

        mapInstance.on(L.Draw.Event.CREATED, async (e) => {
            let layer = e.layer;
            // editableLayers.addLayer(layer);
            if (layer instanceof L.Circle) {
                const center = layer.getLatLng();
                const radius = layer.getRadius();

                const centerPoint = turf.point([center.lng, center.lat]);
                const options = { steps: 60, units: 'kilometers' };

                const buffer = turf.buffer(centerPoint, radius / 1000, options);

                const feature = {
                    type: 'Feature',
                    geometry: buffer.geometry,
                    properties: {},
                };

                const geometryJson = feature;

                await handleDrawUpload(
                    geometryJson,
                    // setGeoJSONs,
                    setVectors,
                    mapInstance,
                    dispatch,
                    projectid,
                    setUploading
                );
            } else {

                const geometryJson = layer.toGeoJSON();

                await handleDrawUpload(
                    geometryJson,
                    // setGeoJSONs,
                    setVectors,
                    mapInstance,
                    dispatch,
                    projectid,
                    setUploading
                );
            }
        });

        mapInstance.on(L.Draw.Event.EDITED, (e) => {
            const layers = e.layers;
            layers.eachLayer((layer) => {
                const updateGeometryAsync = async () => {
                    const geometryJson = layer.toGeoJSON();

                    // Supondo que você tenha o ID e uma função updateGeometry para chamar
                    const geometryId = layer.feature?.properties?.id;
                    if (geometryId) {
                        try {
                            await updateGeometry(geometryJson, geometryId);
                            console.log('Geometry updated successfully');
                        } catch (error) {
                            console.error('Error updating geometry:', error);
                        }
                    }
                };
                updateGeometryAsync();
            });
        });



        return () => {
            if (mapInstance) {
                mapInstance.removeControl(drawControl);
                mapInstance.off(L.Draw.Event.CREATED);
                // mapInstance.off(L.Draw.Event.EDITED);
            }
        };
    }, [mapInstance]);


    return (
        <>
            <div className='custom-draw-button'>
                <a onClick={toggleDrawControl} className='btn-floating btn-color' title='Draw'>
                    <i className="small material-icons">edit</i>
                </a>
            </div>
            <div className="attach-file-button">
                <div className="fixed-action-btn">

                    <a className="btn-floating btn-color">
                        <i className="large material-icons">attach_file</i>
                    </a>
                    <ul>
                        <li>
                            <input
                                type="file"
                                // onChange={handleRaster}
                                onChange={(event) => handleRaster(
                                    event,
                                    setRasters,
                                    mapInstance,
                                    dispatch,
                                    projectid,
                                    setUploading
                                )}
                                ref={rasterInputRef}
                                style={{ display: 'none' }}
                                accept=".tif"
                            />
                            <a
                                className="btn-floating waves-effect waves-light green"
                                data-tooltip="Upload raster"
                                onClick={handleFileClickRaster}
                                title="Upload Raster"
                            >
                                <i className="material-icons">file_upload</i>
                            </a>
                        </li>
                        <li>
                            <input
                                type="file"
                                onChange={(event) => handleGeojson(
                                    event,
                                    //    getCenterOfGeoJSON, 
                                    // setGeoJSONs,
                                    setVectors,
                                    mapInstance,
                                    dispatch,
                                    projectid,
                                    setUploading
                                )}

                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept=".geojson, application/geo+json"
                            />
                            <a
                                className="btn-floating waves-effect waves-light blue"
                                data-tooltip="Upload geojson"
                                onClick={handleFileClick}
                                title='Upload GeoJSON'
                            >
                                <i className="material-icons">file_upload</i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

        </>
    )
}

export default UpDelButttons;