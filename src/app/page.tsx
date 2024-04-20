"use client"

import { useState } from 'react';
import Image from 'next/image';
import Link from "next/link";

export default function Home() {
  const [moves, setMoves] = useState([{ from: '', to: '' }]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertLink, setAlertLink] = useState('')

  const addMove = () => {
    setMoves([...moves, { from: '', to: '' }]);
  };

  const removeMove = (index: number) => {
    const newMoves = [...moves];
    newMoves.splice(index, 1);
    setMoves(newMoves);
  };


  const handleChange = (index: number, side: 'from' | 'to', value: string) => {
    const newMoves = [...moves];
    newMoves[index][side] = value.toUpperCase(); // Converte automaticamente in maiuscolo
    setMoves(newMoves);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ moves }),
    });
    const result = await response.json();
    if (response.status === 200) {
      setAlertMessage("Il tuo viaggio continua!");
      setAlertLink(result.location)
    } else {
      setAlertMessage(result.message);
    }
    setAlertVisible(true); // Mostra l'avviso personalizzato
  };

  const closeAlert = () => {
    setAlertLink('')
    setAlertVisible(false); // Nasconde l'avviso
  };

return (
  <div className="flex justify-center items-center h-auto">
    {alertVisible && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
        <div className="bg-white p-6 rounded shadow-lg text-center">
          <p>{alertMessage}</p>
          {alertLink != '' && (
              <Link href={alertLink} rel="noopener noreferrer" target="_blank">
          <button
                  className="mt-4 mr-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Vai!
          </button>
          </Link>
          )}
          <button onClick={closeAlert} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Chiudi
          </button>
        </div>
      </div>
    )}
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center items-center mb-8 mt-12">
        <Image src="/logo_vna.png" alt="Vietnam Airlines" width={350} height={100} />
      </div>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {moves.map((move, index) => (
          <div key={index} className="mb-4 border p-4 rounded flex items-center justify-between">
            <div>
              <input
                type="text"
                placeholder="Da"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={move.from}
                onChange={(e) => handleChange(index, 'from', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="A"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                value={move.to}
                onChange={(e) => handleChange(index, 'to', e.target.value)}
                required
              />
            </div>
            <button
              onClick={() => removeMove(index)}
              className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded text-lg"
              type="button"
            >
              &times;  {/* This is the "X" character styled as a red cross */}
            </button>
          </div>
        ))}
        <div className="flex items-center justify-between">
          <button type="button" onClick={addMove} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Aggiungi tappa
          </button>
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Invia tappe
          </button>
        </div>
      </form>
    </div>
  </div>
);

}
