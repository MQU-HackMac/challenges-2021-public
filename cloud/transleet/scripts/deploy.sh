#!/bin/bash

PROJECT_ID=test-kctf

gcloud builds submit --tag gcr.io/$PROJECT_ID/transleet --project=$PROJECT_ID challenge && \
gcloud run deploy --image gcr.io/$PROJECT_ID/transleet --project=$PROJECT_ID --platform managed --region=asia-southeast1