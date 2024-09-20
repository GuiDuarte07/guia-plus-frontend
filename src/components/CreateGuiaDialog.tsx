import Grid from "@mui/material/Grid2";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Endereco } from "../interfaces/Endereco";
import { fetchCep } from "../services/api/viaCep";
import { ClienteCreateRequest } from "../DTOs/Cliente/ClienteCreateRequest";
import { ServicoCreateRequest } from "../DTOs/Servico/ServicoCreateRequest";
import ClienteService from "../services/ClienteService";
import GradientSearchButton from "./GradientSearchButton";
import { ClienteDetailsResponse } from "../DTOs/Cliente/ClienteDetailsResponse";
import { ServicoResponse } from "../DTOs/Servico/ServicoResponse";

interface AddressDialogProps {
  open: boolean;
  onClose: () => void;
  endereco: Endereco;
  latitude: number;
  longitude: number;
}

interface FormData
  extends Endereco,
    ClienteCreateRequest,
    ServicoCreateRequest {}

const steps = ["Criar Cliente", "Criar Endereço", "Criar Serviço"];

const CreateGuiaDialog: React.FC<AddressDialogProps> = ({
  open,
  onClose,
  endereco,
  latitude,
  longitude,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      nomeCompleto: "",
      cpf_cnpj: "",
      telefone: "",
      email: "",
      cep: endereco.cep ?? "",
      cidade: endereco.cidade ?? "",
      logradouro: endereco.logradouro ?? "",
      bairro: endereco.bairro ?? "",
      complemento: endereco.complemento ?? "",
      numero: endereco.numero ?? "",
      nome: "",
    },
  });

  const [enderecoSelecionado, setEnderecoSelecionado] = useState("");

  const [createNewCliente, setCreateNewCliente] = useState(true);
  const [cliente, setCliente] = useState<ClienteDetailsResponse | null>(null);

  const [servicos, setServicos] = useState<ServicoResponse[]>([]);
  const [selectedService, setSelectedService] = useState("");

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
  };

  const handleNewService = () => {
    setSelectedService('');
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      if (createNewCliente) {
        const newCliente = await ClienteService.createCliente({
          cpf_cnpj: getValues("cpf_cnpj"),
          email: getValues("email"),
          nomeCompleto: getValues("nomeCompleto"),
          telefone: getValues("telefone"),
        });

        if (newCliente) {
          setCreateNewCliente(false);
          setCliente(newCliente);
          setEnderecoSelecionado('');
          setActiveStep((prevStep) => prevStep + 1);

          console.log(newCliente);
        }
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }

    if (activeStep === 1) {
      if (enderecoSelecionado === '') {
        const newEndereco = await ClienteService.createEndereco({
          bairro: getValues("bairro"),
          cep: getValues("cep"),
          cidade: getValues("cidade"),
          complemento: getValues("complemento"),
          logradouro: getValues("logradouro"),
          numero: getValues("numero"),
          latitude,
          longitude,
          clienteId: cliente!.id
        });

        if(newEndereco) {
          setEnderecoSelecionado(newEndereco.id.toString());
          setCliente((cliente) => {
            if (cliente) {
              const updatedCliente = {
                ...cliente,
                clienteEnderecos: [
                  ...cliente.clienteEnderecos,
                  { ...newEndereco }
                ]
              };
          
              return updatedCliente;
            }
            return cliente;
          });
          setActiveStep((prevStep) => prevStep + 1);
        }
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    alert("Form Data:");
    //onClose();
  };

  const cepValue = watch("cep");
  const cpf_cnpjValue = watch("cpf_cnpj");

  useEffect(() => {
    async function fetchAddress() {
      if (cepValue && cepValue.length === 8) {
        const updateEndereco = await fetchCep(cepValue);

        if (updateEndereco) {
          setValue("logradouro", updateEndereco.logradouro);
          setValue("bairro", updateEndereco.bairro);
          setValue("cidade", updateEndereco.localidade);
        }
      }
    }

    fetchAddress();
  }, [cepValue, setValue]);

  async function findCliente() {
    const cliente = await ClienteService.getClienteByCpfCnpj(cpf_cnpjValue);
    if (cliente) {
      setValue("nomeCompleto", cliente.nomeCompleto);
      setValue("telefone", cliente.telefone);
      setValue("email", cliente.email);

      setCreateNewCliente(false);
      setCliente(cliente);
    }
  }

  useEffect(() => {
    if (activeStep == 2 && servicos.length === 0) {
      
    }
  },[activeStep])

  useEffect(() => {
    setCreateNewCliente(true);
  }, [cpf_cnpjValue]);

  function handleEnderecoChange(value: string | number) {
    console.log(value);
    setEnderecoSelecionado(value.toString());
  }

  const step0Form = (
    <>
      <Grid size={12}>
        <Typography variant="h6">Dados do Cliente</Typography>
      </Grid>
      <Grid size={4}>
        <Controller
          name="cpf_cnpj"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="CPF/CNPJ"
              fullWidth
              size="small"
              variant="outlined"
              error={!!errors.cpf_cnpj}
              helperText={errors.cpf_cnpj ? "CPF/CNPJ é obrigatório" : ""}
            />
          )}
          rules={{ required: "CPF/CNPJ é obrigatório" }}
        />
      </Grid>
      <Grid size={1}>
        <GradientSearchButton onClick={findCliente} />
      </Grid>
      <Grid size={7}>
        <Controller
          name="nomeCompleto"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              disabled={!createNewCliente}
              label="Nome Completo"
              fullWidth
              size="small"
              variant="outlined"
              error={!!errors.nomeCompleto}
              helperText={
                errors.nomeCompleto ? "Nome Completo é obrigatório" : ""
              }
            />
          )}
          rules={{ required: "Nome Completo é obrigatório" }}
        />
      </Grid>
      <Grid size={8}>
        <Controller
          name="email"
          disabled={!createNewCliente}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              size="small"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email ? "Email é obrigatório" : ""}
            />
          )}
          rules={{ required: "Email é obrigatório" }}
        />
      </Grid>
      <Grid size={4}>
        <Controller
          name="telefone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Telefone"
              disabled={!createNewCliente}
              fullWidth
              size="small"
              variant="outlined"
              error={!!errors.telefone}
              helperText={errors.telefone ? "Telefone é obrigatório" : ""}
            />
          )}
          rules={{ required: "Telefone é obrigatório" }}
        />
      </Grid>
    </>
  );

  const step1Form = (
    <>
      <Grid size={12}>
        <Typography variant="subtitle1">Dados de Endereço</Typography>
      </Grid>
      <Grid size={12}>
        <div>
          <Typography variant="subtitle1">
            Selecione um endereço para esse cliente
          </Typography>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="endereco-label">Endereço</InputLabel>
              <Select
                size="small"
                labelId="endereco-label"
                id="endereco-selection"
                value={enderecoSelecionado}
                label="Endereço"
                onChange={(e) => handleEnderecoChange(e.target.value)}
              >
                {cliente?.clienteEnderecos?.length ? (
                  cliente.clienteEnderecos.map((endereco) => (
                    <MenuItem key={endereco.id} value={endereco.id}>
                      {`${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}`}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Nenhum endereço cadastrado</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        </div>
      </Grid>

      <Grid sx={{ padding: 0, margin: 0 }} padding={0} size={12}>
        <div className="">
          <Typography variant="subtitle1">Ou crie um novo</Typography>
        </div>
      </Grid>

      <Box position="relative">
        {enderecoSelecionado !== "" && (
          <Box
            onClick={() => setEnderecoSelecionado("")}
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="rgba(200, 200, 200, 0.7)"
            zIndex={1}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6">
              Clique para adicionar um novo endereço
            </Typography>
          </Box>
        )}

        {/* Form fields */}
        <Grid
          container
          spacing={2}
          sx={{ opacity: enderecoSelecionado !== "" ? 0.5 : 1 }}
        >
          <Grid size={3}>
            <Controller
              name="cep"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="CEP"
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={!!errors.cep}
                  helperText={errors.cep ? "CEP é obrigatório" : ""}
                  disabled={enderecoSelecionado !== ""}
                />
              )}
              rules={{ required: "CEP é obrigatório" }}
            />
          </Grid>
          <Grid size={9}>
            <Controller
              name="logradouro"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Logradouro"
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={!!errors.logradouro}
                  helperText={
                    errors.logradouro ? "Logradouro é obrigatório" : ""
                  }
                  disabled={enderecoSelecionado !== ""}
                />
              )}
              rules={{ required: "Logradouro é obrigatório" }}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="bairro"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Bairro"
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={!!errors.bairro}
                  helperText={errors.bairro ? "Bairro é obrigatório" : ""}
                  disabled={enderecoSelecionado !== ""}
                />
              )}
              rules={{ required: "Bairro é obrigatório" }}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="cidade"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cidade"
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={!!errors.cidade}
                  helperText={errors.cidade ? "Cidade é obrigatória" : ""}
                  disabled={enderecoSelecionado !== ""}
                />
              )}
              rules={{ required: "Cidade é obrigatória" }}
            />
          </Grid>
          <Grid size={9}>
            <Controller
              name="complemento"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Complemento"
                  fullWidth
                  size="small"
                  variant="outlined"
                  disabled={enderecoSelecionado !== ""}
                />
              )}
            />
          </Grid>
          <Grid size={3}>
            <Controller
              name="numero"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Número"
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={!!errors.numero}
                  helperText={errors.numero ? "Número é obrigatório" : ""}
                  disabled={enderecoSelecionado !== ""}
                />
              )}
              rules={{ required: "Número é obrigatório" }}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );

  const step2Form =  <>
  <Grid container spacing={2}>
    <Grid size={12}>
      <Typography variant="subtitle1">Dados do Serviço</Typography>
    </Grid>
    <Grid size={12}>
      <FormControl fullWidth size="small">
        <InputLabel id="servico-label">Nome do Serviço</InputLabel>
        <Controller
          name="nome"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              {...field}
              labelId="servico-label"
              label="Nome do Serviço"
              value={selectedService}
              onChange={(e) => handleServiceChange(e.target.value)}
            >
              <MenuItem value="servico1">Serviço 1</MenuItem>
              <MenuItem value="servico2">Serviço 2</MenuItem>
            </Select>
          )}
        />
      </FormControl>
    </Grid>

    <Box position="relative">
      {selectedService !== "" && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="rgba(200, 200, 200, 0.7)"
          zIndex={1}
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedService('')}
        >
          <Typography variant="subtitle2">
            Clique para adicionar um novo serviço
          </Typography>
        </Box>
      )}
      <Grid container spacing={2} sx={{ opacity: selectedService !== "" ? 0.5 : 1, paddingY: 2 }}>
        <Grid size={12}>
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome do Serviço"
                fullWidth
                size="small"
                variant="outlined"
                error={!!errors.nome}
                helperText={errors.nome ? "Nome do serviço é obrigatório" : ""}
                disabled={selectedService !== ""}
              />
            )}
            rules={{ required: "Nome do serviço é obrigatório" }}
          />
        </Grid>
        {/* Adicione outros campos do formulário conforme necessário */}
      </Grid>
    </Box>
  </Grid>
</>

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Criação de nova Guia</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} style={{ marginTop: 16 }}>
            {activeStep === 0 && step0Form}
            {activeStep === 1 && step1Form}
            {activeStep === 2 && step2Form}
          </Grid>
          <DialogActions>
            {activeStep > 0 && (
              <Button onClick={handleBack} color="secondary">
                Voltar
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button onClick={handleNext} color="primary">
                {createNewCliente && activeStep === 0 || enderecoSelecionado === "" && activeStep === 1
                  ? "Criar"
                  : "Próximo"}
              </Button>
            ) : (
              <Button type="submit" color="primary">
                Salvar
              </Button>
            )}
            <Button onClick={onClose} color="secondary">
              Fechar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGuiaDialog;
