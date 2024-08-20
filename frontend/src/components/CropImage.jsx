import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button, Box, Slider, Typography, Modal } from '@mui/material';
import getCroppedImg from '../utils/getCroppedImg'; 

const CropImage = ({ onSave }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropSave = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const croppedImageURL = URL.createObjectURL(croppedImageBlob);
            onSave(croppedImageBlob, croppedImageURL); // Pass both the blob and URL
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error cropping image:", err);
        }
    };

    return (
        <Box>
            <Button variant="contained" component="label">
                Upload Image
                <input type="file" hidden onChange={handleImageUpload} />
            </Button>

            {imageSrc && (
                <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <Box sx={{ width: '80%', height: '80%', margin: 'auto', mt: 5, p: 2, backgroundColor: '#fff', boxShadow: 24 }}>
                        <div className="crop-container">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={4 / 3}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="controls">
                            <Slider
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e, zoom) => setZoom(zoom)}
                            />
                            <Button onClick={handleCropSave} variant="contained" sx={{ mt: 2 }}>
                                Save
                            </Button>
                        </div>
                    </Box>
                </Modal>
            )}
        </Box>
    );
};

export default CropImage;