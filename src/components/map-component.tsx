import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { UserList } from "../model/user-model";

interface DefaultComponentProps {
  user: UserList | undefined;
  customIcon: Icon<{
    iconUrl: string;
    shadowUrl: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
  }>;
  latitude?: string;
  longitude?: string;
  editMode: boolean;
}

function RecenterMap({
  latitude,
  longitude,
}: {
  latitude: string;
  longitude: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (latitude && longitude) {
      map.flyTo([parseFloat(latitude), parseFloat(longitude)], map.getZoom());
    }
  }, [latitude, longitude, map]);

  return null;
}

export function MapComponent({
  user,
  customIcon,
  latitude,
  longitude,
  editMode,
}: DefaultComponentProps) {
  const lat = parseFloat(editMode ? latitude ?? "0" : user?.latitude ?? "0");
  const lon = parseFloat(editMode ? longitude ?? "0" : user?.longitude ?? "0");

  return (
    <div className="mt-6 mb-4">
      <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">
        Localização
      </h2>
      <div className="h-[500px] rounded-lg overflow-hidden">
        <MapContainer
          center={[lat, lon]}
          zoom={15}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[lat, lon]} icon={customIcon} />
          {/* Deixar o mapa centralizado de forma dinamica */}
          {editMode && latitude && longitude && (
            <RecenterMap latitude={latitude} longitude={longitude} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
