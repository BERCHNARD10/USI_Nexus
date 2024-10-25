import React from 'react';
import image from '../images/Error 404.png'


const Error404 = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  };

  const headingStyle = {
    color: 'red',
    fontSize: '2em',
    marginBottom: '10px',
  };

  const paragraphStyle = {
    fontSize: '1.2em',
    marginBottom: '20px', 
  };
  
  const imgError404={
    height:'70%',
    with:'80%',
  }


  

  return (
    <div style={containerStyle}>
       <img  style={imgError404}src={image} />
      <h1 style={headingStyle}>Error 404: Página no encontrada</h1>
      <p style={paragraphStyle}>Lo sentimos, la página que estás buscando no se encuentra.</p>
      {/* Puedes personalizar esta página de error según tus necesidades */}
    </div>
  );
};

export default Error404;
