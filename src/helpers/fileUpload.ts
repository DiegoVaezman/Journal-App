


export const fileUpload = async (file: File) => {
    if (!file) throw new Error('No file to upload');
    const cloudUrl = 'https://api.cloudinary.com/v1_1/cloudy-vaezman/upload';
    const formData = new FormData();
    formData.append('upload_preset', 'react-journal');
    formData.append('file', file);

    try {
        const res = await fetch(cloudUrl, {
            method: 'POST',
            body: formData
        });
        if (!res.ok) throw new Error('Unexpected error uploading image');
        const cloudRes = await res.json();

        return cloudRes.secure_url;

    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }

}