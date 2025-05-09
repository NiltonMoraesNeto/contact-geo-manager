import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveUser, updateIdUserCreate } from "../services/usuarios";
import { schemaNewUser } from "../schemas/new-user-schema";
import {
  aplicarMascaraCEP,
  aplicarMascaraCPF,
  aplicarMascaraTelefone,
} from "../utils/mask";
import apiViaCep from "../services/apiViaCep";
import DefaultAlertToast from "./default-alert-toast";
import { useAuth } from "../contexts/auth-context";

type UserFormData = z.infer<typeof schemaNewUser>;

export function ModalCadUser({
  open,
  onClose,
  handleListData,
}: {
  open: boolean;
  onClose: () => void;
  handleListData?: () => void;
}) {
  const [openAlert, setOpenAlert] = useState(false);
  const [msgApi, setMsgApi] = useState("");
  const { dataUser } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(schemaNewUser),
    defaultValues: {
      nome: "",
      cpf: "",
      telefone: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      cidade: "",
      estado: "",
      latitude: "",
      longitude: "",
      password: "",
      email: "",
    },
  });

  const cep = watch("cep");

  const resetarCampos = () => {
    reset();
  };

  const handleFechar = () => {
    resetarCampos();
    onClose();
  };

  useEffect(() => {
    if (!open) resetarCampos();
  }, [open]);

  const buscarEndereco = async () => {
    try {
      // Primeiro, busca os dados do endereço com base no CEP
      const res = await apiViaCep.get(`${cep}/json`);
      const data = res.data;
      if (data.erro) return;

      // Atualiza os campos do formulário com base nos dados retornados
      setValue("endereco", `${data.logradouro}, ${data.bairro}`);
      setValue("cidade", data.localidade);
      setValue("estado", data.uf);

      // Constrói o endereço completo incluindo o número da residência
      const numero = watch("numero"); // Pega o número da residência do formulário
      const enderecoCompleto = numero
        ? `${numero}, ${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`
        : `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;

      // Faz a chamada à API para obter as coordenadas (latitude e longitude)
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          enderecoCompleto
        )}`
      );
      const geoData = await geoRes.json();

      // Atualiza os campos de latitude e longitude no formulário
      if (geoData.length > 0) {
        setValue("latitude", geoData[0].lat);
        setValue("longitude", geoData[0].lon);
      }
    } catch (e) {
      console.error("Erro ao buscar endereço ou localização:", e);
    }
  };

  const handleSalvar = async (data: UserFormData) => {
    const usuario = {
      nome: data.nome,
      cpf: data.cpf,
      telefone: data.telefone,
      cep: data.cep,
      endereco: data.endereco,
      numero: data.numero,
      complemento: data.complemento,
      cidade: data.cidade,
      estado: data.estado,
      latitude: data.latitude,
      longitude: data.longitude,
      password: data.password,
      email: data.email,
      IdUserCreate: dataUser !== undefined ? parseInt(dataUser.id) : 0, // Inicialmente 0 se não houver usuário logado
    };

    try {
      const result = await saveUser(usuario);
      if (!dataUser && result?.newUsuario?.id) {
        const updated = await updateIdUserCreate(
          result.newUsuario.id,
          result.newUsuario.id
        );

        if (updated) {
          console.log("🚀 IdUserCreate atualizado com sucesso:", updated);
        }
      }

      setMsgApi("Usuário salvo com sucesso.");
      setOpenAlert(true);
      handleFechar();

      if (handleListData) {
        handleListData();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any)?.response?.data?.error) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setMsgApi((error as any).response.data.error);
        } else {
          setMsgApi("Ocorreu um erro desconhecido.");
        }
        setOpenAlert(true);
      } else {
        setMsgApi("Ocorreu um erro desconhecido.");
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleFechar} fullWidth maxWidth="sm">
        <DialogTitle>Cadastrar Usuário</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={4}>
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
            <Grid item xs={8}>
              <Controller
                name="complemento"
                control={control}
                render={({ field }) => (
                  <TextField fullWidth label="Complemento" {...field} />
                )}
              />
            </Grid>
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Senha"
                    type="password"
                    {...field}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFechar}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit(handleSalvar)}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      <DefaultAlertToast
        open={openAlert}
        setOpen={setOpenAlert}
        message={msgApi}
        actionLabel=""
      />
    </>
  );
}
