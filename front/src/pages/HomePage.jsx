import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import React, { useState } from 'react';
import BookTable from '../components/BookTableWithDetails';

const HomePage = () => {
  const [lang, setLang] = useState('en_US');
  const [seed, setSeed] = useState(42);
  const [likes, setLikes] = useState(3.5);
  const [reviews, setReviews] = useState(4.2);
  const [page, setPage] = useState(1);

  const exportToCSV = async () => {
  try {
    const res = await fetch(`https://bookstore-backend-sszl.onrender.com/api/books/export?seed=${seed}&lang=${lang}&likes=${likes}&reviews=${reviews}&pages=${page}`, {
      method: 'GET',
    });

    if (!res.ok) throw new Error('Failed to fetch CSV');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
   a.download = `books_seed${seed}_page${page}.csv`;

    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url); 

  } catch (err) {
    console.error('CSV export failed:', err);
  }
};

  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 100000));
  };

  

  return (
    <div className="w-full h-full p-4 max-w-6xl mx-auto flex flex-col overflow-y-auto">
      <div className="flex flex-wrap gap-6 mb-6 items-end">

      
                 <button
  onClick={exportToCSV}
  className="px-4 py-2 bg-green-600  rounded hover:bg-green-700 text-sm"
>
  Export to CSV
</button>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border border-gray-400 bg-white text-gray-800 p-2 rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled hidden>Select Language</option>
            <option value="en_US">English (US)</option>
            <option value="de_DE">German (DE)</option>
            <option value="ja_JP">Japanese (JP)</option>
          </select>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seed</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
              className="border border-gray-400 bg-white text-gray-800 p-2 rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleRandomSeed}
              className="border px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              <GiPerspectiveDiceSixFacesRandom />
            </button>
          </div>
        </div>

      
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Likes: {likes.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={likes}
            onChange={(e) => {setLikes(parseFloat(e.target.value))}}
            className="w-full accent-blue-500 border border-gray-400 bg-white text-gray-800 p-2 rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reviews</label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={reviews}
            onChange={(e) => setReviews(parseFloat(e.target.value))}
            className="border p-2 rounded w-20 border border-gray-400 bg-white text-gray-800 p-2 rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <BookTable seed={seed} lang={lang} likes={likes} reviews={reviews}  setPage={setPage}/>
    </div>
  );
};

export default HomePage;









