
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

const BookTableWithDetails = ({ seed, lang, likes, reviews, setPage}) => {
  const [books, setBooks] = useState([]);
 
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageBook, setPageBook] = useState(1);



  const fetchBooksByPage = async (pageNum) => {
    try {
      const res = await axios.get('http://localhost:8000/api/books/', {
        params: { seed, lang, page: pageNum, likes, reviews },
      });
      const data = res.data;
      if (Array.isArray(data)) {
        return data;
      } else {
        console.warn("Unexpected response:", data);
        setError("Сервер вернул неправильный формат данных.");
        return [];
      }
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Не удалось загрузить книги.");
      return [];
    }
  };

  

  useEffect(() => {
    setBooks([]);
    setPageBook(1);
    setExpandedIndex(null);
    setError(null);
    setHasMore(true);

    fetchBooksByPage(1).then((data) => setBooks(data));
  }, [seed, lang, likes, reviews,]);

  const fetchMore = () => {
    const nextPage = pageBook + 1;
    fetchBooksByPage(nextPage).then((data) => {
      setBooks((prev) => [...prev, ...data]);
      setPage(nextPage);
      if (data.length < 20) setHasMore(false);
    });
  };

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  if (!Array.isArray(books)) {
    return <div className="text-red-600 p-4">Ошибка: данные книг недоступны</div>;
  }

  return (
    <div id="scrollableDiv"
      style={{
        height: '80vh',
        overflow: 'auto',
      }}
      className="border border-gray-300 rounded">

      <InfiniteScroll
        dataLength={books.length}
        next={fetchMore}
        // hasMore={true}
        hasMore={hasMore}
        loader={<p className="text-center text-xs">Loading more books...</p>}
        scrollableTarget="scrollableDiv"
      >
        <table className="w-full border border-gray-200 text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 text-left">#</th>
              <th className="px-2 py-1 text-left">ISBN</th>
              <th className="px-2 py-1 text-left">Title</th>
              <th className="px-2 py-1 text-left">Author(s)</th>
              <th className="px-2 py-1 text-left">Publisher</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <React.Fragment key={book.index}>
                <tr
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setExpandedIndex(expandedIndex === book.index ? null : book.index)
                  }
                >
                  <td className="px-2 py-1">{book.index}</td>
                  <td className="px-2 py-1">{book.isbn}</td>
                  <td className="px-2 py-1">{book.title}</td>
                  <td className="px-2 py-1">{book.authors.join(', ')}</td>
                  <td className="px-2 py-1">{book.publisher}</td>
                </tr>

                {expandedIndex === book.index && (
                  <tr className="bg-gray-50 border-t">
                    <td colSpan="5" className="px-4 py-4">
                      <div className="flex gap-4">
                       

                          <img src={book.cover} alt={book.title} className="rounded shadow" />
                       

                        <div>
                          <p className="font-semibold text-sm">
                            {book.title}{' '}
                            <span className="text-sm font-normal text-gray-600">
                              Paperback
                            </span>
                          </p>
                          <p className="text-sm italic">by {book.authors[0]}</p>
                          <p className="text-sm text-gray-500">{book.publisher}</p>
                          <p className="mt-2 font-semibold">Reviews</p>

                          <ul className="text-xs space-y-1 mt-1">
                            {Array.isArray(book.reviews) &&
                              book.reviews.map((rev, i) => (
                                <li key={i}>
                                  <span className="text-gray-700">{rev.text}</span>
                                  <br />
                                  <span className="text-xs italic text-gray-500">
                                    — {rev.author}, {rev.source}
                                  </span>
                                </li>
                              ))}
                          </ul>

                          <div className="mt-2">
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              Likes: {book.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </InfiniteScroll  >
    </div>
  );
};

export default BookTableWithDetails;


