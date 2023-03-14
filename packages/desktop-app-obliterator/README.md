# Salad Obliterator

This tool may be used to forcefully uninstall Salad.

## Building

First, download the latest version of NSIS.

Next, build and sign the executable in your favorite shell:

```sh
makensis obliterator.nsi
signtool sign /f Certificate.pfx /p Pa55w0rd /tr http://timestamp.comodoca.com /td sha256 /fd sha256 "Salad Obliterator.exe"
```
