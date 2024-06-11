let model;

window.onload = async () => {
    model = await tf.loadLayersModel('tfjs_target_dir/model.json');
    console.log('Modelo Cargado');
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    processImage(file);
}

function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    processImage(file);
    document.getElementById('dropzone').classList.remove('dragover');
}

function handleDragOver(event) {
    event.preventDefault();
    document.getElementById('dropzone').classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    document.getElementById('dropzone').classList.remove('dragover');
}

async function processImage(file) {
    const imageContainer = document.getElementById('imageContainer');
    const resultDiv = document.getElementById('result');
    
    // Limpiar contenedores anteriores
    imageContainer.innerHTML = '';
    resultDiv.innerHTML = '';

    const image = document.createElement('img');
    image.src = URL.createObjectURL(file);
    image.onload = async () => {
        // Preprocesar la imagen
        const tensor = tf.browser.fromPixels(image)
            .resizeNearestNeighbor([256, 256])
            .toFloat()
            .expandDims()
            .div(255.0);  // Normalizar los valores de los píxeles

        // Realizar la predicción
        const predictions = await model.predict(tensor).data();
        
        // Mostrar la imagen
        imageContainer.appendChild(image);

        // Interpretar las predicciones
        const classNames = ['COVID', 'PNEUMONIA', 'NORMAL'];
        const predictedClass = classNames[predictions.indexOf(Math.max(...predictions))];
        resultDiv.innerHTML = `Predicción: ${predictedClass}`;
    }
}
