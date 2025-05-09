import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSendToken } from "../services/usuarios";
import { schemaResetPassword } from "../schemas/reset-password-schema";
import { useUserStore } from "../stores/use-user";
import DefaultAlertToast from "./default-alert-toast";

interface ModalResetPasswordProps {
  openModalResetPassword: boolean;
  setOpenModalResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModalInputToken: (value: React.SetStateAction<boolean>) => void;
}

export function ModalResetPassword({
  openModalResetPassword,
  setOpenModalResetPassword,
  setOpenModalInputToken,
}: ModalResetPasswordProps) {
  const updateEmailUser = useUserStore((state) => state.updateEmailUser);
  const [openAlert, setOpenAlert] = useState(false);
  const [msgApi, setMsgApi] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schemaResetPassword>>({
    resolver: zodResolver(schemaResetPassword),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmitResetPassword: SubmitHandler<{ email: string }> = async (
    data
  ) => {
    try {
      updateEmailUser(data.email);
      const response = await resetPasswordSendToken(data.email);

      if (response) {
        localStorage.setItem("resetCode", response.resetCode);
        setMsgApi("Token enviado com sucesso");
        setOpenAlert(true);
        setValue("email", "");
        setOpenModalResetPassword(false);
        setOpenModalInputToken(true);
      } else {
        setMsgApi("Email não encontrado");
        setOpenAlert(true);
      }
    } catch (error) {
      console.error("Erro ao enviar solicitação", error);
      setMsgApi("Email não encontrado");
      setOpenAlert(true);
    }
  };

  const handleClose = () => {
    setOpenModalResetPassword(false);
  };

  return (
    <>
      <Dialog
        open={openModalResetPassword}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Resetar a senha</DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Digite seu email cadastrado para receber o token de validação.
          </DialogContentText>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                margin="normal"
                type="email"
                placeholder="Digite seu email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Typography variant="body2" sx={{ mt: 2 }}>
            <Link
              component="button"
              variant="body2"
              underline="hover"
              onClick={() => {
                handleClose();
                setOpenModalInputToken(true);
              }}
            >
              Já tem o token? Clique aqui para validar e trocar a senha
            </Link>
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(handleSubmitResetPassword)}
            variant="contained"
          >
            Enviar
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
