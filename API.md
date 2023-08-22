# GDELT API Cheatsheet

## GDELT GEO 2.0 API Cheatsheet

**Base URL:** https://api.gdeltproject.org/api/v2/geo/geo

**Endpoints:**

- `/query` - Search by keywords, operators, etc
- `/location` - Search by location name
- `/locationcc` - Search by country code
- `/locationadm1` - Search by admin1 region
- `/domain` - Search by domain
- `/theme` - Search by GKG theme
- `/image` - Search images

### GEO Query Parameters

- `query` - keywords, phrases, operators to search for
- `mode` - type of map to generate  
- `format` - output format
- `timespan` - time range to search
- `maxpoints` - max locations to return
- `geores` - filter results by resolution
- `sortby` - sort results by date, tone, etc

### GEO Query Operators

- `"phrase"` - exact phrase match
- `-exclude` - exclude keywords
- `domain:` - filter by domain
- `location:` - filter by location name
- `locationcc:` - filter by country code
- `locationadm1:` - filter by admin1 region
- `imagetag:` - filter images by tag
- `tone:` - filter by tone threshold
- `theme:` - filter by GKG theme

### GEO Output Formats

- `html` - interactive map
- `geojson` - geojson data
- `csv` - csv data
- `rss` - rss feed
- `jsonfeed` - jsonfeed data

### GEO Examples

- `/query?trump` - map trump mentions  
- `/image?imagetag:"protest"` - map protest images
- `/theme?TERROR` - map terrorism mentions
- `/domain?bbc.com` - map BBC coverage

## GDELT Doc 2.0 API Cheatsheet

**Base URL:** https://api.gdeltproject.org/api/v2/doc/doc

### Doc Endpoints

- `/query` - Search by keywords, operators, etc
- `/url` - Retrieve content by URL
- `/gkg` - Search GKG entities
- `/theme` - Search by theme
- `/event` - Search by event
- `/mention` - Search mentions

### Doc Query Parameters

- `query` - keywords, phrases, operators to search for
- `mode` - docs or events mode
- `maxrecords` - max results to return
- `orderby` - order results by date, tone, etc
- `format` - output format

### Doc Query Operators

- `"phrase"` - exact phrase match
- `-exclude` - exclude keywords
- `url:` - filter by URL
- `domain:` - filter by domain
- `theme:` - filter by theme
- `event:` - filter by event
- `mention:` - filter by mention
- `sourcelang:` - filter by source language

### Doc Output Formats

- `json` - json data
- `csv` - csv table
- `rss` - rss feed
- `jsonfeed` - json feed

### Doc Examples

- `/query?trump` - search for trump
- `/url?https://cnn.com/article` - get article by url  
- `/theme?TERROR` - search terror theme
- `/event?06232015barackobama` - search Obama event
- `/mention?barackobama` - search Obama mentions

## Google News API

Base URL: https://newsapi.org/s/google-news-api

The Google News API provides endpoints to search articles, get headlines, and get everything.

To search articles:

```text
/v2/everything?q=QUERY&apiKey=f32d71baa04c4df8a127a04d783a128e
```

- q parameter specifies search query
- Returns articles matching the query

To get top headlines:

```text
/v2/top-headlines?country=us&apiKey=f32d71baa04c4df8a127a04d783a128e 
```

- country parameter specifies country code
- Returns current top headlines for that country

To get all articles:

```text
/v2/everything?apiKey=f32d71baa04c4df8a127a04d783a128e
```

- Fetches latest articles from all news sources

Parameters:

- q - Search query
- sources - Filter by news source 
- domains - Filter by domain
- from - Start date (YYYY-MM-DD)
- to - End date
- language - Filter by language code

The API returns results in JSON format containing headlines, content, metadata etc.

### Examples

https://newsapi.org/v2/everything?q=tesla&from=2023-02-01&sortBy=publishedAt&apiKey=f32d71baa04c4df8a127a04d783a128e

This searches for articles about "tesla" published after February 1, 2023 and sorts the results by publish date.

To break it down:

- Base URL: https://newsapi.org/v2/everything
- q=tesla - Search for articles containing "tesla"
- from=2023-02-01 - Return articles published after Feb 1, 2023
- sortBy=publishedAt - Sort results by publish date
- apiKey=YOUR_API_KEY - Pass your API key

You can also filter by source, domain, language, country and other parameters.

For example, to only get English articles from the US about Tesla by CNN:

```text
https://newsapi.org/v2/everything?q=tesla&from=2023-02-01&language=en&country=us&domains=cnn.com&apiKey=f32d71baa04c4df8a127a04d783a128e
```

The API returns the results in JSON format containing all the article headlines, content, images, etc. 
This provides a simple way to query the Google News API by keyword, filters, pagination, and sorting using the options available.
