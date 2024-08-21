import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import SwipeableViews from 'react-swipeable-views';
import { Link } from 'react-router-dom';
import NoImage from '../assets/no_image.webp';

function Carousel({ items = [] }) {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = items.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    return (
        <Box sx={{ maxWidth: '100%', flexGrow: 1, bgcolor: '#f5f5f5', borderRadius: 2, p: 2, boxShadow: 3 }}>
            {maxSteps > 0 && (
                <>
                    <Paper
                        square
                        elevation={0}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 60,
                            pl: 2,
                            bgcolor: 'background.paper',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Typography variant="h6" component="div" sx={{ textAlign: 'center', width: '100%' }}>
                            {items[activeStep].title}
                        </Typography>
                    </Paper>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                    >
                        {items.map((item, index) => (
                            <div key={item.id}>
                                {Math.abs(activeStep - index) <= 2 ? (
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Box
                                            component={Link}
                                            to={`/post/${item.id}`}
                                            sx={{
                                                display: 'block',
                                                width: '100%',
                                                height: 400, // Increased height for a taller carousel
                                                overflow: 'hidden',
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                sx={{
                                                    height: '100%',
                                                    width: '100%',
                                                    objectFit: 'cover',
                                                }}
                                                src={item?.image || NoImage}
                                                alt={item.title}
                                            />
                                        </Box>
                                    </Box>
                                ) : null}
                            </div>
                        ))}
                    </SwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        sx={{ bgcolor: 'background.paper', borderTop: `1px solid ${theme.palette.divider}` }}
                        nextButton={
                            <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                                sx={{ color: theme.palette.primary.main }}
                            >
                                Next
                                {theme.direction === 'rtl' ? <FaAngleLeft /> : <FaAngleRight />}
                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={handleBack} disabled={activeStep === 0} sx={{ color: theme.palette.primary.main }}>
                                {theme.direction === 'ltr' ? <FaAngleLeft /> : <FaAngleRight />}
                                Back
                            </Button>
                        }
                    />
                </>
            )}
        </Box>
    );
}

export default Carousel;


