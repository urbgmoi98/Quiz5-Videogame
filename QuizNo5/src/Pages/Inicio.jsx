import React from 'react';
import { Link } from 'react-router-dom';

export const Inicio = () => (
  <div className="glass-panel fade-in" style={{ textAlign: 'center', maxWidth: '500px' }}>
    <h1 style={{ fontSize: '3rem', color: '#00E5FF', textShadow: '2px 2px 0px white' }}> Bocaraká 🫧</h1>
    <p style={{ margin: '20px 0' }}> By: Moisés </p>
    <Link to="/juego"><button className="btn-y2k"> Comenzar Aventura 🐬 </button></Link>
  </div>
);