export default function VideoPlayer({ url }) {
  return (
    <div className="aspect-video w-full mb-4">
      <iframe
        src={url}
        title="Video Player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded"
      ></iframe>
    </div>
  );
}
