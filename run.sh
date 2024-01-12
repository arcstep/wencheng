#!/bin/bash

poetry run uvicorn backend.main:app --reload --port 8000
