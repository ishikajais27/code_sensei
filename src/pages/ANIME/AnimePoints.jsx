import React, { useState, useEffect } from 'react'
import { Search, Filter, RefreshCw, AlertTriangle, Palette } from 'lucide-react' // Added Palette icon
import './Anime.css'

const AnimePoints = () => {
  const [animeData, setAnimeData] = useState([])
  const [filteredAnime, setFilteredAnime] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSize, setSelectedSize] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const ANILIST_API = 'https://graphql.anilist.co'

  const fetchAnime = async () => {
    setLoading(true)
    setError(null)
    try {
      const query = `
        query {
          Page(page: 1, perPage: 50) {
            media(type: ANIME, sort: POPULARITY_DESC) {
              id
              title {
                romaji
                english
              }
              genres
              episodes
              averageScore
              siteUrl
              coverImage {
                large
              }
            }
          }
        }
      `

      const response = await fetch(ANILIST_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch anime data: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.data || !data.data.Page || !data.data.Page.media) {
        throw new Error('No anime data found')
      }

      const transformedAnime = data.data.Page.media.map((anime) => ({
        id: anime.id,
        title: anime.title.english || anime.title.romaji,
        categories: anime.genres,
        watchLink: anime.siteUrl,
        size: getSizeCategory(anime.episodes),
        episodes: anime.episodes || 'Unknown',
        score: anime.averageScore,
        image: anime.coverImage.large,
      }))

      if (transformedAnime.length === 0) {
        throw new Error('No anime data available')
      }

      setAnimeData(transformedAnime)
      setFilteredAnime(transformedAnime)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching anime:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnime()
  }, [])

  const getSizeCategory = (episodes) => {
    if (!episodes) return 'Unknown'
    if (episodes <= 12) return 'Small'
    if (episodes <= 24) return 'Medium'
    if (episodes <= 50) return 'Large'
    return 'Extra Large'
  }

  useEffect(() => {
    let result = animeData

    if (selectedCategories.length > 0) {
      result = result.filter((anime) =>
        selectedCategories.every((cat) => anime.categories.includes(cat))
      )
    }

    if (selectedSize) {
      result = result.filter((anime) => anime.size === selectedSize)
    }

    if (searchTerm) {
      result = result.filter((anime) =>
        anime.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredAnime(result)
  }, [animeData, selectedCategories, selectedSize, searchTerm])

  const allCategories = [
    ...new Set(animeData.flatMap((anime) => anime.categories)),
  ]
  const sizeOptions = ['Small', 'Medium', 'Large', 'Extra Large']

  if (loading) {
    return (
      <div className="loading-container">
        <RefreshCw className="loading-spinner" size={48} />
        <span className="ml-3 text-xl">Loading Anime...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertTriangle className="error-icon" />
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div className="anime-container w-7xl">
      <h2 className="anime-header">
        <Filter className="anime-header-icon" />
        Anime Recommendations
      </h2>

      {/* Search and Filter Section */}
      <div className="search-container">
        <Search className="mr-2 text-gray-500" />
        <input
          type="text"
          placeholder="Search anime by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Category Filters */}
      <div className="mb-3">
        <h3 className="font-semibold mb-2">Categories:</h3>
        <div className="flex flex-wrap gap-2">
          {allCategories.sort().map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategories((prev) =>
                  prev.includes(category)
                    ? prev.filter((c) => c !== category)
                    : [...prev, category]
                )
              }
              className={`filter-button ${
                selectedCategories.includes(category) ? 'active' : 'inactive'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filters */}
      <div>
        <h3 className="font-semibold mb-2">Size:</h3>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size}
              onClick={() =>
                setSelectedSize((prev) => (prev === size ? '' : size))
              }
              className={`filter-button ${
                selectedSize === size ? 'active' : 'inactive'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Anime Results */}
      <div className="anime-results">
        <h3 className="text-lg font-semibold mb-3">
          Results: {filteredAnime.length} anime
        </h3>
        {filteredAnime.length === 0 ? (
          <p className="text-gray-500">No anime found matching your filters.</p>
        ) : (
          <div className="anime-grid">
            {filteredAnime.map((anime) => (
              <div key={anime.id} className="anime-card">
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="anime-image"
                />
                <h4 className="anime-title">{anime.title}</h4>
                <div className="anime-categories">
                  {anime.categories.map((cat) => (
                    <span key={cat} className="category-tag">
                      {cat}
                    </span>
                  ))}
                </div>
                <div className="anime-info">
                  <div>
                    <strong>Episodes:</strong> {anime.episodes}
                  </div>
                  <div>
                    <strong>Size:</strong> {anime.size}
                  </div>
                  <div>
                    <strong>Score:</strong> {anime.score || 'N/A'}
                  </div>
                </div>
                <a
                  href={anime.watchLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="anime-link"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AnimePoints
