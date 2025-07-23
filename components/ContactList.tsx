import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaWhatsapp, FaPhone, FaUserCircle } from "react-icons/fa";
import dayjs from "dayjs";
import "dayjs/locale/fr";

interface Contact {
  id: number;
  phone: string;
  name: string;
  firstMessageAt: string;
}

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filtered, setFiltered] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get<Contact[]>(
          "https://ec5546b610ae.ngrok-free.app/contacts"
        );
        setContacts(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError("Erreur lors du chargement des contacts");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.phone.toLowerCase().includes(lower)
      )
    );
  }, [search, contacts]);

  const isToday = (dateStr: string) => {
    const date = dayjs(dateStr).locale("fr");
    return date.isSame(dayjs(), "day");
  };

  if (loading) return <div className="text-gray-600">Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-xl mx-auto bg-red-500 h-screen bg-white rounded-xl shadow p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Rechercher un contact..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-2 text-sm text-gray-500">
        {filtered.length} contact(s) affiché(s)
      </div>

      <div className="space-y-3 max-h-screen overflow-y-auto my-10">
        {filtered.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center justify-between border-b border-gray-100 pb-3 pt-2"
          >
            <div className="flex items-center space-x-3">
              <FaUserCircle className="text-gray-400 text-3xl" />
              <div>
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  {contact.name}
                  {isToday(contact.firstMessageAt) && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full animate-pulse">
                      Nouveau
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">{contact.phone}</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <a
                href={`tel:${contact.phone}`}
                className="text-blue-500 hover:text-blue-700 text-lg"
                title="Appeler"
              >
                <FaPhone />
              </a>
              <a
                href={`https://wa.me/${contact.phone}?text=Bonjour%20!`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-600 text-lg"
                title="Écrire sur WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
