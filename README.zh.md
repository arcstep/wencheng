# 🦜👸 安装指南

## 1、创建项目

可以从`github`直接拉取项目：

```shell
git clone https://github.com/arcstep/wencheng
```

主要的文件目录结构为：
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

.env(这个文件需要你自己创建，或从.env.sample修改而来)
run.sh
...
```

## 2、安装环境

### 选择python环境

建议安装`python 3.10`，其他版本请自行测试。

### 安装poetry工具

可以使用以下命令在 Ubuntu 上安装`poetry`工具：

```bash
curl -sSL https://install.python-poetry.org | bash
```

然后，你需要关闭并重新打开你的终端窗口，以便让改动生效。

通过添加以下行到你的 shell 配置文件（如 ~/.bashrc 或 ~/.zshrc）来手动添加 Poetry 到你的 PATH：

```bash
export PATH="$HOME/.poetry/bin:$PATH"
```

然后，你可以通过运行以下命令来验证 Poetry 是否已经成功安装：

```bash
poetry --version
```

### 使用poetry更新python包

在终端中运行以下命令：

```bash
poetry update
```

这会检查你的 pyproject.toml 文件中列出的所有依赖包，看看是否有可用的更新。如果有，它会下载并安装这些更新。

## 3、配置服务

### 配置大模型的APIKEY和数据目录

在后台服务代码所在的根目录位置创建一个 `.env` 文件来存储环境变量。这些环境变量可以被你的应用程序读取。

例如，你的 `.env` 文件可能看起来像这样：

``` 
## .env 文件

## OPENAI
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
OPENAI_BASE_URL="https://<your_base_url>"

## adi-textlong
ZHIPUAI_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxx"

## 🦜🦜🦜textlong
TEXTLONG_FOLDER="/data"

```

### 问答资料

你的QA资料应该保存在：`TEXTLONG_FOLDER/__QA__/abc.xlsx`

在abc.xlsx文件中，所有包含`QA`字符的sheet数据表都是问答资料表，以Q开头的列保存问题，以A开头的列保存答案；<br>
后续对AI查询时会自动将用户提问与Q列中的问题匹配，然后将A列中的答案作为参考资料，帮助AI进一步生成高质量回答。

### 提示工程

后台API第一次启动时会自动在`TEXTLONG_FOLDER`子目录中生成提示语，可以对其进行提示工程优化。

## 4、启动后台API

（1）执行`run.sh`脚本可以启动后台服务，并开启8000端口。

（2）向量编码模型使用了`huggingface`模型，会在启动过程中自动下载，因为模型较大或网络延迟的原因可能耗时较长。

（3）启动后，通过`http://{host_name}:8000/docs`可以查看API

## 5、启动UI网页

进入`ui`目录后，执行:

```shell
yarn build
yarn start
```

这会在 `http://{host_name}:3000`查看网页服务。