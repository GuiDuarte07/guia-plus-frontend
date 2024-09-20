import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { reverseGeocode } from "../services/addressService";
import CreateGuiaDialog from "./CreateGuiaDialog";
import { Endereco } from "../interfaces/Endereco";
import { GuiaResponse } from "../DTOs/Guia/GuiaResponse";
import GuiaService from "../services/GuiaService";
import { Button, Container, Divider, Typography } from "@mui/material";
import { StatusGuia } from "../enums/StatusGuia";
import ClienteService from "../services/ClienteService";

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
  const position: [number, number] = [-23.55052, -46.633308];
  const [open, setOpen] = useState(false);
  const [clickedPosition, setClickedPosition] = useState<[number, number] | null>(null);
  const [guias, setGuias] = useState<GuiaResponse[]>([]);
  const [endereco, setEndereco] = useState<Endereco | null>(null);
  const [selectPositionGuiaEnderecoId, setSelectPositionGuiEnderecoId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleMapClick = async (position: [number, number]) => {
    if (isEditing) {
      setIsEditing(false);
      return;
    }

    if (selectPositionGuiaEnderecoId === null) {
      setClickedPosition(position);
      setOpen(true);
      try {
        const { address } = await reverseGeocode(position[0], position[1]);
        const cep = address.postcode?.replace(/\D/g, "") || "";
        setEndereco({
          bairro: "",
          cep,
          cidade: address.city || address.town || "",
          logradouro: address.road || "",
          complemento: "",
          numero: "",
        } as Endereco);
      } catch {
        setEndereco(null);
      }
    } else {
      try {
        await ClienteService.updateEnderecoPosition({
          id: selectPositionGuiaEnderecoId!,
          latitude: position[0],
          longitude: position[1],
        });
        setSelectPositionGuiEnderecoId(null);
        updateGuias();
      } catch {
        alert("Erro ao editar a posição de endereço");
      }
    }
  };

  const updateGuias = async () => {
    const guias = await GuiaService.getAllGuias();
    setGuias(guias);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setClickedPosition(null);
    setEndereco(null);
    setIsEditing(false);
    updateGuias();
  };

  const handleUpdateGuiaStatus = async (guiaId: number, status: StatusGuia) => {
    try {
      await GuiaService.updateGuiaStatus({ id: guiaId, status });
      updateGuias();
    } catch {
      alert(`Erro ao atualizar a guia id = ${guiaId}`);
    }
  };

  const handleDeleteGuia = async (guiaId: number) => {
    try {
      await GuiaService.deleteGuia(guiaId);
      updateGuias();
    } catch {
      alert(`Erro ao excluir a guia id = ${guiaId}`);
    }
  };

  const handleActiveSelectEnderecoPosition = (enderecoId: number) => {
    setIsEditing(true);
    setSelectPositionGuiEnderecoId(enderecoId);
  };

  useEffect(() => {
    updateGuias();
  }, []);

  return (
    <>
      <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectPositionGuiaEnderecoId === null && guias.map((guia) => (
          <Marker
            key={guia.id}
            position={[guia.clienteEndereco.latitude, guia.clienteEndereco.longitude]}
          >
            <Popup>
              <Container>
                <Typography variant="subtitle1">{guia.cliente.nomeCompleto}</Typography>
                <Typography variant="body2">
                  {`${guia.clienteEndereco.logradouro}, ${guia.clienteEndereco.numero} - ${guia.clienteEndereco.bairro}, ${guia.clienteEndereco.cidade}`}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1">Serviço: {guia.servico.nome}</Typography>
                <Container sx={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                  {guia.status === StatusGuia.NOVO && (
                    <>
                      <Button variant="contained" color="primary" size="small" sx={{ minWidth: "80px", fontSize: "0.75rem", marginRight: "8px" }} onClick={() => handleUpdateGuiaStatus(guia.id, StatusGuia.INICIOU_COLETA)}>
                        Iniciar
                      </Button>
                      <Button variant="outlined" color="secondary" size="small" sx={{ minWidth: "80px", fontSize: "0.75rem" }} onClick={() => handleDeleteGuia(guia.id)}>
                        Excluir
                      </Button>
                    </>
                  )}
                  {guia.status === StatusGuia.INICIOU_COLETA && (
                    <>
                      <Button variant="contained" color="primary" size="small" sx={{ minWidth: "80px", fontSize: "0.75rem", marginRight: "8px" }} onClick={() => handleUpdateGuiaStatus(guia.id, StatusGuia.CONFIRMOU_RETIRADA)}>
                        Confirmar Retirada
                      </Button>
                      <Button variant="outlined" color="secondary" size="small" sx={{ minWidth: "80px", fontSize: "0.75rem" }} onClick={() => handleActiveSelectEnderecoPosition(guia.clienteEndereco.id)}>
                        Editar Endereço
                      </Button>
                    </>
                  )}
                </Container>
              </Container>
            </Popup>
          </Marker>
        ))}
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
