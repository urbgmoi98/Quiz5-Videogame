import React from 'react';

export const Menu = ({ estado, iniciar, pausar, reiniciar }) => {
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
      {estado === 'idle' && <button className="btn-y2k" onClick={iniciar}>▶ Jugar</button>}
      {estado === 'playing' && <button className="btn-y2k" onClick={pausar}>⏸ Pausa</button>}
      {estado === 'paused' && <button className="btn-y2k" onClick={iniciar}>▶ Reanudar</button>}
      {(estado === 'gameover' || estado === 'paused') && (
        <button className="btn-y2k" style={{ background: '#FF8FD1' }} onClick={reiniciar}>🔄 Reiniciar</button>
      )}
    </div>
  );
};