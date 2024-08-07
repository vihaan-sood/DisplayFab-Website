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
        <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
            {maxSteps > 0 && (
                <>
                    <Paper
                        square
                        elevation={0}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: 50,
                            pl: 2,
                            bgcolor: 'background.default',
                        }}
                    >
                        <Typography>{items[activeStep].title}</Typography>
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
                                    <>
                                        <Box
                                            component="img"
                                            sx={{
                                                height: 255,
                                                display: 'block',
                                                maxWidth: 400,
                                                overflow: 'hidden',
                                                width: '100%',
                                            }}
                                            src={item?.image || NoImage}
                                            alt={item.title}
                                        />
                                        <Typography>{item.subheading}</Typography>
                                        <Button component={Link} to={`/post/${item.id}`}>
                                            Expand
                                        </Button>
                                    </>
                                ) : null}
                            </div>
                        ))}
                    </SwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        nextButton={
                            <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                            >
                                Next
                                {theme.direction === 'rtl' ? <FaAngleLeft /> : <FaAngleRight />}
                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
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

