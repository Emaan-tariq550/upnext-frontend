export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-upnext-bg">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-upnext-primary border-t-transparent" />
      <p className="text-sm text-upnext-muted">{message}</p>
    </div>
  );
}