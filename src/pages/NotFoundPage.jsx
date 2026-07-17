import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-upnext-bg text-center">
      <h1 className="font-display text-5xl font-bold text-upnext-primary">404</h1>
      <p className="mt-2 text-upnext-muted">This page doesn't exist — even the trending algorithm couldn't find it.</p>
      <Link to="/home" className="mt-6 rounded-xl bg-upnext-primary px-5 py-3 font-medium text-white hover:bg-upnext-primaryDark">
        Back to Home
      </Link>
    </div>
  );
}