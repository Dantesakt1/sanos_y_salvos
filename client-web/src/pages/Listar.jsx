import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

const Listar = () => {
    const { getAccessTokenSilently } = useAuth0();
    const [mascotas, setMascotas] = useState([]);

    useEffect(() => {
        const cargarMascotas = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await axios.get('http://localhost:8081/api/mascotas', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMascotas(res.data);
            } catch (err) {
                console.error("Error al listar:", err);
            }
        };
        cargarMascotas();
    }, [getAccessTokenSilently]);

    return (
        <div className="container">
            <h2>Inventario de Mascotas</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th><th>Especie</th><th>Estado</th><th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {mascotas.map(m => (
                        <tr key={m.id}>
                            <td><strong>{m.nombre}</strong></td>
                            <td>{m.especie}</td>
                            <td>
                                <span className={`status-badge ${m.estado === 'PERDIDO' ? 'status-perdido' : 'status-encontrado'}`}>
                                    {m.estado}
                                </span>
                            </td>
                            <td>{m.descripcion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Listar;