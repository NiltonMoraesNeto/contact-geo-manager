import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Icon } from "leaflet";
import { ArrowLeft, SquarePen } from "lucide-react";
import { editarUsuario, getUserById } from "../../services/usuarios";
import { UserList } from "../../model/user-model";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";
import { UserDetails } from "../../components/user-details";
import { schemaeditUser } from "../../schemas/edit-user-schema";
import apiViaCep from "../../services/apiViaCep";
import DefaultAlertToast from "../../components/default-alert-toast";
import { UserEditMode } from "../../components/user-edit-mode";

type UserFormData = z.infer<typeof schemaeditUser>;

export function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserList>();
  const [editMode, setEditMode] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [msgApi, setMsgApi] = useState("");

  // Configuração do marcador padrão do Leaflet
  const customIcon = new Icon({
    iconUrl: markerIcon,
    shadowUrl: markerIconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(schemaeditUser),
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
      email: "",
    },
  });

  const cep = watch("cep");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        const userData = await getUserById(id);
        setUser(userData);
        reset(userData);
      }
    };
    fetchUser();
  }, [id, reset]);

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
    try {
      if (!id) {
        console.error("ID is undefined");
        return;
      }
      const response = await editarUsuario(parseInt(id), data);
      if (response) {
        setMsgApi("Usuário salvo com sucesso.");
        setOpenAlert(true);
        navigate("/user", {
          state: { successMsg: "Usuário salvo com sucesso." },
        });
      }
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      setMsgApi("Ocorreu um erro desconhecido.");
      setOpenAlert(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            <div className="flex justify-between items-center">
              Detalhes do Usuário
              <SquarePen
                className="ml-3 cursor-pointer"
                onClick={() => setEditMode(!editMode)}
              />
            </div>
          </h1>
          <label
            className="cursor-pointer text-lg text-indigo-600 dark:text-indigo-300"
            onClick={() => navigate("/user")}
          >
            <div className="flex justify-between items-center">
              <ArrowLeft className="mr-2 cursor-pointer" /> Voltar
            </div>
          </label>
        </div>

        <DefaultAlertToast
          open={openAlert}
          setOpen={setOpenAlert}
          message={msgApi}
          actionLabel=""
        />

        {editMode ? (
          <UserEditMode
            control={control}
            errors={errors}
            buscarEndereco={buscarEndereco}
            user={user}
            customIcon={customIcon}
            latitude={latitude}
            longitude={longitude}
            editMode={editMode}
            handleSalvar={handleSalvar}
            handleSubmit={handleSubmit}
          />
        ) : (
          <UserDetails user={user} customIcon={customIcon} />
        )}
      </div>
    </div>
  );
}
