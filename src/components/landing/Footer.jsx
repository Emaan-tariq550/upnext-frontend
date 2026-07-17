export default function Footer() {
  return (
    <footer className="border-t border-upnext-border px-6 py-10 text-center text-sm text-upnext-muted">
      <p className="font-display text-upnext-primary">UPNEXT</p>
      <p className="mt-2">Become The Name Everyone Knows. © {new Date().getFullYear()}</p>
    </footer>
  );
}