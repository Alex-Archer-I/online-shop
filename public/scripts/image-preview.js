const imgInput = document.querySelector('#image-uploader input');
const imgPreview = document.querySelector('#image-uploader img');

console.log('Img-preview is here!');

const updateImgPreview = () => {
    const files = imgInput.files;

    if (!files || files.length === 0) {
        imgPreview.style.display = 'none';
        return;
    };

    imgInput.src = URL.createObjectURL(files[0]);
    imgInput.style.display = 'block';
};

imgInput.addEventListener('change', updateImgPreview);