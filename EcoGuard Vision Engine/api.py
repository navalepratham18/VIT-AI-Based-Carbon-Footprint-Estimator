from fastapi import FastAPI, UploadFile
import predictor

app = FastAPI()

@app.post("/predict")

async def predict(file: UploadFile):

    path="temp.jpg"

    with open(path,"wb") as f:
        f.write(await file.read())

    result=predictor.predict(path)

    return result