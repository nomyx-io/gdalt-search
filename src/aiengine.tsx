import 'dotenv';
import { jsonrepair } from 'jsonrepair'
import axios from 'axios';

const apiInst = `# GDELT API Cheatsheet

## GDELT GEO 2.0 API Cheatsheet

**Base URL:** https://api.gdeltproject.org/api/v2/geo/geo

**Endpoints:**

- \`/query\` - Search by keywords, operators, etc
- \`/location\` - Search by location name
- \`/locationcc\` - Search by country code
- \`/locationadm1\` - Search by admin1 region
- \`/domain\` - Search by domain
- \`/theme\` - Search by GKG theme
- \`/image\` - Search images

### GEO Query Parameters

- \`query\` - keywords, phrases, operators to search for
- \`mode\` - type of map to generate  
- \`format\` - output format
- \`timespan\` - time range to search
- \`maxpoints\` - max locations to return
- \`geores\` - filter results by resolution
- \`sortby\` - sort results by date, tone, etc

### GEO Query Operators

- \`"phrase"\` - exact phrase match
- \`-exclude\` - exclude keywords
- \`domain:\` - filter by domain
- \`location:\` - filter by location name
- \`locationcc:\` - filter by country code
- \`locationadm1:\` - filter by admin1 region
- \`imagetag:\` - filter images by tag
- \`tone:\` - filter by tone threshold
- \`theme:\` - filter by GKG theme

### GEO Output Formats

- \`html\` - interactive map
- \`geojson\` - geojson data
- \`csv\` - csv data
- \`rss\` - rss feed
- \`jsonfeed\` - jsonfeed data

### GEO Examples

- \`/query?trump\` - map trump mentions  
- \`/image?imagetag:"protest"\` - map protest images
- \`/theme?TERROR\` - map terrorism mentions
- \`/domain?bbc.com\` - map BBC coverage

## GDELT Doc 2.0 API Cheatsheet

**Base URL:** https://api.gdeltproject.org/api/v2/doc/doc

### Doc Endpoints

- \`/query\` - Search by keywords, operators, etc
- \`/url\` - Retrieve content by URL
- \`/gkg\` - Search GKG entities
- \`/theme\` - Search by theme
- \`/event\` - Search by event
- \`/mention\` - Search mentions

### Doc Query Parameters

- \`query\` - keywords, phrases, operators to search for
- \`mode\` - docs or events mode
- \`maxrecords\` - max results to return
- \`orderby\` - order results by date, tone, etc
- \`format\` - output format

### Doc Query Operators

- \`"phrase"\` - exact phrase match
- \`-exclude\` - exclude keywords
- \`url:\` - filter by URL
- \`domain:\` - filter by domain
- \`theme:\` - filter by theme
- \`event:\` - filter by event
- \`mention:\` - filter by mention
- \`sourcelang:\` - filter by source language

### Doc Output Formats

- \`json\` - json data
- \`csv\` - csv table
- \`rss\` - rss feed
- \`jsonfeed\` - json feed

### Doc Examples

- \`/query?trump\` - search for trump
- \`/url?https://cnn.com/article\` - get article by url  
- \`/theme?TERROR\` - search terror theme
- \`/event?06232015barackobama\` - search Obama event
- \`/mention?barackobama\` - search Obama mentions

## Google News API

Base URL: https://newsapi.org/s/google-news-api

The Google News API provides endpoints to search articles, get headlines, and get everything.

To search articles:

\`\`\`text
/v2/everything?q=QUERY&apiKey=${process.env.NEWS_API_KEY}
\`\`\`

- q parameter specifies search query
- Returns articles matching the query

To get top headlines:

\`\`\`text
/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY} 
\`\`\`

- country parameter specifies country code
- Returns current top headlines for that country

To get all articles:

\`\`\`text
/v2/everything?apiKey=${process.env.NEWS_API_KEY}
\`\`\`

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

https://newsapi.org/v2/everything?q=tesla&from=2023-02-01&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}

This searches for articles about "tesla" published after February 1, 2023 and sorts the results by publish date.

To break it down:

- Base URL: https://newsapi.org/v2/everything
- q=tesla - Search for articles containing "tesla"
- from=2023-02-01 - Return articles published after Feb 1, 2023
- sortBy=publishedAt - Sort results by publish date
- apiKey=YOUR_API_KEY - Pass your API key

You can also filter by source, domain, language, country and other parameters.

For example, to only get English articles from the US about Tesla by CNN:

\`\`\`text
https://newsapi.org/v2/everything?q=tesla&from=2023-02-01&language=en&country=us&domains=cnn.com&apiKey=${process.env.NEWS_API_KEY}
\`\`\`

The API returns the results in JSON format containing all the article headlines, content, images, etc. 
This provides a simple way to query the Google News API by keyword, filters, pagination, and sorting using the options available.
`

function calculatePayloadSize(payload: any): number {
    return Buffer.byteLength(JSON.stringify(payload), 'utf8');
}

async function sendRequest(request: any): Promise<any> {
    let response: any = null;
    let payload = {
        model: 'gpt-4',
        max_tokens: 8192,
        temperature: 1,
        top_p: 1,
        messages: [{
            role: 'user',
            content: request
        }]
    }
    let payloadSize = calculatePayloadSize(payload);
    payload.max_tokens = Math.min(8192, Math.max(1, Math.floor(8192 * (payloadSize / 8192))));
    try {
        response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            JSON.stringify(payload), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });
        if(!response) throw new Error('No response');
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            response = response.data.choices[0].message.content;
        } else {
            throw new Error('No completion found');
        }
    } catch (error: any) { throw error;  }
    return response;
};

// returns a function that can be called to send a request to the AI. the prompt defines the main
// prompt that will be sent to the AI. The prompt may contain a mumber of replacement markers.
// the markers are defined as {0}, {1}, {2}, etc. The function returns a function that takes parameters
// that will replace the markers in the prompt. The function returns a promise that resolves to the
// response from the AI.
export function createAIFunction(prompt: any) {
    return function (...args: any[]) {
        let request = prompt;
        for (let i = 0; i < args.length; i++) {
            request = request.replace(`{${i}}`, args[i]);
        }
        return sendRequest(request);
    }
}

//const aiFunction = createAIFunction('Create a {0} that {1}.');
// aiFunction('function', 'returns the sum of two numbers').then(console.log);
async function performTask(_task: string, format: string, input: any = null) {
    input = input ? `Input: ${input}` : '';
    return new Promise((resolve, reject) => {
        const prompt = `You are a non-conversational data manipuulation, search and analysis agent. You perform the following task then output its result in the given JSON format:
        Task: ${_task}
        Format: ${format}
        ${input}
        \n** You must return all your output using JSON format ${format} **\n`
        sendRequest(prompt).then((res) => {
            try {
                resolve(JSON.parse(jsonrepair(res)));
            }
            catch(e) {
                console.log('error', e)
            }
        }).catch(reject);
    });
}

export async function buildSearchPlan(query: any) {
    const results = await performTask(`Given the following search APIs:\n\n---\n${apiInst}\n---\n\nand user search query, build a step-by-step search and analysis plan that will best satisfy the user's query. This might involve querying for keywords, performing analysis on the results, performing searches based on the results of other searches, etc. Size and scope each task so that it is performable by you.`, '{ task: string, description: string, step: number }', `USER QUERY: ${query}`);
    return results;
}
export async function buildSearchQueries(query: any) {
    const results = await performTask(`Given the following search APIs:\n\n---\n${apiInst}\n---\n\nand user search query, build a series of search API URLS that can be used to search for the user's query.`, 'string[]', `USER QUERY: ${query}`);
    return results;
}

export async function buildSearchQuery(query: any) {
    const results = await performTask(`Given the following search APIs:\n\n---\n${apiInst}\n---\n\nand search query, build a search API URL that can be used to search for the specified query.`, 'string[]', `SEARCH QUERY: ${query}`);
    return results;
}


// turns a json object into a string of comma-separated key-value pairs that nest arbirarily deep
// for example: {a: 1, b: {c: 2, d: {e: 3}}} becomes "a: 1, b: c: 2, d: e: 3"
function compactify(json: any) {
    let ret = '';
    for (const key in json) {
        if (typeof json[key] === 'object') {
            ret += `${key}: ${compactify(json[key])}, `;
        } else {
            ret += `${key}: ${json[key]}, `;
        }
    }
    return ret.slice(0, -2);
}