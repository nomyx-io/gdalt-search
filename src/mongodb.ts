// mongodb connection
// ----------------------------------------------------------------------
import mongoose from 'mongoose';

const db = process.env.MONGODB_URL as string;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    } as any);
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;

const SearchResultsSchema = ({
    url: String,
    url_mobile: String,
    title: String,
    seendate: String,
    socialimage: String,
    domain: String,
    language: String,
    sourcecountry: String,
});

export const SearchResults = mongoose.model('SearchResults', SearchResultsSchema as any);

const SearchQuerySchema = ({
    query: String,
    results: [SearchResultsSchema],
});

export const SearchQuery = mongoose.model('SearchQuery', SearchQuerySchema as any);

const SearchAddressSchema = ({
  address: String,
  queries: [SearchQuerySchema],
});

export const SearchAddress = mongoose.model('SearchAddress', SearchAddressSchema as any);

function insertSearchResults(searcher: string, searchQuery: string, searchResults: any) {
  const searchResultsModel = new SearchResults(searchResults);
  const searchQueryModel = new SearchQuery({
    query: searchQuery,
    results: [searchResultsModel],
  });
  const searchAddressModel = new SearchAddress({
    address: searcher,
    queries: [searchQueryModel],
  });
  searchAddressModel.save();
}