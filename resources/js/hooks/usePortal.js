import { useState, useEffect } from "react";
import axios from "axios";

export function useDepartments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/api/departments")
            .then((res) => setDepartments(res.data))
            .finally(() => setLoading(false));
    }, []);

    return { departments, loading };
}

export function useCards(basename) {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!basename) return;
        setLoading(true);
        axios
            .get(`/api/cards/${basename}`)
            .then((res) => setCards(res.data))
            .finally(() => setLoading(false));
    }, [basename]);

    return { cards, loading };
}

export function useSystems(cardId) {
    const [systems, setSystems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!cardId) return;
        setLoading(true);
        axios
            .get(`/api/systems/${cardId}`)
            .then((res) => setSystems(res.data))
            .finally(() => setLoading(false));
    }, [cardId]);

    return { systems, loading };
}
