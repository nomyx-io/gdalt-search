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

export default async function handler(req: any, res: any) {
    // get q from query string
    const { q } = req.query;
    // get data from gdelt
    const data = await gdelt_project_query(q);
    // return data
    res.status(200).json({ data })
}