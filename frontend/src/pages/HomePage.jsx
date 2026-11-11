import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const FEATURES = [
  { title: 'Fast plans', text: 'From everyday browsing to gigabit speeds for gaming and 4K streaming.' },
  { title: 'Simple billing', text: 'Bills are generated automatically and paid in one click from your dashboard.' },
  { title: 'Real support', text: 'Raise a ticket anytime and get email updates as our team works on it.' },
];

export default function HomePage() {
  const { user, isAdmin } = useAuth();

  return (
    <>
      <section className="hero">
        <div className="container py-5">
          <div className="row align-items-center py-lg-4">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold text-white mb-3">Internet that keeps up with you.</h1>
              <p className="lead text-white-50 mb-4">
                Browse broadband plans, subscribe in seconds, pay bills, and get support, all from one place.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/plans" className="btn btn-light btn-lg">View plans</Link>
                {user ? (
                  <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn btn-outline-light btn-lg">
                    Go to dashboard
                  </Link>
                ) : (
                  <Link to="/register" className="btn btn-outline-light btn-lg">Create account</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          {FEATURES.map((feature) => (
            <div className="col-md-4" key={feature.title}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="fw-bold">{feature.title}</h5>
                  <p className="text-muted mb-0">{feature.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
