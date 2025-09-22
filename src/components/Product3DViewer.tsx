const Product3DViewer = ({ modelUrl }: { modelUrl: string }) => (
  <model-viewer
    src={modelUrl}
    alt="3D Bell Model"
    auto-rotate
    camera-controls
    style={{ width: '100%', height: '400px', background: '#f8f8f8', borderRadius: '12px' }}
    shadow-intensity="1"
    exposure="1"
    ar
  ></model-viewer>
);

export default Product3DViewer;
