import { useEffect, useState } from "react";
import { UserList } from "../../model/user-model";
import { fetchUserList } from "../../services/usuarios";
import { TableUser } from "../../components/table-user";
import { useAuth } from "../../contexts/auth-context";
import { useLocation } from "react-router-dom";
import DefaultAlertToast from "../../components/default-alert-toast";

export function User() {
  const [userList, setUserList] = useState<UserList[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { dataUser } = useAuth();
  const location = useLocation();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await fetchUserList(
        page,
        limit,
        debouncedSearch,
        parseInt(dataUser?.id || "0")
      );
      setUserList(data.usuarios);
      setTotalPages(Math.ceil(data.total / limit));
    };
    loadUserData();
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    if (location.state?.successMsg) {
      setSuccessMsg(location.state.successMsg);
      setOpenAlert(true);

      // Ocultar a mensagem após 3 segundos
      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
    }
  }, [location.state]);

  const handleListData = () => {
    const loadUserData = async () => {
      const data = await fetchUserList(
        page,
        limit,
        debouncedSearch,
        parseInt(dataUser?.id || "0")
      );
      setUserList(data.usuarios);
      setTotalPages(Math.ceil(data.total / limit));
    };
    loadUserData();
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Lista de Usuários
          </h1>
        </div>
        {successMsg && (
          <DefaultAlertToast
            open={openAlert}
            setOpen={setOpenAlert}
            message={successMsg}
            actionLabel=""
          />
        )}
        <TableUser
          search={search}
          setSearch={setSearch}
          userList={userList}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          handleListData={handleListData}
        />
      </div>
    </div>
  );
}
