import { Typography } from "@mui/material";
import Mapa from "../components/MapContainer";

const HomePage: React.FC = () => {

  return (
    <div>
      <Typography variant="h5" sx={{paddingY: '2px'}}>Guia Plus Mapa</Typography>
      <Mapa />
    </div>
  );
}

export default HomePage