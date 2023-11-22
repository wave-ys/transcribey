# Transcriber

The transcriber is for doing the audio-to-text work.

## Prerequisite

[FFmpeg](https://ffmpeg.org/) is needed to decode media file.

It's also needed to meet some prerequisites in order to connect python application to MS SQL Server. For Mac OS X Arm64 the
processes are as followed.

### Install the driver manager unixODBC

Easily done using homebrew, the Mac package manager:

```shell
brew update
brew install unixodbc
```

Check the installation by running `odbcinst -j`.

### Install the Microsoft ODBC driver for SQL Server

Install the latest Microsoft drivers using the
instructions [here](https://learn.microsoft.com/en-us/sql/connect/odbc/linux-mac/install-microsoft-odbc-driver-sql-server-macos):

```shell
brew tap microsoft/mssql-release https://github.com/Microsoft/homebrew-mssql-release
brew update
HOMEBREW_ACCEPT_EULA=Y brew install msodbcsql18 mssql-tools18
```

### Install `pyodbc` package

For Mac OS X Arm64, pip must be forced to compile the module from sources instead of installing from precompiled wheel:

```shell
pip install --no-binary :all: pyodbc
```

Note that in `requirements.txt` the `--no-binary` option can be frozen like this:

```text
pyodbc --no-binary=pyodbc
```

The `pyodbc` should be installed **after** unixODBC has installed.

### Troubleshooting

#### Driver not found

Some users encounter an issue when trying to connect after installing the ODBC driver and receive an error like:

```text
[01000] [unixODBC][Driver Manager]Can't open lib 'ODBC Driver 18 for SQL Server' : file not found (0) (SQLDriverConnect)
```

It may be the case that unixODBC isn't configured correctly to find registered drivers. In these cases, creating
symbolic links can resolve the issue.

For Mac OS X x86,
follow [the Microsoft instructions](https://learn.microsoft.com/en-us/sql/connect/odbc/linux-mac/install-microsoft-odbc-driver-sql-server-macos?view=sql-server-ver16#troubleshooting):

```shell
sudo ln -s /usr/local/etc/odbcinst.ini /etc/odbcinst.ini
sudo ln -s /usr/local/etc/odbc.ini /etc/odbc.ini
```

However, while in Intel x64 Macs the `odbcinst.ini` and `odbc.ini` files will typically be in
directory `/usr/local/etc/`, **on Arm64 Macs, the .ini files will typically be in directory `/opt/homebrew/etc/`**. In
this case run these command:

```shell
sudo ln -s /opt/homebrew/etc/odbcinst.ini /etc/odbcinst.ini
sudo ln -s /opt/homebrew/etc/odbc.ini /etc/odbc.ini
```

#### Login timeout expired

If `pyodbc` throws this error:

```text
pyodbc.OperationalError: ('HYT00', u'[HYT00] [unixODBC][Microsoft][ODBC Driver 18 for SQL Server]Login timeout expired (0) (SQLDriverConnect)')
```

Changing `localhost` to `127.0.0.1` may solve it, though the reason is not certain.

### References

- [Microsoft SQL Server - SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/dialects/mssql.html)
- [pyodbc · PyPI](https://pypi.org/project/pyodbc/)
- [Install · mkleehammer/pyodbc Wiki](https://github.com/mkleehammer/pyodbc/wiki/Install)
- [Install the Microsoft ODBC driver for SQL Server (macOS) - ODBC Driver for SQL Server | Microsoft Learn](https://learn.microsoft.com/en-us/sql/connect/odbc/linux-mac/install-microsoft-odbc-driver-sql-server-macos)
- [Cannot import pyodbc with latest version on Apple Silicon · Issue #1124 · mkleehammer/pyodbc](https://github.com/mkleehammer/pyodbc/issues/1124)
