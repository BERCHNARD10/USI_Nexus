import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Alert } from 'flowbite-react';

const Notificaciones = () => {
  const [authTokenFirebase, setAuthTokenFirebase] = useState("");

  const handleSendNotification = async () => {

    console.log('Token de firebase de localstorage:', authTokenFirebase);

    const registrationToken = authTokenFirebase;
    const title = 'Hola mundo';
    const body = 'Esta es una notificacion de prueba';

    try {
      const response = await sendNotification(registrationToken, title, body);
      toast.success('Notification sent successfully!');
      toast.success(response);

      console.log('Notification response:', response);
    } catch (error) {
      toast.error('Failed to send notification');
      console.error('Error:', error);
    }
  };

  const sendNotification = async (tokenUser, title, body) => {
    try {
      const response = await axios.post('http://localhost:3000/notificacion', {
        tokenUser: tokenUser,
        title: title,
        body: body
      });
      console.log('Notificacion enviada con exito:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al enviar la notificacion:', error);
      throw error;
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('authTokenFirebase');
    if (token) {
      setAuthTokenFirebase(token);
    }
  }, []);

  return (
    <div>
      <h1>tu token es: {authTokenFirebase}</h1>
      <Button onClick={handleSendNotification}>Enviar Notificacion !</Button>
      <ToastContainer />
    </div>
  );
}

export default Notificaciones;
