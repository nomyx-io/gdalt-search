"use client";

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';

interface HeaderProps {
  onSearch: (searchQuery: string) => void;
  results: any[];
}

import "./components.css";

// Search Functions
const fetchSearch = (query: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    query && query !== '' && fetch(`/api/search?q=${query}`, { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        resolve(data)
      });
  });
}

const initialFilters = {
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  endDate: new Date(),
};

export const Header: React.FC<HeaderProps> = ({ onSearch, results }: any) => {
  const [query, setQuery] = useState<string>('');
  const [toggled, setToggled] = useState<boolean>(false);
  const onChange = (e: any) => {
    setQuery(e.target ? e.target.value : e);
  }
  const onModeChange = (_toggled: boolean) => {
    setToggled(_toggled);
    console.log('toggled', _toggled);
    // change mode to day/night
    if(_toggled)
      document.body.classList.add('day-mode');
    else 
      document.body.classList.remove('day-mode');
  }
  return (
    <header>
      <div className="logo">realnews.ai</div>
      <SearchBox query={query} onChange={onChange} onSearch={onSearch} results={results} />
      <div className="settings">Setting Icons</div>
      {results && results.length > 0 && <nav className="nav-pills">
        <a href="##" className="active">Search</a>
        <a href="##">News</a>
        <a href="##">Images</a>
        <a href="##">Geo</a>
        <a href="##">Trends</a>
      </nav>}
      <ToggleButton onToggle={onModeChange} toggled={toggled} />
    </header>
  );
};


interface SearchBoxProps {
  query: string;
  results: any[];
  onChange: (e: any) => void;
  onSearch: (searchQuery: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ query, results, onChange, onSearch }) => {
  
  const onKeyPress = (e: any) => {
    onChange(e.target.value);
    if (e.key === 'Enter') {
      onSearch(e.target.value);
    }
  }

  const onSearchClick = () => {
    onSearch(query);
  }

  return (
    <div className={`search-box ${!results.length ? 'initial-view' : ''}`}>
      <input type="text" placeholder="Enter keywords, locations, themes..." value={query} onChange={onChange} onKeyPress={onKeyPress} />
      <button onClick={onSearchClick}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-hourglass-split" viewBox="0 0 16 16">
<path d="M8 0a2 2 0 0 1 2 2v2h-4V2a2 2 0 0 1 2-2zm6 4h-2V2a4 4 0 0 0-4-4h-2a4 4 0 0 0-4 4v2H2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v2a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4V8h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM4 4h8v2H4V4zm8 8H4V8h8v4z"/>
</svg></button>
    </div>
  );
};


interface SearchResultsProps {
  results: any[];
  offset: number;
  itemsPerPage: number;
  setPageCount: (setterFn: (oldState: any) => any) => void;
  pageCount: number;
  onPageChange: (selectedItem: {selected: number}) => void;
}


export const SearchResults: React.FC<SearchResultsProps> = ({ results, offset, itemsPerPage, pageCount, onPageChange }: any) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {results && results.slice(offset, offset + itemsPerPage).map((result: any, index: any) => {
        const {
          url,
          url_mobile,
          title,
          seendate,
          socialimage,
          domain,
          language,
          sourcecountry
        } = result;
        return (
          <ResultCard
            key={index}
            url={url}
            url_mobile={url_mobile}
            title={title}
            seendate={seendate}
            socialimage={socialimage}
            domain={domain}
            language={language}
            sourcecountry={sourcecountry}
          />
        );
      })}
      {results && results.length > 0 &&
        <ReactPaginate
          pageCount={pageCount}
          onPageChange={onPageChange}
          containerClassName={'pagination'}
        />
      }
    </div>
  );
};

interface ResultCardProps {
  url: string;
  url_mobile: string;
  title: string;
  seendate: string;
  socialimage: string;
  domain: string;
  language: string;
  sourcecountry: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  url, url_mobile, title, seendate, socialimage, domain, language, sourcecountry
}: any) => (
  <a href={url} target="_blank">
    <div className="result-card">
      <img src={socialimage} alt="social image" height="100px" />
      <div className="content">
        <h3 className="url">{title}</h3>
        <h2 className="title">{url}</h2>
        <div className="metadata">
          <span className="source">{domain}</span>
          <span className="language">{language}</span>
          <span className="source-country">{sourcecountry}</span>
          <span className="date">{seendate}</span>
        </div>
      </div>
    </div>
  </a>
);

interface ToggleButtonProps {
  toggled?: boolean;
  onToggle: (toggled: boolean) => void;
}

//  nice toggle button made out of a checkbox and CSS
export const ToggleButton: React.FC<ToggleButtonProps> = ({ toggled, onToggle }) => {
  const _toggled = toggled ? 'checked' : '';
  const onChange = (e: any) => {
    onToggle(e.target.checked);
  }
  return (
    <div className="toggle-button">
      <input type="checkbox" id="toggle" onChange={onChange} value={_toggled} />
      <label htmlFor="toggle"></label>
    </div>
  );
}

interface WordCloudWord {
  text: string;
  value: number;
}

interface WordCloudProps {
  words: WordCloudWord[];
}

export const WordCloud: React.FC<WordCloudProps> = ({ words }: any) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '18px Arial';
        ctx.fillStyle = 'black';
        words.forEach((word: WordCloudWord, index: number) => {
          ctx.fillText(word.text, 0, index * 20);
        });
      }
    }
  }, [canvasRef, words]);
  const relativeWidth = (maxWidth: number, value: number) => {
    return Math.round((value / 100) * maxWidth);
  }
  const wordWidth = (word: WordCloudWord) => {
    return relativeWidth(100, word.value);
  }
  return (
    <div className="word-cloud">
      <canvas id="hiddenCanvas" ref={canvasRef} className="hidden-canvas"></canvas>
      {words.map((word: WordCloudWord, index: number) => {
        return (
          <div className="word" key={index} id={`word-${index}`} style={{ width: `${wordWidth(word)}px` }}>
            {word.text}
          </div>
        );
      })}
    </div>
  );
}

export default function() {

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [itemOffset, setItemOffset] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [pageCount, setPageCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    fetchSearch(searchQuery).then((data: any) => {
      if (isMounted){
        const resultData = data.data ? data.data : data;
        setSearchResults(resultData);
        setPageCount(Math.ceil(resultData.length / itemsPerPage));
      }
    }
    );
    return () => { isMounted = false };
  }
  , [searchQuery]);

  const onPageChange = (e: any) => {
    const selectedPage = e.selected;
    const offset = selectedPage * itemsPerPage;
    setItemOffset(offset);
  }

  return (
    <div>
      <Header onSearch={setSearchQuery} results={searchResults} />
      <SearchResults
        results={searchResults}
        offset={itemOffset}
        itemsPerPage={itemsPerPage}
        setPageCount={setPageCount}
        pageCount={pageCount}
        onPageChange={onPageChange}
      />
    </div>
  );
}