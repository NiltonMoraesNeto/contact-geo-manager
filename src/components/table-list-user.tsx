import React, { useState } from "react";
import { UserList } from "../model/user-model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { deleteUser } from "../services/usuarios";
import { isSuccessRequest } from "../utils/response-request";
import { useNavigate } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import { ModalDeleteUser } from "./modal-delete-user";
import DefaultAlertToast from "./default-alert-toast";
import { useAuth } from "../contexts/auth-context";

interface TableUsersListProps {
  userList: UserList[];
  handleListData: () => void;
}

export function TableUsersList({
  userList,
  handleListData,
}: TableUsersListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUserId, setMenuUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [msgApi, setMsgApi] = useState("");
  const navigate = useNavigate();
  const { logout, dataUser } = useAuth();

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    userId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuUserId(userId);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuUserId(null);
  };

  const handleEdit = (id: string) => {
    navigate(`/user/edit/${id}`);
  };

  const openDeleteDialog = (id: string) => {
    setUserToDelete(id);
    handleCloseMenu();
  };
  const closeDeleteDialog = () => setUserToDelete(null);

  async function onDelete(id: string, password: string) {
    try {
      const response = await deleteUser(
        id,
        password,
        parseInt(dataUser?.id || "0")
      );
      if (response && isSuccessRequest(response.status)) {
        setMsgApi("Usuário deletado com sucesso");
        setOpenAlert(true);
        closeDeleteDialog();
        handleListData();
        if (dataUser?.id === id) {
          logout();
          navigate("/login");
        }
      } else {
        setMsgApi("Erro ao deletar o Usuário");
        setOpenAlert(true);
      }
    } catch (error) {
      console.error("Erro ao deletar Usuário:", error);
      setMsgApi("Erro ao deletar o Usuário");
      setOpenAlert(true);
    }
  }

  return (
    <Box overflow="auto">
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          borderRadius: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#312e81" : "#fefefe",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {["ID", "Nome", "Email", "CEP", "Ação"].map((header) => (
                <TableCell key={header}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {header}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map((user) => (
              <TableRow
                key={user.id}
                hover
                sx={{ "&:hover": { backgroundColor: "action.hover" } }}
              >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.nome}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.cep}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => handleOpenMenu(e, user.id.toString())}
                  >
                    <EllipsisVertical />
                  </Button>
                  <Menu
                    id="split-button-menu"
                    anchorEl={anchorEl}
                    open={menuUserId === user.id.toString()}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem onClick={() => handleEdit(user.id.toString())}>
                      Editar
                    </MenuItem>
                    <MenuItem
                      onClick={() => openDeleteDialog(user.id.toString())}
                    >
                      Deletar
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <ModalDeleteUser
        userToDelete={userToDelete}
        closeDeleteDialog={closeDeleteDialog}
        onDelete={onDelete}
      />

      <DefaultAlertToast
        open={openAlert}
        setOpen={setOpenAlert}
        message={msgApi}
        actionLabel=""
      />
    </Box>
  );
}
