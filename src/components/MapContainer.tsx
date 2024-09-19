import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { reverseGeocode } from '../services/addressService';
import CreateGuiaDialog from './CreateGuiaDialog';
import { Endereco } from '../interfaces/Endereco';


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
  const [endereco, setEndereco] = useState<Endereco | null>(null);

  const handleMapClick = async (position: [number, number]) => {
    setClickedPosition(position);
    setMarkers([...markers, position]);
    setOpen(true);

    try {
      const geocodedData = await reverseGeocode(position[0], position[1]);
      const adrs = geocodedData.address;
      const cep = adrs.postcode ?? '';
      const onlyNumbersCep = cep.replace(/\D/g, '');

      setEndereco({
        bairro: "",
        cep: onlyNumbersCep,
        cidade: adrs.city ?? adrs.town ?? '',
        logradouro: adrs.road ?? '',
        complemento: '',
        numero: ''
      } as  Endereco);
    } catch {
      setEndereco(null);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setClickedPosition(null);
    setEndereco(null);
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

      {clickedPosition && endereco && (
        <CreateGuiaDialog
          open={open}
          onClose={handleCloseDialog}
          endereco={endereco}
          latitude={clickedPosition[0]}
          longitude={clickedPosition[1]}
        />
      )}

    </>

  );
};

export default Mapa;
