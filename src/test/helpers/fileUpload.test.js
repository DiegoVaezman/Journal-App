import { fileUpload } from '../../helpers/fileUpload';
import { v2 as cloudinary } from 'cloudinary';

//en la parte de testing podemos usar las keys de cloudinary porque no se compilan en la app y no se expondrán.
cloudinary.config({
    cloud_name: 'cloudy-vaezman',
    api_key: '677752268855965',
    api_secret: 'WzVa1A47mDj0bHp3Le_ePCvmMS0',
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
        expect(typeof url).toBe('string');

        //eliminar foto de cloudinary después del test
        const segments = url.split('/');
        const imageId = segments[segments.length - 1].replace('.jpg', '');
        await cloudinary.api.delete_resources(['journal/' + imageId], {
            resource_type: 'image',
        });
    });

    test('should return error', async () => {
        try {
            const file = new File([], 'foto');
            const url = await fileUpload(file);
        } catch (error) {
            expect(error.message).toBe('Unexpected error uploading image');
        }
    });
});
