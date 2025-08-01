import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TensorFlow logs

import json
import random
import numpy as np
from keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions
from keras.preprocessing import image
import sys
import base64
from io import BytesIO
from PIL import Image

quotes = {
    "plant": [
        "Ah, the sunlight tastes divine today.",
        "The soil is moist, but is my purpose fulfilled?",
        "I reach toward the heavens, yet remain rooted in doubt."
    ],
    "not_plant": [
        "I am no plant, merely a bystander in chlorophyll's world.",
        "This isn't a plant, it’s a poser in green.",
        "My leaves are imaginary, like my hopes."
    ]
}

model = MobileNetV2(weights='imagenet')

def is_plant(preds):
    plant_keywords = [
        'plant', 'tree', 'flower', 'cactus', 'sunflower', 'palm', 'corn',
        'maize', 'mushroom', 'daisy', 'tulip', 'rose', 'pine', 'oak',
        'fern', 'herb', 'shrub', 'weed'
    ]
    for _, label, prob in preds[0]:
        if any(keyword in label.lower() for keyword in plant_keywords):
            return True
    return False

def main():
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    img_data = data['image'].split(",")[1]

    img_bytes = base64.b64decode(img_data)
    img = Image.open(BytesIO(img_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    preds = model.predict(img_array, verbose=0)
    decoded_preds = decode_predictions(preds, top=3)

    category = "plant" if is_plant(decoded_preds) else "not_plant"
    translation = random.choice(quotes[category])

    result = {
        "mood": category,
        "translation": translation
    }
    print(json.dumps(result))  # Only this gets printed

if __name__ == "__main__":
    main()
