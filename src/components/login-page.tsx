import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { ThemeToggle } from "./theme-toogle";
import { fetchLogin } from "../services/usuarios";
import { Button, TextField, Typography } from "@mui/material";
import { ModalResetPassword } from "./modal-reset-password";
import { ModalInputToken } from "./modal-input-token";
import { ModalCadUser } from "./modal-cad-user";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openModalResetPassword, setOpenModalResetPassword] = useState(false);
  const [openModalInputToken, setOpenModalInputToken] = useState(false);
  const [openModalCadUser, setOpenModalCadUser] = useState(false);

  const [tokenIsValid, setTokenIsValid] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await fetchLogin(email, password);

    if (result) {
      const { token } = result;
      login(token);
      navigate("/home");
    } else {
      setError("Email ou senha inválidos");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Coluna esquerda - Roxo  */}
      <div className="hidden w-1/2 flex-col justify-between bg-indigo-600 dark:bg-indigo-900 p-12 text-white md:flex h-full">
        <div>
          <div className="flex items-center gap-2">
            <Typography variant="h5" gutterBottom>
              Nilton Moraes Neto <ThemeToggle />
            </Typography>
          </div>
        </div>
        <div className="space-y-6">
          <Typography variant="h4" gutterBottom>
            UEX
          </Typography>
          <div>
            <Typography variant="body1" gutterBottom>
              Não tem conta criada?
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              className="border-white text-white hover:bg-white/10 hover:text-white"
              onClick={() => setOpenModalCadUser(true)}
            >
              Criar
            </Button>
          </div>
        </div>
        <div></div>
      </div>

      {/* Coluna direita - Branco */}
      <div className="flex w-full flex-col items-center justify-center bg-white dark:bg-indigo-950 p-6 md:w-1/2 md:p-12 h-full">
        <div className="w-full max-w-md">
          <div className="text-center">
            <Typography
              variant="h5"
              gutterBottom
              className="text-indigo-600"
              sx={{ fontWeight: "bold" }}
            >
              ENTRAR
            </Typography>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@gmail.com"
                  className="border-indigo-200 focus-visible:ring-indigo-500 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <TextField
                  fullWidth
                  margin="normal"
                  label="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="border-indigo-200 focus-visible:ring-indigo-500 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="text"
                  color="warning"
                  size="small"
                  onClick={() => setOpenModalResetPassword(true)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    mt: 1,
                    "&:hover": { color: "#ff9800" },
                  }}
                >
                  Esqueceu a senha?
                </Button>
                <Button
                  variant="text"
                  color="warning"
                  size="small"
                  onClick={() => setOpenModalInputToken(true)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    mt: 1,
                    "&:hover": { color: "#ff9800" },
                  }}
                >
                  Resetar a senha
                </Button>
                <ModalResetPassword
                  openModalResetPassword={openModalResetPassword}
                  setOpenModalResetPassword={setOpenModalResetPassword}
                  setOpenModalInputToken={setOpenModalInputToken}
                />
                <ModalInputToken
                  openModalInputToken={openModalInputToken}
                  setOpenModalInputToken={setOpenModalInputToken}
                  tokenIsValid={tokenIsValid}
                  setTokenIsValid={setTokenIsValid}
                />
                <ModalCadUser
                  open={openModalCadUser}
                  onClose={() => setOpenModalCadUser(false)}
                />
              </div>
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              className="w-full bg-indigo-500 text-white hover:bg-indigo-600"
            >
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
