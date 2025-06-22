import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

const API_KEY = "4c28a0ae";

function Home({ onSearch, searchTerm, setSearchTerm, loading, cars }) {
  const navigate = useNavigate();

  const handleCardClick = (car) => {
    navigate(`/car/${car.imdbID}`, { state: { car } });
  };

  return (
    <main>
      <h1>Australia's most awarded car subscription platform</h1>
      <h2>FIND YOUR DREAM CAR WITH <span className="highlight">BLINKER</span></h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Model, Make or Keyword"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={onSearch}>
          {loading ? <div className="spinner"></div> : <span>&#128269;</span>}
        </button>
      </div>
      <div className="car-results">
        {cars.map((car) => (
          <div key={car.imdbID} className="car-card" onClick={() => handleCardClick(car)}>
            <img src={car.Poster} alt={car.Title} />
            <h3>{car.Title}</h3>
            <p>{car.Year}</p>
          </div>
        ))}
      </div>
      <div className="cityscape"></div>
    </main>
  );
}

function CarDetails({ location }) {
  const car = location.state?.car;
  if (!car) return <p>Car details not available</p>;

  return (
    <div className="car-details">
      <h2>{car.Title}</h2>
      <img src={car.Poster} alt={car.Title} />
      <p><strong>Year:</strong> {car.Year}</p>
      <p><strong>Type:</strong> {car.Type}</p>
      <Link to="/">← Back to Search</Link>
    </div>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`);
    const data = await res.json();
    if (data.Search) {
      setCars(data.Search);
    } else {
      setCars([]);
    }
    setLoading(false);
  };

  return (
    <Router>
      <div className="app">
        <header>
          <div className="logo">blinker</div>
          <nav>
            <Link to="/">Home</Link>
            <a href="#find">Find your car</a>
            <button className="contact">Contact</button>
          </nav>
        </header>
        <Routes>
          <Route
            path="/"
            element={<Home
              onSearch={handleSearch}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loading={loading}
              cars={cars}
            />}
          />
          <Route path="/car/:id" element={<CarDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;