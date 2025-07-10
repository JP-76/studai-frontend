import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaTrash,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function AccountSettings() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [originalUsername, setOriginalUsername] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/v1/me")
      .then((res) => {
        const userData = res.data;
        setUsername(userData.username);
        setEmail(userData.email);
        setOriginalUsername(userData.username);
        setOriginalEmail(userData.email);
      })
      .catch(() => {
        setError("Falha ao carregar os dados da conta.");
        setShowModal(true);
      });
  }, []);

  const validatePassword = (value: string) => ({
    length: value.length >= 8,
    number: /\d/.test(value),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    uppercase: /[A-Z]/.test(value),
  });

  const pwd = validatePassword(newPassword);

  const handleUpdate = async () => {
    if (!oldPassword.trim()) {
      setError("Senha atual é obrigatória para fazer alterações.");
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
      const payload: {
        oldPassword: string;
        username?: string;
        email?: string;
        newPassword?: string;
      } = {
        oldPassword,
      };

      if (username !== originalUsername) {
        payload.username = username;
      }

      if (email !== originalEmail) {
        payload.email = email;
      }

      if (newPassword.trim()) {
        const allValid = Object.values(pwd).every(Boolean);
        if (!allValid) {
          setError("A nova senha não atende aos requisitos de segurança.");
          setShowModal(true);
          setLoading(false);
          return;
        }
        payload.newPassword = newPassword;
      }

      if (Object.keys(payload).length === 1) {
        setError("Nenhuma alteração foi detectada.");
        setShowModal(true);
        setLoading(false);
        return;
      }

      await api.put("/v1/me/credentials", payload);
      toast.success("Informações atualizadas com sucesso!");

      setOriginalUsername(username);
      setOriginalEmail(email);
      setOldPassword("");
      setNewPassword("");
    } catch {
      setError("Falha ao atualizar a conta.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePassword.trim()) {
      setError("Senha atual é obrigatória para excluir a conta.");
      setShowModal(true);
      return;
    }

    try {
      await api.delete("/v1/me", {
        data: { password: deletePassword },
      });
      toast.success("Conta excluída com sucesso.");
      navigate("/");
    } catch {
      setError("Falha ao excluir a conta. Verifique se a senha está correta.");
      setShowModal(true);
    }
    setShowDeleteModal(false);
    setDeletePassword("");
  };

  const confirmDelete = () => {
    setDeletePassword("");
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4 flex items-center justify-center">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body text-center relative">
          <button
            className="absolute left-6 top-4 btn btn-sm btn-ghost"
            onClick={() => navigate("/home")}
          >
            <FaArrowLeft className="mr-2" /> Início
          </button>

          <h2 className="card-title justify-center mb-2 mt-4">
            Configurações da Conta
          </h2>
          <p className="text-base-content/70 mb-6">
            Atualize suas informações abaixo
          </p>

          <label className="input input-bordered flex items-center gap-2 w-full mb-4">
            <FaUser className="opacity-70" />
            <input
              type="text"
              className="grow"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="input input-bordered flex items-center gap-2 w-full mb-4">
            <FaEnvelope className="opacity-70" />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="input input-bordered flex items-center gap-2 w-full mb-4">
            <FaLock className="opacity-70" />
            <input
              type={showPassword ? "text" : "password"}
              className="grow"
              placeholder="Senha atual"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </label>

          <div className="flex flex-col gap-1 relative mb-4">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <FaLock className="opacity-70" />
              <input
                type={showPassword ? "text" : "password"}
                className="grow"
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              >
                {showPassword ? (
                  <IoEyeOffOutline className="text-lg opacity-70" />
                ) : (
                  <IoEyeOutline className="text-lg opacity-70" />
                )}
              </button>
            </label>
            <div className="text-base-content/60 px-1 text-[0.6875rem] grid grid-cols-2 flex-wrap">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span
                  className={`status inline-block ${
                    pwd.uppercase ? "status-success" : "status-error"
                  }`}
                />
                Pelo menos uma letra maiúscula
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span
                  className={`status inline-block ${
                    pwd.special ? "status-success" : "status-error"
                  }`}
                />
                Pelo menos um caractere especial
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span
                  className={`status inline-block ${
                    pwd.number ? "status-success" : "status-error"
                  }`}
                />
                Pelo menos um número
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span
                  className={`status inline-block ${
                    pwd.length ? "status-success" : "status-error"
                  }`}
                />
                Pelo menos 8 caracteres
              </div>
            </div>
          </div>

          <div className="card-actions flex-col space-y-3">
            <button
              className="btn btn-primary w-full"
              onClick={handleUpdate}
              disabled={loading}
            >
              <FaSave className="mr-2" />
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>

            <button className="btn btn-error w-full" onClick={confirmDelete}>
              <FaTrash className="mr-2" />
              Excluir Conta
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmar Exclusão</h3>
            <p className="py-4 mb-4">
              Tem certeza que deseja excluir sua conta? Esta ação é irreversível
              e todos os seus dados serão perdidos.
            </p>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">
                  Digite sua senha atual para confirmar:
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-2 w-full">
                <FaLock className="opacity-70" />
                <input
                  type="password"
                  className="grow"
                  placeholder="Senha atual"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
              </label>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={!deletePassword.trim()}
              >
                Sim, Excluir Conta
              </button>
              <button
                className="btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Modal de Erro */}
      {showModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Erro</h3>
            <p className="py-4">{error}</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>
                Fechar
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default AccountSettings;
