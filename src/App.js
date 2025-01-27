import React, { useState, useRef } from 'react';
import { Button, Drawer, IconButton, Grid, Box, Paper } from '@mui/material';
import { Upload as UploadIcon, RotateRight as RotateRightIcon, Flip as FlipIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

function App() {
  const [image, setImage] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [images, setImages] = useState([]);
  const [croppedImage, setCroppedImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const cropperRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setOpenDrawer(true); // Open the drawer for editing
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      setCroppedImage(cropperRef.current.getCroppedCanvas().toDataURL());
    }
  };

  const handleRotate = () => {
    setRotation((prevRotation) => prevRotation + 90); // Rotate 90 degrees clockwise
  };

  const handleFlipHorizontal = () => {
    setFlipHorizontal((prevFlipHorizontal) => !prevFlipHorizontal);
  };

  const handleFlipVertical = () => {
    setFlipVertical((prevFlipVertical) => !prevFlipVertical);
  };

  const handleReplaceImage = () => {
    setImage(null);
    setOpenDrawer(false);
  };

  const handleSaveImage = () => {
    const finalImage = croppedImage || image; // Use cropped image if available, else original image
    setImages([...images, finalImage]); // Add the final image to the images list
    setImage(null);
    setOpenDrawer(false);
  };

  // Create a CSS transform string to apply rotation and flips
  const getTransformStyle = () => {
    let transform = `rotate(${rotation}deg)`;
    if (flipHorizontal) {
      transform += ' scaleX(-1)';
    }
    if (flipVertical) {
      transform += ' scaleY(-1)';
    }
    return transform;
  };

  return (
    <div>
      <Box sx={{ padding: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
      </Box>

      {/* Drawer for editing the image */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{ width: 400 }}
      >
        <Box sx={{ padding: 2 }}>
          <Box sx={{ marginBottom: 2 }}>
            <Paper>
              {image && (
                <Cropper
                  ref={cropperRef}
                  src={image}
                  style={{
                    height: 400,
                    width: '100%',
                    transform: getTransformStyle(), // Apply the rotation and flip styles here
                  }}
                  aspectRatio={16 / 9}
                  guides={false}
                  cropBoxResizable
                  viewMode={1}
                />
              )}
            </Paper>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton onClick={handleRotate}>
              <RotateRightIcon />
            </IconButton>
            <IconButton onClick={handleFlipHorizontal}>
              <FlipIcon />
            </IconButton>
            <IconButton onClick={handleFlipVertical}>
              <FlipIcon sx={{ transform: 'rotate(90deg)' }} />
            </IconButton>
            <IconButton onClick={handleReplaceImage}>
              <RefreshIcon />
            </IconButton>
          </Box>

          <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="secondary" onClick={handleReplaceImage}>
              Replace Image
            </Button>
            <Button variant="contained" onClick={handleSaveImage}>
              Save Image
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Masonry grid for displaying images */}
      <Grid container spacing={2} sx={{ padding: 2 }}>
        {images.map((imgSrc, index) => (
          <Grid item xs={4} key={index}>
            <Paper elevation={3}>
              <img
                src={imgSrc}
                alt={`Uploaded ${index}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default App;
