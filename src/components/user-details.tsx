import { Icon } from "leaflet";
import { UserList } from "../model/user-model";
import { MapComponent } from "./map-component";

interface UserDetailsProps {
  user: UserList | undefined;
  customIcon: Icon<{
    iconUrl: string;
    shadowUrl: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
  }>;
}

export function UserDetails({ user, customIcon }: UserDetailsProps) {
  return (
    <>
      {user ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                Nome Completo
              </h2>
              <p className="text-gray-700 dark:text-gray-200">{user.nome}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                CPF
              </h2>
              <p className="text-gray-700 dark:text-gray-200">{user.cpf}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                Telefone
              </h2>
              <p className="text-gray-700 dark:text-gray-200">
                {user.telefone}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                E-mail
              </h2>
              <p className="text-gray-700 dark:text-gray-200">{user.email}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                Endereço
              </h2>
              <p className="text-gray-700 dark:text-gray-200">
                {user.endereco}, {user.numero} - {user.complemento}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                Cidade/Estado
              </h2>
              <p className="text-gray-700 dark:text-gray-200">
                {user.cidade} - {user.estado}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                CEP
              </h2>
              <p className="text-gray-700 dark:text-gray-200">{user.cep}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                Latitude/Longitude
              </h2>
              <p className="text-gray-700 dark:text-gray-200">
                {user.latitude} / {user.longitude}
              </p>
            </div>
          </div>

          {/* Mapa */}
          <MapComponent user={user} customIcon={customIcon} editMode={false} />
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-200">
          Carregando detalhes do usuário...
        </p>
      )}
    </>
  );
}
