export default function VideoPlayer({ url }) {
  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1];
      if (videoId.includes('&')) {
        videoId = videoId.split('&')[0];
      }
    }
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1];
      if (videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }
    }
    else if (url.includes('youtube.com/v/')) {
      videoId = url.split('/v/')[1];
      if (videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div className="aspect-video w-full mb-4">
      <iframe
        src={embedUrl}
        title="Video Player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded"
      ></iframe>
    </div>
  );
}