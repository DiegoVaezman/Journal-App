import { ImageList, ImageListItem } from '@mui/material';

interface Props {
    images: string[];
}

export const ImageGalery = ({ images }: Props) => {
    return (
        <ImageList sx={{ width: '100%', height: 450 }} cols={4} rowHeight={200}>
            {images.map((image) => (
                <ImageListItem
                    key={image}
                    sx={{
                        overflow: 'hidden',
                    }}
                >
                    <img
                        src={`${image}`}
                        srcSet={`${image}`}
                        alt='Note_image'
                        loading='lazy'
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
};
