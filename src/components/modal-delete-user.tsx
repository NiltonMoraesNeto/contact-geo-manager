import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface ModalDeleteUserProps {
  userToDelete: string | null;
  closeDeleteDialog: () => void;
  onDelete(id: string, password: string): Promise<void>;
}

export function ModalDeleteUser({
  userToDelete,
  closeDeleteDialog,
  onDelete,
}: ModalDeleteUserProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!password) {
      setError("Por favor, insira sua senha.");
      return;
    }

    try {
      if (userToDelete) {
        await onDelete(userToDelete, password);
        setPassword("");
        setError(null);
      }
    } catch {
      setError("Senha incorreta. Tente novamente.");
    }
  };

  return (
    <Dialog
      open={userToDelete !== null}
      onClose={closeDeleteDialog}
      aria-labelledby="delete-user-dialog-title"
      aria-describedby="delete-user-dialog-description"
    >
      <DialogTitle id="delete-user-dialog-title">Deletar Usuário</DialogTitle>
      <DialogContent>
        <Box mt={1}>
          <Typography color="error" gutterBottom>
            Essa ação não pode ser desfeita.
          </Typography>
          <Typography color="error">
            Tem certeza que deseja deletar o usuário?
          </Typography>
        </Box>

        <Box mt={2}>
          <TextField
            fullWidth
            type="password"
            label="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <DialogActions sx={{ px: 0 }}>
          <Button onClick={closeDeleteDialog}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={!password}
          >
            Deletar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
