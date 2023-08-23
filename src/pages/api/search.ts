import axios from 'axios';

// "url": "https://vm.ru/news/1074115-uchenye-posledstviya-koronavirusa-mogut-sohranyatsya-dazhe-cherez-dva-goda",
// "url_mobile": "https://vm.ru/news/1074115-uchenye-posledstviya-koronavirusa-mogut-sohranyatsya-dazhe-cherez-dva-goda/amp",
// "title": "WP : Риск развития заболеваний после коронавируса сохраняется после двух лет",
// "seendate": "20230821T194500Z",
// "socialimage": "https://vm.ru/img/vmru_cover.png",
// "domain": "vm.ru",
// "language": "Russian",
// "sourcecountry": "Russia"
interface GDALTResult {
    url: string;
    url_mobile: string;
    title: string;
    seendate: string;
    socialimage: string;
    domain: string;
    language: string;
    sourcecountry: string;
}

async function gdelt_project_query(
    term: string,
    start_date?: string,
    end_date?: string,
    max_records: number = 250,
    format: string = 'json'
): Promise<GDALTResult[]> {
    function dateStr(str: string) {
        str = str.replaceAll('-','');
        str = str.replaceAll(':','');
        str = str.replaceAll(' ','');
        return str
      }
      if(!start_date) { // set to 24 hours ago YYYYMMDDHHMMSS
          const date = new Date();
          date.setDate(date.getDate() - 1);
          start_date = dateStr(date.toISOString().slice(0, 19).replace('T', ' '));
      }
      if(!end_date) { // set to now YYYYMMDDHHMMSS
          const date = new Date();
          end_date = dateStr(date.toISOString().slice(0, 19).replace('T', ' '));
      }
    // Build the URL.
    let url = 'https://api.gdeltproject.org/api/v2/doc/doc';
    url += '?query=' + term;
    url += '&mode=artlist';
    url += '&maxrecords=' + max_records.toString();
    url += '&startdatetime=' + start_date;
    url += '&enddatetime=' + end_date;
    url += '&format=' + format;
    try {
        // Query the API.
        const response = await axios.get(url);
        return response.data.articles
    } catch (error) {
        console.error('Error querying GDELT Project:', error);
        throw error;
    }
}

async function search_gdelt(term: string, options: any) {
    function cleanDate(d: string) {
        d = d.replaceAll('-','');
        d = d.replaceAll(':','');
        d = d.replaceAll(' ','');
        d = d.replaceAll('T','');
        return d
    }
    if(!options) {
        const now = new Date();
        let yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        options = {
            start_date: cleanDate(yesterday.toISOString().slice(0, 19)),
            end_date: cleanDate(now.toISOString().slice(0, 19)),
            max_records: 250,
            format: 'json'
        }
    }
    // get data from gdelt
    return gdelt_project_query(term, options.start_date, options.end_date, options.max_records, options.format);
}

export default async function handler(req: any, res: any) {
    const { q, source, options } = req.query
    const data = await search_gdelt(q, options)
    res.status(200).json({ data })
}

