import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useAdminDepartments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetch = useCallback(() => {
        setLoading(true);
        axios
            .get("/api/admin/departments")
            .then((r) => setDepartments(r.data))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    const create = (data) =>
        axios.post("/api/admin/departments", data).then(fetch);
    const update = (id, data) =>
        axios.put(`/api/admin/departments/${id}`, data).then(fetch);
    const remove = (id) =>
        axios.delete(`/api/admin/departments/${id}`).then(fetch);

    return { departments, loading, create, update, remove, refetch: fetch };
}

export function useAdminCards() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetch = useCallback(() => {
        setLoading(true);
        axios
            .get("/api/admin/cards")
            .then((r) => setCards(r.data))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    const create = (data) => axios.post("/api/admin/cards", data).then(fetch);
    const update = (id, data) =>
        axios.put(`/api/admin/cards/${id}`, data).then(fetch);
    const remove = (id) => axios.delete(`/api/admin/cards/${id}`).then(fetch);

    return { cards, loading, create, update, remove, refetch: fetch };
}

export function useAdminSystems() {
    const [systems, setSystems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetch = useCallback(() => {
        setLoading(true);
        axios
            .get("/api/admin/systems")
            .then((r) =>
                setSystems(
                    r.data.map((s) => ({
                        ...s,
                        system_status: Number(s.system_status),
                        require_auto_login: Number(s.require_auto_login),
                    })),
                ),
            )
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    const create = (data) => axios.post("/api/admin/systems", data).then(fetch);
    const update = (id, data) =>
        axios.put(`/api/admin/systems/${id}`, data).then(fetch);
    const remove = (id) => axios.delete(`/api/admin/systems/${id}`).then(fetch);

    return { systems, loading, create, update, remove, refetch: fetch };
}
