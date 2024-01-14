import numpy as np
import tensorflow as tf
from PIL import Image





model = tf.keras.models.load_model("app/model_work/keras_mnist1.h5")



def predict_number(image_file):

    print(image_file)
    img = Image.open(image_file)
    img = img.resize((20,20),Image.BICUBIC)
    img = img.convert("L")
    bordered_image = Image.new("L", (28, 28), 0)
    bordered_image.paste(img, (4, 4))
    img = np.array(bordered_image)

    img = img.reshape(-1,28,28, 1)
    # img[img<=50] = 0
    # img[img > 50] = 255
    img = img/255.0
        

    res = np.argmax((model.predict(img)))
    print(np.argmax(res))

    return res