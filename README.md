# 🦜👸 Installation Guide

## 1. Create the Project

You can directly clone the project from `github`:

```shell
git clone https://github.com/arcstep/wencheng
```

The main file directory structure is as follows:
```
backend/
backend/main.py
...

ui/
ui/api
ui/components
ui/pages
ui/index.js
...

.env (you need to create this file yourself, or modify it from .env.sample)
run.sh
...
```

## 2. Install the Environment

### Choose Python Environment

It is recommended to install `python 3.10`. Please test other versions yourself.

### Install Poetry Tool

You can use the following command to install the `poetry` tool on Ubuntu:

```bash
curl -sSL https://install.python-poetry.org | bash
```

Then, you need to close and reopen your terminal window for the changes to take effect.

You can manually add Poetry to your PATH by adding the following line to your shell configuration file (such as ~/.bashrc or ~/.zshrc):

```bash
export PATH="$HOME/.poetry/bin:$PATH"
```

Then, you can verify whether Poetry has been successfully installed by running the following command:

```bash
poetry --version
```

### Update Python Packages Using Poetry

Run the following command in the terminal:

```bash
poetry update
```

This will check all the dependent packages listed in your pyproject.toml file to see if there are available updates. If there are, it will download and install these updates.

## 3. Configure the Service

### Configure the APIKEY and Data Directory of the Large Model

Create a `.env` file in the root directory of the backend service code to store environment variables. These environment variables can be read by your application.

For example, your `.env` file might look like this:

``` 
## .env file

## OPENAI
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
OPENAI_BASE_URL="https://<your_base_url>"

## adi-textlong
ZHIPUAI_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxx"

## 🦜🦜🦜textlong
TEXTLONG_FOLDER="/data"

```

### Q&A Materials

Your Q&A materials should be saved in: `TEXTLONG_FOLDER/__QA__/abc.xlsx`

In the abc.xlsx file, all sheets containing the character `QA` are Q&A data tables, with questions saved in columns starting with Q and answers saved in columns starting with A;<br>
When querying the AI in the future, it will automatically match the user's question with the questions in the Q column, and use the answers in the A column as reference materials to help the AI generate high-quality answers.

### Prompt Engineering

When the backend API is started for the first time, it will automatically generate prompts in the `TEXTLONG_FOLDER` subdirectory, which can be optimized for prompt engineering.

## 4. Start the Backend API

(1) Execute the `run.sh` script to start the backend service and open port 8000.

(2) The vector encoding model uses the `huggingface` model, which will be automatically downloaded during startup. Due to the large model size or network latency, this may take a long time.

(3) After startup, you can view the API at `http://{host_name}:8000/docs`

## 5. Start the UI Web Page

After entering the `ui` directory, execute:

```shell
yarn build
yarn start
```

You can view the web service at `http://{host_name}:3000`.