"use client";

import Image from 'next/image'
import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';

function SearchEngineHeader() {
  return (<header>
    <div className="sticky top-0 bg-white p-4 flex flex-col items-center justify-center">
      <Image src="/search-engine.svg" width={100} height={100} alt="search engine" />
      <h1 className="text-6xl font-bold text-center pb-4">Search Engine</h1>
    </div>
  </header>
  )
}

// shows the search bar and the search button
function SearchInterface({ onSearch }: any) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [startDate, setStartDate] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());

  const searchChange = (e: any) => {
    setSearchQuery(e.target.value)
    if (e.key === 'Enter') {
      onSearch(searchQuery, { startDate, endDate })
    }
  }

  const searchClick = () => {
    onSearch(searchQuery, { startDate, endDate })
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-center pb-4">Search</h1>
      <div className="flex flex-row items-center justify-center">
        <input className="border-2 border-gray-300 rounded-lg p-2 m-2 w-100 text-black" type="text" placeholder="Search" value={searchQuery} onChange={searchChange} onKeyPress={searchChange} />
        <button className="border-2 border-gray-300 rounded-lg p-2 m-2" onClick={searchClick}>Search</button>
      </div>
      
      <button className="border-2 border-gray-300 rounded-lg p-2 m-2" onClick={() => setShowAdvanced(!showAdvanced)}>
        Toggle Advanced Options
      </button>

      {showAdvanced && (
        <div className="flex flex-col items-center justify-center">
          <input className="border-2 border-gray-300 rounded-lg p-2 m-2 w-50" type="datetime-local" value={startDate.toISOString().substring(0,16)} onChange={(e) => setStartDate(new Date(e.target.value))} />
          <input className="border-2 border-gray-300 rounded-lg p-2 m-2 w-50" type="datetime-local" value={endDate.toISOString().substring(0,16)} onChange={(e) => setEndDate(new Date(e.target.value))} />
        </div>
      )}
    </div>
  )
}

function SearchResult({ url, url_mobile, title, seendate, socialimage, domain, language, sourcecountry }: any) {
  const [showMobile, setShowMobile] = useState(false)
  const [showMetadata, setShowMetadata] = useState(false)

  const toggleMobile = () => {
    setShowMobile(!showMobile)
  }
  const toggleMetadata = () => {
    setShowMetadata(!showMetadata)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md my-3 w-full lg:w-3/5">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
        <h3 className="text-xl font-medium w-full lg:w-5/5 mb-2 lg:mb-0">{title}</h3>
      </div>
      <a className="w-full block text-blue-600 hover:underline mt-2" href={showMobile ? url_mobile : url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
      <div className="flex justify-between mt-2">
        <div>
          <Image src={'/api/img?img='+socialimage} width={120} height={100} alt="social image" />
        </div>
        <div className="flex flex-col p-4">
          <div>Domain: {domain}</div>
          <div>Language: {language}</div>
          <div>Source Country: {sourcecountry}</div>
        </div>
       </div>
    </div>
  )
}


// "url": "https://vm.ru/news/1074115-uchenye-posledstviya-koronavirusa-mogut-sohranyatsya-dazhe-cherez-dva-goda",
// "url_mobile": "https://vm.ru/news/1074115-uchenye-posledstviya-koronavirusa-mogut-sohranyatsya-dazhe-cherez-dva-goda/amp",
// "title": "WP : Риск развития заболеваний после коронавируса сохраняется после двух лет",
// "seendate": "20230821T194500Z",
// "socialimage": "https://vm.ru/img/vmru_cover.png",
// "domain": "vm.ru",
// "language": "Russian",
// "sourcecountry": "Russia"
function SearchResults({ results }: any) {
  return (
    <div className="flex flex-col items-center justify-center">
      {results && results.map((result: any) => (
        <SearchResult key={result.url} url={result.url} url_mobile={result.url_mobile} title={result.title} seendate={result.seendate} socialimage={result.socialimage} domain={result.domain} language={result.language} sourcecountry={result.sourcecountry} />
      ))}
    </div>
  )
}

function PaginatedSearchResults({ results, offset, resultsPerPage, pageCount, onPageChange }: any) {
  return (
    <div className="flex flex-col items-center justify-center">
      {results && results.length && results.slice(offset, offset + resultsPerPage).map((result: any) => (
        <SearchResult key={result.url} url={result.url} url_mobile={result.url_mobile} title={result.title} seendate={result.seendate} socialimage={result.socialimage} domain={result.domain} language={result.language} sourcecountry={result.sourcecountry} />
      ))}
      {results && results.length > 0 && <ReactPaginate onPageChange={onPageChange} pageCount={pageCount} pageRangeDisplayed={5} marginPagesDisplayed={2} containerClassName={'flex flex-row items-center justify-center'} pageClassName={'mx-2'} activeClassName={'text-blue-600'} />}
    </div>
  )
}

// This page implements a google-like search interface. A search bar is presented to the user, and the user can type in a search query. The search query is then sent to the backend, which returns a list of results. The results are then displayed to the user.
// The user can then click on a result, which will take them to the target website.
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])

  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const search = async (query: string) => {
    return new Promise((resolve, reject) => {
      query != '' && fetch('/api/search?q=' + query, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
          resolve(data)
        })
    });
  }

  useEffect(() => {
    search(searchQuery).then((_results: any) => {
      setResults(_results.data)
      setPageCount(Math.ceil(_results.data.length / itemsPerPage))
    });
  }, [searchQuery])

  // This function is called when the user types in the search bar.
  // It updates the searchQuery state variable.
  const handleSearchQueryChange = (e: any) => {
    setSearchQuery(e)
  }

  const onPageChange = (e: any) => {
    setItemOffset(e.selected * itemsPerPage)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <SearchInterface onSearch={handleSearchQueryChange} />
      <PaginatedSearchResults results={results} offset={itemOffset} resultsPerPage={itemsPerPage} onPageChange={onPageChange} pageCount={pageCount} />
    </div>
  )
}
