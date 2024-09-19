import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';



const MapClickHandler: React.FC<{ onClick: (position: [number, number]) => void }> = ({ onClick }) => {
  useMapEvents({
    click(event) {
      const { latlng } = event;
      onClick([latlng.lat, latlng.lng]);
    },
  });
  return null;
};


const Mapa: React.FC = () => {
  const position: [number, number] = [-23.55052, -46.633308]; // Coordenadas para São Paulo, Brasil

  const [open, setOpen] = useState(false);
  const [clickedPosition, setClickedPosition] = useState<[number, number] | null>(null);
  const [markers, setMarkers] = useState<[number, number][]>([]);

  const handleMapClick = (position: [number, number]) => {
    setClickedPosition(position);
    setMarkers([...markers, position]);
    //setOpen(true);
  };

  const handleClose = () => {
    //setOpen(false);
    setClickedPosition(null);
  };



  return (
    <>
      <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {
          markers.map((marker, index) => (
            <Marker key={index} position={marker}>
            <Popup>
              Marcador {index + 1}
              <br />
              Latitude: {marker[0]}, Longitude: {marker[1]}
            </Popup>
          </Marker>
          ))
        }
        <MapClickHandler onClick={handleMapClick} />
      </MapContainer>

      {/* Diálogo para mostrar ao clicar no mapa */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Posição Clicada</DialogTitle>
        <DialogContent>
          {clickedPosition && (
            <div>
              <p>Latitude: {clickedPosition[0]}</p>
              <p>Longitude: {clickedPosition[1]}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

    </>

  );
};

export default Mapa;
