// AddressDialog.tsx
import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Endereco } from '../interfaces/Endereco';
import { fetchCep } from '../services/api/viaCep';

interface AddressDialogProps {
  open: boolean;
  onClose: () => void;
  endereco: Endereco;
  latitude: number;
  longitude: number;
}

const CreateGuiaDialog: React.FC<AddressDialogProps> = ({ open, onClose, endereco, latitude, longitude }) => {
  const { control, handleSubmit, formState: { errors }, setValue, watch  } = useForm<Endereco>({
    defaultValues: endereco,
  });

  const cepValue = watch('cep');

  useEffect(() => {
    async function fetchAddress() {
      if (cepValue && cepValue.length === 8) {
        const updateEndereco = await fetchCep(cepValue);

        if (updateEndereco) {
          setValue('logradouro', updateEndereco.logradouro);
          setValue('bairro', updateEndereco.bairro);
          setValue('cidade', updateEndereco.localidade);
        }
      }
    }

    fetchAddress();
  }, [cepValue, setValue]); // Escuta as alterações no valor do CEP

  console.log(latitude, longitude);

  const onSubmit: SubmitHandler<Endereco> = (data) => {
    // Handle form submission here
    console.log('Form Data:', data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalhes do Endereço</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="cep"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="CEP"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.cep}
                helperText={errors.cep ? 'CEP é obrigatório' : ''}
              />
            )}
            rules={{ required: 'CEP é obrigatório' }}
          />
          <Controller
            name="logradouro"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Logradouro"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.logradouro}
                helperText={errors.logradouro ? 'Logradouro é obrigatório' : ''}
              />
            )}
            rules={{ required: 'Logradouro é obrigatório' }}
          />
          <Controller
            name="bairro"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Bairro"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.bairro}
                helperText={errors.bairro ? 'Bairro é obrigatório' : ''}
              />
            )}
            rules={{ required: 'Bairro é obrigatório' }}
          />
          <Controller
            name="cidade"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Cidade"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.cidade}
                helperText={errors.cidade ? 'Cidade é obrigatória' : ''}
              />
            )}
            rules={{ required: 'Cidade é obrigatória' }}
          />
          <Controller
            name="complemento"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Complemento"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
          />
          <Controller
            name="numero"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Número"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.numero}
                helperText={errors.numero ? 'Número é obrigatório' : ''}
              />
            )}
            rules={{ required: 'Número é obrigatório' }}
          />
          <DialogActions>
            <Button type="submit" color="primary">
              Salvar
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
