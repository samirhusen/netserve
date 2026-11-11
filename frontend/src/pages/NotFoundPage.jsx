import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-4 fw-bold">404</h1>
      <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}
