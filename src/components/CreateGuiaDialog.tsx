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
import { useForm, Controller } from "react-hook-form";
import { Endereco } from "../interfaces/Endereco";
import { fetchCep } from "../services/api/viaCep";
import { ClienteCreateRequest } from "../DTOs/Cliente/ClienteCreateRequest";
import { ServicoCreateRequest } from "../DTOs/Servico/ServicoCreateRequest";
import ClienteService from "../services/ClienteService";
import GradientSearchButton from "./GradientSearchButton";
import { ClienteDetailsResponse } from "../DTOs/Cliente/ClienteDetailsResponse";
import { ServicoResponse } from "../DTOs/Servico/ServicoResponse";
import GuiaService from "../services/GuiaService";
import ServicoService from "../services/servicoService";

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
    formState: { errors, touchedFields },
    setValue,
    watch,
    getValues,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      nomeCompleto: "",
      cpf_cnpj: "",
      telefone: "",
      email: "",
      cep: endereco.cep ?? "ewewewewewe",
      cidade: endereco.cidade ?? "",
      logradouro: endereco.logradouro ?? "",
      bairro: endereco.bairro ?? "",
      complemento: endereco.complemento ?? "",
      numero: endereco.numero ?? "",
      nome: "",
    },
  });

  //Atributos de cliente
  const cpf_cnpjValue = watch("cpf_cnpj");
  const [createNewCliente, setCreateNewCliente] = useState(true);
  const [cliente, setCliente] = useState<ClienteDetailsResponse | null>(null);

  //Atributos de endereco
  const cepValue = watch("cep");
  const [enderecoSelecionado, setEnderecoSelecionado] = useState("");

  //Atributos de servico
  const [servicos, setServicos] = useState<ServicoResponse[]>([]);
  const [selectedServico, setSelectedServico] = useState("");

  const validators = {
    validateCpfCnpj: (value: string) => {
      const cpfCnpjRegex = /^\d+$/;
      if (cpfCnpjRegex.test(value) && (value.length === 11 || value.length === 14)) return true;
      return "CPF deve ter 11 dígitos ou CNPJ 14 dígitos.";
    },
  
    validateTelefone: (value: string) => {
      const telefoneRegex = /^\d{2}\d{8,9}$/;
      if (telefoneRegex.test(value)) return true;
      return "Telefone deve ter DDD e 9 ou 8 dígitos.";
    },
  
    validateCep: (value: string) => {
      const cepRegex = /^\d{8}$/;
      if (cepRegex.test(value)) return true;
      return "CEP deve ter 8 dígitos.";
    },
  };

  const isStepValid = (step: number): boolean => {
    if (step === 0) {
      if (typeof cliente?.id === 'number') return true;
      if(errors.cpf_cnpj || errors.email || errors.nomeCompleto || errors.telefone) return false;
      if(touchedFields.cpf_cnpj && touchedFields.email && touchedFields.nomeCompleto && touchedFields.telefone) return true;
      return false;
    }
    if (step === 1) {
      if (enderecoSelecionado !== '') return true;
      if (errors.bairro || errors.cep || errors.cidade || errors.logradouro || errors.numero) return false;
      if (
        (touchedFields.bairro || getValues('bairro') !== '') && 
        (touchedFields.cep || getValues('cep') !== '') && 
        (touchedFields.cidade || getValues('cidade') !== '') && 
        (touchedFields.logradouro || getValues('logradouro') !== '') && 
        (touchedFields.numero || getValues('numero') !== '')) 
          {
            console.log('touched')
            return true;

          }
      
      return false;
    }
    
    if (selectedServico !== '' || getValues('nome') !== '') return true;

    return false;
  };

  const formMethods: {
    handleBack: () => void;
    handleNext: () => Promise<void>;
    onSubmit: () => Promise<void>;
  } = {
    handleBack: () => setActiveStep((prevStep) => prevStep - 1),
    onSubmit: async () => {
      if (activeStep !== 2) return;

      if (!cliente?.id || enderecoSelecionado === "") {
        alert("dados inválidos.");
      }

      const clienteId = cliente!.id;
      const clienteEnderecoId = parseInt(enderecoSelecionado);
      let servicoId: number;

      if (selectedServico === "") {
        const newServico = await createServico();
        servicoId = newServico.id;
      } else {
        servicoId = parseInt(selectedServico);
      }

      const newGuia = await GuiaService.createGuia({
        clienteEnderecoId,
        clienteId,
        servicoId,
      });

      if (newGuia) {
        onClose();
      }
    },
    handleNext: async () => {
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
            setEnderecoSelecionado("");
            setActiveStep((prevStep) => prevStep + 1);

            console.log(newCliente);
          }
        } else {
          setActiveStep((prevStep) => prevStep + 1);
        }
      }

      if (activeStep === 1) {
        if (enderecoSelecionado === "") {
          const newEndereco = await ClienteService.createEndereco({
            bairro: getValues("bairro"),
            cep: getValues("cep"),
            cidade: getValues("cidade"),
            complemento: getValues("complemento"),
            logradouro: getValues("logradouro"),
            numero: getValues("numero"),
            latitude,
            longitude,
            clienteId: cliente!.id,
          });

          if (newEndereco) {
            setEnderecoSelecionado(newEndereco.id.toString());
            setCliente((cliente) => {
              if (cliente) {
                const updatedCliente = {
                  ...cliente,
                  clienteEnderecos: [
                    ...cliente.clienteEnderecos,
                    { ...newEndereco },
                  ],
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

      if (activeStep === 2) {
        await formMethods.onSubmit();
      }
    },
  };

  //Métodos de cliente
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

  //Métodos de endereço
  function handleEnderecoChange(value: string | number) {
    console.log(value);
    setEnderecoSelecionado(value.toString());
  }

  //Métodos de serviços
  const handleServiceChange = (value: string) => {
    setSelectedServico(value);
  };

  const createServico: () => Promise<ServicoResponse> = async () => {
    return await ServicoService.createService({
      nome: getValues("nome"),
    });
  };

  //useEffects
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

  useEffect(() => {
    async function getServicos() {
      if (activeStep == 2 && servicos.length === 0) {
        const servicosList = await ServicoService.getAllServicos();
        setServicos(servicosList);
      }
    }
    getServicos();
  }, [activeStep, servicos.length]);

  useEffect(() => {
    setCreateNewCliente(true);
  }, [cpf_cnpjValue]);

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
              helperText={errors.cpf_cnpj?.message}
            />
          )}
          rules={{ 
            required: "CPF/CNPJ é obrigatório",
            validate: validators.validateCpfCnpj 
          }}
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
                errors.nomeCompleto?.message
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
              helperText={errors.email?.message}
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
              helperText={errors.telefone?.message}
            />
          )}
          rules={{ required: "Telefone é obrigatório", validate: validators.validateTelefone }}
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
                  helperText={errors.cep?.message}
                  disabled={enderecoSelecionado !== ""}
                />
              )}
              rules={{ required: "CEP é obrigatório", validate: validators.validateCep }}
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
                    errors.logradouro?.message
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
                  helperText={errors.bairro?.message}
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
                  helperText={errors.cidade?.message}
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
                  helperText={errors.numero?.message}
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

  const step2Form = (
    <>
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
                  value={selectedServico}
                  onChange={(e) => handleServiceChange(e.target.value)}
                >
                  {servicos.map((servico) => (
                    <MenuItem key={servico.id} value={servico.id}>
                      {servico.nome}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Box position="relative">
          {selectedServico !== "" && (
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
              onClick={() => setSelectedServico("")}
            >
              <Typography variant="subtitle2">
                Clique para adicionar um novo serviço
              </Typography>
            </Box>
          )}
          <Grid
            container
            spacing={2}
            sx={{ opacity: selectedServico !== "" ? 0.5 : 1, paddingY: 2 }}
          >
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
                    helperText={
                      errors.nome?.message
                    }
                    disabled={selectedServico !== ""}
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
  );

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
        <form>
          <Grid container spacing={2} style={{ marginTop: 16 }}>
            {activeStep === 0 && step0Form}
            {activeStep === 1 && step1Form}
            {activeStep === 2 && step2Form}
          </Grid>
          <DialogActions>
            {activeStep > 0 && (
              <Button onClick={formMethods.handleBack} color="secondary">
                Voltar
              </Button>
            )}
            <Button disabled={!isStepValid(activeStep)} onClick={formMethods.handleNext} color="primary">
              {(createNewCliente && activeStep === 0) ||
              (enderecoSelecionado === "" && activeStep === 1)
                ? "Criar"
                : activeStep === 2
                ? "Salvar"
                : "Próximo"}
            </Button>
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
