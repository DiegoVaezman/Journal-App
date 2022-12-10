import { fileUpload } from '../../helpers/fileUpload';
import { v2 as cloudinary } from 'cloudinary';
require('dotenv').config({
    path: '.env.test',
});

//en la parte de testing podemos usar las keys de cloudinary porque no se compilan en la app y no se expondrán. Pero al subirlo a github si...
cloudinary.config({
    cloud_name: 'cloudy-vaezman',
    api_key: process.env.VITE_CLOUDINARY_API_KEY,
    api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
    secure: true,
});

describe('Testing fileUpload', () => {
    test('should upload file to cloudinary', async () => {
        const imageUrl =
            'https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?b=1&k=20&m=517188688&s=612x612&w=0&h=x8h70-SXuizg3dcqN4oVe9idppdt8FUVeBFemfaMU7w=';
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const file = new File([blob], 'foto');
        const url = await fileUpload(file);
        console.log(url);
        expect(typeof url).toBe('string');

        //eliminar foto de cloudinary después del test
        const segments = url.split('/');
        const imageId = segments[segments.length - 1].replace('.jpg', '');
        await cloudinary.api.delete_resources(['journal/' + imageId], {
            resource_type: 'image',
        });
    });

    test('should return error', async () => {
        //Hace un console.log del error por eso aparece en la consola Unexpected error uploading image
        try {
            const file = new File([], 'foto');
            const url = await fileUpload(file);
        } catch (error) {
            expect(error.message).toBe('Unexpected error uploading image');
        }
    });
});
