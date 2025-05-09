import { useState } from "react";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { UserList } from "../model/user-model";
import { TableUsersList } from "./table-list-user";
import { Pagination } from "./pagination";
import { ModalCadUser } from "./modal-cad-user";

interface TableUserProps {
  search: string;
  setSearch: (value: React.SetStateAction<string>) => void;
  userList: UserList[];
  page: number;
  totalPages: number;
  setPage: (value: React.SetStateAction<number>) => void;
  handleListData: () => void;
}

export function TableUser({
  search,
  setSearch,
  userList,
  page,
  totalPages,
  setPage,
  handleListData,
}: TableUserProps) {
  const [openModalCadUser, setOpenModalCadUser] = useState(false);

  return (
    <>
      <Card
        elevation={3}
        sx={{
          mt: 4,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#312e81" : "#fefefe",
          borderRadius: 3,
        }}
      >
        <CardHeader
          title={
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
                mb: 2,
              }}
            >
              <Button
                variant="contained"
                onClick={() => setOpenModalCadUser(true)}
              >
                Adicionar Usuário
              </Button>

              <Box
                sx={{ position: "relative", width: { xs: "100%", sm: 300 } }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Pesquisar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton edge="end" disabled>
                        <Search size={20} />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            </Box>
          }
        />

        <CardContent>
          <TableUsersList userList={userList} handleListData={handleListData} />
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </Box>
        </CardContent>
      </Card>
      <ModalCadUser
        open={openModalCadUser}
        onClose={() => setOpenModalCadUser(false)}
        handleListData={handleListData}
      />
    </>
  );
}
