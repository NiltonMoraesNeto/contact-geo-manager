import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { Button, Grid, TextField } from "@mui/material";
import {
  aplicarMascaraCEP,
  aplicarMascaraCPF,
  aplicarMascaraTelefone,
} from "../utils/mask";
import { MapComponent } from "./map-component";
import { UserFormData, UserList } from "../model/user-model";
import { Icon } from "leaflet";

interface UserEditModeProps {
  control: Control<
    {
      nome: string;
      cpf: string;
      telefone: string;
      cep: string;
      endereco: string;
      numero: string;
      cidade: string;
      estado: string;
      latitude: string;
      longitude: string;
      email: string;
      complemento?: string | undefined;
    },
    unknown,
    {
      nome: string;
      cpf: string;
      telefone: string;
      cep: string;
      endereco: string;
      numero: string;
      cidade: string;
      estado: string;
      latitude: string;
      longitude: string;
      email: string;
      complemento?: string | undefined;
    }
  >;
  errors: FieldErrors<{
    nome: string;
    cpf: string;
    telefone: string;
    cep: string;
    endereco: string;
    numero: string;
    cidade: string;
    estado: string;
    latitude: string;
    longitude: string;
    email: string;
    complemento?: string | undefined;
  }>;
  buscarEndereco: () => Promise<void>;
  user: UserList | undefined;
  customIcon: Icon<{
    iconUrl: string;
    shadowUrl: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
  }>;
  latitude: string;
  longitude: string;
  editMode: true;
  handleSalvar: (data: UserFormData) => Promise<void>;
  handleSubmit: UseFormHandleSubmit<
    {
      nome: string;
      cpf: string;
      telefone: string;
      cep: string;
      endereco: string;
      numero: string;
      cidade: string;
      estado: string;
      latitude: string;
      longitude: string;
      email: string;
      complemento?: string | undefined;
    },
    {
      nome: string;
      cpf: string;
      telefone: string;
      cep: string;
      endereco: string;
      numero: string;
      cidade: string;
      estado: string;
      latitude: string;
      longitude: string;
      email: string;
      complemento?: string | undefined;
    }
  >;
}

export function UserEditMode({
  control,
  errors,
  buscarEndereco,
  user,
  customIcon,
  latitude,
  longitude,
  editMode,
  handleSalvar,
  handleSubmit,
}: UserEditModeProps) {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Nome"
                {...field}
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={5}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="E-mail"
                {...field}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="CPF"
                value={aplicarMascaraCPF(field.value)}
                onChange={(e) =>
                  field.onChange(aplicarMascaraCPF(e.target.value))
                }
                error={!!errors.cpf}
                helperText={errors.cpf?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Controller
            name="telefone"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Telefone"
                value={aplicarMascaraTelefone(field.value)}
                onChange={(e) =>
                  field.onChange(aplicarMascaraTelefone(e.target.value))
                }
                error={!!errors.telefone}
                helperText={errors.telefone?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Controller
            name="cep"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="CEP"
                value={aplicarMascaraCEP(field.value)}
                onChange={(e) =>
                  field.onChange(aplicarMascaraCEP(e.target.value))
                }
                onBlur={() => {
                  field.onBlur();
                  buscarEndereco();
                }}
                error={!!errors.cep}
                helperText={errors.cep?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="endereco"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Endereço"
                {...field}
                disabled
                error={!!errors.endereco}
                helperText={errors.endereco?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name="complemento"
            control={control}
            render={({ field }) => (
              <TextField fullWidth label="Complemento" {...field} />
            )}
          />
        </Grid>
        <Grid item xs={1}>
          <Controller
            name="estado"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Estado"
                {...field}
                disabled
                error={!!errors.estado}
                helperText={errors.estado?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name="numero"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Número"
                {...field}
                onBlur={() => buscarEndereco()}
                error={!!errors.numero}
                helperText={errors.numero?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name="cidade"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Cidade"
                {...field}
                disabled
                error={!!errors.cidade}
                helperText={errors.cidade?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={3}>
          <Controller
            name="latitude"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Latitude"
                {...field}
                disabled
                error={!!errors.latitude}
                helperText={errors.latitude?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name="longitude"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Longitude"
                {...field}
                disabled
                error={!!errors.longitude}
                helperText={errors.longitude?.message}
              />
            )}
          />
        </Grid>
      </Grid>
      <MapComponent
        user={user}
        customIcon={customIcon}
        latitude={latitude}
        longitude={longitude}
        editMode={editMode}
      />
      <Button variant="contained" onClick={handleSubmit(handleSalvar)}>
        Salvar
      </Button>
    </>
  );
}
