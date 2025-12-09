# Beta By Drew

A full-stack web scraping application that helps outdoor enthusiasts find the best deals on gear from multiple retailers. Search for outdoor products and discover discounts across Backcountry, REI, Public Lands, Outdoor Gear Exchange, and Steep and Cheap.

## Features

- **Real-time Product Search**: Search for outdoor gear across 5+ major retailers simultaneously
- **Intelligent Price Comparison**: Automatically identifies and highlights the best deals
- **Smart Caching**: PostgreSQL database with 24-hour cache to reduce scraping load
- **Discount Explorer**: Browse top-discounted products across all retailers
- **Image Proxy**: Built-in proxy to handle CORS restrictions on product images
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Project Structure

This is a monorepo containing:

```
Beta-By-Drew/
├── backend/          # Flask-based Python web scraper
└── frontend/         # React + Vite frontend application
```

### Backend
- **Framework**: Flask (Python)
- **Web Scraping**: Selenium WebDriver with headless Chrome
- **Database**: PostgreSQL with fuzzy text search (pg_trgm)
- **Caching**: 24-hour product search cache with similarity matching
- **Deployment**: Configured for Heroku (Procfile included)

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.2.0
- **Styling**: Tailwind CSS + SASS
- **Routing**: React Router v6
- **Animations**: GSAP & Framer Motion

## Getting Started

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **PostgreSQL 12+** with `pg_trgm` extension
- **Chrome/Chromium browser** (for Selenium web scraping)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   FLASK_ENV=development
   DEBUG=False
   ```

5. Set up PostgreSQL database:
   ```sql
   CREATE DATABASE your_database_name;
   \c your_database_name
   CREATE EXTENSION pg_trgm;
   ```

6. Run the backend:
   ```bash
   python app.py
   ```

   The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```bash
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `FLASK_ENV` | Flask environment mode | `development` or `production` |
| `DEBUG` | Enable/disable debug mode | `False` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL (must start with `VITE_`) | `http://localhost:5000` |

**Note**: Vite requires the `VITE_` prefix for environment variables to be exposed to the client-side code.

## API Endpoints

### POST `/search`
Search for a product across all retailers.

**Request**:
```json
{
  "product": "patagonia nano puff jacket"
}
```

**Response**: Streaming JSON with real-time results as they're scraped.

### GET `/explore?page=1&limit=9`
Get top-discounted products from the database cache.

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 9)

**Response**:
```json
[
  {
    "product": "Product Name",
    "fullPrice": 120.00,
    "discountedPrice": 84.00,
    "discount": 30,
    "productUrl": "https://...",
    "productImages": ["https://..."]
  }
]
```

### GET `/proxy-image?url=<encoded_url>`
Proxy external product images to bypass CORS restrictions.

## Development

### Running Locally

1. Start the backend (in one terminal):
   ```bash
   cd backend
   source venv/bin/activate
   python app.py
   ```

2. Start the frontend (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

### Building for Production

#### Backend
The backend is production-ready via Gunicorn (configured in `Procfile`):
```bash
gunicorn app:app --timeout 90
```

#### Frontend
```bash
cd frontend
npm run build      # Creates optimized build in /dist
npm run preview    # Preview production build locally
```

The production build can be deployed to any static hosting service (Vercel, Netlify, etc.).

## Deployment

### Backend Deployment (Heroku)

The backend is configured for Heroku deployment with the included `Procfile`.

1. Create a Heroku app:
   ```bash
   heroku create your-app-name
   ```

2. Add PostgreSQL addon:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

3. Enable pg_trgm extension:
   ```bash
   heroku pg:psql
   CREATE EXTENSION pg_trgm;
   ```

4. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Frontend Deployment (Vercel/Netlify)

1. Set environment variable:
   - `VITE_API_BASE_URL`: Your backend URL

2. Deploy from the `frontend` directory

## Tech Stack

### Backend
- **Flask** 1.1.2 - Web framework
- **SQLAlchemy** 1.3.18 - ORM and database toolkit
- **Selenium** 4.25.0 - Web scraping automation
- **Pandas** 2.1.4 - Data processing
- **Gunicorn** 23.0.0 - WSGI server for production
- **python-dotenv** 1.0.0 - Environment variable management

### Frontend
- **React** 18.3.1 - UI library
- **Vite** 5.2.0 - Build tool and dev server
- **React Router** 6.26.0 - Client-side routing
- **Tailwind CSS** 3.4.6 - Utility-first CSS framework
- **GSAP** 3.12.5 - Animation library
- **Framer Motion** 11.2.13 - React animation library

## How It Works

1. **User searches** for a product (e.g., "Patagonia Nano Puff")
2. **Backend checks cache**: If searched in last 24 hours, returns cached results
3. **If not cached**: Launches Selenium to scrape 5 retailers simultaneously
4. **Results are filtered** using fuzzy text matching for relevance
5. **Frontend displays** results in real-time as they stream in
6. **Images are proxied** through the backend to avoid CORS issues

## Database Schema

### ProductSearch Table
- `id`: Primary key (Integer)
- `product`: Product name (String, unique, indexed with pg_trgm for fuzzy search)
- `result`: JSON results (Text)
- `discount`: Maximum discount percentage (Float)
- `last_searched`: Timestamp with timezone (DateTime)

**Caching Strategy**: Products with similarity >= 0.9 (using pg_trgm) are considered a cache hit and returned within 24 hours of last search.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Andrew Le**
GitHub: [@pandrewle](https://github.com/pandrewle)

---

Built with love for the outdoor community 🏔️
