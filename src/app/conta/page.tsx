'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Helper function to get the JWT from the cookies
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop();
    if (part) {
      return part.split(';').shift();
    }
  }
  return undefined;
};

export default function UserInfoPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('********');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const router = useRouter();  
  const handleQuizNavigation = () => {
    router.push(`/quiz`);
  };


  useEffect(() => {
    const token = getCookie('token');
    console.log(token);

    if (token) {
      // Fetch user data from the backend
      fetch('/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.text())
        .then(data => {
          console.log('User data:', data);
          try {
            const userData = JSON.parse(data);
            setUsername(userData.username);
            setEmail(userData.email);
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        })
        .catch(error => console.error('Error fetching user data:', error));
    } else {
      console.error('No token found');
    }
  }, []);

  const handleEditClick = () => {
    setShowEditPopup(true);
  };

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const token = getCookie('token');

    // Update username
    fetch('/api/user/username', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username })
    })
      .then(response => response.text())
      .then(data => {
        console.log('Username updated:', data);
        // Assuming the data is plain text, handle it directly
      })
      .catch(error => console.error('Error updating username:', error));

    // Update email
    fetch('/api/user/email', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    })
      .then(response => response.text())
      .then(data => {
        console.log('Email updated:', data);
        // Assuming the data is plain text, handle it directly
      })
      .catch(error => console.error('Error updating email:', error));

    setShowEditPopup(false);
  };

  const handleChangePasswordClick = () => {
    setShowChangePasswordPopup(true);
  };

  const handleCloseChangePasswordPopup = () => {
    setShowChangePasswordPopup(false);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const token = getCookie('token');

    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match');
      return;
    }

    fetch('/api/user/password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    })
      .then(response => response.text())
      .then(data => {
        console.log('Password changed:', data);
        // Assuming the data is plain text, handle it directly
        setShowChangePasswordPopup(false);
      })
      .catch(error => console.error('Error changing password:', error));
  };

  const handleDeleteAccount = () => {
    const token = getCookie('token');

    fetch('/api/user', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.text())
      .then(data => {
        console.log('Account deleted:', data);
        handleQuizNavigation();
      })
      .catch(error => console.error('Error deleting account:', error));
  };

  const handleGoBack = () => {
    router.push('/'); // Replace with the actual path to the main page
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#12121B] overflow-hidden relative">
      <h1 className="absolute top-4 left-4 text-2xl text-white">Configurações</h1>
      <div className="flex flex-col items-center justify-center w-1/2 h-[85%] p-8 m-8 bg-[#12121B] rounded-lg">
        <h2 className="text-2xl text-white mb-8 self-start">Informações do Usuário</h2>
        <form className="flex flex-col items-center w-full">
          <div className="mb-6 w-full">
            <label className="block text-white mb-2" htmlFor="username">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              readOnly
              className="px-6 py-3 w-full rounded-lg bg-[#222233] text-white border border-gray-600 select-none"
            />
          </div>
          <div className="mb-6 w-full">
            <label className="block text-white mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="px-6 py-3 w-full rounded-lg bg-[#222233] text-white border border-gray-600 select-none"
            />
          </div>
        </form>
        <div className="flex justify-between w-full mt-4">
          <button
            onClick={handleEditClick}
            className="px-6 py-3 text-white bg-[#222233] rounded-lg hover:bg-[#333344]"
          >
            Editar Informações
          </button>
          <button
            onClick={handleChangePasswordClick}
            className="px-6 py-3 text-white bg-[#222233] rounded-lg hover:bg-[#333344]"
          >
            Alterar Senha
          </button>
        </div>
      </div>
      {showEditPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleCloseEditPopup}>
          <div className="bg-[#12121B] p-8 rounded-lg max-w-lg mx-auto text-white relative" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Editar Informações</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col items-center w-full">
              <div className="mb-6 w-full">
                <label className="block text-white mb-2" htmlFor="edit-username">Nome de Usuário</label>
                <input
                  type="text"
                  id="edit-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-6 py-3 w-full rounded-lg bg-[#222233] text-white border border-gray-600"
                />
              </div>
              <div className="mb-6 w-full">
                <label className="block text-white mb-2" htmlFor="edit-email">Email</label>
                <input
                  type="email"
                  id="edit-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-6 py-3 w-full rounded-lg bg-[#222233] text-white border border-gray-600"
                />
              </div>
              <button type="submit" className="px-6 py-3 text-white bg-[#222233] rounded-lg hover:bg-[#333344]">
                Salvar
              </button>
            </form>
            <button
              onClick={handleDeleteAccount}
              className="mt-4 px-6 py-3 text-white bg-red-600 rounded-lg hover:bg-red-800"
            >
              Deletar Conta
            </button>
            <button className="absolute top-2 right-2 text-white" onClick={handleCloseEditPopup}>X</button>
          </div>
        </div>
      )}
      {showChangePasswordPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleCloseChangePasswordPopup}>
          <div className="bg-[#12121B] p-8 rounded-lg max-w-lg mx-auto text-white relative" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Alterar Senha</h2>
            <form onSubmit={handleChangePasswordSubmit} className="flex flex-col items-center w-full">
              <div className="mb-6 w-full">
                <label className="block text-white mb-2" htmlFor="current-password">Senha Atual</label>
                <input
                  type="password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="px-6 py-3 w-full rounded-lg bg-[#222233] text-white border border-gray-600"
                />
              </div>
              <div className="mb-6 w-full">
                <label className="block text-white mb-2" htmlFor="new-password">Nova Senha</label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="px-6 py-3 w-full rounded-lg bg-[#222233] text-white border border-gray-600"
                />
              </div>
              <div className="mb-6 w-full">
                <label className="block text-white mb-2" htmlFor="confirm-new-password">Confirmar Nova Senha</label>
                <input
                  type="password"
                  id="confirm-new-password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="px-6 py-3 w-full rounded-lg bg-[#222233] text-white border border-gray-600"
                />
              </div>
              <button type="submit" className="px-6 py-3 text-white bg-[#222233] rounded-lg hover:bg-[#333344]">
                Salvar
              </button>
            </form>
            <button className="absolute top-2 right-2 text-white" onClick={handleCloseChangePasswordPopup}>X</button>
          </div>
        </div>
      )}
      <button
        onClick={handleGoBack}
        className="absolute bottom-8 right-8 px-6 py-3 text-white bg-[#222233] rounded-lg hover:bg-[#333344]"
      >
        Voltar para a Página Principal
      </button>
    </main>
  );
}