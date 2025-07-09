import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { FaUser, FaEnvelope, FaLock, FaTrash, FaSave, FaArrowLeft } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function AccountSettings() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/v1/me")
      .then((res) => {
        setUsername(res.data.username);
        setEmail(res.data.email);
      })
      .catch(() => {
        setError("Failed to load account data");
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
    setLoading(true);
    try {
      await api.put("/v1/me/credentials", {
        username,
        email,
        oldPassword,
        newPassword,
      });
      alert("Information updated successfully!");
    } catch (err) {
      setError("Failed to update account.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;
    try {
      await api.delete("/v1/me", {
        data: { password: oldPassword },
      });
      alert("Account deleted successfully.");
      navigate("/");
    } catch (err) {
      setError("Failed to delete account.");
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4 flex items-center justify-center">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body text-center relative">
          <button
            className="absolute left-6 top-4 btn btn-sm btn-ghost"
            onClick={() => navigate("/home")}
          >
            <FaArrowLeft className="mr-2" /> Home
          </button>

          <h2 className="card-title justify-center mb-2 mt-4">Account Settings</h2>
          <p className="text-base-content/70 mb-6">Update your information below</p>

          <label className="input input-bordered flex items-center gap-2 w-full mb-4">
            <FaUser className="opacity-70" />
            <input
              type="text"
              className="grow"
              placeholder="Username"
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
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </label>

          <div className="flex flex-col gap-1 relative mb-4">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <FaLock className='opacity-70' />
              <input
                type={showPassword ? "text" : "password"}
                className="grow"
                placeholder="New Password"
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
                <span className={`status inline-block ${pwd.uppercase ? 'status-success' : 'status-error'}`} />
                At least one uppercase letter
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className={`status inline-block ${pwd.special ? 'status-success' : 'status-error'}`} />
                At least one special character
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className={`status inline-block ${pwd.number ? 'status-success' : 'status-error'}`} />
                At least one number
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className={`status inline-block ${pwd.length ? 'status-success' : 'status-error'}`} />
                At least 8 characters
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
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="btn btn-error w-full"
              onClick={handleDelete}
            >
              <FaTrash className="mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {showModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Error</h3>
            <p className="py-4">{error}</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default AccountSettings;
